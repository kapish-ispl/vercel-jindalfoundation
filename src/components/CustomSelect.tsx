"use client";
import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    options: Option[];
    onChange?: (value: string) => void;
    placeholder?: string;
    icon?: ReactNode;
    searchable?: boolean;
    paramKey?: string
    selectRef?: React.RefObject<{ clearValue: (push?: boolean) => void } | null>;
}

export default function CustomSelect({
    options,
    onChange,
    placeholder = "Select an option",
    icon,
    searchable = false,
    paramKey = 'type',
    selectRef,
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<Option | null>(null);
    const [search, setSearch] = useState("");

    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Changing a filter re-slices the result set, so any page the user had
    // paginated to is no longer valid — keeping it would land them on an empty
    // page (e.g. ?page=3 with a filter that only returns 6 items).
    // Covers both the shared `page` key and PostList's `<slug>-page` variants.
    const resetPagination = (params: URLSearchParams) => {
        params.delete("page");
        [...params.keys()]
            .filter((key) => key.endsWith("-page"))
            .forEach((key) => params.delete(key));
    };

    if (selectRef) {
        selectRef.current = {
            clearValue(push = true) {
                setSelected(null);
                setSearch("");
                onChange?.("");

                if (push) {
                    const params = new URLSearchParams(window.location.search);
                    params.delete(paramKey);
                    resetPagination(params);
                    const query = params.toString();
                    const newUrl = query
                        ? `${window.location.pathname}?${query}`
                        : window.location.pathname;
                    router.push(newUrl, { scroll: false });
                }
            },
        };
    }

    const filteredOptions = searchable
        ? options.filter((opt) =>
            opt.label.toLowerCase().includes(search.toLowerCase())
        )
        : options;

    useEffect(() => {
        if (isOpen) setSearch("");
    }, [isOpen]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const type = params.get(paramKey);

        if (type) {
            const match = options.find((o) => o.value === type);
            if (match) setSelected(match);
        }
    }, [options, paramKey]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: Option) => {
        setSelected(option);
        setIsOpen(false);
        onChange?.(option.value);

        const params = new URLSearchParams(window.location.search);
        params.set(paramKey, option.value);
        resetPagination(params);

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        router.push(newUrl, { scroll: false });
    };

    return (
        <div ref={wrapperRef} className="dropdown d-inline-block w-100 cus-select">
            <motion.button
                type="button"
                className="dropdown-toggle d-flex justify-content-between align-items-center w-100"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="flex-grow-1 text-start">
                    {searchable && isOpen ? (
                        <input
                            type="text"
                            className="form-control border-0 m-0 shadow-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : selected ? (
                        selected.label
                    ) : (
                        placeholder
                    )}
                </span>

                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={isOpen ? "open" : "closed"}
                        className="ms-2 d-inline-flex"
                        initial={{ opacity: 0, scaleY: 0.6 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0.6 }}
                    >
                        {isOpen ? <i className="icon-minus" /> : icon || <i className="icon-list-filter" />}
                    </motion.span>
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        className="dropdown-menu show w-100 mt-1 shadow"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                        style={{
                            transformOrigin: "top",
                            maxHeight: "250px",
                            overflowY: "auto",
                            display: "block",
                            zIndex: 1050
                        }}
                        onWheel={(e) => e.stopPropagation()}
                    >
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <li key={opt.value}>
                                    <button
                                        type="button"
                                        className="dropdown-item"
                                        onClick={() => handleSelect(opt)}
                                    >
                                        {opt.label}
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li className="px-3 py-2 text-muted small">No results found</li>
                        )}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}
