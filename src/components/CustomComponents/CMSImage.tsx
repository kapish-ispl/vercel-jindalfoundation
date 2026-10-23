import Image from "next/image";

/**
 * next/image needs plain numeric width/height, but CMS markup is hand-authored and the
 * values arrive in whatever shape the editor typed: "600", "600px", " 600 ", or JSX-style
 * braces like "{600}". Anything we can't read as a positive pixel count (percentages,
 * "auto", empty) falls back to the default.
 */
const toPixels = (value: unknown, fallback: number): number => {
    if (typeof value === "number") {
        return Number.isFinite(value) && value > 0 ? Math.round(value) : fallback;
    }
    if (typeof value !== "string") return fallback;

    /* relative units can't be resolved here — let the fallback stand */
    if (value.includes("%")) return fallback;

    const match = value.match(/\d+(?:\.\d+)?/);
    const parsed = match ? Number(match[0]) : NaN;
    return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : fallback;
};

const CMSImage = (props: any) => {
    return (
        <>
            <Image
                alt={props.alt}
                src={props.src}
                quality={100}
                className={props.className}
                // loading="lazy"
                // placeholder="blur"
                //blurDataURL={rgbDataURL(128, 128, 128)}
                width={toPixels(props.width, 500)}
                height={toPixels(props.height, 500)}
                style={props.style}
            />
        </>
    )
}

export default CMSImage;
