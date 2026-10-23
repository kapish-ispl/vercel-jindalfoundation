"use client";
import { useMemo, useRef } from "react";
import ReactSlick from "react-slick";
const Slider = (ReactSlick as unknown as { default: typeof ReactSlick }).default || ReactSlick;
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const sliderSettings = {
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  arrows: false,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

export default function MediaSection({ data }: { data?: React.ReactNode }) {
  const sliderRef = useRef<ReactSlick>(null);
  const articles = useMemo(() => {
    return React.Children.toArray(data)
      .filter(
        (child): child is React.ReactElement<any> =>
          React.isValidElement(child) && child.type === "article"
      )
      .map((article) => {
        const children = React.Children.toArray(article.props.children);

        const getValue = (tag: string) =>
          children.find(
            (child): child is React.ReactElement<any> =>
              React.isValidElement(child) && child.type === tag
          )?.props.children;

        return {
          img: getValue("postimg"),
          desc: getValue("description"),
          href: getValue("postlink"),
        };
      });
  }, [data]);

  const handlePrev = () => sliderRef.current?.slickPrev();
  const handleNext = () => sliderRef.current?.slickNext();

  return (
    <>
      <div className="media-controls">
        <button
          type="button"
          className="media-nav-btn"
          onClick={handlePrev}
          aria-label="Previous media coverage"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          className="media-nav-btn"
          onClick={handleNext}
          aria-label="Next media coverage"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <Slider ref={sliderRef} {...sliderSettings} className="media-slider">
        {articles.map((a, index) => (
          <div key={index} className="media-slide">
            <div className="media-card">
              {/* Image */}
              <div className="media-card-img-wrap">
                <Image
                  height={478}
                  width={478}
                  src={a.img}
                  alt="Media appearance highlight"
                  className="media-card-img"
                />
              </div>

              {/* Content */}
              <div className="media-card-body">
                <p className="media-card-desc">
                  {a.desc}
                </p>

                <Link
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-more"
                >
                  Read More

                  <svg
                    width="22"
                    height="14"
                    viewBox="0 0 24 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="8" x2="19" y2="8" />
                    <polyline points="12 1 19 8 12 15" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </>
  );
}
