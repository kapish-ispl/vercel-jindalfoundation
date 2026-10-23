import React, { useState, useRef, useEffect } from 'react';
import { useField } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';

export interface Option {
    label: string;
    value: string;
}

interface FormSelectProps {
    label: string;
    name: string;
    options: Option[];
    placeholder?: string;
    searchable?: boolean;
    error?: string;
    touched?: boolean;
    onChange?: (option: Option) => void;
    onFocus?: () => void;
    showLabel?: boolean;
    onBlur?: () => void;
}

const FormSelect: React.FC<FormSelectProps> = ({
    label,
    name,
    options,
    placeholder = "Select an option",
    searchable = true,
    onChange,
    onFocus,
    onBlur,
    showLabel = false,
    ...props
}) => {
    const [field, meta, helpers] = useField(name);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const hasError = meta.touched && meta.error;
    const displayError = meta.error;
    const selectedOption = options.find(opt => opt.value === field.value);

    const filteredOptions = searchable
        ? options.filter((opt) =>
            opt.label.toLowerCase().includes(search.toLowerCase())
        )
        : options;

    useEffect(() => {
        if (!isOpen) setSearch("");
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                if (isOpen) {
                    setIsOpen(false);
                    helpers.setTouched(true);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleSelect = (option: Option) => {
        helpers.setValue(option.value, true);
        helpers.setTouched(true, true);
        setIsOpen(false);
        if (onChange) onChange(option);
        if (onBlur) onBlur();
    };

    const containerClassName = `form_grider_wrap ${hasError ? "hasError" : ""}`;

    return (
        <div className={containerClassName} ref={wrapperRef}>
            {showLabel && <label htmlFor={name} className="form_grider_wrap_label">
                {label}
            </label>}
            <div className="dropdown d-inline-block w-100 cus-select">
                <motion.button
                    type="button"
                    className="form_grider_wrap_field d-flex justify-content-between align-items-center w-100"
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (isOpen) helpers.setTouched(true, true);
                    }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    style={{ textAlign: 'left', background: 'transparent' }}
                >
                    <span className="flex-grow-1 text-start overflow-hidden text-nowrap">
                        {selectedOption ? (
                            selectedOption.label
                        ) : (
                            <span style={{ color: '#949494' }}>{placeholder}</span>
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
                            {isOpen ? <i className="icon-minus" /> : <i className="icon-list-filter" />}
                        </motion.span>
                    </AnimatePresence>
                </motion.button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="dropdown-menu show w-100 mt-1 shadow-lg"
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0 }}
                            style={{
                                transformOrigin: "top",
                                zIndex: 1000,
                                display: 'block',
                                padding: '10px 0'
                            }}
                        >
                            {searchable && (
                                <div className="px-3 pb-2 sticky-top bg-white border-bottom mb-1">
                                    <div className="position-relative">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            className="form-control form-control-sm pr-4"
                                            style={{
                                                fontSize: '0.875rem',
                                                height: '40px',
                                                borderRadius: '4px',
                                                border: '1px solid #ced4da'
                                            }}
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search..."
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <i className="icon-search position-absolute" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '0.8rem' }} />
                                    </div>
                                </div>
                            )}
                            <ul
                                className="list-unstyled mb-0"
                                style={{ maxHeight: '250px', overflowY: 'auto', overscrollBehavior: 'contain' }}
                                data-lenis-ignore="true"
                                data-lenis-prevent="true"
                            >
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((opt) => (
                                        <li key={opt.value}>
                                            <button
                                                type="button"
                                                className={`dropdown-item py-2 ${field.value === opt.value ? 'active' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelect(opt);
                                                }}
                                                onFocus={onFocus}
                                                onBlur={onBlur}
                                                style={{ whiteSpace: 'normal' }}
                                            >
                                                {opt.label}
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-3 py-2 text-muted small">No results found for "{search}"</li>
                                )}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {hasError && <p className="form_grider_wrap_helper">{displayError}</p>}
        </div>
    );
};

export default FormSelect;
