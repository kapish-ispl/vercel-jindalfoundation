"use client";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";

import { AppContext } from "@/context/AppContext";
import PageTemplate from "./PageTemplate";
import { SVG_ICON12 } from "@/config/icons";

const Footer = () => {
    type FooterItem = {
        id: string | number;
        name: string;
        link: string;
        is_new_tab: number;
    };
    const { footerContent, footerBottomMenu } = useContext(AppContext);
    const [visible, setVisible] = useState(false);

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    };


    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisible);

        return () => {
            window.removeEventListener("scroll", toggleVisible);
        };
    }, []);

    return (
        <>
            {visible &&
                <div className="back_top" onClick={scrollToTop}>
                    {SVG_ICON12}
                </div>
            }
            <footer className="c-footer">
                {footerContent != null &&
                    <PageTemplate data={footerContent} />
                }
                <div className="c-footer__bottom">
                    <div className="container custom_container">
                        <div className="row">
                            <div className="col-12">
                                <div className="c-footer__bottom_container">
                                    <div className="c-footer__bottom_items">
                                        © Jindal Foundation 2025
                                    </div>
                                    <div className="c-footer__bottom_items">
                                        <div className="c-navigation c-navigation_1">
                                            {footerBottomMenu.map((item: FooterItem) => {
                                                return (
                                                    <Link key={item.id} target={item.is_new_tab == 0 ? '_self' : '_blank'} className="c-navigation__item" href={item.link.split(".html")[0]}>{item.name}</Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;