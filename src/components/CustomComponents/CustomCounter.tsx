import { useEffect, useRef, useState, useMemo } from "react";

const extractText = (node: any): string => {
    if (!node) return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (node.props && node.props.children) return extractText(node.props.children);
    return "";
};

const formatNumber = (val: number, decimals: number, hasCommas: boolean) => {
    let formatted = val.toFixed(decimals);
    if (hasCommas) {
        const parts = formatted.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        formatted = parts.join(".");
    }
    return formatted;
};

const CustomCounter = ({ data }: any) => {
    const ref = useRef<HTMLSpanElement>(null);
    const duration = 1000;

    const rawText = useMemo(() => extractText(data), [data]);

    const parsed = useMemo(() => {
        const trimmed = rawText.trim();
        const regex = /^([^0-9+-]*)([+-]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?)(.*)$/;
        const match = trimmed.match(regex);

        if (!match) {
            return {
                prefix: "",
                suffix: trimmed,
                targetNumber: 0,
                decimalPlaces: 0,
                hasCommas: false,
                isValid: false,
            };
        }

        const prefix = match[1];
        const numberStr = match[2];
        const suffix = match[3];

        const hasCommas = numberStr.includes(",");
        const decimalIndex = numberStr.indexOf(".");
        const decimalPlaces = decimalIndex !== -1 ? numberStr.length - decimalIndex - 1 : 0;
        const targetNumber = parseFloat(numberStr.replace(/,/g, ""));

        return {
            prefix,
            suffix,
            targetNumber,
            decimalPlaces,
            hasCommas,
            isValid: true,
        };
    }, [rawText]);

    const getDisplayValue = (val: number) => {
        if (!parsed.isValid) return rawText;
        return `${parsed.prefix}${formatNumber(val, parsed.decimalPlaces, parsed.hasCommas)}${parsed.suffix}`;
    };

    const [displayValue, setDisplayValue] = useState(() => getDisplayValue(0));

    useEffect(() => {
        setDisplayValue(getDisplayValue(0));

        if (!parsed.isValid) {
            setDisplayValue(rawText);
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                const startTime = Date.now();
                const interval = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const currentVal = progress * parsed.targetNumber;

                    setDisplayValue(getDisplayValue(currentVal));

                    if (progress === 1) {
                        clearInterval(interval);
                    }
                }, 16);
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, [parsed, duration, rawText]);

    return (
        <span ref={ref}>
            {displayValue}
        </span>
    );
};

export default CustomCounter;