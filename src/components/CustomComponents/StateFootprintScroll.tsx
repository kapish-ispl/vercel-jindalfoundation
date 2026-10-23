"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import IndiaMap from "@/components/Map/IndiaMap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

/* A mobile browser hiding/showing its URL bar fires a resize, which would otherwise
   refresh ScrollTrigger mid-scroll and make the pinned map jump. */
ScrollTrigger.config({ ignoreMobileResize: true });

/* ------------------------------------------------------------------ *
 *  Two-step pinned map:
 *    step 1 — plain India SVG map
 *    step 2 — the focus states [MH, CH, OD, JH, AP] light up with their labels, and the CTA appears
 * ------------------------------------------------------------------ */

export type DeviceBreakpoint = "mobile" | "tablet" | "desktop";

export interface ResponsiveCoord {
  mobile?: { x: number; y: number };
  tablet?: { x: number; y: number };
  desktop?: { x: number; y: number };
}

export interface ResponsiveNumber {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}

export interface StateItem {
  key: string;
  /** label drawn at the end of the leader line */
  name: string;
  /** corresponding SVG element id (e.g. 'MH', 'CH', 'OD', 'JH', 'AP') */
  stateId?: string;
  /**
   * Dot position (% of India map box).
   * Can be a single { x, y } or breakpoint-specific: { mobile: {x,y}, tablet: {x,y}, desktop: {x,y} }
   */
  pin?: { x: number; y: number } | ResponsiveCoord;
  /**
   * Where the label anchors (% of India map box from left).
   * Can be a single number or breakpoint-specific: { mobile: 24, tablet: 15, desktop: 5 }
   */
  labelX?: number | ResponsiveNumber;
  /** which side the leader line + label runs */
  labelSide?: "left" | "right";
}

export interface StateFootprintScrollProps {
  /** the states that light up on step 2 */
  states?: StateItem[] | string;
  /** full India map image (legacy prop, optional) */
  indiamap?: string;
  /** CTA button — heading line, second line, link */
  ctalabel?: string;
  ctasublabel?: string;
  ctahref?: string;
  /** hide the CTA entirely */
  hidecta?: boolean | string;
  /** total scroll distance (in % of viewport height) the section stays pinned for */
  stepscroll?: number | string;
  /**
   * How far you have to scroll inside the pinned section before the states light up,
   * in % of viewport height.
   */
  revealat?: number | string;
  className?: string;
}

/* ------------------------------------------------------------------ *
 *  Data & State Mapping
 * ------------------------------------------------------------------ */

export const STATE_ID_MAP: Record<string, string> = {
  delhi: "INDL",
  dl: "INDL",
  jharkhand: "INJH",
  jh: "INJH",
  chhattisgarh: "INCT",
  ch: "INCT",
  ct: "INCT",
  odisha: "INOR",
  od: "INOR",
  or: "INOR",
  maharashtra: "INMH",
  mh: "INMH",
  "andhra-pradesh": "INAP",
  andhra: "INAP",
  ap: "INAP",
  telangana: "INTG",
  tg: "INTG",
  "west-bengal": "INWB",
  wb: "INWB",
  gujarat: "INGJ",
  gj: "INGJ",
  karnataka: "INKA",
  ka: "INKA",
  "tamil-nadu": "INTN",
  tn: "INTN",
  "madhya-pradesh": "INMP",
  mp: "INMP",
  rajasthan: "INRJ",
  rj: "INRJ",
  "uttar-pradesh": "INUP",
  up: "INUP",
  punjab: "INPB",
  pb: "INPB",
  haryana: "INHR",
  hr: "INHR",
  bihar: "INBR",
  br: "INBR",
  assam: "INAS",
  as: "INAS",
  kerala: "INKL",
  kl: "INKL",
  uttarakhand: "INUT",
  ut: "INUT",
  "jammu-and-kashmir": "INJK",
  jk: "INJK",
  ladakh: "INLA",
  la: "INLA",
};

