import { FieldArray, Form, getIn, Formik, useFormikContext } from "formik";
import { JobApplicationSchema } from "./formschema";
import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { UploadCloud, FileText, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { POST_JOB_ENDPOINT, GET_FILE_UPLOAD_ENDPOINT } from "@/config/apiConfig";
import { Captcha } from "../Captcha";
import { AppContext } from "@/context/AppContext";
import FormField from "./FormField";
import FormDatePicker from "./FormDatePicker";
import { useRouter, useParams, usePathname } from "next/navigation";
import { postUploadFileResponse, postAPIResponse } from "@/services/apiRequests";
import FormMultiSelect from "./FormMultiSelect";
import { useFormSubmit, validateAndNotifyCaptcha } from "@/hooks/useFormSubmit";
import { useApplicantCheck, JobApplicantModal } from "./job";

import { COUNTRY_CODE } from "@/config/countryCode";
import { BOARD_OPTIONS } from "@/config/educationalBoards";

export const getCountryDialCode = (selected: any): string => {
    if (!selected) return "";
    const rawName = (typeof selected === "string" ? selected : selected?.label || selected?.value || "").trim();
    if (!rawName) return "";
    const cleanLower = rawName.toLowerCase();
    const cleanNorm = cleanLower.replace(/[^a-z0-9]/g, "");
    let match = COUNTRY_CODE.find(
        (c) => c.name.toLowerCase() === cleanLower || c.code.toLowerCase() === cleanLower
    );
    if (match) return match.dial_code;
    match = COUNTRY_CODE.find(
        (c) => c.name.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanNorm
    );
    if (match) return match.dial_code;
    match = COUNTRY_CODE.find(
        (c) => c.name.toLowerCase().startsWith(cleanLower) || cleanLower.startsWith(c.name.toLowerCase())
    );
    if (match) return match.dial_code;
    return "";
};

const CountryCodeSync = () => {
    const { values, setFieldValue } = useFormikContext<any>();
    const prevCountryRef = useRef(values.country_name);
    useEffect(() => {
        if (values.country_name !== prevCountryRef.current) {
            prevCountryRef.current = values.country_name;
            const dialCode = getCountryDialCode(values.country_name);
            if (dialCode && values.std_code !== dialCode) {
                setFieldValue("std_code", dialCode, false);
            } else if (!values.country_name && values.std_code) {
                setFieldValue("std_code", "", false);
            }
        }
    }, [values.country_name, values.std_code, setFieldValue]);
    return null;
};

const ScrollToFirstError = () => {
    const { errors, isSubmitting, isValidating } = useFormikContext();
    useEffect(() => {
        if (isSubmitting && !isValidating && Object.keys(errors).length > 0) {
            const el = document.querySelector(".hasError");
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [isSubmitting, isValidating, errors]);
    return null;
};

const JobForm = () => {
    const contextInfo = useContext(AppContext);
    const { departmentOptions } = useContext(AppContext);
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const [showInputBox, setShowInputBox] = useState(false);
    const [showExpericeFields, setShowExpericeFields] = useState(false);
    const [selectedCountryIndia, setSelectedCountryIndia] = useState(false);
    const [selectedStateOther, setSelectedStateOther] = useState(false);
    const [selectedNationalityOther, setSelectedNationalityOther] = useState(false);
    const [selectDepartmentOther, setSelectDepartmentOther] = useState(false);
    const maxDobDate = useMemo(() => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 18);
        return date;
    }, []);
    const [actualCaptcha, setActualCaptcha] = useState<string>('');
    const [reloadCaptcha, setReloadCaptcha] = useState<boolean>(false);
    const [captchaKey, setCaptchaKey] = useState<number>(0);
    const [fileName, setFileName] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isTalentCommunity = useMemo(() => {
        const slug = params?.slug;
        if (slug === "join-our-talent-community") return true;
        if (Array.isArray(slug) && slug.includes("join-our-talent-community")) return true;
        if (pathname === "/join-our-talent-community" || pathname?.endsWith("/join-our-talent-community"))
            return true;
        return false;
    }, [params?.slug, pathname]);

    const {
        isAlreadyApplied,
        checkApplicantEmail,
        modalProps: applicantModalProps,
    } = useApplicantCheck({
        postId: contextInfo?.jobPostId,
        isTalentCommunity,
    });

    const { handleSubmit: submitJobForm } = useFormSubmit(
        (data: any) => postAPIResponse(POST_JOB_ENDPOINT, data),
        {
            successMsg: "Application submitted successfully!",
            onSuccess: () => {
                setTimeout(() => {
                    router.push("/careers");
                }, 5000);
            },
            onError: (_err, msg) => {
                contextInfo.setIsLoading(false);
                setReloadCaptcha(prev => !prev);
            },
        }
    );

    const experienceOptions = [
        { value: "0", label: "Fresher" },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "9", label: "9" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
        { value: "13", label: "13" },
        { value: "14", label: "14" },
        { value: "15", label: "15+" },
    ];

    const educationLabels = [
        "10th",
        "12th",
        "Graduation",
        "Post Graduation",
        "Others",
    ];

    const currentEmploymentOptions = [
        { value: "0", label: "No" },
        { value: "1", label: "Yes" },
    ];

    const genderOptions = useMemo(() => {
        let opts = [
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
        ];
        if (contextInfo.genderOptions && contextInfo.genderOptions.length > 0) {
            opts = [...contextInfo.genderOptions];
        }
        const hasOther = opts.some(
            (o) => o.value?.toLowerCase() === "other" || o.label?.toLowerCase() === "other"
        );
        if (!hasOther) {
            opts.push({ value: "Other", label: "Other" });
        }
        return opts;
    }, [contextInfo.genderOptions]);

    const initialValues = {
        post_id:
            contextInfo.jobPostId !== "" && contextInfo.jobPostId !== undefined
                ? Number(contextInfo.jobPostId)
                : "",
        job_code:
            contextInfo.jobCode !== "" && contextInfo.jobCode !== undefined
                ? contextInfo.jobCode
                : "",
        current_openings:
            contextInfo.jobTitle !== "" && contextInfo.jobTitle !== undefined
                ? `${contextInfo.jobRole}${contextInfo.jobRole && ' ,'}${contextInfo.jobTitle}`
                : "",
        job_location:
            contextInfo.jobLocation !== "" && contextInfo.jobLocation !== undefined
                ? contextInfo.jobLocation
                : "",
        name: "",
        dob: null,
        isTalentForm: pathname == "/join-our-talent-community" ? true : false,
        skils: "",
        department: "",
        other_department: "",
        email: "",
        alternate_email: "",
        gender: "",
        total_experience: "",
        other_experience: "",
        notice_period: "",
        nationality: "",
        other_nationality: "",
        country_name: "",
        state_name: "",
        other_state_name: "",
        pincode: "",
        std_code: "",
        mobile_number: "",
        alternate_mobile_number: "",
        address: "",
        country_of_residence: "India",
        city_name: "",
        resume_id: "",
        resume_file: null,
        user_captcha_input: "",
        education_details: [
            {
                degree_name: "",
                other_board_name: "",
                course_name: "",
                institute_name: "",
                university_name: "",
                passing_year: "",
                percentage: "",
            },
        ],
        experience_details: [
            {
                organization_name: "",
                designation: "",
                joining_date: null,
                job_profile: "",
                relieving_date: null,
                is_current_employment: "",
            },
        ],
    };


    useEffect(() => {
        if (reloadCaptcha) {
            setCaptchaKey((prev) => prev + 1);
        }
    }, [reloadCaptcha]);

    useEffect(() => {
        let jobId = contextInfo.jobPostId;

        if (params?.slug === "join-our-talent-community") {
            jobId = "3645";
            contextInfo.setJobPostId(jobId);
        }

        if (Number(jobId) === 0) {
            router.push("/careers");
        }
    }, [params?.slug, contextInfo.jobPostId]);

    return (

        <div className="commonSection-md">

            <div className="container cus-conatiner">
                <div className="row">
                    <div className="col-12">
                        <div className="form_container c-form">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={JobApplicationSchema}
                                enableReinitialize={true}
                                validateOnChange={true}
                                validateOnBlur={true}
                                onSubmit={async (values, action) => {
                                    if (isAlreadyApplied) {
                                        action.setFieldError("email", applicantModalProps.message || "You have already applied for this position.");
                                        action.setSubmitting(false);
                                        return;
                                    }

                                    const formValues = { ...values };

                                    if (formValues.total_experience == "15") {
                                        formValues.total_experience = formValues.other_experience;
                                    } else if (formValues.total_experience == "0") {
                                        formValues.notice_period = "";
                                        formValues.other_experience = "";
                                        formValues.experience_details = [];
                                    }

                                    if (formValues.nationality === "Others" || formValues.nationality === "Other") {
                                        if (formValues.other_nationality) {
                                            formValues.nationality = formValues.other_nationality;
                                        }
                                    }

                                    const {
                                        user_captcha_input,
                                        other_nationality,
                                        ...submittedValue
                                    } = formValues;

                                    if (!validateAndNotifyCaptcha(user_captcha_input, actualCaptcha)) {
                                        action.setFieldError("user_captcha_input", "Captcha does not match. Please try again.");
                                        action.setFieldTouched("user_captcha_input", true, false);
                                        return;
                                    }

                                    const formatDateForApi = (dateVal: any) => {
                                        if (!dateVal) return null;
                                        const d = new Date(dateVal);
                                        if (isNaN(d.getTime())) return dateVal;
                                        const year = d.getFullYear();
                                        const month = String(d.getMonth() + 1).padStart(2, "0");
                                        const day = String(d.getDate()).padStart(2, "0");
                                        return `${year}-${month}-${day}`;
                                    };

                                    const formattedExperienceDetails = (formValues.total_experience === "0" ? [] : formValues.experience_details).map((exp: any, idx: number) => ({
                                        ...exp,
                                        is_current_employment: idx === 0 ? (exp.is_current_employment || "") : "0",
                                        joining_date: formatDateForApi(exp.joining_date),
                                        relieving_date: formatDateForApi(exp.relieving_date),
                                    }));

                                    const submittedData = {
                                        ...submittedValue,
                                        dob: formatDateForApi(submittedValue.dob),
                                        experience_details: formattedExperienceDetails,
                                    };

                                    setReloadCaptcha(prev => !prev);
                                    contextInfo.setIsLoading(true);

                                    await submitJobForm(
                                        submittedData,
                                        {
                                            setSubmitting: action.setSubmitting,
                                            resetForm: action.resetForm,
                                        }
                                    );

                                    contextInfo.setIsLoading(false);
                                }}
                            >
                                {({
                                    values,
                                    touched,
                                    errors,
                                    setFieldValue,
                                    setFieldTouched,
                                    setFieldError,
                                    setValues,
                                    validateField,
                                    validateForm,
                                    handleSubmit,
                                    isSubmitting,
                                }) => {
                                    const noticePeriodHandler = (e: any) => {
                                        let val = e.target.value.replace(/\D/g, "");
                                        if (val.length > 1 && val.startsWith("0")) {
                                            val = val.replace(/^0+/, "");
                                            if (val === "") val = "0";
                                        }
                                        if (Number(val) > 180) {
                                            val = "180";
                                        }
                                        setFieldValue("notice_period", val, true);
                                    };

                                    const handleExperienceChange = (selectedValue: any) => {
                                        const val = selectedValue?.value || "";
                                        const isFresher = val === "0";
                                        const isExperienced = Boolean(val && val !== "0");

                                        setShowExpericeFields(isExperienced);
                                        setShowInputBox(val === "15");

                                        if (val) {
                                            setFieldError("total_experience", undefined);
                                            setFieldTouched("total_experience", true, false);
                                        }

                                        if (isFresher) {
                                            setFieldValue("notice_period", "");
                                            setFieldTouched("notice_period", false, false);
                                            setFieldError("notice_period", undefined);
                                            setFieldValue("other_experience", "");
                                            setFieldTouched("other_experience", false, false);
                                            setFieldError("other_experience", undefined);
                                            setFieldValue("experience_details", []);
                                            setFieldError("experience_details", undefined);
                                        } else if (isExperienced) {
                                            if (val !== "15") {
                                                setFieldValue("other_experience", "");
                                                setFieldTouched("other_experience", false, false);
                                                setFieldError("other_experience", undefined);
                                            }
                                            if (!values.experience_details || values.experience_details.length === 0) {
                                                setFieldValue("experience_details", [
                                                    {
                                                        organization_name: "",
                                                        designation: "",
                                                        joining_date: null,
                                                        job_profile: "",
                                                        relieving_date: null,
                                                        is_current_employment: "",
                                                    },
                                                ]);
                                            }
                                        } else {
                                            setFieldValue("notice_period", "");
                                            setFieldTouched("notice_period", false, false);
                                            setFieldError("notice_period", undefined);
                                            setFieldValue("experience_details", []);
                                        }

                                        if (typeof errors.experience_details === "string") {
                                            setFieldError("experience_details", undefined);
                                        }
                                        setTimeout(() => {
                                            validateForm();
                                        }, 50);
                                    };

                                    // Helpers for option matching
                                    const isOtherOption = (opt: any) =>
                                        ["Others", "Other"].includes(opt?.value) || ["Others", "Other"].includes(opt?.label);

                                    const findOptionByLabel = (options: any[], label: string) =>
                                        options?.find((opt: any) => opt.value === label || opt.label === label);

                                    const handleCountryChange = (selectedValue: any) => {
                                        const countryVal = selectedValue?.value || selectedValue?.label || "";
                                        const isInd = countryVal === "India" || selectedValue?.value === "India" || selectedValue?.label === "India";
                                        setSelectedCountryIndia(isInd);

                                        const existingStateError = errors.state_name;
                                        const dialCode = getCountryDialCode(selectedValue);

                                        const natOptions = contextInfo.nationalityOptions || [];
                                        let newNat = values.nationality;
                                        let isOtherNat = selectedNationalityOther;
                                        if (isInd) {
                                            const indianOpt = findOptionByLabel(natOptions, "Indian");
                                            if (indianOpt) {
                                                newNat = indianOpt.value;
                                                isOtherNat = false;
                                            }
                                        } else {
                                            const otherOpt = natOptions.find(isOtherOption);
                                            newNat = otherOpt?.value || "Others";
                                            isOtherNat = true;
                                        }
                                        setSelectedNationalityOther(isOtherNat);
                                        setSelectedStateOther(false);

                                        // Update all related values in ONE atomic batch and validate
                                        setValues((prev: any) => ({
                                            ...prev,
                                            country_name: countryVal,
                                            std_code: dialCode,
                                            state_name: "",
                                            other_state_name: "",
                                            nationality: newNat || prev.nationality,
                                            other_nationality: "",
                                        }), true);

                                        if (countryVal) {
                                            setFieldError("country_name", undefined);
                                            setFieldTouched("country_name", true, false);
                                        }

                                        // Preserve existing State error if present
                                        if (existingStateError) {
                                            setFieldTouched("state_name", true, false);
                                            setFieldError("state_name", existingStateError);
                                        } else {
                                            setFieldTouched("state_name", false, false);
                                            setFieldError("state_name", undefined);
                                        }

                                        setFieldTouched("other_state_name", false, false);
                                        setFieldError("other_state_name", undefined);
                                        setFieldError("nationality", undefined);
                                    };

                                    const handleNationalityChange = (selectedValue: any) => {
                                        const isOther = isOtherOption(selectedValue);
                                        setSelectedNationalityOther(isOther);
                                        const natVal = selectedValue?.value || "";
                                        if (natVal) {
                                            setFieldError("nationality", undefined);
                                            setFieldTouched("nationality", true, false);
                                        }
                                        if (!isOther) {
                                            setFieldValue("other_nationality", "", false);
                                            setFieldError("other_nationality", undefined);
                                            setFieldTouched("other_nationality", false, false);
                                        }
                                    };

                                    const handleStateChange = (selectedValue: any) => {
                                        const isOther = selectedValue?.value === "Others";
                                        setSelectedStateOther(isOther);
                                        const stateVal = selectedValue?.value || "";

                                        // Update state atomically and run validation
                                        setValues((prev: any) => ({
                                            ...prev,
                                            state_name: stateVal,
                                            other_state_name: isOther ? prev.other_state_name : "",
                                        }), true);

                                        if (stateVal) {
                                            setFieldError("state_name", undefined);
                                            setFieldTouched("state_name", true, false);
                                        }
                                        if (!isOther) {
                                            setFieldError("other_state_name", undefined);
                                            setFieldTouched("other_state_name", false, false);
                                        }
                                    };

                                    const isIndia = selectedCountryIndia || values.country_name === "India";

                                    const handleFileChange = (selectedFile: any) => {
                                        const fileData = selectedFile.currentTarget.files?.[0];
                                        if (!fileData) {
                                            if (!values.resume_id) {
                                                setFieldTouched("resume_id", true, true);
                                                setFieldTouched("resume_file", true, true);
                                            }
                                            return;
                                        }

                                        const allowedExtensions = [".pdf", ".doc", ".docx", ".rtf"];
                                        const allowedMimeTypes = [
                                            "application/pdf",
                                            "application/msword",
                                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                            "application/rtf",
                                            "text/rtf",
                                        ];
                                        const ext = fileData.name.substring(fileData.name.lastIndexOf(".")).toLowerCase();
                                        const isMimeValid = !fileData.type || allowedMimeTypes.includes(fileData.type);
                                        if (!allowedExtensions.includes(ext) || !isMimeValid) {
                                            setFieldValue("resume_id", "", true);
                                            setFieldValue("resume_file", null, true);
                                            setFieldTouched("resume_id", true, true);
                                            setFieldTouched("resume_file", true, true);
                                            setFieldError("resume_file", "Only PDF, DOC, DOCX, and RTF files are allowed");
                                            setFileName("");
                                            toast.error("Only PDF, DOC, DOCX, and RTF files are allowed");
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                            return;
                                        }

                                        const maxFileSize = 5 * 1024 * 1024;
                                        if (fileData.size > maxFileSize) {
                                            setFieldValue("resume_id", "", true);
                                            setFieldValue("resume_file", null, true);
                                            setFieldTouched("resume_id", true, true);
                                            setFieldTouched("resume_file", true, true);
                                            setFieldError("resume_file", "File size must be less than 5MB");
                                            setFileName("");
                                            toast.error("File size must be less than 5MB");
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                            return;
                                        }

                                        setFieldValue("resume_file", fileData, false);
                                        setFieldTouched("resume_file", false, false);
                                        setFieldTouched("resume_id", false, false);
                                        setFieldError("resume_file", undefined);
                                        setFieldError("resume_id", undefined);
                                        setFileName(fileData.name);
                                        setIsUploading(true);
                                        const getFileUploadInfo = async () => {
                                            try {
                                                const response = await postUploadFileResponse(
                                                    `${GET_FILE_UPLOAD_ENDPOINT}`,
                                                    fileData
                                                );
                                                if (response && response.code === 'SUC200' && response.data?.media?.orig) {
                                                    setFieldValue("resume_id", response.data.media.orig, true);
                                                    setFieldTouched("resume_id", false, false);
                                                    setFieldError("resume_id", undefined);
                                                    setFieldError("resume_file", undefined);
                                                } else {
                                                    console.error("File upload failed:", response);
                                                    setFileName("");
                                                    setFieldValue("resume_id", "", false);
                                                    setFieldValue("resume_file", null, false);
                                                    setFieldTouched("resume_id", true, false);
                                                    setFieldError("resume_id", "File upload failed, please try again");
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = "";
                                                    }
                                                }
                                            } catch (err) {
                                                console.error("File upload failed:", err);
                                                setFileName("");
                                                setFieldValue("resume_id", "", false);
                                                setFieldValue("resume_file", null, false);
                                                setFieldTouched("resume_id", true, false);
                                                setFieldError("resume_id", "File upload failed, please try again");
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = "";
                                                }
                                            } finally {
                                                setIsUploading(false);
                                            }
                                        };
                                        getFileUploadInfo();
                                    };

                                    const handleRemoveFile = () => {
                                        setFieldValue("resume_id", "", true);
                                        setFieldValue("resume_file", null, true);
                                        setFieldTouched("resume_id", true, true);
                                        setFieldTouched("resume_file", true, true);
                                        setFieldError("resume_id", "Please upload your resume");
                                        setFileName("");
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = "";
                                        }
                                    };
                                    return (
                                        <Form onSubmit={handleSubmit}>
                                            <ScrollToFirstError />
                                            <CountryCodeSync />
                                            {/* ------ Job Details ------ */}
                                            {pathname != "/join-our-talent-community" ? (
                                                <div className="row form_grider v1">
                                                    <div className="col-12 col-md-4">
                                                        <FormField
                                                            label="Job Position*"
                                                            name="current_openings"
                                                            error={errors.current_openings}
                                                            touched={touched.current_openings}
                                                            autoComplete="off"
                                                            readOnly={true}
                                                            showLabel={true}
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-4">
                                                        <FormField
                                                            label="Job Code*"
                                                            name="job_code"
                                                            error={errors.job_code}
                                                            touched={touched.job_code}
                                                            autoComplete="off"
                                                            readOnly={true}
                                                            showLabel={true}
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-4">
                                                        <FormField
                                                            label="Job Location*"
                                                            name="job_location"
                                                            error={errors.job_location}
                                                            touched={touched.job_location}
                                                            autoComplete="off"
                                                            readOnly={true}
                                                            showLabel={true}
                                                        />
                                                    </div>
                                                </div>
                                            ) :
                                                <div className="row form_grider v1">
                                                    <div className={`col-12 ${selectDepartmentOther ? "col-md-4" : "col-md-6"}`}>
                                                        <FormMultiSelect
                                                            label="Select Department*"
                                                            name="department"
                                                            options={departmentOptions}
                                                            placeholder="Select Department"
                                                            showLabel={true}
                                                            error={errors.department}
                                                            touched={touched.department}
                                                            onChange={(selectedOption) => {
                                                                if (selectedOption?.value === "Others") {
                                                                    setSelectDepartmentOther(true);
                                                                } else {
                                                                    setSelectDepartmentOther(false);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    {selectDepartmentOther && (
                                                        <div className="col-12 col-md-4">
                                                            <FormField
                                                                label="Other Department*"
                                                                name="other_department"
                                                                error={errors.other_department}
                                                                touched={touched.other_department}
                                                                autoComplete="off"
                                                                showLabel={true}
                                                            />
                                                        </div>
                                                    )}

                                                    <div className={`col-12 ${selectDepartmentOther ? "col-md-4" : "col-md-6"}`}>
                                                        <FormField
                                                            label="Sub function or Specialty*"
                                                            name="skils"
                                                            error={errors.skils}
                                                            touched={touched.skils}
                                                            autoComplete="off"
                                                            showLabel={true}
                                                        />
                                                    </div>
                                                </div>
                                            }

                                            <div className="c-divider">&nbsp;</div>
                                            {/* ------ Personal Details ------ */}
                                            <div className="row">
                                                <div className="col-12">
                                                    <h3 className="cus_text30 text-orange withborder">
                                                        Personal Details
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="row form_grider v1">
                                                <div className="col-12 col-md-4">
                                                    <FormField
                                                        label="Email*"
                                                        name="email"
                                                        type="email"
                                                        error={errors.email}
                                                        touched={touched.email}
                                                        maxLength={50}
                                                        autoComplete="off"
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            const val = e.target.value;
                                                            setFieldValue("email", val, true);
                                                            checkApplicantEmail(
                                                                val,
                                                                values.post_id || contextInfo?.jobPostId || "",
                                                                validateField,
                                                                setFieldError
                                                            );
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-12 col-md-4">
                                                    <FormField
                                                        label="Name*"
                                                        name="name"
                                                        error={errors.name}
                                                        touched={touched.name}
                                                        maxLength={50}
                                                        autoComplete="off"
                                                        onChange={(e: any) => {
                                                            let val = e.target.value.replace(/[^a-zA-Z\s.'-]/g, "");
                                                            val = val.replace(/\s{2,}/g, " ");
                                                            setFieldValue("name", val, true);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-12 col-md-4">
                                                    <FormDatePicker
                                                        label="Date of Birth*"
                                                        name="dob"
                                                        error={errors.dob as string}
                                                        touched={touched.dob}
                                                        placeholderText="DOB* (DD/MM/YYYY)"
                                                        dateFormat="dd/MM/yyyy"
                                                        minDate={new Date("1940/01/01")}
                                                        maxDate={maxDobDate}
                                                        openToDate={maxDobDate}
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        autoComplete="off"
                                                    />
                                                </div>

                                                <div className="col-12 col-md-4">
                                                    <FormField
                                                        label="Alternate Email"
                                                        name="alternate_email"
                                                        type="email"
                                                        error={errors.alternate_email}
                                                        touched={touched.alternate_email}
                                                        maxLength={50}
                                                        autoComplete="off"
                                                    />
                                                </div>

                                                <div className="col-12 col-md-4">
                                                    <FormMultiSelect
                                                        label="Select Gender*"
                                                        name="gender"
                                                        options={genderOptions}
                                                        placeholder="Select Gender*"
                                                        error={errors.gender}
                                                        touched={touched.gender}
                                                    />
                                                </div>

                                                <div className="col-12 col-md-4">
                                                    <FormMultiSelect
                                                        label="Experience (Years)*"
                                                        name="total_experience"
                                                        options={experienceOptions}
                                                        placeholder="Select Experience in Year"
                                                        error={errors.total_experience}
                                                        touched={touched.total_experience}
                                                        onChange={handleExperienceChange}
                                                    />
                                                </div>

                                                {showInputBox && (
                                                    <div className="col-12 col-md-4">
                                                        <FormField
                                                            label="Other Experience*"
                                                            name="other_experience"
                                                            error={errors.other_experience}
                                                            touched={touched.other_experience}
                                                            maxLength={2}
                                                            autoComplete="off"
                                                            onChange={(e: any) => {
                                                                const val = e.target.value.replace(/\D/g, "");
                                                                setFieldValue("other_experience", val, true);
                                                            }}
                                                        />
                                                    </div>
                                                )}

                                                {showExpericeFields && (
                                                    <div className="col-12 col-md-4">
                                                        <FormField
                                                            label="Notice Period (Days)*"
                                                            name="notice_period"
                                                            error={errors.notice_period}
                                                            touched={touched.notice_period}
                                                            autoComplete="off"
                                                            onChange={noticePeriodHandler}
                                                            maxLength={3}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="c-divider">&nbsp;</div>
                                            {/* ------ Educational Details ------ */}
                                            <div className="row">
                                                <div className="col-12">
                                                    <h3 className="cus_text30 text-orange withborder">
                                                        Educational Details
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="row form_grider v1">
                                                <FieldArray
                                                    name="education_details"
                                                    render={(arrayHelpers) => {
                                                        const education_details = values.education_details;
                                                        const canAddMore = educationLabels.length > education_details.length;
                                                        return (
                                                            <div>
                                                                {education_details.map((_edu, index) => (
                                                                    <div key={index}>
                                                                        <div className="row">
                                                                            <div className="col-12">
                                                                                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between filter_withBtn">
                                                                                    <p className="cus_text24 mb-4 mt-4">
                                                                                        {educationLabels[index] || "Others"}
                                                                                    </p>
                                                                                    {index > 1 && (
                                                                                        <button
                                                                                            type="button"
                                                                                            className="c-button cus-btn v1"
                                                                                            onClick={() => arrayHelpers.remove(index)}
                                                                                        >
                                                                                            <span className="label">Delete</span>
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col-12 col-md-4">
                                                                                {educationLabels[index] === "10th" || educationLabels[index] === "12th" ? (
                                                                                    <FormMultiSelect
                                                                                        label="Select Board*"
                                                                                        name={`education_details.${index}.degree_name`}
                                                                                        options={BOARD_OPTIONS}
                                                                                        placeholder="Select Board"
                                                                                        error={getIn(errors, `education_details.${index}.degree_name`)}
                                                                                        touched={getIn(touched, `education_details.${index}.degree_name`)}
                                                                                        onChange={(selected) => {
                                                                                            if (selected?.value !== "Others" && selected?.value !== "Other") {
                                                                                                setFieldValue(`education_details.${index}.other_board_name`, "");
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                ) : (
                                                                                    <FormField
                                                                                        label="Degree Name*"
                                                                                        name={`education_details.${index}.degree_name`}
                                                                                        error={getIn(errors, `education_details.${index}.degree_name`)}
                                                                                        touched={getIn(touched, `education_details.${index}.degree_name`)}
                                                                                        autoComplete="off"
                                                                                        maxLength={100}
                                                                                        onChange={(e: any) => {
                                                                                            let val = e.target.value.replace(/[^a-zA-Z\s.'-]/g, "");
                                                                                            val = val.replace(/\s{2,}/g, " ");
                                                                                            setFieldValue(`education_details.${index}.degree_name`, val, true);
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                            {(educationLabels[index] === "10th" || educationLabels[index] === "12th") &&
                                                                                (values.education_details[index]?.degree_name === "Others" || values.education_details[index]?.degree_name === "Other") && (
                                                                                    <div className="col-12 col-md-4">
                                                                                        <FormField
                                                                                            label="Other Board Name*"
                                                                                            name={`education_details.${index}.other_board_name`}
                                                                                            error={getIn(errors, `education_details.${index}.other_board_name`)}
                                                                                            touched={getIn(touched, `education_details.${index}.other_board_name`)}
                                                                                            autoComplete="off"
                                                                                            maxLength={100}
                                                                                            onChange={(e: any) => {
                                                                                                let val = e.target.value.replace(/[^a-zA-Z\s.'()-]/g, "");
                                                                                                val = val.replace(/\s{2,}/g, " ");
                                                                                                setFieldValue(`education_details.${index}.other_board_name`, val, true);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            {educationLabels[index] !== "10th" && educationLabels[index] !== "12th" && (
                                                                                <>
                                                                                    <div className="col-12 col-md-4">
                                                                                        <FormField
                                                                                            label="Course Name*"
                                                                                            name={`education_details.${index}.course_name`}
                                                                                            error={getIn(errors, `education_details.${index}.course_name`)}
                                                                                            touched={getIn(touched, `education_details.${index}.course_name`)}
                                                                                            autoComplete="off"
                                                                                            maxLength={50}

                                                                                            onChange={(e: any) => {
                                                                                                let val = e.target.value.replace(/[^a-zA-Z\\s.'-]/g, "");
                                                                                                val = val.replace(/\s{2,}/g, " ");
                                                                                                setFieldValue(`education_details.${index}.course_name`, val, true);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-12 col-md-4">
                                                                                        <FormField
                                                                                            label="Institute Name*"
                                                                                            name={`education_details.${index}.institute_name`}
                                                                                            error={getIn(errors, `education_details.${index}.institute_name`)}
                                                                                            touched={getIn(touched, `education_details.${index}.institute_name`)}
                                                                                            autoComplete="off"
                                                                                            maxLength={50}

                                                                                            onChange={(e: any) => {
                                                                                                let val = e.target.value.replace(/[^a-zA-Z\\s.'&-]/g, "");
                                                                                                val = val.replace(/\s{2,}/g, " ");
                                                                                                setFieldValue(`education_details.${index}.institute_name`, val, true);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-12 col-md-4">
                                                                                        <FormField
                                                                                            label="University Name*"
                                                                                            name={`education_details.${index}.university_name`}
                                                                                            error={getIn(errors, `education_details.${index}.university_name`)}
                                                                                            touched={getIn(touched, `education_details.${index}.university_name`)}
                                                                                            autoComplete="off"
                                                                                            maxLength={50}

                                                                                            onChange={(e: any) => {
                                                                                                let val = e.target.value.replace(/[^a-zA-Z\\s.'&-]/g, "");
                                                                                                val = val.replace(/\s{2,}/g, " ");
                                                                                                setFieldValue(`education_details.${index}.university_name`, val, true);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                            <div className="col-12 col-md-4">
                                                                                <FormField
                                                                                    label="Passing Year*"
                                                                                    name={`education_details.${index}.passing_year`}
                                                                                    error={getIn(errors, `education_details.${index}.passing_year`)}
                                                                                    touched={getIn(touched, `education_details.${index}.passing_year`)}
                                                                                    autoComplete="off"
                                                                                    maxLength={4}
                                                                                    onChange={(e: any) => {
                                                                                        const val = e.target.value.replace(/\D/g, "");
                                                                                        setFieldValue(`education_details.${index}.passing_year`, val, true);
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <div className="col-12 col-md-4">
                                                                                <FormField
                                                                                    label="Percentage*"
                                                                                    name={`education_details.${index}.percentage`}
                                                                                    error={getIn(errors, `education_details.${index}.percentage`)}
                                                                                    touched={getIn(touched, `education_details.${index}.percentage`)}
                                                                                    autoComplete="off"
                                                                                    maxLength={6}
                                                                                    onChange={(e: any) => {
                                                                                        let val = e.target.value.replace(/[^0-9.]/g, "");
                                                                                        const parts = val.split(".");
                                                                                        if (parts.length > 2) {
                                                                                            val = parts[0] + "." + parts.slice(1).join("");
                                                                                        }
                                                                                        setFieldValue(`education_details.${index}.percentage`, val, true);
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {canAddMore && (
                                                                    <div className="d-flex">
                                                                        <button
                                                                            type="button"
                                                                            className="c-button cus-btn v1"
                                                                            onClick={() =>
                                                                                arrayHelpers.push({
                                                                                    degree_name: "",
                                                                                    course_name: "",
                                                                                    institute_name: "",
                                                                                    university_name: "",
                                                                                    passing_year: "",
                                                                                    percentage: "",
                                                                                })
                                                                            }
                                                                        >
                                                                            <span className="label">Add More</span>
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {typeof errors.education_details === 'string' && (
                                                                    <div className="col-12 mt-2">
                                                                        <p className="form_grider_wrap_helper hasError" style={{ color: "#ed4337", fontWeight: 600 }}>
                                                                            {errors.education_details}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    }}
                                                />
                                            </div>

                                            {/* ------ Employment Details ------ */}
                                            {showExpericeFields && (
                                                <>
                                                    <div className="c-divider">&nbsp;</div>
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <h3 className="cus_text30 text-orange withborder">
                                                                Employment Details
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <div className="row form_grider v1">
                                                        <FieldArray
                                                            name="experience_details"
                                                            render={(arrayHelpers) => {
                                                                const experience_details = values.experience_details;
                                                                return (
                                                                    <div>
                                                                        {experience_details.map((_exp, index) => (
                                                                            <div key={index}>
                                                                                {index > 0 && (
                                                                                    <div className="row">
                                                                                        <div className="col-12 d-flex justify-content-end">
                                                                                            <button
                                                                                                type="button"
                                                                                                className="cus_btn2 mb-4 mt-4 no_zIndex orange"
                                                                                                onClick={() => arrayHelpers.remove(index)}
                                                                                            >
                                                                                                <span>Delete</span>
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                                <div className="row">
                                                                                    <div className="col-12 col-md-4">
                                                                                        <FormField
                                                                                            label="Organization Name*"
                                                                                            name={`experience_details.${index}.organization_name`}
                                                                                            error={getIn(errors, `experience_details.${index}.organization_name`)}
                                                                                            touched={getIn(touched, `experience_details.${index}.organization_name`)}
                                                                                            autoComplete="off"
                                                                                            maxLength={50}

                                                                                            onChange={(e: any) => {
                                                                                                let val = e.target.value.replace(/[^A-Za-z0-9À-ÿ\s&'.,-]/gu, "");
                                                                                                val = val.replace(/\s{2,}/g, " ");
                                                                                                setFieldValue(`experience_details.${index}.organization_name`, val, true);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-12 col-md-4">
                                                                                        <FormField
                                                                                            label="Designation*"
                                                                                            name={`experience_details.${index}.designation`}
                                                                                            error={getIn(errors, `experience_details.${index}.designation`)}
                                                                                            touched={getIn(touched, `experience_details.${index}.designation`)}
                                                                                            autoComplete="off"
                                                                                            maxLength={30}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-12 col-md-4">
                                                                                        <FormDatePicker
                                                                                            label="Joining Date*"
                                                                                            name={`experience_details.${index}.joining_date`}
                                                                                            error={getIn(errors, `experience_details.${index}.joining_date`)}
                                                                                            touched={getIn(touched, `experience_details.${index}.joining_date`)}
                                                                                            placeholderText="Joining Date (DD/MM/YYYY)"
                                                                                            dateFormat="dd/MM/yyyy"
                                                                                            showMonthDropdown
                                                                                            showYearDropdown
                                                                                            maxDate={new Date()}
                                                                                            dropdownMode="select"
                                                                                            autoComplete="off"
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-12 col-md-4">
                                                                                        <FormField
                                                                                            label="Job Profile*"
                                                                                            name={`experience_details.${index}.job_profile`}
                                                                                            error={getIn(errors, `experience_details.${index}.job_profile`)}
                                                                                            touched={getIn(touched, `experience_details.${index}.job_profile`)}
                                                                                            autoComplete="off"
                                                                                            maxLength={150}

                                                                                            onChange={(e: any) => {
                                                                                                let val = e.target.value.replace(/[^a-zA-Z\\s.'-]/g, "");
                                                                                                val = val.replace(/\s{2,}/g, " ");
                                                                                                setFieldValue(`experience_details.${index}.job_profile`, val, true);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                    {index === 0 && (
                                                                                        <div className="col-12 col-md-4">
                                                                                            <FormMultiSelect
                                                                                                label="Currently Employed*"
                                                                                                name={`experience_details.${index}.is_current_employment`}
                                                                                                options={currentEmploymentOptions}
                                                                                                placeholder="Currently Employed"
                                                                                                error={getIn(errors, `experience_details.${index}.is_current_employment`)}
                                                                                                touched={getIn(touched, `experience_details.${index}.is_current_employment`)}
                                                                                                onChange={(selectedOption) => {
                                                                                                    if (selectedOption?.value === "1") {
                                                                                                        setFieldValue(`experience_details.${index}.relieving_date`, null);
                                                                                                        setFieldTouched(`experience_details.${index}.relieving_date`, false);
                                                                                                        setFieldError(`experience_details.${index}.relieving_date`, undefined);
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                    <div className="col-12 col-md-4">
                                                                                        {(() => {
                                                                                            const isCurrent = index === 0 && _exp.is_current_employment === "1";
                                                                                            return (
                                                                                                <FormDatePicker
                                                                                                    label={isCurrent ? "Relieving Date (N/A)" : "Relieving Date*"}
                                                                                                    name={`experience_details.${index}.relieving_date`}
                                                                                                    error={isCurrent ? undefined : getIn(errors, `experience_details.${index}.relieving_date`)}
                                                                                                    touched={isCurrent ? false : getIn(touched, `experience_details.${index}.relieving_date`)}
                                                                                                    placeholderText={isCurrent ? "Currently Employed (N/A)" : "Relieving Date* (DD/MM/YYYY)"}
                                                                                                    dateFormat="dd/MM/yyyy"
                                                                                                    minDate={_exp.joining_date ? new Date(_exp.joining_date) : undefined}
                                                                                                    maxDate={new Date()}
                                                                                                    disabled={isCurrent}
                                                                                                    showMonthDropdown
                                                                                                    showYearDropdown
                                                                                                    dropdownMode="select"
                                                                                                    autoComplete="off"
                                                                                                />
                                                                                            );
                                                                                        })()}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                        <div className="d-flex">
                                                                            {experience_details.length < 10 && (
                                                                                <button
                                                                                    type="button"
                                                                                    className="c-button cus-btn v1"
                                                                                    onClick={() =>
                                                                                        arrayHelpers.push({
                                                                                            organization_name: "",
                                                                                            designation: "",
                                                                                            joining_date: null,
                                                                                            job_profile: "",
                                                                                            relieving_date: null,
                                                                                            is_current_employment: "0",
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    <span className="label">Add More</span>
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                        {typeof errors.experience_details === 'string' && (
                                                                            <div className="col-12 mt-2">
                                                                                <p className="form_grider_wrap_helper hasError" style={{ color: "#ed4337", fontWeight: 600 }}>
                                                                                    {errors.experience_details}
                                                                                </p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            <div className="c-divider">&nbsp;</div>
                                            {/* ------ Contact & Address ------ */}
                                            <div className="row">
                                                <div className="col-12">
                                                    <h3 className="cus_text30 text-orange withborder">
                                                        Contact &amp; Address
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="row form_grider v1">
                                                <div
                                                    className={`col-12 ${isIndia ? selectedStateOther ? "col-md-4" : "col-md-6" : "col-md-6"}`}
                                                >
                                                    <FormMultiSelect
                                                        label="Select Country*"
                                                        name="country_name"
                                                        options={contextInfo.countryOptions || []}
                                                        placeholder="Select Country"
                                                        error={errors.country_name}
                                                        touched={touched.country_name}
                                                        onChange={handleCountryChange}
                                                    />
                                                </div>
                                                {isIndia ? (
                                                    <div
                                                        className={`col-12 ${selectedStateOther ? "col-md-4" : "col-md-6"}`}
                                                    >
                                                        <FormMultiSelect
                                                            label="Select State*"
                                                            name="state_name"
                                                            options={contextInfo.statesOptions || []}
                                                            placeholder="Select State"
                                                            error={errors.state_name}
                                                            touched={touched.state_name}
                                                            onChange={handleStateChange}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="col-12 col-md-6">
                                                        <FormField
                                                            label="State Name*"
                                                            name="state_name"
                                                            error={errors.state_name}
                                                            touched={touched.state_name}
                                                            autoComplete="off"
                                                            maxLength={50}

                                                            onChange={(e: any) => {
                                                                let val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                                                                val = val.replace(/\s{2,}/g, " ");
                                                                setFieldValue("state_name", val, true);
                                                                setFieldTouched("state_name", true, false);
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                {selectedStateOther && (
                                                    <div className="col-12 col-md-4">
                                                        <FormField
                                                            label="Other State Name*"
                                                            name="other_state_name"
                                                            error={errors.other_state_name}
                                                            touched={touched.other_state_name}
                                                            autoComplete="off"
                                                            maxLength={50}

                                                            onChange={(e: any) => {
                                                                let val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                                                                val = val.replace(/\s{2,}/g, " ");
                                                                setFieldValue("other_state_name", val, true);
                                                                setFieldTouched("other_state_name", true, false);
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="col-12 col-md-4">
                                                    <FormField
                                                        label="City Name*"
                                                        name="city_name"
                                                        error={errors.city_name}
                                                        touched={touched.city_name}
                                                        autoComplete="off"
                                                        maxLength={50}
                                                        onChange={(e: any) => {
                                                            let val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                                                            val = val.replace(/\s{2,}/g, " ");
                                                            setFieldValue("city_name", val, true);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-4">
                                                    <FormMultiSelect
                                                        label="Nationality*"
                                                        name="nationality"
                                                        options={contextInfo.nationalityOptions || []}
                                                        placeholder="Select Nationality"
                                                        error={errors.nationality}
                                                        touched={touched.nationality}
                                                        onChange={handleNationalityChange}
                                                    />
                                                </div>
                                                {(selectedNationalityOther || values.nationality === "Others" || values.nationality === "Other") && (
                                                    <div className="col-12 col-md-4">
                                                        <FormField
                                                            label="Other Nationality*"
                                                            name="other_nationality"
                                                            error={errors.other_nationality}
                                                            touched={touched.other_nationality}
                                                            autoComplete="off"
                                                            maxLength={50}
                                                            onChange={(e: any) => {
                                                                let val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                                                                val = val.replace(/\s{2,}/g, " ");
                                                                setFieldValue("other_nationality", val, true);
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="col-12 col-md-4">
                                                    <FormField
                                                        label={isIndia ? "Pincode*" : "Postal Code*"}
                                                        name="pincode"
                                                        error={errors.pincode}
                                                        touched={touched.pincode}
                                                        autoComplete="off"
                                                        maxLength={isIndia ? 6 : 10}
                                                        onChange={(e: any) => {
                                                            const val = isIndia ? e.target.value.replace(/\D/g, "") : e.target.value;
                                                            setFieldValue("pincode", val, true);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-4">
                                                    <FormField
                                                        label="Country Code*"
                                                        name="std_code"
                                                        error={errors.std_code}
                                                        touched={touched.std_code}
                                                        autoComplete="off"
                                                        maxLength={5}
                                                        placeholder="+91"
                                                        onChange={(e: any) => {
                                                            let val = e.target.value.trim();
                                                            if (val.startsWith("+")) {
                                                                val = "+" + val.slice(1).replace(/\D/g, "");
                                                            } else {
                                                                val = val.replace(/\D/g, "");
                                                            }
                                                            setFieldValue("std_code", val, true);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-4">
                                                    <FormField
                                                        label="Mobile Number*"
                                                        name="mobile_number"
                                                        error={errors.mobile_number}
                                                        touched={touched.mobile_number}
                                                        maxLength={isIndia ? 10 : 15}
                                                        autoComplete="off"
                                                        onChange={(e: any) => {
                                                            const val = e.target.value.replace(/\D/g, "");
                                                            setFieldValue("mobile_number", val, true);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-4">
                                                    <FormField
                                                        label="Alternate Mobile Number"
                                                        name="alternate_mobile_number"
                                                        error={errors.alternate_mobile_number}
                                                        touched={touched.alternate_mobile_number}
                                                        maxLength={isIndia ? 10 : 15}
                                                        autoComplete="off"
                                                        onChange={(e: any) => {
                                                            const val = e.target.value.replace(/\D/g, "");
                                                            setFieldValue("alternate_mobile_number", val, true);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <FormField
                                                        label="Address*"
                                                        name="address"
                                                        type="textarea"
                                                        error={errors.address}
                                                        touched={touched.address}
                                                        maxLength={150}
                                                    />
                                                </div>
                                            </div>

                                            {/* ------ Resume Upload ------ */}
                                            <div className="row form_grider v1">
                                                <div className="col-12">
                                                    {/* <p className="cus_text20 mb-2">
                                                        Upload Your Resume (Type: .doc, .docx, .pdf)
                                                    </p> */}
                                                    <div className="custom_file_upload_container">
                                                        {!values.resume_id && !values.resume_file && !fileName && !isUploading ? (
                                                            <div
                                                                tabIndex={0}
                                                                role="button"
                                                                aria-label="Upload Resume"
                                                                className={`custom_upload_area ${(touched.resume_id && errors.resume_id) || (touched.resume_file && errors.resume_file) ? "hasError" : ""}`}
                                                                onClick={() => {
                                                                    fileInputRef.current?.click();
                                                                }}
                                                                onBlur={() => {
                                                                    if (!values.resume_id && !values.resume_file && !fileName) {
                                                                        setFieldTouched("resume_id", true, true);
                                                                        setFieldTouched("resume_file", true, true);
                                                                    }
                                                                }}
                                                            >
                                                                <div className="upload_icon_box">
                                                                    <UploadCloud className="upload_icon" size={32} />
                                                                </div>
                                                                <div className="upload_text_content">
                                                                    <span className="upload_title">Click to upload your resume*</span>
                                                                    <span className="upload_subtitle">Formats: PDF, DOC, DOCX, RTF (Max 5MB)</span>
                                                                </div>
                                                                <input
                                                                    ref={fileInputRef}
                                                                    name="resume_id"
                                                                    type="file"
                                                                    accept=".pdf,.doc,.docx,.rtf"
                                                                    style={{ display: "none" }}
                                                                    onChange={(e) => handleFileChange(e)}
                                                                    onBlur={() => {
                                                                        if (!values.resume_id && !values.resume_file && !fileName) {
                                                                            setFieldTouched("resume_id", true, true);
                                                                            setFieldTouched("resume_file", true, true);
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="uploaded_file_card">
                                                                <div className="file_info">
                                                                    <div className="file_icon_box">
                                                                        {isUploading ? (
                                                                            <div className="upload_spinner"></div>
                                                                        ) : (
                                                                            <FileText className="file_icon" size={24} />
                                                                        )}
                                                                    </div>
                                                                    <div className="file_details">
                                                                        <span className="file_name">
                                                                            {isUploading ? "Uploading file..." : (fileName || (typeof values.resume_id === 'string' ? values.resume_id.split('/').pop() : "") || "Resume File")}
                                                                        </span>
                                                                        <span className={`file_status ${isUploading ? "uploading" : "success"}`}>
                                                                            {isUploading ? "Please wait..." : "Upload successful"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                {!isUploading && (
                                                                    <button
                                                                        type="button"
                                                                        className="remove_file_btn"
                                                                        onClick={handleRemoveFile}
                                                                        aria-label="Remove uploaded file"
                                                                    >
                                                                        <Trash2 className="remove_icon" size={20} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                        {touched.resume_file && errors.resume_file ? (
                                                            <p className="form_grider_wrap_helper">
                                                                {errors.resume_file}
                                                            </p>
                                                        ) : touched.resume_id && errors.resume_id && !values.resume_id && !values.resume_file && !fileName ? (
                                                            <p className="form_grider_wrap_helper">
                                                                {errors.resume_id}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ------ Captcha ------ */}
                                            <div className="row form_grider v1">
                                                <div className="col-12 col-md-6">
                                                    <div className="form_captcha_wrap">
                                                        <Captcha
                                                            key={captchaKey}
                                                            numberOfCharacters={6}
                                                            backgroundColor="#c2c2c2"
                                                            fontColor="#333"
                                                            onChange={setActualCaptcha}
                                                            setReloadCaptcha={setReloadCaptcha}
                                                        />
                                                        <FormField
                                                            label="Enter Captcha*"
                                                            name="user_captcha_input"
                                                            error={errors.user_captcha_input}
                                                            touched={touched.user_captcha_input}
                                                            maxLength={6}
                                                            autoComplete="off"
                                                            onChange={(e: any) => {
                                                                const val = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                                                                setFieldValue("user_captcha_input", val, true);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ------ Alert & Submit ------ */}
                                            {/* {submitMsg && (
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div
                                                            className="p-4 mb-4 mt-4 cus_text24 text-white rounded-lg bg-orange"
                                                            role="alert"
                                                        >
                                                            <span className="font-medium">
                                                                {alertMsg !== ""
                                                                    ? alertMsg
                                                                    : "Something went wrong, please try again later."}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )} */}

                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="button_wrap d-flex">
                                                        <button
                                                            type="submit"
                                                            className="c-button cus-btn v1"
                                                            disabled={isSubmitting || isUploading || contextInfo.isLoading}
                                                            style={{
                                                                opacity: isSubmitting || isUploading || contextInfo.isLoading ? 0.65 : 1,
                                                                cursor: isSubmitting || isUploading || contextInfo.isLoading ? "not-allowed" : "pointer",
                                                            }}
                                                        >
                                                            <span className="label">
                                                                {isUploading
                                                                    ? "UPLOADING RESUME..."
                                                                    : isSubmitting || contextInfo.isLoading
                                                                        ? "SUBMITTING APPLICATION..."
                                                                        : "SUBMIT APPLICATION"}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </div>

                        <JobApplicantModal {...applicantModalProps} />

                    </div>
                </div>
            </div>
        </div>

    );
};

export default JobForm;
