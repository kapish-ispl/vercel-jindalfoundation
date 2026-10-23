"use client";
import React, { Children, isValidElement, ReactNode, useEffect, useState } from "react";

function findImageSrc(node: ReactNode): string | null {
    let found: string | null = null;
    Children.forEach(node, (child) => {
        if (found || !isValidElement(child)) return;
        const anyChild = child as any;
        if (anyChild.type === "img" && anyChild.props?.src) {
            found = anyChild.props.src;
            return;
        }
        if (anyChild.props?.children) {
            found = findImageSrc(anyChild.props.children);
        }
    });
    return found;
}

function findByClass(node: ReactNode, cls: string): string {
    let text = "";
    Children.forEach(node, (child) => {
        if (text || !isValidElement(child)) return;
        const anyChild = child as any;
        const className = anyChild.props?.className || "";
        if (className.split(" ").includes(cls)) {
            text = getPlainText(anyChild.props?.children);
            return;
        }
        if (anyChild.props?.children) {
            text = findByClass(anyChild.props.children, cls);
        }
    });
    return text;
}

function findFirstTag(node: ReactNode, tag: string): string {
    let text = "";
    Children.forEach(node, (child) => {
        if (text || !isValidElement(child)) return;
        const anyChild = child as any;
        if (anyChild.type === tag) {
            text = getPlainText(anyChild.props?.children);
            return;
        }
        if (anyChild.props?.children) {
            text = findFirstTag(anyChild.props.children, tag);
        }
    });
    return text;
}

function getPlainText(node: ReactNode): string {
    let out = "";
    Children.forEach(node, (child) => {
        if (typeof child === "string") out += child;
        else if (isValidElement(child)) out += getPlainText((child.props as any)?.children);
    });
    return out.trim();
}

interface StackSlide {
    key: string;
    image: string | null;
    title: string;
    subtitle: string;
    text: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StackSlider = (props: any) => {
    const data = props.data || [];
    const finalData = data.filter((items: any) => items.props !== undefined);

    const slides: StackSlide[] = finalData.map((item: any, i: number) => ({
        key: item.key ?? String(i),
        image: findImageSrc(item.props.children),
        title: findByClass(item.props.children, "title") || findFirstTag(item.props.children, "h3"),
        subtitle: findByClass(item.props.children, "subtitle") || findFirstTag(item.props.children, "h5"),
        text: findFirstTag(item.props.children, "p"),
    }));

    const [activeIndex, setActiveIndex] = useState(0);
    const total = slides.length;

    useEffect(() => {
        if (total <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % total);
        }, 4500);
        return () => clearInterval(interval);
    }, [total]);

    if (total === 0) return null;

    const handleNext = () => setActiveIndex((p) => (p + 1) % total);
    const handlePrev = () => setActiveIndex((p) => (p - 1 + total) % total);

    return (
        <div className="ccs-trueStack">
            <div className="ccs-trueStack__viewport">
                {slides.map((slide, index) => {
                    let offset = index - activeIndex;
                    if (offset > total / 2) offset -= total;
                    if (offset < -total / 2) offset += total;

                    const isActive = offset === 0;
                    if (Math.abs(offset) > 2) return null;

                    return (
                        <div
                            key={slide.key}
                            onClick={() => setActiveIndex(index)}
                            className={`ccs-trueStack__card${isActive ? " is-active" : ""}`}
                            style={{
                                transform: `translateX(${offset * 85}px) scale(${isActive ? 1 : 0.94 - Math.abs(offset) * 0.05})`,
                                zIndex: total - Math.abs(offset),
                                backgroundImage: slide.image ? `url(${slide.image})` : undefined,
                            }}
                        >
                            {isActive && (
                                <div className="ccs-trueStack__overlay-2">
                                    {slide.title && <h3 className="ccs-trueStack__title">{slide.title}</h3>}

                                </div>
                            )}

                            {isActive && (
                                <div className="ccs-trueStack__overlay">
                                    {slide.subtitle && <h5 className="ccs-trueStack__subtitle">{slide.subtitle}</h5>}
                                    {slide.text && <p className="ccs-trueStack__text text-center">{slide.text}</p>}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {total > 1 && (
                <div className="ccs-trueStack__nav">
                    <button onClick={handlePrev} className="nav-prev" aria-label="Previous slide">&#8249;</button>
                    <button onClick={handleNext} className="nav-next" aria-label="Next slide">&#8250;</button>
                </div>
            )}
        </div>
    );
};

export default StackSlider;