/** Exact center coordinates derived directly from IndiaMap SVG feature points */
export const STATE_PIN_MAP: Record<string, { x: number; y: number }> = {
  INDL: { x: 34.41, y: 32.0 },
  INJH: { x: 56.39, y: 47.58 },
  INCT: { x: 47.35, y: 53.34 },
  INOR: { x: 54.99, y: 55.93 },
  INMH: { x: 30.57, y: 59.79 },
  INAP: { x: 39.23, y: 73.07 },
  INTG: { x: 39.67, y: 64.19 },
  INWB: { x: 63.71, y: 48.58 },
  INGJ: { x: 19.92, y: 48.1 },
  INKA: { x: 30.21, y: 72.81 },
  INTN: { x: 37.96, y: 83.56 },
  INMP: { x: 37.84, y: 49.42 },
  INRJ: { x: 25.67, y: 37.58 },
  INUP: { x: 43.87, y: 37.55 },
  INPB: { x: 30.05, y: 25.44 },
  INHR: { x: 32.3, y: 30.52 },
  INBR: { x: 57.58, y: 41.1 },
  INAS: { x: 77.59, y: 39.39 },
  INKL: { x: 32.55, y: 84.89 },
  INUT: { x: 40.14, y: 27.21 },
  INJK: { x: 27.48, y: 15.61 },
  INLA: { x: 34.49, y: 13.65 },
  INAN: { x: 77.03, y: 81.46 },
  INAR: { x: 82.63, y: 32.59 },
  INGA: { x: 26.16, y: 71.39 },
  INHP: { x: 34.84, y: 21.77 },
  INMN: { x: 80.15, y: 44.31 },
  INML: { x: 73.7, y: 41.76 },
  INMZ: { x: 77.62, y: 47.62 },
  INNL: { x: 82.21, y: 39.9 },
  INPY: { x: 41.77, y: 83.89 },
  INSK: { x: 65.43, y: 35.56 },
  INTR: { x: 74.06, y: 47.22 },
  INLD: { x: 23.3, y: 91.26 },
  INDH: { x: 23.25, y: 57.38 },
  INCH: { x: 33.49, y: 25.51 },
};

export const DEFAULT_STATES: StateItem[] = [
  {
    key: "delhi",
    name: "Delhi",
    stateId: "INDL",
    pin: STATE_PIN_MAP.INDL,
    labelX: { mobile: 48, tablet: 48, desktop: 48 },
    labelSide: "right",
  },
  {
    key: "jharkhand",
    name: "Jharkhand",
    stateId: "INJH",
    pin: STATE_PIN_MAP.INJH,
    labelX: { mobile: 76, tablet: 80, desktop: 82 },
    labelSide: "right",
  },
  {
    key: "chhattisgarh",
    name: "Chhattisgarh",
    stateId: "INCT",
    pin: STATE_PIN_MAP.INCT,
    labelX: { mobile: 24, tablet: 12, desktop: 5 },
    labelSide: "left",
  },
  {
    key: "odisha",
    name: "Odisha",
    stateId: "INOR",
    pin: STATE_PIN_MAP.INOR,
    labelX: { mobile: 74, tablet: 78, desktop: 80 },
    labelSide: "right",
  },
  {
    key: "maharashtra",
    name: "Maharashtra",
    stateId: "INMH",
    pin: STATE_PIN_MAP.INMH,
    labelX: { mobile: 18, tablet: 14, desktop: 12 },
    labelSide: "left",
  },
  {
    key: "andhra-pradesh",
    name: "Andhra Pradesh",
    stateId: "INAP",
    pin: STATE_PIN_MAP.INAP,
    labelX: { mobile: 20, tablet: 18, desktop: 18 },
    labelSide: "left",
  },
];

/* ------------------------------------------------------------------ *
 *  Helpers
 * ------------------------------------------------------------------ */

/** Hook to track current device viewport category */
export function useDeviceBreakpoint(): DeviceBreakpoint {
  const [device, setDevice] = useState<DeviceBreakpoint>("desktop");

  useEffect(() => {
    const updateDevice = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setDevice("mobile");
      } else if (w < 1024) {
        setDevice("tablet");
      } else {
        setDevice("desktop");
      }
    };

    updateDevice();
    window.addEventListener("resize", updateDevice);
    return () => window.removeEventListener("resize", updateDevice);
  }, []);

  return device;
}

/** `states` may arrive as a JSON string when the component is driven from the CMS */
const resolveStates = (value?: StateItem[] | string): StateItem[] => {
  if (!value) return DEFAULT_STATES;
  let parsed: StateItem[] = DEFAULT_STATES;
  if (Array.isArray(value)) {
    parsed = value.length ? value : DEFAULT_STATES;
  } else {
    try {
      const p = JSON.parse(value);
      parsed = Array.isArray(p) && p.length ? (p as StateItem[]) : DEFAULT_STATES;
    } catch {
      parsed = DEFAULT_STATES;
    }
  }

  return parsed.map((item) => {
    const keyLower = item.key?.toLowerCase() || "";
    const stateId = item.stateId || STATE_ID_MAP[keyLower] || DEFAULT_STATES.find(
      (d) => d.key.toLowerCase() === keyLower,
    )?.stateId;

    const fallback = DEFAULT_STATES.find(
      (d) => d.key.toLowerCase() === keyLower || (stateId && d.stateId === stateId),
    );

    const pin = item.pin || (stateId ? STATE_PIN_MAP[stateId] : undefined) || fallback?.pin || { x: 50, y: 50 };

    return {
      ...fallback,
      ...item,
      stateId,
      pin,
    };
  });
};

