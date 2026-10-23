'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface SlideItem {
  id: number;
  image: string;
  statNumber: string;
  statText: string;
}

const slidesData: SlideItem[] = [
  {
    id: 1,
    image: '/images/girl-image.jpg',
    statNumber: '10 Lakh+',
    statText: 'Patients treated at Fortis OP Jindal Hospital Research Centre with 30% of bed capacity dedicated to critical care and 24x7 emergency services.',
  },
  {
    id: 2,
    image: '/images/girl-image-2.png',
    statNumber: '8.9 lakh+',
    statText: 'Mothers and children supported by Vatsalya across Odisha, Chhattisgarh, and Jharkhand, achieving 99% pregnancy registration and 98.3% child immunisation coverage.',
  },
  {
    id: 3,
    image: '/images/milestones.webp',
    statNumber: '9 lakh+',
    statText: 'Adolescent girls benefited from Kishori Express, leading to a 98% reduction in severe anaemia in Banarpal Block',
  },
  {
    id: 4,
    image: '/images/media-news.jpg',
    statNumber: '10 lakh++',
    statText: 'Women and girls in 3,000+ villages received free sanitary napkins through Shubhangi, generating ₹1 crore+ in rural women’s income.',
  },
  {
    id: 5,
    image: '/images/art_culture.jpg',
    statNumber: '50+',
    statText: 'health centers upgraded in tribal regions',
  },
];

export default function HealthInitiativeSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slidesData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slidesData.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slidesData.length) % slidesData.length);
  };

  return (
    <section className="c-ptb-lg position-relative overflow-hidden">
      <div className="container custom_container">
        <div className="row align-items-center">
          {/* Left Column: Content */}
         
          

          {/* Right Column: Stacked Slider */}
          <div className="col-lg-12 col-md-12">
            <div className="position-relative d-flex flex-column justify-content-center align-items-center py-4">
              {/* Stack Container */}
              <div 
                className="position-relative w-100 d-flex justify-content-center align-items-center" 
                style={{ height: '680px' }}
              >
                {slidesData.map((slide, index) => {
                  const total = slidesData.length;
                  
                  // Calculate wrapped relative position (-2, -1, 0, 1, 2)
                  let offset = index - activeIndex;
                  if (offset > total / 2) offset -= total;
                  if (offset < -total / 2) offset += total;

                  const isActive = offset === 0;

                  // Increased horizontal spread to show wider stacked peek effect
                  const translateX = offset * 85; 
                  const scale = isActive ? 1 : 0.94 - Math.abs(offset) * 0.05;
                  const zIndex = total - Math.abs(offset);
                  const opacity = Math.abs(offset) > 2 ? 0 : 1;
                                    const filter = isActive ? 'brightness(100%)' : 'brightness(45%)';

                  return (
                    <div
                      key={slide.id}
                      onClick={() => setActiveIndex(index)}
                      className="position-absolute overflow-hidden shadow-lg"
                      style={{
                        width: '700px',
                        height: '680px',
                        transform: `translateX(${translateX}px) scale(${scale})`,
                        zIndex: zIndex,
                        opacity: opacity,
                        filter: filter,
                        transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        cursor: 'pointer',
                        boxShadow: '0 20px 35px rgba(0, 0, 0, 0.35)',
                      }}
                    >
                      {/* Image */}
                      <Image
                        src={slide.image}
                        alt="Initiative Slide"
                        fill
                        className="object-fit-cover"
                        priority={isActive}
                      />

                      {/* Overlay (Active Card Only) */}
                      {isActive && (
                        <div 
                          className="position-absolute bottom-0 start-0 w-100 p-4 text-white text-center"
                          style={{
                            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.88) 100%)',
                          }}
                        >
                          <h3 className="display-4 fw-bold mb-1 text-white">
                            {slide.statNumber}
                          </h3>
                          <p className="fs-16 text-white-50 mb-0 leading-tight">
                            {slide.statText}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="d-flex gap-3 mt-3 z-3">
                <button
                  onClick={handlePrev}
                  className="btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '44px', height: '44px', fontSize: '20px' }}
                  aria-label="Previous Slide"
                >
                  &#8249;
                </button>
                <button
                  onClick={handleNext}
                  className="btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '44px', height: '44px', fontSize: '20px' }}
                  aria-label="Next Slide"
                >
                  &#8250;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}