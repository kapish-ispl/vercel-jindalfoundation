import * as Yup from "yup";

// ─── HTML/Script Injection Guard ──────────────────────────────────────────────
export const hasHtmlOrScript = (value: string): boolean => {
  const htmlTagPattern = /<[a-z/][\s\S]*>/i;
  const eventHandlerPattern = /\bon\w+\s*=/i;
  const scriptSchemePattern = /\b(javascript|vbscript):/i;
  const cdataPattern = /<!\[CDATA\[/i;
  const cssExpressionPattern = /\bexpression\s*\(/i;

  return (
    htmlTagPattern.test(value) ||
    eventHandlerPattern.test(value) ||
    scriptSchemePattern.test(value) ||
    cdataPattern.test(value) ||
    cssExpressionPattern.test(value)
  );
};

export const safeString = (message?: string) => {
  return Yup.string().test(
    "no-html-script",
    message || "HTML tags, script injections, or event handlers are not allowed",
    (value) => {
      if (!value) return true;
      return !hasHtmlOrScript(value);
    }
  );
};

// ─── Shared Regular Expressions ──────────────────────────────────────────────
export const orgNameRegex = /^[A-Za-z0-9À-ÿ\s&'.,-]+$/u;

export const REGEX = {
  phone: /^[6-9]\d{9}$/,
  internationalPhone: /^[0-9]{7,15}$/,
  year: /^(194[5-9]|19[5-9]\d|20\d{2})$/,
  percentage: /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/,
  pincode: /^[1-9][0-9]{5}$/,
  postalCode: /^[a-zA-Z0-9\s-]{3,10}$/,
  gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  stdCode: /^\+?[1-9]\d{0,3}$/,
  name: /^[a-zA-Z\s.'-]+$/,
  orgName: orgNameRegex,
  hasLetters: /[a-zA-Z]/,
  hasAlphanumeric: /[a-zA-Z0-9]/,
};

// ─── Dummy Phone & Disposable Email Detectors ─────────────────────────────────
export const isSequentialOrDummyPhone = (phone?: string | null): boolean => {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, "");
  if (/^([0-9])\1+$/.test(digits)) return true;
  const sequentialPatterns = [
    "0123456789",
    "1234567890",
    "9876543210",
    "8765432109",
    "0987654321",
  ];
  return sequentialPatterns.some((pattern) => digits.includes(pattern));
};

const DISPOSABLE_EMAIL_DOMAINS = [
  "mailinator.com",
  "yopmail.com",
  "tempmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "trashmail.com",
  "sharklasers.com",
  "dispostable.com",
  "getairmail.com",
  "fakemailgenerator.com",
  "throwawaymail.com",
];

export const isDisposableEmail = (email?: string | null): boolean => {
  if (!email || !email.includes("@")) return false;
  const domain = email.split("@").pop()?.toLowerCase().trim();
  return domain ? DISPOSABLE_EMAIL_DOMAINS.includes(domain) : false;
};

// ─── Centralised Validation Error Messages ──────────────────────────────────
export const VALIDATION_ERRORS = {
  required: {
    fullName: "Enter your Full Name",
    name: "Enter your Name",
    email: "Enter your Email Id",
    mobile: "Enter valid Mobile Number",
    company: "Enter Company Name",
    description: "Enter your Description",
    country: "Enter Country Name",
    city: "Enter City Name",
    captcha: "Captcha is required",
    gst: "GST Number is required",
    firmName: "Name of the Firm is required",
    firmAddress: "Address of the Firm is required",
    pincode: "Pincode is required",
    postalCode: "Enter your Postal Code",
    contactPerson: "Contact person name is required",
    dob: "Enter your Date of Birth",
    gender: "Select your Gender",
    experience: "Select your Experience",
    address: "Enter your Address",
    resume: "Please upload your resume",
    joiningDate: "Enter your Joining Date",
    relievingDate: "Relieving Date is required",
    jobProfile: "Enter your Job Profile",
    designation: "Enter your Designation",
    degreeName: "Enter your Board/Degree Name",
    currentEmployment: "Select your current Employment",
    department: "Select Department",
    otherDepartment: "Enter Other Department",
    jobPosition: "Enter Job Position",
    specialty: "Enter Specialty",
    jobCode: "Enter Job Code",
    jobLocation: "Enter Job Location",
    nationality: "Select your Nationality",
    stateName: "Enter your State Name",
    otherStateName: "Enter your Other State Name",
    stdCode: "Enter your Country Code",
    passingYear: "Enter your Passing Year",
    percentage: "Enter your Percentage",
    noticePeriod: "Enter Notice Period",
    courseName: "Enter your Course Name",
    instituteName: "Enter your Institute Name",
    universityName: "Enter your University Name",
  },
  invalid: {
    email: "Invalid email format",
    mobile: "Enter valid Mobile Number",
    name: "Name can only contain alphabets and spaces",
    nameMin: "Name must be at least 2 characters",
    nameMax: "Name cannot exceed 50 characters",
    nameLetters: "Name must contain letters",
    nameConsecutiveSpaces: "Name cannot contain consecutive spaces",
    nameMinLetters: "Name must contain at least 2 letters",
    stateName: "State Name can only contain letters and spaces",
    cityName: "City Name can only contain letters and spaces",
    postalCode: "Enter valid Postal Code",
    postalCodeLength: "Postal Code must be between 3 and 10 characters",
    gst: "Invalid GST Number format",
    pincode: "Pincode must be exactly 6 digits",
    pincodeDigits: "Pincode must contain only digits",
    contactPersonNumbers: "Contact Person Name cannot contain numbers",
    passingYear: "Enter a valid Passing Year",
    passingAfterDob: "Passing year cannot be earlier than your school age",
    passingChronological: "Passing year cannot be earlier than previous qualification",
    percentage: "Enter a valid Percentage (e.g., 85.5)",
    percentageMin: "Percentage should be 30 or more",
    percentageMax: "Percentage cannot exceed 100",
    dobAge: "Applicant must be at least 18 years old",
    dobMinAge: "Applicant must be born after 1940",
    dobInvalid: "Enter a valid Date of Birth",
    joiningInvalid: "Enter a valid Joining Date",
    relievingInvalid: "Enter a valid Relieving Date",
    joiningAfterDob: "Joining Date must be after Date of Birth",
    joiningAge: "Applicant must be at least 15 years old at Joining Date",
    singleCurrentEmployment: "Only one organization can be marked as current employment",
    duplicateExperience: "Duplicate organization and joining date entries are not allowed",
    noticePeriodRange: "Notice Period must be between 0 and 180 days",
    expMin15: "Experience must be 15 years or more",
    expMax: "Experience cannot exceed 60 years",
    fileType: "Only PDF, DOC, DOCX, and RTF files are allowed",
    addressMin: "Address must be at least 10 characters",
    addressLetters: "Address must contain letters",
    addressWords: "Address must contain at least 2 words",
    emailDomain: "Enter a valid email with a proper domain extension (e.g. .com, .in)",
    relievingAfterJoining: "Relieving Date must be after Joining Date",
    relievingFuture: "Relieving Date cannot be in the future",
    joiningFuture: "Joining Date cannot be in the future",
    stdCode: "Enter valid Country Code (e.g. +91 or 91)",
    phoneRepetitive: "Mobile number cannot be repetitive digits",
    altPhoneSame: "Alternate Mobile cannot be the same as Primary Mobile",
    altEmailSame: "Alternate Email cannot be the same as Primary Email",
    orgName: "Enter a valid Organization Name",
    designationLetters: "Designation must contain letters",
    jobProfileLetters: "Job Profile must contain letters",
    degreeNameLetters: "Board/Degree Name must contain letters",
    gstLength: "GST Number must be exactly 15 characters",
    quantityNumber: "Quantity must be a number",
    quantityNegative: "Quantity cannot be negative",
    sequentialPhone: "Mobile number cannot be a repetitive or sequential dummy number",
    disposableEmail: "Disposable and temporary email addresses are not permitted",
    stdCodeIndia: "Country code for India must be +91 or 91",
    passingAge14: "Class 10 passing year cannot be earlier than age 14",
    passingYearGap: "Passing year must be after previous qualification (minimum 2-year gap for 12th/Graduation)",
    overlappingExperience: "Employment dates cannot overlap between different organizations",
    experienceMismatch: "Total duration in employment details cannot be less than selected Total Experience",
  }
};

// ─── Interfaces ─────────────────────────────────────────────────────────────
export interface IProductFormValues {
  fullname: string;
  email: string;
  country: string;
  company: string;
  mobile: string;
  city: string;
  description: string;
  product: string;
  user_captcha_input: string;
}

export interface IEducationDetail {
  degree_name: string;
  other_board_name?: string;
  course_name?: string;
  institute_name?: string;
  university_name?: string;
  passing_year: string;
  percentage: string;
}

export interface IExperienceDetail {
  organization_name: string;
  designation: string;
  joining_date: Date | null;
  relieving_date: Date | null;
  job_profile: string;
  is_current_employment: string;
}

export interface IJobApplicationValues {
  post_id?: string | number;
  current_openings: string;
  job_code: string;
  job_location: string;
  name: string;
  dob: Date | null;
  email: string;
  alternate_email?: string;
  gender: string;
  total_experience: string;
  other_experience?: string;
  notice_period?: string;
  nationality: string;
  country_name: string;
  state_name: string;
  other_state_name?: string;
  pincode: string;
  std_code: string;
  mobile_number: string;
  alternate_mobile_number?: string;
  address: string;
  city_name: string;
  key_skills?: string | string[];
  resume_id: string;
  resume_file?: any;
  user_captcha_input: string;
  education_details: IEducationDetail[];
  experience_details: IExperienceDetail[];
  isTalentForm?: boolean;
  skils?: string;
  department?: string;
  other_department?: string;
}

// ─── Validation Schemas ─────────────────────────────────────────────────────

/**
 * ProductForm Schema (Contact / Query / Product Enquiry Form)
 */
export const ProductFormSchema: Yup.ObjectSchema<any> = Yup.object({
  fullname: safeString().required(VALIDATION_ERRORS.required.fullName),
  email: safeString().email(VALIDATION_ERRORS.invalid.email).required(VALIDATION_ERRORS.required.email),
  mobile: safeString()
    .matches(REGEX.phone, VALIDATION_ERRORS.invalid.mobile)
    .required(VALIDATION_ERRORS.required.mobile),
  company: safeString().required(VALIDATION_ERRORS.required.company),
  description: safeString().required(VALIDATION_ERRORS.required.description),
  country: safeString().required(VALIDATION_ERRORS.required.country),
  city: safeString().required(VALIDATION_ERRORS.required.city),
  user_captcha_input: safeString().required(VALIDATION_ERRORS.required.captcha),
});

/**
 * JobApplication Schema (Career / Talent Form)
 */
export const JobApplicationSchema: Yup.ObjectSchema<any> = Yup.object({
  current_openings: safeString().when("isTalentForm", {
    is: (isTalentForm: any) => isTalentForm == true,
    then: () => safeString().notRequired(),
    otherwise: () => safeString().required(VALIDATION_ERRORS.required.jobPosition).trim(),
  }),
  skils: safeString().when("isTalentForm", {
    is: (isTalentForm: any) => isTalentForm == true,
    then: () =>
      safeString()
        .trim()
        .min(2, "Specialty must be at least 2 characters")
        .max(100, "Specialty cannot exceed 100 characters")
        .matches(REGEX.hasLetters, "Specialty must contain letters")
        .test("no-consecutive-spaces", "Specialty cannot contain consecutive spaces", (val) => !val || !/\s{2,}/.test(val))
        .required(VALIDATION_ERRORS.required.specialty),
    otherwise: () => safeString().notRequired(),
  }),
  department: safeString().when("isTalentForm", {
    is: (isTalentForm: any) => isTalentForm == true,
    then: () => safeString().required(VALIDATION_ERRORS.required.department),
    otherwise: () => safeString().notRequired(),
  }),
  other_department: safeString().when("department", {
    is: (department: any) => department == "Others",
    then: () =>
      safeString()
        .trim()
        .min(2, "Other Department must be at least 2 characters")
        .max(50, "Other Department cannot exceed 50 characters")
        .matches(REGEX.hasLetters, "Other Department must contain letters")
        .required(VALIDATION_ERRORS.required.otherDepartment),
    otherwise: () => safeString().notRequired(),
  }),
  job_code: safeString().when("isTalentForm", {
    is: (isTalentForm: any) => isTalentForm == true,
    then: () => safeString().notRequired(),
    otherwise: () => safeString().required(VALIDATION_ERRORS.required.jobCode).trim(),
  }),
  job_location: safeString().when("isTalentForm", {
    is: (isTalentForm: any) => isTalentForm == true,
    then: () => safeString().notRequired(),
    otherwise: () => safeString().required(VALIDATION_ERRORS.required.jobLocation).trim(),
  }),
  name: safeString()
    .trim()
    .matches(REGEX.name, VALIDATION_ERRORS.invalid.name)
    .matches(REGEX.hasLetters, VALIDATION_ERRORS.invalid.nameLetters)
    .test("no-consecutive-spaces", VALIDATION_ERRORS.invalid.nameConsecutiveSpaces, (val) => !val || !/\s{2,}/.test(val))
    .test("min-letters", VALIDATION_ERRORS.invalid.nameMinLetters, (val) => !val || (val.match(/[a-zA-Z]/g) || []).length >= 2)
    .min(2, VALIDATION_ERRORS.invalid.nameMin)
    .max(50, VALIDATION_ERRORS.invalid.nameMax)
    .required(VALIDATION_ERRORS.required.name),
  dob: Yup.date()
    .typeError(VALIDATION_ERRORS.invalid.dobInvalid)
    .nullable()
    .test("min-age-range", VALIDATION_ERRORS.invalid.dobMinAge, (value) => {
      if (!value) return false;
      const d = new Date(value);
      return !isNaN(d.getTime()) && d.getFullYear() >= 1940;
    })
    .test("is-18-or-older", VALIDATION_ERRORS.invalid.dobAge, (value) => {
      if (!value) return false;
      const d = new Date(value);
      if (isNaN(d.getTime())) return false;
      const cutoff = new Date();
      cutoff.setHours(23, 59, 59, 999);
      cutoff.setFullYear(cutoff.getFullYear() - 18);
      return d <= cutoff;
    })
    .required(VALIDATION_ERRORS.required.dob),
  email: safeString()
    .trim()
    .email(VALIDATION_ERRORS.invalid.email)
    .test("valid-tld", VALIDATION_ERRORS.invalid.emailDomain, (val) => !val || /\.[a-zA-Z]{2,}$/.test(val))
    .test("no-disposable", VALIDATION_ERRORS.invalid.disposableEmail, (val) => !val || !isDisposableEmail(val))
    .max(50, "Email cannot exceed 50 characters")
    .required(VALIDATION_ERRORS.required.email),
  alternate_email: safeString()
    .trim()
    .max(50, "Alternate Email cannot exceed 50 characters")
    .email(VALIDATION_ERRORS.invalid.email)
    .test("valid-tld", VALIDATION_ERRORS.invalid.emailDomain, (val) => !val || /\.[a-zA-Z]{2,}$/.test(val))
    .test("no-disposable", VALIDATION_ERRORS.invalid.disposableEmail, (val) => !val || !isDisposableEmail(val))
    .test(
      "different-email",
      VALIDATION_ERRORS.invalid.altEmailSame,
      function (value) {
        if (!value) return true;
        const { email } = this.parent;
        if (!email) return true;
        return value.trim().toLowerCase() !== email.trim().toLowerCase();
      }
    )
    .nullable(),
  gender: safeString().required(VALIDATION_ERRORS.required.gender).trim(),
  total_experience: safeString().required(VALIDATION_ERRORS.required.experience).trim(),
  other_experience: safeString().when("total_experience", {
    is: (total_experience: any) => total_experience == "15",
    then: () =>
      safeString()
        .trim()
        .matches(/^\d{1,2}$/, "Enter valid Experience in years")
        .test("min-15-exp", VALIDATION_ERRORS.invalid.expMin15, (val) => {
          if (!val) return false;
          return Number(val) >= 15;
        })
        .test("max-60-exp", VALIDATION_ERRORS.invalid.expMax, (val) => {
          if (!val) return false;
          return Number(val) <= 60;
        })
        .required(VALIDATION_ERRORS.required.experience),
    otherwise: () => safeString().notRequired(),
  }),
  notice_period: safeString().when("total_experience", {
    is: (total_experience: any) => total_experience && total_experience !== "0",
    then: () =>
      safeString()
        .trim()
        .required(VALIDATION_ERRORS.required.noticePeriod)
        .matches(/^\d+$/, "Notice Period must contain only digits")
        .test("range-notice-period", VALIDATION_ERRORS.invalid.noticePeriodRange, (val) => {
          if (val === undefined || val === null || val === "") return true;
          const num = Number(val);
          return !isNaN(num) && num >= 0 && num <= 180;
        }),
    otherwise: () => safeString().notRequired(),
  }),
  nationality: safeString().required(VALIDATION_ERRORS.required.nationality).trim(),
  other_nationality: safeString()
    .trim()
    .when("nationality", {
      is: (val: any) => val === "Others" || val === "Other",
      then: (schema) =>
        schema
          .min(2, "Other Nationality must be at least 2 characters")
          .max(50, "Other Nationality cannot exceed 50 characters")
          .matches(REGEX.name, "Other Nationality can only contain letters and spaces")
          .matches(REGEX.hasLetters, "Other Nationality must contain letters")
          .required("Please enter your Nationality"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
  country_name: safeString().required(VALIDATION_ERRORS.required.country).trim(),
  state_name: safeString()
    .trim()
    .min(3, "State Name must be at least 3 characters")
    .max(50, "State Name cannot exceed 50 characters")
    .matches(/^[a-zA-Z\s.'&_-]+$/, VALIDATION_ERRORS.invalid.stateName)
    .matches(REGEX.hasLetters, VALIDATION_ERRORS.invalid.stateName)
    .test("min-letters", "State Name must contain at least 3 letters", (val) => !val || (val.match(/[a-zA-Z]/g) || []).length >= 3)
    .test("no-consecutive-spaces", "State Name cannot contain consecutive spaces", (val) => !val || !/\s{2,}/.test(val))
    .test("no-repetitive", "Enter a valid State Name", (val) => !val || !/^([a-zA-Z])\1{2,}$/.test(val.replace(/\s/g, "")))
    .required(VALIDATION_ERRORS.required.stateName),
  other_state_name: safeString().when("state_name", {
    is: (state_name: any) => state_name == "Others",
    then: () =>
      safeString()
        .trim()
        .min(3, "Other State Name must be at least 3 characters")
        .max(50, "Other State Name cannot exceed 50 characters")
        .matches(/^[a-zA-Z\s.'&_-]+$/, VALIDATION_ERRORS.invalid.stateName)
        .matches(REGEX.hasLetters, VALIDATION_ERRORS.invalid.stateName)
        .test("min-letters", "Other State Name must contain at least 3 letters", (val) => !val || (val.match(/[a-zA-Z]/g) || []).length >= 3)
        .test("no-consecutive-spaces", "Other State Name cannot contain consecutive spaces", (val) => !val || !/\s{2,}/.test(val))
        .test("no-repetitive", "Enter a valid State Name", (val) => !val || !/^([a-zA-Z])\1{2,}$/.test(val.replace(/\s/g, "")))
        .required(VALIDATION_ERRORS.required.otherStateName),
    otherwise: () => safeString().notRequired(),
  }),
  city_name: safeString()
    .trim()
    .min(3, "City Name must be at least 3 characters")
    .max(50, "City Name cannot exceed 50 characters")
    .matches(REGEX.name, VALIDATION_ERRORS.invalid.cityName)
    .matches(REGEX.hasLetters, VALIDATION_ERRORS.invalid.cityName)
    .test("min-letters", "City Name must contain at least 3 letters", (val) => !val || (val.match(/[a-zA-Z]/g) || []).length >= 3)
    .test("no-consecutive-spaces", "City Name cannot contain consecutive spaces", (val) => !val || !/\s{2,}/.test(val))
    .test("no-repetitive", "Enter a valid City Name", (val) => !val || !/^([a-zA-Z])\1{2,}$/.test(val.replace(/\s/g, "")))
    .required(VALIDATION_ERRORS.required.city),
  pincode: safeString()
    .trim()
    .when("country_name", {
      is: (val: any) => !val || val === "India",
      then: (schema) =>
        schema
          .matches(REGEX.pincode, VALIDATION_ERRORS.invalid.pincode)
          .required(VALIDATION_ERRORS.required.pincode),
      otherwise: (schema) =>
        schema
          .min(3, VALIDATION_ERRORS.invalid.postalCodeLength)
          .max(10, VALIDATION_ERRORS.invalid.postalCodeLength)
          .matches(REGEX.postalCode, VALIDATION_ERRORS.invalid.postalCode)
          .matches(REGEX.hasAlphanumeric, VALIDATION_ERRORS.invalid.postalCode)
          .required(VALIDATION_ERRORS.required.postalCode),
    }),
  std_code: safeString()
    .trim()
    .when("country_name", {
      is: (val: any) => !val || val === "India",
      then: (schema) =>
        schema
          .matches(/^(\+?91|91)$/, VALIDATION_ERRORS.invalid.stdCodeIndia)
          .required(VALIDATION_ERRORS.required.stdCode),
      otherwise: (schema) =>
        schema
          .matches(REGEX.stdCode, VALIDATION_ERRORS.invalid.stdCode)
          .required(VALIDATION_ERRORS.required.stdCode),
    }),
  mobile_number: safeString()
    .trim()
    .when("country_name", {
      is: (val: any) => !val || val === "India",
      then: (schema) =>
        schema
          .matches(REGEX.phone, VALIDATION_ERRORS.invalid.mobile)
          .test(
            "not-all-same",
            VALIDATION_ERRORS.invalid.phoneRepetitive,
            (val) => !val || !/^([0-9])\1{9}$/.test(val)
          )
          .test(
            "not-sequential",
            VALIDATION_ERRORS.invalid.sequentialPhone,
            (val) => !val || !isSequentialOrDummyPhone(val)
          )
          .required(VALIDATION_ERRORS.required.mobile),
      otherwise: (schema) =>
        schema
          .matches(REGEX.internationalPhone, "Enter valid Mobile Number (7-15 digits)")
          .test(
            "not-all-same",
            VALIDATION_ERRORS.invalid.phoneRepetitive,
            (val) => !val || !/^([0-9])\1{6,}$/.test(val)
          )
          .test(
            "not-sequential",
            VALIDATION_ERRORS.invalid.sequentialPhone,
            (val) => !val || !isSequentialOrDummyPhone(val)
          )
          .required(VALIDATION_ERRORS.required.mobile),
    }),
  alternate_mobile_number: safeString()
    .trim()
    .when("country_name", {
      is: (val: any) => !val || val === "India",
      then: (schema) =>
        schema.matches(REGEX.phone, {
          message: VALIDATION_ERRORS.invalid.mobile,
          excludeEmptyString: true,
        }),
      otherwise: (schema) =>
        schema.matches(REGEX.internationalPhone, {
          message: "Enter valid Mobile Number (7-15 digits)",
          excludeEmptyString: true,
        }),
    })
    .test(
      "different-mobile",
      VALIDATION_ERRORS.invalid.altPhoneSame,
      function (val) {
        if (!val) return true;
        const { mobile_number } = this.parent;
        if (!mobile_number) return true;
        return val.trim() !== mobile_number.trim();
      }
    )
    .test(
      "not-all-same-alt",
      VALIDATION_ERRORS.invalid.phoneRepetitive,
      (val) => !val || !/^([0-9])\1{6,}$/.test(val)
    )
    .test(
      "not-sequential-alt",
      VALIDATION_ERRORS.invalid.sequentialPhone,
      (val) => !val || !isSequentialOrDummyPhone(val)
    )
    .nullable(),
  address: safeString()
    .trim()
    .min(10, VALIDATION_ERRORS.invalid.addressMin)
    .max(150, "Address cannot exceed 150 characters")
    .matches(REGEX.hasLetters, VALIDATION_ERRORS.invalid.addressLetters)
    .test("min-words", VALIDATION_ERRORS.invalid.addressWords, (val) => !val || val.trim().split(/\s+/).length >= 2)
    .required(VALIDATION_ERRORS.required.address),
  resume_id: safeString()
    .test(
      "resume-required",
      VALIDATION_ERRORS.required.resume,
      function (val) {
        const { resume_file } = this.parent;
        return Boolean((val && val.trim()) || resume_file);
      }
    ),
  resume_file: Yup.mixed()
    .nullable()
    .test("fileSize", "File size must be less than 5MB", (value: any) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024;
    })
    .test("fileType", VALIDATION_ERRORS.invalid.fileType, (value: any) => {
      if (!value || !value.name) return true;
      const allowedExts = [".pdf", ".doc", ".docx", ".rtf"];
      const ext = value.name.substring(value.name.lastIndexOf(".")).toLowerCase();
      return allowedExts.includes(ext);
    }),
  user_captcha_input: safeString().required(VALIDATION_ERRORS.required.captcha).trim(),
  education_details: Yup.array()
    .of(
      Yup.object({
        degree_name: safeString()
          .trim()
          .min(3, "Board/Degree Name must be at least 3 characters")
          .max(150, "Board/Degree Name cannot exceed 150 characters")
          .matches(REGEX.hasLetters, VALIDATION_ERRORS.invalid.degreeNameLetters)
          .test("no-numbers-higher-ed", "Degree Name cannot contain numbers", function (val) {
            const match = this.path.match(/\[(\d+)\]/);
            const idx = match ? parseInt(match[1], 10) : 0;
            if (idx >= 2 && val) {
              return !/\d/.test(val);
            }
            return true;
          })
          .test("valid-degree-name", "Degree Name can only contain letters and spaces", function (val) {
            const match = this.path.match(/\[(\d+)\]/);
            const idx = match ? parseInt(match[1], 10) : 0;
            if (idx >= 2 && val) {
              return /^[a-zA-Z\s.'-]+$/.test(val);
            }
            return true;
          })
          .test("min-letters-degree", "Degree Name must contain at least 2 letters", function (val) {
            const match = this.path.match(/\[(\d+)\]/);
            const idx = match ? parseInt(match[1], 10) : 0;
            if (idx >= 2 && val) {
              return (val.match(/[a-zA-Z]/g) || []).length >= 2;
            }
            return true;
          })
          .test("no-consecutive-spaces-degree", "Degree Name cannot contain consecutive spaces", (val) => !val || !/\s{2,}/.test(val))
          .required(VALIDATION_ERRORS.required.degreeName),
        other_board_name: safeString()
          .trim()
          .test("req-for-other-board", "Please enter your Board Name", function (val) {
            const { degree_name } = this.parent;
            const match = this.path.match(/\[(\d+)\]/);
            const idx = match ? parseInt(match[1], 10) : 0;
            if (idx <= 1 && (degree_name === "Others" || degree_name === "Other")) {
              if (!val || !val.trim()) {
                return this.createError({ message: "Please enter your Board Name" });
              }
              if (val.trim().length < 3) {
                return this.createError({ message: "Board Name must be at least 3 characters" });
              }
              if (val.trim().length > 100) {
                return this.createError({ message: "Board Name cannot exceed 100 characters" });
              }
              if (!REGEX.name.test(val)) {
                return this.createError({ message: "Board Name can only contain letters and spaces" });
              }
              if (!REGEX.hasLetters.test(val) || (val.match(/[a-zA-Z]/g) || []).length < 2) {
                return this.createError({ message: "Board Name must contain at least 2 letters" });
              }
              if (/\s{2,}/.test(val)) {
                return this.createError({ message: "Board Name cannot contain consecutive spaces" });
              }
            }
            return true;
          }),
        course_name: safeString()
          .trim()
          .max(50, "Course Name cannot exceed 50 characters")
          .test("req-for-higher-ed", VALIDATION_ERRORS.required.courseName, function (val) {
            const match = this.path.match(/\[(\d+)\]/);
            const idx = match ? parseInt(match[1], 10) : 0;
            if (idx >= 2) {
              return !!val && val.trim().length >= 2;
            }
            return true;
          })
          .test("has-letters", "Course Name must contain letters", (val) => !val || REGEX.hasLetters.test(val))
          .test("no-numbers", "Course Name cannot contain numbers", (val) => !val || !/\d/.test(val))
          .test("valid-chars", "Course Name can only contain letters and spaces", (val) => !val || /^[a-zA-Z\s.'-]+$/.test(val))
          .test("min-letters", "Course Name must contain at least 2 letters", (val) => !val || (val.match(/[a-zA-Z]/g) || []).length >= 2)
          .test("no-consecutive-spaces", "Course Name cannot contain consecutive spaces", (val) => !val || !/\s{2,}/.test(val)),
        institute_name: safeString()
          .trim()
          .max(50, "Institute Name cannot exceed 50 characters")
          .test("req-for-higher-ed", VALIDATION_ERRORS.required.instituteName, function (val) {
            const match = this.path.match(/\[(\d+)\]/);
            const idx = match ? parseInt(match[1], 10) : 0;
            if (idx >= 2) {
              return !!val && val.trim().length >= 2;
            }
            return true;
          })
          .test("has-letters", "Institute Name must contain letters", (val) => !val || REGEX.hasLetters.test(val))
          .test("no-numbers", "Institute Name cannot contain numbers", (val) => !val || !/\d/.test(val))
          .test("valid-chars", "Institute Name can only contain letters and spaces", (val) => !val || /^[a-zA-Z\s.'&-]+$/.test(val))
          .test("min-letters", "Institute Name must contain at least 2 letters", (val) => !val || (val.match(/[a-zA-Z]/g) || []).length >= 2)
          .test("no-consecutive-spaces", "Institute Name cannot contain consecutive spaces", (val) => !val || !/\s{2,}/.test(val)),
        university_name: safeString()
          .trim()
          .max(50, "University Name cannot exceed 50 characters")
          .test("req-for-higher-ed", VALIDATION_ERRORS.required.universityName, function (val) {
            const match = this.path.match(/\[(\d+)\]/);
            const idx = match ? parseInt(match[1], 10) : 0;
            if (idx >= 2) {
              return !!val && val.trim().length >= 2;
            }
            return true;
          })
          .test("has-letters", "University Name must contain letters", (val) => !val || REGEX.hasLetters.test(val))
          .test("no-numbers", "University Name cannot contain numbers", (val) => !val || !/\d/.test(val))
          .test("valid-chars", "University Name can only contain letters and spaces", (val) => !val || /^[a-zA-Z\s.'&-]+$/.test(val))
          .test("min-letters", "University Name must contain at least 2 letters", (val) => !val || (val.match(/[a-zA-Z]/g) || []).length >= 2)
          .test("no-consecutive-spaces", "University Name cannot contain consecutive spaces", (val) => !val || !/\s{2,}/.test(val)),
        passing_year: safeString()
          .trim()
          .required(VALIDATION_ERRORS.required.passingYear)
          .test("valid-year", VALIDATION_ERRORS.invalid.passingYear, (val) => {
            if (!val) return false;
            const num = Number(val);
            const currentYear = new Date().getFullYear();
            return !isNaN(num) && num >= 1950 && num <= currentYear + 1;
          })
          .test("passing-after-dob", VALIDATION_ERRORS.invalid.passingAge14, function (val) {
            if (!val) return true;
            const dobVal = this.from?.[1]?.value?.dob;
            if (!dobVal) return true;
            const dob = new Date(dobVal);
            if (isNaN(dob.getTime())) return true;
            return Number(val) >= dob.getFullYear() + 14;
          })
          .test("chronological-order", function (val) {
            if (!val) return true;
            const match = this.path.match(/\[(\d+)\]/);
            const idx = match ? parseInt(match[1], 10) : 0;
            if (idx > 0) {
              const eduList = this.from?.[1]?.value?.education_details;
              const prevEdu = eduList?.[idx - 1];
              if (prevEdu?.passing_year) {
                const prevYear = Number(prevEdu.passing_year);
                const currentYear = Number(val);
                const minGap = idx <= 2 ? 2 : 1;
                if (!isNaN(prevYear) && !isNaN(currentYear) && prevYear > 0) {
                  if (currentYear < prevYear + minGap) {
                    return this.createError({
                      message:
                        idx === 1
                          ? "12th passing year must be at least 2 years after 10th"
                          : idx === 2
                          ? "Graduation passing year must be at least 2 years after 12th"
                          : "Passing year must be after previous qualification",
                    });
                  }
                }
              }
            }
            return true;
          }),
        percentage: safeString()
          .trim()
          .required(VALIDATION_ERRORS.required.percentage)
          .matches(/^\d+(\.\d{1,2})?$/, VALIDATION_ERRORS.invalid.percentage)
          .test("min-percentage", VALIDATION_ERRORS.invalid.percentageMin, (val) => {
            if (!val) return true;
            const num = parseFloat(val);
            return !isNaN(num) && num >= 30;
          })
          .test("max-percentage", VALIDATION_ERRORS.invalid.percentageMax, (val) => {
            if (!val) return true;
            const num = parseFloat(val);
            return !isNaN(num) && num <= 100;
          }),
      })
    )
    .required("Education details are required")
    .min(1, "At least one education detail is required")
    .max(10, "Cannot add more than 10 education details"),
  experience_details: Yup.lazy((value, { parent }) => {
    if (parent?.total_experience === "0") {
      return Yup.array().notRequired();
    }
    const applicantDob = parent?.dob ? new Date(parent.dob) : null;

    return Yup.array()
      .of(
        Yup.object({
          organization_name: safeString()
            .trim()
            .min(3, "Organization Name must be at least 3 characters")
            .max(50, "Organization Name cannot exceed 50 characters")
            .matches(orgNameRegex, "Organization Name cannot contain special characters")
            .matches(/[a-zA-ZÀ-ÿ]/, "Organization Name must contain letters")
            .test("min-letters", "Organization Name must contain at least 2 letters", (val) => !val || (val.match(/[a-zA-ZÀ-ÿ]/gu) || []).length >= 2)
            .test("no-consecutive-spaces", "Organization Name cannot contain consecutive spaces", (val) => !val || !/\s{2,}/.test(val))
            .required(VALIDATION_ERRORS.required.firmName),
          designation: safeString()
            .trim()
            .min(2, "Designation must be at least 2 characters")
            .max(50, "Designation cannot exceed 50 characters")
            .matches(REGEX.name, "Designation can only contain letters and spaces")
            .matches(REGEX.hasLetters, VALIDATION_ERRORS.invalid.designationLetters)
            .test("no-numbers", "Designation cannot contain numbers", (val) => !val || !/\d/.test(val))
            .test("min-letters", "Designation must contain at least 2 letters", (val) => !val || (val.match(/[a-zA-Z]/g) || []).length >= 2)
            .test("no-consecutive-spaces", "Designation cannot contain consecutive spaces", (val) => !val || !/\s{2,}/.test(val))
            .required(VALIDATION_ERRORS.required.designation),
          joining_date: Yup.date()
            .typeError(VALIDATION_ERRORS.invalid.joiningInvalid)
            .nullable()
            .max(new Date(), VALIDATION_ERRORS.invalid.joiningFuture)
            .test(
              "after-dob",
              VALIDATION_ERRORS.invalid.joiningAge,
              function (val) {
                if (!val) return true;
                const dobVal = applicantDob || (this.from?.[1]?.value?.dob ? new Date(this.from[1].value.dob) : null);
                if (!dobVal || isNaN(dobVal.getTime())) return true;
                const minJoiningDate = new Date(dobVal.getFullYear() + 15, dobVal.getMonth(), dobVal.getDate());
                return new Date(val) >= minJoiningDate;
              }
            )
            .required(VALIDATION_ERRORS.required.joiningDate),
          is_current_employment: safeString()
            .trim()
            .test("req-first-emp", VALIDATION_ERRORS.required.currentEmployment, function (val) {
              const match = this.path.match(/\[(\d+)\]/);
              const idx = match ? parseInt(match[1], 10) : 0;
              if (idx === 0) {
                return Boolean(val && val.trim());
              }
              return true;
            }),
          relieving_date: Yup.date()
            .typeError(VALIDATION_ERRORS.invalid.relievingInvalid)
            .nullable()
            .when("is_current_employment", {
              is: (val: any) => val === "0" || val === undefined || val === null || val === "",
              then: (schema) =>
                schema
                  .required(VALIDATION_ERRORS.required.relievingDate)
                  .max(new Date(), VALIDATION_ERRORS.invalid.relievingFuture)
                  .test(
                    "is-greater",
                    VALIDATION_ERRORS.invalid.relievingAfterJoining,
                    function (val) {
                      const { joining_date } = this.parent as any;
                      if (!val || !joining_date) return true;
                      return new Date(val) >= new Date(joining_date);
                    }
                  ),
              otherwise: (schema) => schema.nullable().notRequired(),
            }),
          job_profile: safeString()
            .trim()
            .min(2, "Job Profile must be at least 2 characters")
            .max(150, "Job Profile cannot exceed 150 characters")
            .matches(REGEX.name, "Job Profile can only contain letters and spaces")
            .matches(REGEX.hasLetters, VALIDATION_ERRORS.invalid.jobProfileLetters)
            .test("no-numbers", "Job Profile cannot contain numbers", (val) => !val || !/\d/.test(val))
            .test("min-letters", "Job Profile must contain at least 2 letters", (val) => !val || (val.match(/[a-zA-Z]/g) || []).length >= 2)
            .test("no-consecutive-spaces", "Job Profile cannot contain consecutive spaces", (val) => !val || !/\s{2,}/.test(val))
            .required(VALIDATION_ERRORS.required.jobProfile),
        })
      )
      .required("Experience details are required")
      .min(1, "At least one employment detail is required")
      .max(10, "Cannot add more than 10 employment records")
      .test(
        "single-current-employment",
        VALIDATION_ERRORS.invalid.singleCurrentEmployment,
        (experiences) => {
          if (!experiences || !Array.isArray(experiences)) return true;
          const currentCount = experiences.filter(
            (exp: any) => exp && exp.is_current_employment === "1"
          ).length;
          return currentCount <= 1;
        }
      )
      .test(
        "no-duplicate-experiences",
        VALIDATION_ERRORS.invalid.duplicateExperience,
        (experiences) => {
          if (!experiences || !Array.isArray(experiences)) return true;
          const seen = new Set();
          for (const exp of experiences) {
            if (exp?.organization_name && exp?.joining_date) {
              const key = `${exp.organization_name.trim().toLowerCase()}_${new Date(exp.joining_date).toISOString().slice(0, 10)}`;
              if (seen.has(key)) return false;
              seen.add(key);
            }
          }
          return true;
        }
      )
      .test(
        "no-overlapping-experiences",
        VALIDATION_ERRORS.invalid.overlappingExperience,
        (experiences) => {
          if (!experiences || !Array.isArray(experiences) || experiences.length <= 1) return true;
          const validExps = experiences
            .filter((e: any) => e && e.joining_date)
            .map((e: any) => {
              const join = new Date(e.joining_date).getTime();
              const relieve = e.relieving_date
                ? new Date(e.relieving_date).getTime()
                : e.is_current_employment === "1"
                ? Date.now()
                : null;
              return { join, relieve };
            })
            .filter((e: any) => !isNaN(e.join));

          for (let i = 0; i < validExps.length; i++) {
            for (let j = i + 1; j < validExps.length; j++) {
              const a = validExps[i];
              const b = validExps[j];
              if (a.relieve && b.relieve) {
                if (a.join < b.relieve && a.relieve > b.join) {
                  return false;
                }
              }
            }
          }
          return true;
        }
      )
      .test(
        "experience-duration-matches-total",
        function (experiences) {
          if (!experiences || !Array.isArray(experiences) || experiences.length === 0) return true;
          const parent = this.parent || (this.from?.[1]?.value);
          const totalExpVal = parent?.total_experience;
          if (!totalExpVal || totalExpVal === "0") return true;

          let claimedYears = 0;
          if (totalExpVal === "15") {
            claimedYears = Number(parent?.other_experience) || 15;
          } else {
            claimedYears = Number(totalExpVal);
          }
          if (isNaN(claimedYears) || claimedYears <= 0) return true;

          // Check if at least one employment entry has joining_date filled
          const hasAnyDate = experiences.some((exp: any) => exp && exp.joining_date);
          if (!hasAnyDate) return true;

          let totalDays = 0;
          const today = new Date();

          for (const exp of experiences) {
            if (!exp || !exp.joining_date) continue;
            const start = new Date(exp.joining_date);
            if (isNaN(start.getTime())) continue;

            let end: Date | null = null;
            if (exp.is_current_employment === "1" || exp.is_current_employment === "Yes") {
              end = today;
            } else if (exp.relieving_date) {
              const rDate = new Date(exp.relieving_date);
              if (!isNaN(rDate.getTime())) {
                end = rDate;
              }
            }

            if (end && end >= start) {
              const diffMs = end.getTime() - start.getTime();
              totalDays += diffMs / (1000 * 60 * 60 * 24);
            }
          }

          const calculatedYears = totalDays / 365.25;
          // Grace margin of 30 days (~0.08 years) to account for calendar variations
          if (calculatedYears + 0.08 < claimedYears) {
            const displayYears = calculatedYears < 1
              ? Math.max(0, Math.round(calculatedYears * 10) / 10)
              : Math.round(calculatedYears * 10) / 10;
            return this.createError({
              message: `Total duration in employment details (${displayYears} years) cannot be less than selected Total Experience (${claimedYears} years)`,
            });
          }

          return true;
        }
      );
  }),
}) as any;

/**
 * Generates dynamic MSME Form Schema based on a product list.
 */
export const getMsmeFormSchema = (productList: Array<{ key: string; label: string }>) => {
  const productsShape: Record<string, any> = {};

  productList.forEach(({ key, label }) => {
    productsShape[key] = Yup.boolean();

    productsShape[`${key}_quantity`] = Yup.number()
      .typeError(VALIDATION_ERRORS.invalid.quantityNumber)
      .min(0, VALIDATION_ERRORS.invalid.quantityNegative)
      .nullable()
      .when(key, {
        is: true,
        then: (schema) => schema.required(`Quantity is required when ${label} is selected`),
        otherwise: (schema) => schema.notRequired().nullable(),
      })
      .test(
        `require-checkbox-if-${key}-quantity-present`,
        `Please check the product (${label})`,
        function (value) {
          const checkbox = this.parent[key];
          return !value || checkbox === true;
        }
      );
  });

  return Yup.object({
    gst_number: safeString()
      .trim()
      .required(VALIDATION_ERRORS.required.gst)
      .length(15, VALIDATION_ERRORS.invalid.gstLength)
      .matches(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        VALIDATION_ERRORS.invalid.gst
      ),
    email: safeString().email(VALIDATION_ERRORS.invalid.email).required(VALIDATION_ERRORS.required.email),
    mobile: safeString()
      .matches(/^\d{10}$/, VALIDATION_ERRORS.invalid.mobile)
      .required(VALIDATION_ERRORS.required.mobile),
    name_of_the_firm: safeString().trim().required(VALIDATION_ERRORS.required.firmName),
    address_of_the_firm: safeString().trim().required(VALIDATION_ERRORS.required.firmAddress),
    pincode: safeString().trim()
      .length(6, VALIDATION_ERRORS.invalid.pincode)
      .matches(/^\d{6}$/, VALIDATION_ERRORS.invalid.pincodeDigits)
      .required(VALIDATION_ERRORS.required.pincode),
    contact_person_name: safeString()
      .trim()
      .required(VALIDATION_ERRORS.required.contactPerson)
      .matches(/^[^0-9]+$/, VALIDATION_ERRORS.invalid.contactPersonNumbers),

    products: Yup.object()
      .shape(productsShape)
      .test(
        'at-least-one-selected',
        'Please select at least one product',
        (obj) => productList.some(({ key }) => obj?.[key])
      ),
  });
};

export const MSME_PRODUCT_LIST = [
  { key: 'HR_coil', label: 'HR coil' },
  { key: 'Plates', label: 'Plates' },
  { key: 'CRFH_coil', label: 'CRFH coil' },
  { key: 'TMT', label: 'TMT' },
  { key: 'wire_rods', label: 'Wire rods' },
  { key: 'HRPO_coils', label: 'HRPO coils' },
  { key: 'HRSPO_coils', label: 'HRSPO coils' },
  { key: 'rails', label: 'Rails' },
  { key: 'structures', label: 'Structures' },
  { key: 'hollow_section', label: 'Hollow section' },
  { key: 'cement', label: 'Cement' },
];

/**
 * Unpaid Dividend Form Schema
 */
export const UnpaidDividendFormSchema = Yup.object().shape({
  dpid: Yup.string().test(
    "dpid-required",
    "DP ID is required when Folio Number is not provided",
    function (value) {
      const { folioNo } = this.parent;
      if (!folioNo) {
        return !!value && value.trim().length > 0;
      }
      return true;
    }
  ).test(
    "dpid-format",
    "DP ID must be 6 digits",
    function (value) {
      if (value) {
        return /^\d{6}$/.test(value);
      }
      return true;
    }
  ),
  clientId: Yup.string().test(
    "clientId-required",
    "Client ID is required when Folio Number is not provided",
    function (value) {
      const { folioNo } = this.parent;
      if (!folioNo) {
        return !!value && value.trim().length > 0;
      }
      return true;
    }
  ).test(
    "clientId-format",
    "Client ID must be 8 digits",
    function (value) {
      if (value) {
        return /^\d{8}$/.test(value);
      }
      return true;
    }
  ),
  folioNo: Yup.string().test(
    "folioNo-required",
    "Folio Number is required when DP ID & Client ID are not provided",
    function (value) {
      const { dpid, clientId } = this.parent;
      if (!dpid && !clientId) {
        return !!value && value.trim().length > 0;
      }
      return true;
    }
  ),
  pan: safeString()
    .required("PAN is required")
    .matches(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/, "Invalid PAN format"),
  user_captcha_input: safeString().required("Captcha is required"),
});

// ─── QueryFormSchema (Preserved for ProductForm / Contact enquiry) ─────────
export interface IQueryFormSchema {
  full_Name: string;
  email: string;
  mobile: string;
  country: string;
  city: string;
  message: string;
  inquiry_Type?: string;
  company?: string;
  privacy_Policy: boolean;
}

export const QueryFormSchema: Yup.ObjectSchema<any> = Yup.object({
  full_Name: safeString()
    .trim()
    .min(2, 'Name is too short')
    .required('Full Name is required'),
  company: safeString().trim(),
  email: safeString()
    .trim()
    .email('Please enter a valid email address')
    .required('Email is required'),
  mobile: safeString()
    .trim()
    .matches(REGEX.phone, 'Please enter a valid 10-digit mobile number')
    .required('Mobile number is required'),
  country: safeString()
    .trim()
    .required('Country is required'),
  city: safeString()
    .trim()
    .required('City is required'),
  message: safeString()
    .trim()
    .required('Message is required'),
  inquiry_Type: safeString(),
  privacy_Policy: Yup.boolean()
    .oneOf([true], 'You must accept the privacy policy to continue')
    .required(),
});
