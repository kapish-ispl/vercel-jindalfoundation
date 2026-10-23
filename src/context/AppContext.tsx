"use client";

import { getJobMasterData } from "@/services/getJobMasterData";
import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from "react";

import Loader from "@/components/Elements/Loader";

type Option = { label: string; value: string };
type contextType = {
    headerMenu: any;
    footerContent: any;
    footerBottomMenu: any;
    jobPostId: string;
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setJobPostId: Dispatch<SetStateAction<string>>;
    jobTitle: string;
    setJobTitle: Dispatch<SetStateAction<string>>;
    jobLocation: string;
    setJobLocation: Dispatch<SetStateAction<string>>;
    jobRole: string;
    setJobRole: Dispatch<SetStateAction<string>>;
    jobCode: string;
    setJobCode: Dispatch<SetStateAction<string>>;
    genderOptions: Option[];
    nationalityOptions: Option[];
    degreeOptions: Option[];
    countryOptions: Option[];
    statesOptions: Option[];
    departmentOptions: Option[];
    locationOptions: Option[];
};
export const AppContext = createContext<contextType>(
    {
        headerMenu: [],
        footerContent: null,
        footerBottomMenu: [],
        jobPostId: "",
        isLoading: false,
        setIsLoading: () => { },
        setJobPostId: () => { },
        setJobTitle: () => { },
        setJobLocation: () => { },
        setJobRole: () => { },
        jobTitle: "",
        jobLocation: "",
        jobRole: "",
        jobCode: "",
        setJobCode: () => { },
        genderOptions: [],
        nationalityOptions: [],
        degreeOptions: [],
        countryOptions: [],
        statesOptions: [],
        departmentOptions: [],
        locationOptions: [],
    }
);

type AppContextProviderProps = {
    children: ReactNode;
    initialHeaderMenu?: any[];
    initialFooterBottomMenu?: any[];
    initialFooterContent?: any;
};

const AppContextProvider = ({
    children,
    initialHeaderMenu = [],
    initialFooterBottomMenu = [],
    initialFooterContent = null,
}: AppContextProviderProps) => {
    const [headerMenu] = useState<any>(initialHeaderMenu);
    const [footerBottomMenu] = useState<any[]>(initialFooterBottomMenu);
    const [footerContent] = useState<any>(initialFooterContent);
    const [mastersData, setMastersData] = useState<any>([]);
    const [jobPostId, setJobPostId] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobLocation, setJobLocation] = useState("");
    const [jobRole, setJobRole] = useState("");
    const [jobCode, setJobCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Master data options state
    const [genderOptions, setGenderOptions] = useState<Option[]>([]);
    const [nationalityOptions, setNationalityOptions] = useState<Option[]>([]);
    const [degreeOptions, setDegreeOptions] = useState<Option[]>([]);
    const [countryOptions, setCountryOptions] = useState<Option[]>([]);
    const [statesOptions, setStatesOptions] = useState<Option[]>([]);
    const [departmentOptions, setDepartmentOptions] = useState<Option[]>([]);
    const [locationOptions, setLocationOptions] = useState<Option[]>([]);


    useEffect(() => {
        let isMounted = true;
        const getPostData = async () => {
            try {
                const taxonomyInfo = await getJobMasterData();
                if (isMounted && taxonomyInfo) {
                    setMastersData(taxonomyInfo);
                }
            } catch (error) {
                console.error('[Job master data]', error);
            }
        };

        getPostData();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        if (mastersData && mastersData.code == 'SUC200' && mastersData.data) {
            const data = mastersData.data;

            if (data.gender) {
                const mappedGenders = Object.keys(data.gender).map(key => ({
                    value: key,
                    label: data.gender[key]
                }));
                if (!mappedGenders.some(g => g.value.toLowerCase() === "other" || g.label.toLowerCase() === "other")) {
                    mappedGenders.push({ value: "Other", label: "Other" });
                }
                setGenderOptions(mappedGenders);
            }

            if (data.nationality) {
                setNationalityOptions(Object.keys(data.nationality).map(key => ({
                    value: key,
                    label: data.nationality[key]
                })));
            }

            if (data.degree) {
                setDegreeOptions(Object.keys(data.degree).map(key => ({
                    value: key,
                    label: data.degree[key]
                })));
            }

            if (data.country) {
                setCountryOptions(Object.keys(data.country).map(key => ({
                    value: key,
                    label: data.country[key]
                })));
            }

            if (data.states) {
                setStatesOptions(Object.keys(data.states).map(key => ({
                    value: key,
                    label: data.states[key]
                })));
            }

            if (data.department) {
                setDepartmentOptions(Object.keys(data.department).map(key => ({
                    value: key,
                    label: data.department[key]
                })));
            }

            if (data.location) {
                setLocationOptions(Object.keys(data.location).map(key => ({
                    value: key,
                    label: data.location[key]
                })));
            }
        }
    }, [mastersData]);

    const values = { headerMenu, footerContent, footerBottomMenu, jobPostId, setJobPostId, jobTitle, setJobTitle, jobLocation, setJobLocation, jobRole, setJobRole, jobCode, setJobCode, genderOptions, setGenderOptions, nationalityOptions, setNationalityOptions, degreeOptions, setDegreeOptions, countryOptions, setCountryOptions, statesOptions, setStatesOptions, departmentOptions, setDepartmentOptions, locationOptions, setLocationOptions, isLoading, setIsLoading };

    return (
        <AppContext.Provider value={values}>
            {isLoading && <Loader fullPage={true} text="Please wait..." />}
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
