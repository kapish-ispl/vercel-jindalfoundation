"use client";

import { FC } from "react";
import Slider from "react-slick";

const HomeBanner: FC<{ bannerMedia: any }> = ({ bannerMedia }) => {

    // eslint-disable-next-line no-var
    var settings = {
        dots: true,
        arrows: true,
        infinite: true,
        fade: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    const isVideo = (data: any) => {
        return data?.type?.toLowerCase() === 'video' ||
            data?.cdnPath?.toLowerCase()?.endsWith('.mp4') ||
            data?.cdnPath?.toLowerCase()?.endsWith('.webm') ||
            data?.cdnPath?.toLowerCase()?.endsWith('.ogg');
    };

    const desktopMedia = bannerMedia.filter((item: any) => item.caption === 'desktop');
    const mobileMedia = bannerMedia.filter((item: any) => item.caption === 'mobile');
    return (
        <>
            {bannerMedia && bannerMedia.length > 0 &&
                <div className="c-banner__wrapper">
                    <div className="c-banner__wrapper__item_desktop slider__arrow">
                        <Slider {...settings} >
                            {desktopMedia.map((data: any, index: any) =>
                                isVideo(data) ? (
                                    <div key={data.cdnPath} className="w-100 h-100 position-relative">
                                        <video loop={true} muted={true} autoPlay={true} playsInline={true} className={`c-banner__item_desktop`}>
                                            <source src={data.cdnPath} type="video/mp4" />
                                        </video>
                                        <div className="container custom_container">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="banner__title">We are
                                                        <span>#CaringBeyondBounds</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={data.cdnPath} className="w-100 h-100 position-relative">
                                        <img
                                            src={data.cdnPath}
                                            alt="industry"
                                            className={`c-banner__item_desktop img-fluid`}
                                        />
                                        <div className="container custom_container">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="banner__title">We are
                                                        <span>#CaringBeyondBounds</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </Slider>
                    </div>
                    <div className="c-banner__item_mobile slider__arrow c-banner__wrapper">
                        <Slider {...settings} >
                            {mobileMedia.map((data: any, index: any) =>
                                isVideo(data) ? (
                                    <div key={data.cdnPath} className="w-100 h-100 position-relative">
                                        <video loop={true} muted={true} autoPlay={true} playsInline={true} className={`c-banner__item_mobile`}>
                                            <source src={data.cdnPath} type="video/mp4" />
                                        </video>
                                        <div className="banner__title">We are
                                            <span>#CaringBeyondBounds</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={data.cdnPath} className="w-100 h-100 position-relative">
                                        <img
                                            src={data.cdnPath}
                                            alt="industry"
                                            className={`c-banner__item_mobile img-fluid`}
                                        />
                                        <div className="banner__title">We are
                                            <span>#CaringBeyondBounds</span>
                                        </div>
                                    </div>
                                )
                            )}
                        </Slider>
                    </div>
                </div>
            }
        </>
    )
}

export default HomeBanner;