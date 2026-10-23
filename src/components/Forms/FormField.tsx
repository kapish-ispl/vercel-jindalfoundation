import { useField } from 'formik';
import React, { forwardRef } from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label?: string;
    name: string;
    type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'textarea' | 'radio' | 'checkbox';
    error?: string;
    touched?: boolean;
    rows?: number;
    maxLength?: number;
    autoComplete?: string;
    showLabel?: boolean;
    prefixText?: string;
}

const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
    ({ type = 'text', label, name, error, touched, maxLength, autoComplete, showLabel = false, prefixText, ...rest }, ref) => {

        const [field, meta] = useField({ name, type: type === 'textarea' ? 'text' : type });
        const hasError = (touched || meta.touched) && (error || meta.error);
        const displayError = error || meta.error;

        const containerClassName = `form_grider_wrap ${hasError ? "hasError" : ""}`;

        if (type === 'radio') {
            const uniqueId = `${name}-${rest.value}`;
            return (
                <div className="form_radio_wrap form-check">
                    <input
                        id={uniqueId}
                        {...rest}
                        {...field}
                        type="radio"
                        className="form_radio_field form-check-input"
                        ref={ref as React.Ref<HTMLInputElement>}
                    />
                    <label htmlFor={uniqueId} className="form_radio_label form-check-label">
                        {label}
                    </label>
                </div>
            );
        }

        const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            field.onBlur(e);
            if (rest.onBlur) {
                rest.onBlur(e as any);
            }
        };

        return (
            <div className={containerClassName}>
                {showLabel && <label htmlFor={name} className="form_grider_wrap_label">
                    {label}
                </label>}
                {type === 'textarea' ? (
                    <textarea
                        id={name}
                        {...field}
                        {...rest}
                        placeholder={label}
                        className="form_grider_wrap_field"
                        maxLength={maxLength}
                        autoComplete={autoComplete}
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        onBlur={handleBlur}
                    />
                ) : (
                    <div className={prefixText ? "form_field_input_group" : ""}>
                        {prefixText && <span className="form_field_prefix">{prefixText}</span>}
                        <input
                            id={name}
                            {...field}
                            {...rest}
                            placeholder={label}
                            type={type}
                            className="form_grider_wrap_field"
                            maxLength={maxLength}
                            autoComplete={autoComplete}
                            ref={ref as React.Ref<HTMLInputElement>}
                            onBlur={handleBlur}
                        />
                    </div>
                )}
                {hasError && <p className="form_grider_wrap_helper">{displayError}</p>}
            </div>
        );
    }
);

FormField.displayName = 'FormField';

export default FormField;