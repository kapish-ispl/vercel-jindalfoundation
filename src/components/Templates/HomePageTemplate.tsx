"use client";
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
const PageTemplate = dynamic(() => import('./PageTemplate'), { ssr: true });
const HomeBanner = dynamic(() => import('../Elements/HomeBanner'), { ssr: true });

function ScrollToSection() {
    useEffect(() => {
        if (window.location.hash !== "#stateSection") {
            return;
        }

        let attempts = 0;

        const scrollToSection = () => {
            const element = document.getElementById("stateSection");

            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

                // Remove the hash from the URL
                window.history.replaceState(
                    null,
                    "",
                    window.location.pathname + window.location.search
                );

                return;
            }

            if (attempts < 50) {
                attempts++;
                requestAnimationFrame(scrollToSection);
            }
        };

        requestAnimationFrame(scrollToSection);
    }, []);

    return null;
}
const HomePage = ({ data }: any) => {
    ScrollToSection();
    return (
        <>
            <div className="c-banner">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 p-0">
                            <HomeBanner bannerMedia={data.media} />
                        </div>
                    </div>
                </div>
            </div>
            <PageTemplate data={data} />
        </>
    )
}

export default HomePage;