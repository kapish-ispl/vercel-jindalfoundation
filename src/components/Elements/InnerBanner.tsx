"use client"
import Breadcrumbs from "./Breadcrumbs";

const InnerBanner = ({ label, slug, currentPage, innerBanner, tagline }: any) => {
    const isVideo = (mediaItem: any) => {
        return mediaItem?.type?.toLowerCase() === 'video' ||
            mediaItem?.cdnPath?.toLowerCase()?.endsWith('.mp4') ||
            mediaItem?.cdnPath?.toLowerCase()?.endsWith('.webm') ||
            mediaItem?.cdnPath?.toLowerCase()?.endsWith('.ogg');
    };

    const desktopMedia = innerBanner.filter((item: any) => item?.deviceType?.toLowerCase() === 'desktop');

    const mobileMedia = innerBanner.filter((item: any) => item?.deviceType?.toLowerCase() === 'mobile');

    const activeDesktop = desktopMedia[0] || innerBanner[0];
    const activeMobile = mobileMedia[0] || activeDesktop;

    return (
        <>
            <div className={`c-inner-banner ${innerBanner.length > 0 ? "" : "without-banner"}`}>
                {innerBanner.length > 0 &&
                    <div className="c-inner-banner__media">
                        <div className="c-inner-banner__item_desktop">
                            {isVideo(activeDesktop) ?
                                <video
                                    loop={true}
                                    muted={true}
                                    autoPlay={true}
                                    playsInline={true}
                                    className="c-inner-banner__video">
                                    <source src={activeDesktop?.cdnPath} type="video/mp4" />
                                </video>
                                :
                                <img
                                    src={activeDesktop?.cdnPath}
                                    alt={activeDesktop?.caption == null ? 'JSP Foundation' : activeDesktop?.caption}
                                    style={{ width: '100%' }}
                                    className={`c-inner-banner__image img-fluid`}
                                />
                            }
                        </div>

                        <div className="c-inner-banner__item_mobile">
                            {isVideo(activeMobile) ?
                                <video
                                    loop={true}
                                    muted={true}
                                    autoPlay={true}
                                    playsInline={true}
                                    className="c-inner-banner__video">
                                    <source src={activeMobile?.cdnPath} type="video/mp4" />
                                </video>
                                :
                                <img
                                    src={activeMobile?.cdnPath}
                                    alt={activeMobile?.caption == null ? 'JSP Foundation' : activeMobile?.caption}
                                    className={`c-inner-banner__image img-fluid`}
                                />
                            }

                        </div>
                    </div>
                }

                <div className="c-inner-banner__content">
                    <div className="container custom_container">
                        <div className="row">
                            <div className="col-12">
                                <div className="c-inner-banner__content_box">
                                    <h1 className="banner_heading">{tagline != undefined ? tagline : label}</h1>
                                    <div className="breadcumbs">
                                        <nav aria-label="breadcrumb">
                                            <Breadcrumbs currentPage={currentPage} slug={slug} />
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InnerBanner;