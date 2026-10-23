"use client";
import Slider from "react-slick";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomContentSlider = (props: any) => {
    const data = props.data || [];
    const finalData = data.filter((items: any) => items.props !== undefined);
    const itemCount = finalData.length;
    const slidesToShow = Number(props.items) || 3;

    const settings = {
        arrows: itemCount > slidesToShow ? true : false,
        dots: itemCount > slidesToShow ? true : false,
        // autoplay: itemCount > slidesToShow ? true : false,
        autoplay: false,
        autoplaySpeed: 5000,
        infinite: itemCount > slidesToShow ? true : false,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: slidesToShow < 3 ? slidesToShow : 3,
                    slidesToScroll: slidesToShow < 3 ? slidesToShow : 3,
                },
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: slidesToShow <= 1 ? slidesToShow : 2,
                    slidesToScroll: slidesToShow <= 1 ? slidesToShow : 2,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: true,
                },
            },
        ],
    };

    return (
        <>
            <div>
                <Slider {...settings}>
                    {finalData.map((info: any) => (
                        <div className={info.props.className} key={info.key}>
                            {info.props.children}
                        </div>
                    ))}
                </Slider>
            </div>
        </>
    );
};

export default CustomContentSlider;
