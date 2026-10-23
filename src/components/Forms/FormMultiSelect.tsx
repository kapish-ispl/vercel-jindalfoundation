import React from 'react';
import { useField } from 'formik';
import Select, { components } from 'react-select';

interface Option {
    label: string;
    value: string;
}

interface FormMultiSelectProps {
    label: string;
    name: string;
    options: Option[];
    placeholder?: string;
    onChange?: (options: any) => void;
    showLabel?: boolean;
    isMulti?: boolean;
    error?: string;
    touched?: boolean;
}

const CustomMenuList = (props: any) => {
    return (
        <components.MenuList
            {...props}
            innerProps={{
                ...props.innerProps,
                'data-lenis-prevent': 'true',
                'data-lenis-ignore': 'true',
            }}
        >
            {props.children}
        </components.MenuList>
    );
};

const FormMultiSelect: React.FC<FormMultiSelectProps> = ({
    label,
    name,
    options,
    placeholder = "Select options",
    onChange,
    showLabel = false,
    isMulti = false,
    error,
    touched,
}) => {
    const [field, meta, helpers] = useField(name);

    const hasError = Boolean((touched || meta.touched) && (error || meta.error));
    const displayError = error || meta.error;

    // Handle initial value or external value updates
    const selectedOptions = isMulti
        ? options.filter(option => (field.value as string[])?.includes(option.value))
        : options.find(option => option.value === field.value || option.label === field.value) || null;

    const handleChange = (selected: any) => {
        if (isMulti) {
            const values = selected ? selected.map((opt: any) => opt.value) : [];
            helpers.setValue(values, true);
            if (values.length > 0) {
                helpers.setError(undefined);
            }
        } else {
            const val = selected ? (selected.value ?? selected.label ?? "") : "";
            // If onChange is provided, it handles batch updates and validation atomically
            helpers.setValue(val, !onChange);
            if (val) {
                helpers.setError(undefined);
                helpers.setTouched(true, false);
            }
        }

        if (onChange) onChange(selected);
    };

    return (
        <div
            className={`form_grider_wrap ${hasError ? "hasError" : ""}`}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    helpers.setTouched(true, true);
                }
            }}
        >
            {showLabel && <label className="form_grider_wrap_label">{label}</label>}
            <div className="dropdown d-inline-block w-100 cus-select">
                <Select
                    isMulti={isMulti}
                    name={name}
                    className="form_grider_wrap_field select_field"
                    classNamePrefix="react-select"
                    placeholder={placeholder}
                    value={selectedOptions}
                    onChange={handleChange}
                    options={options}
                    components={{ MenuList: CustomMenuList }}
                    onBlur={() => helpers.setTouched(true, true)}
                    styles={{
                        control: (base, state) => ({
                            ...base,
                            border: hasError ? '1px solid rgb(237, 67, 55)' : 'none',
                            boxShadow: 'none',
                            '&:hover': {
                                border: hasError ? '1px solid rgb(237, 67, 55)' : 'none'
                            }
                        }),
                        menuList: (base) => ({
                            ...base,
                            overscrollBehavior: 'contain',
                        }),
                        valueContainer: (base) => ({
                            ...base,
                            paddingLeft: '15px'
                        }),
                        singleValue: (base) => ({
                            ...base,
                            margin: 0
                        }),
                        placeholder: (base) => ({
                            ...base,
                            margin: 0
                        })
                    }}
                />
            </div>
            {hasError && <p className="form_grider_wrap_helper">{displayError}</p>}
        </div>
    );
};

export default FormMultiSelect;
