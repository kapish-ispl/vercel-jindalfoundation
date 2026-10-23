import { FC, useContext } from "react";
import Link from "next/link";
import { AppContext } from "@/context/AppContext";
import Modal from "./Modal";

const CareerModal: FC<{ open: any; closeModal?: any; data: any }> = ({ data, open, closeModal }) => {
    const contextInfo = useContext(AppContext);

    const redirectToJobPage = (data: any) => {
        contextInfo.setJobPostId(data.id);
        contextInfo.setJobCode(data.metaInfo.job_code);
        contextInfo.setJobTitle(data.title);
        contextInfo.setJobLocation(data.metaInfo.location);
        contextInfo.setJobRole(data.metaInfo.role);
        closeModal();
    };

    return (
        <Modal
            isOpen={open}
            onClose={closeModal}
            title={`Role Overview – ${data.title}`}
        >
            <div className="generic_content">
                <div className="generic_content_container">
                    {data.metaInfo.job_objective !== undefined && data.metaInfo.job_objective !== "" ? (
                        <>
                            <h4>Job objective</h4>
                            {data.metaInfo.job_objective.split("\r\n").map((item: any, index: any) => (
                                <p key={index}>{item}</p>
                            ))}
                        </>
                    ) : (
                        ""
                    )}
                </div>

                <div className="generic_content_container">
                    {data.metaInfo.about_the_role !== undefined && data.metaInfo.about_the_role !== "" ? (
                        <>
                            <h4>About the role</h4>
                            <div className="generic_list v2">
                                <ul>
                                    {data.metaInfo.about_the_role.split("\r\n").map((item: any, index: any) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        ""
                    )}
                </div>

                <div className="generic_content_container">
                    {data.metaInfo.key_attributes !== undefined && data.metaInfo.key_attributes !== "" ? (
                        <>
                            <h4>Key attributes</h4>
                            <div className="generic_list v2">
                                <ul>
                                    {data.metaInfo.key_attributes.split("\r\n").map((item: any, index: any) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        ""
                    )}
                </div>

                <div className="generic_content_container">
                    {data.metaInfo.experience !== undefined && data.metaInfo.experience !== "" ? (
                        <>
                            <h4>Experience</h4>
                            <div className="generic_list v2">
                                <ul>
                                    {data.metaInfo.experience.split("\r\n").map((item: any, index: any) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        ""
                    )}
                </div>

                <div className="generic_content_container">
                    {data.metaInfo.education !== undefined && data.metaInfo.education !== "" ? (
                        <>
                            <h4>Education</h4>
                            <div className="generic_list v2">
                                <ul>
                                    {data.metaInfo.education.split("\r\n").map((item: any, index: any) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        ""
                    )}
                </div>

                <div className="generic_content_container">
                    {data.metaInfo.role_profile !== undefined && data.metaInfo.role_profile !== "" ? (
                        <>
                            <h4>Role profile</h4>
                            <div className="generic_list v2">
                                <ul>
                                    {data.metaInfo.role_profile.split("\r\n").map((item: any, index: any) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        ""
                    )}
                </div>

                <div className="c-modal-v2__body-content mt-5 border-top pt-4">
                    <h4>Public Notice – Fake Job Offers</h4>
                    <p>
                        We, Jindal Foundation and its group companies, have observed fraudulent individuals issuing fake job offers in our name and asking applicants to pay processing fees or deposit money via email or phone calls.
                    </p>
                    <p>
                        We strongly advise the public <strong>not to respond or make any payment</strong> to such communications. While legal action is underway against these entities, Jindal Foundation and its group companies will not be responsible for any loss arising from such fraudulent dealings.
                    </p>
                    <p>
                        Please note, our recruitment process is <strong>professional, merit-based and completely free. We do not charge any fee</strong> at any stage of hiring.
                    </p>
                    <p>
                        If you receive any interview call or job offer claiming to be from us, <strong>verify it only through our official website (<a href="https://www.jindalfoundation.com" target="_blank" rel="noopener noreferrer" className="modal_disclaimer_link">www.jindalfoundation.com</a>)</strong> or directly with our HR department.
                    </p>
                </div>

                <div className="c-modal-v2__footer">
                    <Link prefetch={false} className="c-button cus-btn v1" href={`/job-application`} onClick={() => redirectToJobPage(data)}><span className="label">Apply Now</span></Link>
                </div>
            </div>
        </Modal>
    );
};

export default CareerModal;
