import { useState, useRef } from "react";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { serverRequest } from "@/services/getServerSideRender";
import { CONSTANTS } from "@/config/constant";
import { CHECK_APPLICANT_ENDPOINT } from "@/config/apiConfig";

interface UseApplicantCheckProps {
    postId?: string | number;
    isTalentCommunity?: boolean;
}

export const useApplicantCheck = ({
    postId,
    isTalentCommunity = false,
}: UseApplicantCheckProps) => {
    const [alreadyAppliedModal, setAlreadyAppliedModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
    }>({
        isOpen: false,
        title: "Application Status",
        message: "",
    });

    const [isAlreadyApplied, setIsAlreadyApplied] = useState<boolean>(false);
    const emailCheckTimerRef = useRef<NodeJS.Timeout | null>(null);
    const emailAbortControllerRef = useRef<AbortController | null>(null);

    const checkApplicantEmail = (
        emailValue: string,
        currentPostId: string | number,
        validateField: (field: string) => Promise<any>,
        setFieldError: (field: string, message: string | undefined) => void
    ) => {
        if (emailCheckTimerRef.current) {
            clearTimeout(emailCheckTimerRef.current);
        }

        const isTalent = isTalentCommunity;
        if (isTalent) {
            setIsAlreadyApplied(false);
            return;
        }

        const trimmedEmail = (emailValue || "").trim();
        if (!trimmedEmail) {
            setIsAlreadyApplied(false);
            return;
        }

        const postIdToUse = currentPostId || postId || "";
        if (!postIdToUse || String(postIdToUse) === "0") {
            return;
        }

        emailCheckTimerRef.current = setTimeout(async () => {
            const fieldError = await validateField("email");
            const isValid = await Yup.string()
                .email()
                .required()
                .isValid(trimmedEmail);

            if (fieldError || !isValid) {
                return;
            }

            try {
                if (emailAbortControllerRef.current) {
                    emailAbortControllerRef.current.abort();
                }
                const controller = new AbortController();
                emailAbortControllerRef.current = controller;

                const endpoint = `${CHECK_APPLICANT_ENDPOINT}?email=${encodeURIComponent(trimmedEmail)}&postId=${encodeURIComponent(String(postIdToUse))}`;
                const response = await serverRequest(
                    {},
                    endpoint,
                    CONSTANTS.REQUEST_GET,
                    "client"
                );

                if (response && (response.code === "SUC200" || response.code === CONSTANTS.STATUS_SUCCESS)) {
                    const resData = response.data || {};
                    const hasApplied =
                        resData.is_applied === true ||
                        resData.is_applied === "true" ||
                        resData.is_applied === 1 ||
                        resData.is_applied === "1";
                    const appStatus = resData.application_status;
                    const isStatusNull =
                        appStatus === null ||
                        appStatus === undefined ||
                        appStatus === "";

                    if (hasApplied || !isStatusNull) {
                        setIsAlreadyApplied(true);
                        const popupMsg =
                            resData.message ||
                            (resData.application_status_text
                                ? `Your application status is: ${resData.application_status_text}.`
                                : "You have already applied for this job post. Kindly check the status.");
                        setAlreadyAppliedModal({
                            isOpen: true,
                            title: "Application Status",
                            message: popupMsg,
                        });
                        setFieldError("email", popupMsg);
                    } else {
                        setIsAlreadyApplied(false);
                        setAlreadyAppliedModal((prev) => ({ ...prev, isOpen: false }));
                    }
                } else if (response && response.message && !response.error) {
                    setIsAlreadyApplied(true);
                    setFieldError("email", response.message);
                    setAlreadyAppliedModal({
                        isOpen: true,
                        title: "Application Status",
                        message: response.message,
                    });
                }
            } catch (err: any) {
                if (err?.name !== "AbortError") {
                    console.error("Failed to check applicant email:", err);
                }
            }
        }, 1000);
    };

    const handleCloseModal = () => {
        setAlreadyAppliedModal((prev) => ({ ...prev, isOpen: false }));
    };

    return {
        isAlreadyApplied,
        setIsAlreadyApplied,
        checkApplicantEmail,
        modalProps: {
            isOpen: alreadyAppliedModal.isOpen,
            title: alreadyAppliedModal.title,
            message: alreadyAppliedModal.message,
            onClose: handleCloseModal,
        },
    };
};
