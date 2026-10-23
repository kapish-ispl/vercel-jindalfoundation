import React, { FC } from "react";
import Modal from "./Modal";

interface RecruitmentDisclaimerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RecruitmentDisclaimerModal: FC<RecruitmentDisclaimerModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Disclaimer Notice to Whomsoever it May Concern"
        >
            <div className="c-modal-v2__body-content">

                <p>
                    Job scams are becoming increasingly common, with fraudsters using company names to send fake offers, interview invites, and requests for payment. These often involve unofficial email IDs, incorrect logos, or suspicious links.
                </p>
                <p>
                    <strong>Please remember:</strong><br />Jindal Foundation does not charge any fees or request sensitive personal information during the hiring process. If you receive a suspicious offer or communication:<br />- Do not engage<br />
                    - Report it immediately via our official website or social media channels<br />
                    - Verify any offer through our official careers portal<br />
                </p>
                <p>
                    Your safety matters to us. Thank you for helping us stop misinformation and protect our community.
                </p>

                <div className="c-modal-v2__footer">
                    <button className="c-button cus-btn v1" onClick={onClose} type="button"><span className="label">Okay</span></button>
                </div>
            </div>
        </Modal>
    );
};

export default RecruitmentDisclaimerModal;
