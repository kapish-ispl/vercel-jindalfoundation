'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './AreaOfOperationsSection.module.css';

/**
 * Coordinates below come straight from the source SVG's own
 * <g id="label_points"> group (SimpleMaps India map, viewBox
 * "0 0 1000 1000"), so `dot` marks the true center of each
 * state and lines up exactly with the map regardless of the
 * rendered size (mobile, tablet, desktop).
 *
 * `anchor` is where the connector line ends / the text sits.
 * Anchors were chosen inside blank/ocean margins of the map
 * and spaced vertically so none of the five labels collide.
 * 
 * Lines are now horizontal (180 degrees) with y coordinates
 * matching the dot's y position.
 */
const OPERATION_STATES = [
  {
    id: 'INDL',
    name: 'Delhi',
    dot: { x: 344.1, y: 320 },
    anchor: { x: 15, y: 320 },
    side: 'left' as const,
  },
  {
    id: 'INJH',
    name: 'Jharkhand',
    dot: { x: 563.9, y: 475.8 },
    anchor: { x: 985, y: 475.8 },
    side: 'right' as const,
  },
  {
    id: 'INCT',
    name: 'Chhattisgarh',
    dot: { x: 473.5, y: 533.4 },
     anchor: { x: 985, y: 533.4 },  // ← Changed from 15 to 985 (right side)
    side: 'right' as const,         // ← Changed from 'left' to 'right'
  },
  {
    id: 'INOR',
    name: 'Odisha',
    dot: { x: 549.9, y: 579.3 },
    anchor: { x: 985, y: 579.3 },
    side: 'right' as const,
  },
  {
    id: 'INAP',
    name: 'Andhra Pradesh',
    dot: { x: 392.3, y: 730.7 },
    anchor: { x: 15, y: 730.7 },
    side: 'left' as const,
  },
  {
    id: 'INMH',
    name: 'Maharashtra',
    dot: { x: 313.8, y: 610.5 },
    anchor: { x: 15, y: 610.5 },
    side: 'left' as const,
  }
];

export default function AreaOfOperationsSection() {
  const mapHostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadMap = async () => {
      try {
        const response = await fetch('/images/in.svg');
        const svgText = await response.text();

        if (!mounted || !mapHostRef.current) return;

        mapHostRef.current.innerHTML = svgText;

        const svg = mapHostRef.current.querySelector('svg');

        if (svg) {
          svg.removeAttribute('width');
          svg.removeAttribute('height');
          svg.setAttribute('width', '100%');
          svg.setAttribute('height', '100%');
          svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        }
      } catch (error) {
        console.error('Failed to load India map:', error);
      }
    };

    loadMap();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className={styles.aooSection}>
      <div className={styles.aooContainer}>
        <div className={styles.aooContent}>
          {/* ========================= MAP ========================= */}
          <div className={styles.aooMapWrapper}>
            {/* Base India map, injected via fetch */}
            <div ref={mapHostRef} className={styles.aooMapHost} />

            {/* Dots + connector lines */}
            <svg
              className={styles.aooOverlaySvg}
              viewBox="0 0 1000 1000"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              {OPERATION_STATES.map((state) => (
                <g key={state.id}>
                  <line
                    x1={state.dot.x}
                    y1={state.dot.y}
                    x2={state.anchor.x}
                    y2={state.anchor.y}
                    className={styles.aooConnector}
                  />
                  <circle
                    cx={state.dot.x}
                    cy={state.dot.y}
                    r={13}
                    className={styles.aooDotPulse}
                  />
                  <circle
                    cx={state.dot.x}
                    cy={state.dot.y}
                    r={6}
                    className={styles.aooDot}
                  />
                </g>
              ))}
            </svg>

            {/* Text labels */}
            {OPERATION_STATES.map((state) => (
              <div
                key={state.id}
                className={`${styles.aooLabel} ${
                  state.side === 'left' ? styles.aooLabelLeft : styles.aooLabelRight
                }`}
                style={{ top: `${state.anchor.y / 10}%` }}
              >
                <span className={styles.aooLabelText}>{state.name}</span>
              </div>
            ))}

            {/* ========================= BUTTON (Desktop - on map) ========================= */}
            <Link href="/areas-of-operations" className={styles.aooBtn}>
              <span className={styles.aooBtnHeading}>CLICK HERE</span>
              <span className={styles.aooBtnSub}>
                TO EXPLORE OUR AREAS OF OPERATIONS
              </span>
            </Link>
          </div>

          {/* ========================= BUTTON (Mobile - below map) ========================= */}
          <Link href="/areas-of-operations" className={styles.aooBtnMobile}>
            <span className={styles.aooBtnHeading}>CLICK HERE</span>
            <span className={styles.aooBtnSub}>
              TO EXPLORE OUR AREAS OF OPERATIONS
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}