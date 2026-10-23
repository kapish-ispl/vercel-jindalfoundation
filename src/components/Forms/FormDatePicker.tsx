import React from 'react';
import { useField, useFormikContext } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

interface FormDatePickerProps {
    label: string;
    name: string;
    placeholder?: string;
    placeholderText?: string;
    error?: string;
    touched?: boolean;
    showLabel?: boolean;
    dateFormat?: string;
    openToDate?: Date;
    minDate?: Date;
    maxDate?: Date;
    [key: string]: unknown;
}

const CustomDateInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    (inputProps, ref) => (
        <input
            {...inputProps}
            ref={ref}
            maxLength={12}
            inputMode="numeric"
        />
    )
);
CustomDateInput.displayName = "CustomDateInput";

const getInvalidErrorMessage = (fieldName: string, fieldLabel: string): string => {
    if (fieldName === "dob") return "Enter a valid Date of Birth";
    if (fieldName.includes("joining_date")) return "Enter a valid Joining Date";
    if (fieldName.includes("relieving_date")) return "Enter a valid Relieving Date";
    const cleanLabel = fieldLabel.replace(/[*()]/g, "").trim();
    return `Enter a valid ${cleanLabel || "Date"}`;
};

const parseDateString = (rawVal: string, format = "dd/MM/yyyy"): Date | null => {
    const trimmed = rawVal.trim();
    // Only support '/' as separator
    if (!trimmed.includes("/")) return null;

    const parts = trimmed.split("/");
    if (parts.length !== 3) return null;

    const [p0, p1, p2] = parts;
    // Each part must be digits only
    if (!/^\d+$/.test(p0) || !/^\d+$/.test(p1) || !/^\d+$/.test(p2)) return null;

    let day = 0;
    let month = 0; // 0-indexed for JavaScript Date
    let year = 0;

    const isYearFirst = format.toLowerCase().startsWith("yyyy");
    const isMonthFirst = format.toLowerCase().startsWith("mm");

    if (isYearFirst) {
        // YYYY/MM/DD
        if (p0.length !== 4) return null;
        year = parseInt(p0, 10);
        month = parseInt(p1, 10) - 1;
        day = parseInt(p2, 10);
    } else {
        // DD/MM/YYYY (default) or MM/DD/YYYY
        if (p2.length !== 4) return null;
        year = parseInt(p2, 10);
        const num0 = parseInt(p0, 10);
        const num1 = parseInt(p1, 10);

        if (isMonthFirst) {
            // MM/DD/YYYY
            if (num0 > 12 && num1 <= 12) {
                // If user entered day first even when format is MM/DD/YYYY
                day = num0;
                month = num1 - 1;
            } else {
                month = num0 - 1;
                day = num1;
            }
        } else {
            // DD/MM/YYYY (default)
            day = num0;
            month = num1 - 1;
        }
    }

    if (year < 1900 || year > 2100) return null;
    if (month < 0 || month > 11) return null;
    if (day < 1 || day > 31) return null;

    // Strict validation: construct Date and ensure year, month, and day match
    // (Prevents JS Date overflow like 31/02/2024 becoming 02/03/2024)
    const date = new Date(year, month, day);
    if (
        isNaN(date.getTime()) ||
        date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
};

const autoFormatDate = (raw: string, isDeleting: boolean, format = "dd/MM/yyyy"): string => {
    // 1. Only allow digits and '/'
    const clean = raw.replace(/[^0-9/]/g, "");

    // If deleting, do not auto-append slashes so the user can backspace freely
    if (isDeleting) {
        let val = clean.replace(/\/+/g, "/");
        if (val.startsWith("/")) val = val.replace(/^\/+/, "");
        const parts = val.split("/");
        if (parts.length > 3) {
            val = `${parts[0]}/${parts[1]}/${parts.slice(2).join("")}`;
        }
        return val.slice(0, 12);
    }

    const slashCount = (clean.match(/\//g) || []).length;
    const isYearFirst = format.toLowerCase().startsWith("yyyy");

    if (isYearFirst) {
        // YYYY/MM/DD
        const digits = clean.replace(/\D/g, "").slice(0, 8);
        if (!digits) return "";
        if (digits.length <= 4) {
            return digits.length === 4 ? `${digits}/` : digits;
        }
        if (digits.length <= 6) {
            const y = digits.slice(0, 4);
            const m = digits.slice(4);
            return digits.length === 6 ? `${y}/${m}/` : `${y}/${m}`;
        }
        const y = digits.slice(0, 4);
        const m = digits.slice(4, 6);
        const d = digits.slice(6, 8);
        return `${y}/${m}/${d}`;
    }

    // Default: DD/MM/YYYY (or MM/DD/YYYY) - both 2/2/4
    const digits = clean.replace(/\D/g, "").slice(0, 8);
    if (!digits) return "";

    // If user explicitly typed slash after 1 digit (e.g. "5/"), pad to "05/"
    if (clean.endsWith("/") && slashCount === 1 && digits.length === 1) {
        return `0${digits}/`;
    }

    // If user explicitly typed slash after month digit (e.g. "25/3/"), pad month to "25/03/"
    if (clean.endsWith("/") && slashCount === 2 && digits.length === 3) {
        return `${digits.slice(0, 2)}/0${digits.slice(2, 3)}/`;
    }

    if (digits.length <= 2) {
        return digits.length === 2 ? `${digits}/` : digits;
    }

    if (digits.length <= 4) {
        const p1 = digits.slice(0, 2);
        const p2 = digits.slice(2);
        return digits.length === 4 ? `${p1}/${p2}/` : `${p1}/${p2}`;
    }

    const p1 = digits.slice(0, 2);
    const p2 = digits.slice(2, 4);
    const year = digits.slice(4, 8);

    return `${p1}/${p2}/${year}`;
};

const FormDatePicker: React.FC<FormDatePickerProps> = ({
    label,
    name,
    placeholder,
    placeholderText,
    error,
    touched,
    showLabel = false,
    dateFormat = "dd/MM/yyyy",
    openToDate,
    minDate,
    maxDate,
    ...props
}) => {
    const [field, meta] = useField(name);
    const { setFieldValue, setFieldTouched, setFieldError } = useFormikContext();
    const [typedText, setTypedText] = React.useState<string | null>(null);
    const prevValRef = React.useRef<string>("");

    const hasError = (touched || meta.touched) && (error || meta.error);
    const displayError = error || meta.error;
    const isFieldDisabled = Boolean((props as any).disabled);
    const containerClassName = `form_grider_wrap ${hasError ? "hasError" : ""} ${isFieldDisabled ? "isDisabled" : ""}`;

    React.useEffect(() => {
        if (isFieldDisabled && typedText !== null) {
            setTypedText(null);
            prevValRef.current = "";
        }
    }, [isFieldDisabled, typedText]);

    const selectedDate = React.useMemo(() => {
        if (!field.value) return null;
        const d = new Date(field.value);
        return isNaN(d.getTime()) ? null : d;
    }, [field.value]);

    const placeholderPattern = dateFormat ? dateFormat.toUpperCase() : "DD/MM/YYYY";
    const resolvedPlaceholder = placeholderText || placeholder || `${label} (${placeholderPattern})`;

    const validateDateValue = (parsed: Date | null, rawText: string, markTouched = true) => {
        if (markTouched) {
            setFieldTouched(name, true, false);
        }

        if (!rawText.trim()) {
            setFieldValue(name, null, true);
            return;
        }

        if (!parsed) {
            setFieldValue(name, new Date("invalid"), false);
            setFieldError(name, getInvalidErrorMessage(name, label));
            return;
        }

        // Min Date check
        if (minDate && parsed < minDate) {
            setFieldValue(name, parsed, false);
            if (name === "dob") {
                setFieldError(name, "Applicant must be born after 1940");
            } else if (name.includes("relieving_date")) {
                setFieldError(name, "Relieving Date must be after Joining Date");
            } else {
                setFieldError(name, `Date cannot be earlier than ${minDate.toLocaleDateString()}`);
            }
            return;
        }

        // Max Date check
        if (maxDate && parsed > maxDate) {
            setFieldValue(name, parsed, false);
            if (name === "dob") {
                setFieldError(name, "Applicant must be at least 18 years old");
            } else if (name.includes("joining_date")) {
                setFieldError(name, "Joining Date cannot be in the future");
            } else if (name.includes("relieving_date")) {
                setFieldError(name, "Relieving Date cannot be in the future");
            } else {
                setFieldError(name, `Date cannot be after ${maxDate.toLocaleDateString()}`);
            }
            return;
        }

        // DOB specific age cutoff check
        if (name === "dob") {
            const cutoff = new Date();
            cutoff.setHours(23, 59, 59, 999);
            cutoff.setFullYear(cutoff.getFullYear() - 18);

            if (parsed > cutoff) {
                setFieldValue(name, parsed, false);
                setFieldError(name, "Applicant must be at least 18 years old");
                return;
            }

            if (parsed.getFullYear() < 1940) {
                setFieldValue(name, parsed, false);
                setFieldError(name, "Applicant must be born after 1940");
                return;
            }
        }

        // Valid date within bounds
        setFieldValue(name, parsed, true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        (props as any).onKeyDown?.(e);

        const allowedControlKeys = [
            "Backspace",
            "Tab",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Home",
            "End",
            "Enter",
            "Escape",
        ];

        // Allow Ctrl/Cmd shortcuts (Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+Z, etc.)
        if (e.ctrlKey || e.metaKey) {
            return;
        }

        if (allowedControlKeys.includes(e.key)) {
            return;
        }

        const target = e.target as HTMLInputElement;
        const currentVal = target.value || "";
        const selectionStart = target.selectionStart ?? currentVal.length;
        const selectionEnd = target.selectionEnd ?? currentVal.length;
        const isReplacing = selectionEnd > selectionStart;

        // Enforce max length of 12 characters: user can't add more than 12 char
        if (!isReplacing && currentVal.length >= 12) {
            e.preventDefault();
            return;
        }

        // Only allow digits '0'-'9' and '/'
        if (!/^[0-9\/]$/.test(e.key)) {
            e.preventDefault();
            return;
        }

        // Additional restriction on '/':
        if (e.key === "/") {
            const slashCount = (currentVal.match(/\//g) || []).length;
            if (!isReplacing && slashCount >= 2) {
                e.preventDefault();
                return;
            }
            if (selectionStart === 0) {
                e.preventDefault();
                return;
            }
            if (currentVal[selectionStart - 1] === "/") {
                e.preventDefault();
                return;
            }
        }
    };

    const handleRawChange = (e: any) => {
        const raw = e?.target?.value ?? "";
        const prev = prevValRef.current;
        const isDeleting = raw.length < prev.length;

        const formatted = autoFormatDate(raw, isDeleting, dateFormat);
        prevValRef.current = formatted;

        if (e?.target && e.target.value !== formatted) {
            e.target.value = formatted;
        }

        setTypedText(formatted);

        if (!formatted.trim()) {
            setFieldValue(name, null, true);
            return;
        }

        const parts = formatted.split("/");
        // If complete date entered (10 chars DD/MM/YYYY or parts has 3 with 4-digit year)
        if (formatted.length === 10 || (parts.length === 3 && parts[2]?.length === 4)) {
            const parsed = parseDateString(formatted, dateFormat);
            validateDateValue(parsed, formatted, false);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setFieldTouched(name, true, true);
        (props as any).onBlur?.(e);

        if (typedText !== null) {
            if (!typedText.trim()) {
                setFieldValue(name, null, true);
                setTypedText(null);
                prevValRef.current = "";
            } else {
                const parsed = parseDateString(typedText, dateFormat);
                validateDateValue(parsed, typedText, true);
                if (parsed) {
                    const cutoff = new Date();
                    cutoff.setHours(23, 59, 59, 999);
                    cutoff.setFullYear(cutoff.getFullYear() - 18);

                    const isDobInvalid = name === "dob" && (
                        parsed.getFullYear() < 1940 ||
                        parsed > cutoff
                    );
                    const isMinInvalid = Boolean(minDate && parsed < minDate);
                    const isMaxInvalid = Boolean(maxDate && parsed > maxDate);

                    if (!isDobInvalid && !isMinInvalid && !isMaxInvalid) {
                        setTypedText(null);
                        prevValRef.current = "";
                    }
                }
            }
        }
    };

    return (
        <div className={containerClassName}>
            {showLabel && (
                <label htmlFor={name} className="form_grider_wrap_label">
                    {label}
                </label>
            )}
            <div className="datepicker_wrapper w-100 position-relative">
                <DatePicker
                    {...props}
                    id={name}
                    name={name}
                    selected={selectedDate}
                    dateFormat={dateFormat}
                    openToDate={openToDate}
                    minDate={minDate}
                    maxDate={maxDate}
                    value={typedText !== null ? typedText : undefined}
                    customInput={<CustomDateInput />}
                    onKeyDown={handleKeyDown as any}
                    onChangeRaw={handleRawChange}
                    onChange={(val: Date | null) => {
                        setTypedText(null);
                        setFieldTouched(name, true, false);
                        setFieldValue(name, val, true);
                    }}
                    onBlur={handleBlur}
                    placeholderText={resolvedPlaceholder}
                    className="form_grider_wrap_field w-100 pe-5"
                    autoComplete="off"
                />
                <Calendar
                    className="datepicker_icon"
                    size={18}
                    style={{
                        position: 'absolute',
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#878787',
                    }}
                />
            </div>
            {hasError && <p className="form_grider_wrap_helper">{displayError}</p>}
        </div>
    );
};

export default FormDatePicker;
