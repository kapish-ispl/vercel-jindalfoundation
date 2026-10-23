// components/HomeVision.jsx
'use client';

import Image from 'next/image';

const HomeVision = () => {
  return (
    <div className="hv_vision_wrapper">
      <div className="container">
        <div className="row hv_top_row">
          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12">
            <div className="hv_vision_image">
              <img
                src="/images/girl-image-2.png"
                alt="Vision"
                width={600}
                height={500}
                className="hv_image"
              />
            </div>
          </div>

          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12">
            <div className="hv_stats_wrapper">
              <div className="hv_stats_item">
                <span className="hv_stats_number">2 Lakh+</span>
                <p className="hv_stats_label">
                  women benefitted from our reproductive health care initiatives
                </p>
              </div>
              <div className="hv_stats_item">
                <span className="hv_stats_number">18 Lakh+</span>
                <p className="hv_stats_label">
                  people provided with safe and clean drinking water facilities
                </p>
              </div>
              <div className="hv_stats_item">
                <span className="hv_stats_number">2 Lakh+</span>
                <p className="hv_stats_label">
                  youths imparted with vocational training
                </p>
              </div>
              <div className="hv_stats_item">
                <span className="hv_stats_number">30 Lakh+</span>
                <p className="hv_stats_label"> saplings planted </p>
              </div>
              <div className="hv_stats_item">
                <span className="hv_stats_number">10 K+</span>
                <p className="hv_stats_label">
                  scholarships for poor &amp; underprivileged students
                </p>
              </div>
              <div className="hv_stats_item">
                <span className="hv_stats_number">15 K+</span>
                <p className="hv_stats_label">imparted quality education</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hv_vm_section">
          <div className="row hv_vm_row">
            <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12">
              <div className="hv_vm_item hv_vm_vision">
                <h3 className="hv_vm_title">Vision</h3>
                <p className="hv_vm_description">
                  To enable and empower communities by consistently improving
                  their quality of life on a sustainable basis and creating
                  opportunities for building and catalysing equitable<br></br> and
                  inclusive prosperity.
                </p>
              </div>
            </div>
            <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12">
              <div className="hv_vm_item hv_vm_mission">
                <h3 className="hv_vm_title mt-3">Mission</h3>
                <p className="hv_vm_description">
                  We exist to empower underserved communities by driving
                  sustainable development and creating equitable opportunities.
                  Through transformative initiatives, we promote growth,
                  resilience, and inclusiveness, guided by our commitment to
                  care, integrity, and sustainability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeVision;