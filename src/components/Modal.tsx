import React, { FC, ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="c-modal-v2" onClick={onClose}>
            <div className="c-modal-v2__container" onClick={(e) => e.stopPropagation()} data-lenis-ignore>
                <div className="c-modal-v2__header">
                    <h2 className="c-modal-v2__title c-content-30">{title}</h2>
                    <button onClick={onClose} className="c-modal-v2__close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="c-modal-v2__body">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
