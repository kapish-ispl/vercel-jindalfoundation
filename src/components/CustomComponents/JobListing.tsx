"use client";
import React, { useRef, useContext, useState, useEffect } from 'react';
import CustomSelect from '@/components/CustomSelect';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppContext } from '@/context/AppContext';
import Link from 'next/link';
import Pagination from './Pagination';
import CareerModal from '@/components/CareerModal';
import RecruitmentDisclaimerModal from '@/components/RecruitmentDisclaimerModal';
import { RotateCcw } from 'lucide-react';

const JobListing = ({ postData, itemsPerPage }: any) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { departmentOptions, locationOptions } = useContext(AppContext);
    const departmentRef = useRef<{ clearValue: (push?: boolean) => void } | null>(null);
    const locationRef = useRef<{ clearValue: (push?: boolean) => void } | null>(null);
    const contextInfo = useContext(AppContext);
    const [modalData, setModalData] = useState(null);
    const [modalState, setModalState] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    useEffect(() => {
        setShowDisclaimer(true);
    }, []);

    const handleClear = () => {
        departmentRef.current?.clearValue(false);
        locationRef.current?.clearValue(false);

        const params = new URLSearchParams(window.location.search);
        params.delete("department");
        params.delete("location");
        params.delete("page"); // Clear page on reset
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        router.push(newUrl, { scroll: false });
    };

    const currentDate = new Date();
    let currentDay = `${currentDate.getDate()}`;
    let currentMonth = `${currentDate.getMonth() + 1}`;
    const currentYear = currentDate.getFullYear();
    if (currentDate.getMonth() + 1 <= 9) {
        currentMonth = `0${currentDate.getMonth() + 1}`
    }
    if (currentDate.getDate() <= 9) {
        currentDay = `0${currentDate.getDate()}`
    }
    const getCurrentDate = `${currentYear}${currentMonth}${currentDay}`;

    const selectedDeptLabel = departmentOptions.find(o => o.value === searchParams.get("department"))?.label;
    const selectedLocLabel = locationOptions.find(o => o.value === searchParams.get("location"))?.label;

    const filterData = (postData || []).filter((item: any) => {
        // Location Filter
        if (selectedLocLabel && item.metaInfo?.location !== selectedLocLabel) {
            return false;
        }

        // Department Filter
        if (selectedDeptLabel && item.metaInfo?.department !== selectedDeptLabel) {
            return false;
        }

        let startDate, endDate;
        if (item.startDate != undefined && item.startDate != "" && item.endDate != undefined && item.endDate != "") {
            const getStartDate = item.startDate.split("-");
            const getEndDate = item.endDate.split("-");

            if (getStartDate[0].length == 4) {
                startDate = `${getStartDate[0]}${getStartDate[1]}${getStartDate[2]}`;
            } else {
                startDate = `${getStartDate[2]}${getStartDate[1]}${getStartDate[0]}`;
            }

            if (getEndDate[0].length == 4) {
                endDate = `${getEndDate[0]}${getEndDate[1]}${getEndDate[2]}`;
            } else {
                endDate = `${getEndDate[2]}${getEndDate[1]}${getEndDate[0]}`;
            }
        }

        if (endDate !== undefined && startDate !== undefined) {
            if (startDate <= getCurrentDate && endDate >= getCurrentDate) {
                return item;
            }
            return false;
        }
        return true;
    });

    const sortData = [...filterData].sort((a: any, b: any) => {
        if (b.metaInfo?.end_date && a.metaInfo?.end_date) {
            return a.metaInfo.end_date.split("-").reverse().join("").localeCompare(b.metaInfo.end_date.split("-").reverse().join(""));
        }
        return 0;
    });

    const totalCount = sortData.length;
    const displayData = sortData.slice(0, itemsPerPage);

    const redirectToJobPage = (item: any) => {
        contextInfo.setJobPostId(item.id);
        contextInfo.setJobCode(item.metaInfo?.job_code || "");
        contextInfo.setJobTitle(item.title || "");
        contextInfo.setJobLocation(item.metaInfo?.location || "");
        contextInfo.setJobRole(item.metaInfo?.role || "");
    };
    const handleReadMore = (item: any) => {
        setModalData(item);
        setModalState(true);
    };

    const modalClose = () => {
        setModalData(null);
        setModalState(false);
    };
    return (
        <>
            <RecruitmentDisclaimerModal isOpen={showDisclaimer} onClose={() => setShowDisclaimer(false)} />
            {modalData !== null && <CareerModal open={modalState} closeModal={modalClose} data={modalData} />}
            <div className="generic_spacer_container genric_bottom_spacer pt-2 v-2 newListCard">
                <div className="container cus-container">
                    <div className="c-filterView mb-4">
                        <div className="row gy-2">
                            <div className="col-md-10 col-sm-12">
                                <div className="row g-3">
                                    {/* <div className="col-md-6">
                                <CustomSelect
                                    options={departmentOptions}
                                    placeholder="Select Department"
                                    paramKey="department"
                                    selectRef={departmentRef}
                                />
                            </div> */}
                                    <div className="col-md-12">
                                        <CustomSelect
                                            options={locationOptions}
                                            placeholder="Select Location"
                                            paramKey="location"
                                            selectRef={locationRef}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-2">
                                <button
                                    type="button"
                                    className="reset-btn"
                                    onClick={handleClear}
                                    title="Reset Filters"
                                >
                                    <RotateCcw className='reset-icon' size={"15"} />
                                    <span>Reset</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="row gy-4">

                        {displayData.length > 0 ? (
                            displayData.map((item: any) => {
                                return (
                                    <div className="col-12 col-md-6" key={item.id}>
                                        <div className="newListCard__item">
                                            <div className="newListCard__item-info">
                                                <div className="job-title">
                                                    {item.metaInfo?.role ? `${item.metaInfo.role} - ` : ""}
                                                    {item.title}
                                                </div>

                                                <div className="job-meta-row">
                                                    <div className="job-meta">
                                                        <span className="meta-label">Location:</span>
                                                        <span className="meta-value">{item.metaInfo?.location || "-"}</span>
                                                    </div>

                                                    <div className="job-meta">
                                                        <span className="meta-label">Department:</span>
                                                        <span className="meta-value">{item.metaInfo?.department || "-"}</span>
                                                    </div>
                                                </div>

                                                {item.metaInfo?.description && (
                                                    <div className="job-desc">{item.metaInfo.description}</div>
                                                )}

                                                <div className="action-btn">
                                                    <Link
                                                        prefetch={false}
                                                        className="cus-btn v1 green--bordered"
                                                        href={`/job-application`}
                                                        onClick={() => redirectToJobPage(item)}
                                                    >
                                                        <span className="label">Apply Now</span>
                                                    </Link>
                                                    <button
                                                        className="cus-btn v1 orange--bordered"
                                                        onClick={() => handleReadMore(item)}
                                                        type="button"
                                                    >
                                                        <span className="label">Know More</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-12">
                                <p className="cus_text24 text-center">No Data Found</p>
                            </div>
                        )}
                    </div>

                    <Pagination
                        totalPosts={totalCount}
                        itemsPerPage={itemsPerPage}
                    />
                </div>
            </div>
        </>
    );
};

export default JobListing;