/** Resolves responsive pin coordinates for active device */
export const getResponsivePin = (
  pin: { x: number; y: number } | ResponsiveCoord | undefined,
  device: DeviceBreakpoint,
  fallback: { x: number; y: number } = { x: 50, y: 50 }
): { x: number; y: number } => {
  if (!pin) return fallback;
  if ("x" in pin && typeof (pin as { x: number }).x === "number") {
    return pin as { x: number; y: number };
  }
  const resp = pin as ResponsiveCoord;
  return resp[device] || resp.desktop || resp.tablet || resp.mobile || fallback;
};

/** Resolves responsive labelX position for active device */
export const getResponsiveLabelX = (
  labelX: number | ResponsiveNumber | undefined,
  device: DeviceBreakpoint,
  fallback: number = 50
): number => {
  if (labelX === undefined || labelX === null) return fallback;
  if (typeof labelX === "number") return labelX;
  const resp = labelX as ResponsiveNumber;
  return resp[device] ?? resp.desktop ?? resp.tablet ?? resp.mobile ?? fallback;
};

/* ------------------------------------------------------------------ *
 *  Component
 * ------------------------------------------------------------------ */

export default function StateFootprintScroll({
  states,
  ctalabel = "CLICK HERE",
  ctasublabel = "TO EXPLORE OUR AREAS OF OPERATIONS",
  ctahref = "/areas-of-operations",
  hidecta = false,
  stepscroll,
  revealat,
  className = "",
}: StateFootprintScrollProps) {
  const device = useDeviceBreakpoint();
  const stateData = useMemo(() => resolveStates(states), [states]);
  const withCta = !(hidecta === true || hidecta === "true");

  // State to control visibility of the mouse‑scroll indicator
  const [showScroll, setShowScroll] = useState(true);

  const revealVh = useMemo(() => {
    const value = Number(stepscroll);
    return Number.isFinite(value) && value > 20 ? value : 220;
  }, [stepscroll]);
  // Breakpoint scroll factors to control pin duration
  const MOBILE_SCROLL_FACTOR = 0.4; // Mobile pin distance factor (kept unchanged)
  const TABLET_SCROLL_FACTOR = 1.0; // Tablet pin distance factor (kept unchanged)
  const DESKTOP_SCROLL_FACTOR = 0.33; // Reduced desktop pin distance to prevent excessive hold time

  /** how much scrolling (in vh) happens before the states light up */
  const revealAtVh = useMemo(() => {
    const value = Number(revealat);
    return Number.isFinite(value) && value >= 5 && value <= 80 ? value : 30;
  }, [revealat]);

  /** 0 = plain India map, 1 = states lit + CTA */
  const [lit, setLit] = useState(false);


  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const pointerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const litRef = useRef(false);
  // Ref to track previous scroll position for showing scroll indicator
  const lastScrollY = useRef<number>(typeof window !== "undefined" ? window.scrollY : 0);
  // Scroll to the end of the section when the mouse icon is clicked, staying within the same section
  const scrollToEnd = () => {
    if (sectionRef.current) {
      // Define a top margin to keep content clear of the fixed header (adjust as needed)
      const headerMargin = 80; // pixels
      const targetTop =
        sectionRef.current.offsetTop +
        sectionRef.current.offsetHeight -
        window.innerHeight -
        headerMargin;
      // window.scrollTo({
      //   top: targetTop > 0 ? targetTop : 0,
      //   behavior: 'smooth',
      // });
      gsap.to(window, {
        duration: 0.3, // decrease this to make scrolling faster
        scrollTo: {
          y: targetTop > 0 ? targetTop : 0,
        },
        ease: "power2.out",
      });

      // Hide the mouse‑scroll indicator after we have scrolled to the bottom
      setShowScroll(false);
    }
  };

  // Sync showScroll with CTA visibility (lit)
  useEffect(() => {
    if (!lit) {
      // When CTA is hidden, allow the scroll button to be shown (if not already)
      setShowScroll(true);
    } else {
      // When CTA appears, hide the scroll button
      setShowScroll(false);
    }
  }, [lit]);

  // Show scroll indicator again when user scrolls up more than 10px
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (!showScroll && lastScrollY.current - currentY > 10) {
        setShowScroll(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showScroll]);

  /* -------------------- scroll driver: pin, one step -------------------- */

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isTablet: "(min-width: 768px) and (max-width: 1023px)",
          isDesktop: "(min-width: 1024px)",
        },
        (context) => {
          const { isMobile, isTablet } = context.conditions as Record<string, boolean>;
          const factor = isMobile
            ? MOBILE_SCROLL_FACTOR
            : isTablet
              ? TABLET_SCROLL_FACTOR
              : DESKTOP_SCROLL_FACTOR;
          const distance = () => window.innerHeight * (revealVh / 100) * factor;

          ScrollTrigger.create({
            trigger: sectionRef.current!,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: pinRef.current!,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const scrolled = self.scroll() - self.start;
              const on = Math.min(window.innerHeight * (revealAtVh / 100), distance() * 0.35);
              const next = litRef.current ? scrolled > on * 0.5 : scrolled >= on;
              if (next !== litRef.current) {
                litRef.current = next;
                setLit(next);
              }
            },
          });
        },
      );
    },
    { scope: sectionRef, dependencies: [revealVh, revealAtVh], revertOnUpdate: true },
  );

  /* -------------------- reveal / reverse -------------------- */

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const dur = (value: number) => (reduce ? 0 : value);

      /* Highlight SVG state paths [INMH, INCT, INOR, INJH, INAP, INDL] */
      stateData.forEach((item, index) => {
        const id = item.stateId || STATE_ID_MAP[item.key.toLowerCase()];
        if (!id) return;
        const el = sectionRef.current?.querySelector<SVGPathElement>(`#${id}`);
        if (!el) return;

        gsap.to(el, {
          fill: lit ? (id === "INJH" || id === "JH" ? "#F47A22" : "#F47921") : "#BBBCBF",
          duration: dur(0.12),
          delay: 0,
          ease: "power1.out",
          overwrite: "auto",
        });
      });

      /* leader lines + names, drawn once the shapes have lit up */
      pointerRefs.current.forEach((el, index) => {
        if (!el) return;
        gsap.to(el, {
          autoAlpha: lit ? 1 : 0,
          duration: dur(0.12),
          delay: 0,
          ease: "power1.out",
          overwrite: "auto",
        });
        const line = el.querySelector<HTMLElement>("[data-line]");
        if (line) {
          gsap.to(line, {
            scaleX: lit ? 1 : 0,
            duration: dur(0.12),
            delay: 0,
            ease: "power1.out",
            overwrite: "auto",
          });
        }
      });

      if (ctaRef.current) {
        gsap.to(ctaRef.current, {
          autoAlpha: lit ? 1 : 0,
          y: lit ? 0 : 18,
          duration: dur(0.12),
          delay: 0,
          ease: "power1.out",
          overwrite: "auto",
        });
      }
    },
    { scope: sectionRef, dependencies: [lit, stateData, device] },
  );

  return (
    <section ref={sectionRef} className={`state-scroll ${className}`.trim()}>
      <div ref={pinRef} className="state-scroll__pin">
        <div className="container custom_container state-scroll__inner">
          <div className="state-scroll__stage">
            <div className="state-scroll__maps">
              <IndiaMap className="state-scroll__svg" />

              {/* leader line + name for each marker */}
              {stateData.map((item, index) => {
                const dot = getResponsivePin(item.pin || (item.stateId ? STATE_PIN_MAP[item.stateId] : undefined), device);
                const side = item.labelSide === "left" ? "left" : "right";
                const labelX = getResponsiveLabelX(item.labelX, device, dot.x);
                return (
                  <div
                    key={`pointer-${item.key}`}
                    className="state-scroll__pointer"
                    ref={(el) => {
                      pointerRefs.current[index] = el;
                    }}
                  >
                    <span className="state-scroll__pointer-dot" style={{ left: `${dot.x}%`, top: `${dot.y}%` }} />
                    <span
                      className="state-scroll__pointer-line"
                      data-line
                      style={{
                        left: `${Math.min(dot.x, labelX)}%`,
                        top: `${dot.y}%`,
                        width: `${Math.abs(labelX - dot.x)}%`,
                        transformOrigin: side === "left" ? "right center" : "left center",
                      }}
                    />
                    <span
                      className={`state-scroll__pointer-label state-scroll__pointer-label--${side}`}
                      style={
                        side === "left"
                          ? { right: `${100 - labelX}%`, top: `${dot.y}%` }
                          : { left: `${labelX}%`, top: `${dot.y}%` }
                      }
                    >
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shared CTA */}
          {withCta ? (
            <Link ref={ctaRef} href={ctahref} className="area-ops-btn state-scroll__cta">
              <span className="area-ops-btn-heading">{ctalabel}</span>
              <span>{ctasublabel}</span>
            </Link>
          ) : null}
          {/* Mouse scroll indicator — visible only when CTA is hidden. It occupies the
              exact spot the CTA button uses (see .mouse-scroll-indicator in
              _state_scroll.scss), but only from tablet width up; on mobile it stays in
              normal flow below the map, as before. */}
          {showScroll && !lit && (
            <div className="mouse-scroll-indicator d-xl-none" onClick={scrollToEnd}>
              <span className="mouse-scroll-indicator__label">Click me</span>
              <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="22" height="38" rx="11" stroke="#000" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" fill="#000" />
              </svg>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
