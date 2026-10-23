'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function AreaOfOperationsSection() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadMap = async () => {
      try {
        const response = await fetch('/images/in.svg');
        const svgText = await response.text();

        if (!mounted || !mapRef.current) return;

        mapRef.current.innerHTML = svgText;

        const svg = mapRef.current.querySelector('svg');

        if (svg) {
          svg.removeAttribute('width');
          svg.removeAttribute('height');

          svg.setAttribute('width', '100%');
          svg.setAttribute('height', '100%');
          svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

          svg.classList.add('india-map-svg');
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
    <section className="area-ops-section">
      <div className="container custom_container">

        <div className="area-ops-container">

          {/* =========================
              MAP
          ========================== */}
          <div className="area-ops-map-wrapper">

            {/* Actual SVG */}
            <div
              ref={mapRef}
              className="india-map"
            />

            {/* =========================
                DELHI
            ========================== */}
            <div className="map-label delhi-label">
              <span className="map-dot" />
              <span className="map-line" />
              <span className="map-text">
                Delhi
              </span>
            </div>


            {/* =========================
                JHARKHAND
            ========================== */}
            <div className="map-label jharkhand-label">
              <span className="map-dot" />
              <span className="map-line" />
              <span className="map-text">
                Jharkhand
              </span>
            </div>


            {/* =========================
                CHHATTISGARH
            ========================== */}
            <div className="map-label chhattisgarh-label">
              <span className="map-dot" />
              <span className="map-line" />
              <span className="map-text">
                Chhattisgarh
              </span>
            </div>


            {/* =========================
                ODISHA
            ========================== */}
            <div className="map-label odisha-label">
              <span className="map-dot" />
              <span className="map-line" />
              <span className="map-text">
                Odisha
              </span>
            </div>


            {/* =========================
                ANDHRA PRADESH
            ========================== */}
            <div className="map-label andhra-label">
              <span className="map-dot" />
              <span className="map-line" />
              <span className="map-text">
                Andhra Pradesh
              </span>
            </div>

          </div>


          {/* =========================
              BUTTON
          ========================== */}
          <Link
            href="/area-of-operation"
            className="area-ops-btn"
          >
            <span className="area-ops-btn-heading">
              CLICK HERE
            </span>

            <span>
              TO EXPLORE OUR AREAS OF OPERATIONS
            </span>
          </Link>

        </div>

      </div>
    </section>
  );
}