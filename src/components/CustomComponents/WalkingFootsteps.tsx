"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

interface Step {
  x: number; // percentage
  y: number; // percentage
  angleDown: number; // rotation in degrees when going down
  angleUp: number; // rotation in degrees when going up
  offsetX: number; // pixels
  offsetY: number; // pixels
  isLeft: boolean;
}

interface WalkingFootstepsProps {
  isreverse?: boolean | string;
}

export default function WalkingFootsteps({ isreverse }: WalkingFootstepsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [walkProgress, setWalkProgress] = useState(0);
  const [goingDown, setGoingDown] = useState(true);
  const lastScrollY = useRef(0);
  const reverse = Boolean(isreverse) && isreverse === "true" ? true : false;

  const steps = useMemo(() => {
    // Generate footsteps coordinates along a smooth curve
    // We calculate in pixel space (1200x180 nominal size) to prevent aspect ratio distortion
    const width = 1200;
    const height = 180;

    const P0 = { x: reverse ? width * 0.72 : width * 0.28, y: height * 0.22 };
    const P1 = { x: reverse ? width * 0.62 : width * 0.38, y: height * 0.42 };
    const P2 = { x: reverse ? width * 0.38 : width * 0.62, y: height * 0.58 };
    const P3 = { x: reverse ? width * 0.28 : width * 0.72, y: height * 0.78 };

    const stepCount = 10;
    const offsetDistance = 22; // Increased from 14 to 22 for better left/right gapping
    const generatedSteps: Step[] = [];

    for (let i = 0; i < stepCount; i++) {
      const t = i / (stepCount - 1);

      // Linear X progress to maintain perfectly consistent horizontal stride length,
      // and cubic Y progress to follow the smooth Bezier vertical curve trajectory.
      const xPx = P0.x + t * (P3.x - P0.x);
      const yPx = (1 - t) ** 3 * P0.y + 3 * (1 - t) ** 2 * t * P1.y + 3 * (1 - t) * t ** 2 * P2.y + t ** 3 * P3.y;

      // Tangent vector derivative in pixels
      const dx = P3.x - P0.x;
      const dy = 3 * (1 - t) ** 2 * (P1.y - P0.y) + 6 * (1 - t) * t * (P2.y - P1.y) + 3 * t ** 2 * (P3.y - P2.y);

      // True physical angle in radians
      const angleRad = Math.atan2(dy, dx);
      const angleDown = angleRad * (180 / Math.PI) + 90;
      const angleUp = angleRad * (180 / Math.PI) - 90;

      // To maintain perfectly consistent horizontal stride length:
      // We keep the base X position exactly on the curve, and offset only in Y.
      // This mimics natural walking where forward step progress is uniform.
      const isLeft = i % 2 === 0;
      const sign = isLeft ? -1 : 1;

      const offsetX = 0; // No X offset to keep horizontal spacing perfectly uniform
      const offsetY = sign * offsetDistance * Math.cos(angleRad);

      generatedSteps.push({
        x: (xPx / width) * 100, // convert back to percentage for layout
        y: (yPx / height) * 100,
        angleDown,
        angleUp,
        offsetX,
        offsetY,
        isLeft,
      });
    }

    return generatedSteps;
  }, [reverse]);

  useEffect(() => {
    if (steps.length === 0) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Track scroll direction
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      if (Math.abs(delta) > 2) {
        setGoingDown(delta > 0);
      }
      lastScrollY.current = currentScrollY;

      // Calculate visibility progress inside container
      const totalScrollable = rect.height + viewportHeight;
      const currentProgress = viewportHeight - rect.top;

      let progress = currentProgress / totalScrollable;
      progress = Math.max(0, Math.min(1, progress));

      // Reveal steps sequentially
      const startTrigger = 0.15;
      const endTrigger = 0.85;
      let calculatedWalkProgress = (progress - startTrigger) / (endTrigger - startTrigger);
      calculatedWalkProgress = Math.max(0, Math.min(1, calculatedWalkProgress));

      setWalkProgress(calculatedWalkProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll(); // Initial run

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [steps]);

  // Handle animation and rotation changes when walkProgress or goingDown changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    steps.forEach((step, idx) => {
      const el = container.querySelector(`.walking-step-${idx}`);
      if (!el) return;

      const currentRotation = goingDown ? step.angleUp : step.angleDown;

      // Apply rotation instantly so there is no spinning animation
      gsap.set(el, { rotation: currentRotation });

      // Determine visibility based on direction:
      // When going down: reveal from top (index 0) to bottom (index 9)
      // When going up: reveal from bottom (index 9) to top (index 0)
      const isVisible = goingDown
        ? idx < walkProgress * steps.length
        : idx >= walkProgress * steps.length;

      if (isVisible) {
        gsap.to(el, {
          opacity: 0.85,
          xPercent: -50,
          yPercent: -50,
          x: step.offsetX,
          y: step.offsetY,
          scale: 1,
          duration: 0.45,
          ease: "back.out(1.2)",
          overwrite: "auto",
        });
      } else {
        gsap.to(el, {
          opacity: 0,
          xPercent: -50,
          yPercent: -50,
          scale: 0.5,
          duration: 0.2,
          ease: "sine.in",
          overwrite: "auto",
        });
      }
    });
  }, [walkProgress, goingDown, steps]);

  return (
    <div ref={containerRef} className="walking-footsteps">
      <div className="walking-footsteps-inner">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`walking-step walking-step-${idx}`}
            style={{ left: `${step.x}%`, top: `${step.y}%` }}
          >
            <Image
              src={(goingDown ? !step.isLeft : step.isLeft) ? "/images/step1.png" : "/images/step2.png"}
              alt="Walking Footstep"
              width={42}
              height={56}
              className="walking-step-img"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
