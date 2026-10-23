"use client";
const IMPACT_DATA = [
  {
    metric: "590.47 M+",
    label: "earned media reach | 100% message consistency",
    // desc: "Delivered across national, regional, and sector publications — outperforming category benchmarks without paid amplification.",
  },
  {
    metric: "250,058",
    label: "digital reach | 100% organic amplification ",
    // desc: "Achieved across LinkedIn, Instagram, Facebook, and X — built through authentic storytelling, not paid spend.",
  },
  {
    metric: "8,000",
    label: "employees reached internally | 97 new volunteers added ",
    // desc: "Across all content formats and platforms throughout the campaign period, reflecting sustained audience interest.",
  },
  {
    metric: "10.8 %",
    label: "growth in women beneficiaries | Across 9 locations ",
    // desc: "The documentary-style long-form film resonated without a single rupee of paid amplification — one of the clearest indicators of genuine audience engagement.",
  }
];


export default function ImpactSection() {
  return (
    <section className="impact-section" id="impact">
      <div className="container custom_container">

        {/* Header Block with Floating Footprints */}
        <div className="impact-header">
          <div>
            <h2 className="impact-title">
              Impact
            </h2>
            <p className="impact-tagline">
              Strong results, earned credibly.
            </p>
          </div>


        </div>

        {/* Four-Quadrant Stats Grid */}
        <div className="impact-stats-grid">

          {/* Vertical Separator Line */}
          <div className="impact-grid-divider" />

          {IMPACT_DATA.map((item, idx) => {
            // Determine grid borders to build clean intersection lines
            const isTopRow = idx < 2;
            const isLeftColumn = idx % 2 === 0;

            return (
              <div
                key={idx}
                className={[
                  "impact-stat",
                  "fade-in",
                  isLeftColumn ? "impact-stat--left" : "impact-stat--right",
                  isTopRow ? "impact-stat--bordered" : "",
                ].join(" ").trim()}
                style={{ transitionDelay: `${idx * 0.1}s` }}
              >
                {/* Big Stat Metric */}
                <div className="impact-metric">
                  {item.metric}
                </div>

                {/* Sub-label Title */}
                <div className="impact-label">
                  {item.label}
                </div>

                {/* Explanatory Paragraph Context */}
                <p className="impact-desc">
                  {/* {item.desc} */}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
