"use client";
import { useMemo, useState } from "react";
import React from "react";

export default function HeadlinesSection({ data }: any) {
  const [activeIndex, setActiveIndex] = useState(0);

  const section = useMemo(() => {
    const children = React.Children.toArray(data);

    const getChild = (type: string) =>
      children.find(
        (child): child is React.ReactElement<any> =>
          React.isValidElement(child) && child.type === type
      );

    return {
      title: getChild("sectiontitle")?.props.children ?? "",
      description: getChild("description")?.props.children,
      slides: React.Children.toArray(getChild("slides")?.props.children)
        .filter(
          (child): child is React.ReactElement<any> =>
            React.isValidElement(child) && child.type === "slide"
        )
        .map((slide, index) => ({
          id: index + 1,
          type: slide.props.type,
          src: String(slide.props.children).trim(),
        })),
    };
  }, [data]);

  const activeSlide = section.slides?.[activeIndex];
  return (

    <>
      <div className="campaign-split">
        <div className="campaign-copy">
          <div className="campaign-copy-inner">
            <h2>{section.title}</h2>
            {section.description}
          </div>
        </div>
        {/* DYNAMIC RIGHT SIDE IMAGE CELL */}
        <div className="campaign-video-cell">
          {activeSlide.type === "video" ? (
            <>
              <video
                key={`${activeSlide.src}-blur`}
                src={activeSlide.src}
                aria-hidden="true"
                autoPlay
                muted
                loop
                playsInline
                className="campaign-video-blur"
              />
              <video
                key={activeSlide.src}
                src={activeSlide.src}
                controls
                autoPlay
                muted
                playsInline
                className="campaign-video-main"
              />
            </>
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeSlide.src}
                alt="Her Kadam Campaign Group Banner"
                className="campaign-video-image"
              />
            </>
          )}
        </div>
      </div>

      {/* BOTTOM FILMSTRIP NAVIGATION THUMBNAIL TRACK CAROUSEL */}
      <div className="campaign-filmstrip">

        <div className="campaign-thumbs">
          {section?.slides?.map((item: any, idx: number) => {
            const isSelected = idx === activeIndex;
            return (
              <div
                key={item.id}
                className={`campaign-thumb${isSelected ? " selected" : ""}`}
                onClick={() => setActiveIndex(idx)}
              >
                {item.type === "video" ? (
                  <div className="campaign-thumb-video-wrap">
                    <video
                      src={item.src}
                      muted
                      playsInline
                      preload="metadata"
                      className="campaign-thumb-video"
                    />
                    <span className="campaign-thumb-playbtn" />
                  </div>
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt="Strip preview thumbnail"
                      className="campaign-thumb-img"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>

  );
}
