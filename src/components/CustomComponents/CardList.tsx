'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GALLERY_DROPDOWN, PUBLICATION_DROPDOWN, NEWS_DROPDOWN } from '@/config/constant';
import ImageModal from './ImageModal';
import Pagination from './Pagination';
import { PostData } from '@/types/postData';

export interface CardListProps {
    postData: PostData[];
    pageSlug: string;
    totalPosts: number;
    itemsPerPage: number;
}

const CardList: React.FC<CardListProps> = ({ postData, pageSlug, totalPosts, itemsPerPage = 6 }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const typeDropdownRef = useRef<HTMLDivElement>(null);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);
    const dropdownValue = searchParams.get('type') || (pageSlug === 'news' ? 'Media Coverage' : pageSlug === 'gallery' ? 'Photo' : pageSlug === 'publications' ? 'Success Stories' : null);

    const [selectedImage, setSelectedImage] = useState<string | null | undefined>(null);
    const [selectedMediaType, setSelectedMediaType] = useState<string | null | undefined>(null);
    const [dropdownActive, setDropdownActive] = useState<boolean>(false)
    const [categoryDropdownActive, setCategoryDropdownActive] = useState<boolean>(false)
    const router = useRouter();
    const currentItems = postData.slice(0, itemsPerPage);


    const dropdownInfo: any[] = useMemo(() => {
        if (pageSlug == 'news') return NEWS_DROPDOWN;
        if (pageSlug == 'gallery') return GALLERY_DROPDOWN;
        if (pageSlug == 'publications') return PUBLICATION_DROPDOWN;
        return [];
    }, [pageSlug]);

    const setDropdownValue = (type: string) => {
        const newParams = new URLSearchParams(searchParams?.toString() || '');
        newParams.set('type', type);
        newParams.delete('page');
        const newUrl = `${pathname}?${newParams.toString()}`;
        router.push(newUrl, { scroll: false });
    };



    useEffect(() => {
        function handleClickOrEscape(event: MouseEvent | KeyboardEvent) {
            if (event instanceof MouseEvent) {
                const target = event.target as Node;
                const clickedOutsideType = typeDropdownRef.current && !typeDropdownRef.current.contains(target);
                const clickedOutsideCategory = categoryDropdownRef.current && !categoryDropdownRef.current.contains(target);

                if (clickedOutsideType && clickedOutsideCategory) {
                    setDropdownActive(false);
                    setCategoryDropdownActive(false);
                }
            }

            if (event instanceof KeyboardEvent && event.key === 'Escape') {
                setDropdownActive(false);
                setCategoryDropdownActive(false);
            }
        }

        document.addEventListener('mousedown', handleClickOrEscape);
        document.addEventListener('keydown', handleClickOrEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOrEscape);
            document.removeEventListener('keydown', handleClickOrEscape);
        };
    }, []);

    return (
        <>
            {
                (pageSlug == "news" || pageSlug == "gallery" || pageSlug == "publications") &&
                <div className="main_dropdown mb-4">
                    <div className="dropdown" ref={typeDropdownRef}>
                        <button
                            className="dropdown-toggle"
                            onClick={() => setDropdownActive(prev => !prev)}
                        >
                            {dropdownValue}
                        </button>

                        <div className={`dropdown-menu ${dropdownActive ? 'dropdown-active' : ''}`}>
                            {
                                dropdownInfo.map(type => (
                                    <span
                                        key={type.label}
                                        onClick={() => {
                                            setDropdownValue(type.label);
                                            setDropdownActive(false);
                                        }}
                                    >
                                        {type.label}
                                    </span>
                                ))
                            }
                        </div>
                    </div>

                </div>
            }
            {
                <div className="row gy-4">
                    {currentItems.length > 0 ? (
                        currentItems.map(post => {
                            const { metaInfo, title, description, id, postingDate } = post;
                            let dateDisplay = null;
                            const rawAwardDate = metaInfo?.award_year?.trim();
                            const rawPostDate = postingDate?.trim();

                            let finalDate = '';
                            if (rawAwardDate && rawAwardDate.split('-').length === 3) {
                                finalDate = rawAwardDate;
                            } else if (rawPostDate) {
                                finalDate = rawPostDate;
                            }

                            if (finalDate) {
                                let date: Date;
                                if (finalDate.includes('-') && finalDate.split('-')[0].length === 2) {
                                    const [day, month, year] = finalDate.split('-');
                                    date = new Date(`${year}-${month}-${day}`);
                                } else {
                                    date = new Date(finalDate);
                                }

                                if (!isNaN(date.getTime())) {
                                    const monthDisplay = date.toLocaleString('en-US', { month: 'short' });
                                    const yearDisplay = date.getFullYear().toString().slice(-2);

                                    dateDisplay = (
                                        <span className="float_elem">
                                            <span className="value">{monthDisplay} {yearDisplay}</span>
                                        </span>
                                    );
                                }
                            }

                            return (
                                <div key={id} className="col-12 col-lg-4 col-md-6 col-sm-12">
                                    <div className="c-card__wrap">
                                        {(post.media?.some(item => item.type === 'image' && item?.cdnPath?.trim())
                                            ? post.media.filter(item => item.type === 'image' && item?.cdnPath?.trim())
                                            : [{ cdnPath: '/images/fallback_Image.jpg' }]
                                        ).map((item, index) => {
                                            const videoUrl = post?.metaInfo?.video_url;
                                            const isVideo = (post?.metaInfo?.type === 'video' || Boolean(post?.metaInfo?.video_url));
                                            const handleClick = () => {
                                                setSelectedImage(isVideo ? videoUrl : item?.cdnPath);
                                                setSelectedMediaType(isVideo ? 'video' : 'image');
                                            };

                                            return (
                                                pageSlug == 'publications' ?
                                                    <div
                                                        key={index}
                                                        className="c-card__wrap-media"
                                                    >
                                                        <Image
                                                            alt="card image"
                                                            loading="lazy"
                                                            width={500}
                                                            height={500}
                                                            decoding="async"
                                                            className="img-fluid u-img"
                                                            src={item?.cdnPath}
                                                            style={{ color: 'transparent' }}
                                                        />
                                                    </div>

                                                    :
                                                    <Link
                                                        key={index}
                                                        href="#"
                                                        prefetch={false}
                                                        className="c-card__wrap-media cursor-pointer"
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            handleClick();
                                                        }}
                                                    >
                                                        <Image
                                                            alt="card image"
                                                            loading="lazy"
                                                            width={500}
                                                            height={500}
                                                            decoding="async"
                                                            className="img-fluid u-img"
                                                            src={item?.cdnPath}
                                                            style={{ color: 'transparent' }}
                                                        />
                                                        {pathname !== '/gallery' && dateDisplay}
                                                    </Link>
                                            );
                                        })}
                                        <span className="c-card__wrap-content">
                                            <span className="title">{title}</span>
                                            <span className="desc">{description}</span>
                                            {pageSlug === "publications" &&
                                                typeof post?.metaInfo?.category === 'string' &&
                                                ["Success Stories", "Reports", "Newsletters",].includes(post.metaInfo.category) && (
                                                    <Link
                                                        className="action__btn full-link"
                                                        prefetch={false}
                                                        href={
                                                            post.media?.some((item) => item.type === "attachment")
                                                                ? post.media.find((item) => item.type === "attachment")?.cdnPath || "#"
                                                                : `/publications/${post.slug}` || "#"
                                                        }
                                                        target={
                                                            post?.metaInfo?.category === "Success Stories"
                                                                ? post.media?.some((item) => item.type === "attachment")
                                                                    ? "_blank"
                                                                    : "_self"
                                                                : "_blank"
                                                        }
                                                    >
                                                        {post.media?.some((item) => item.type === "attachment") && (
                                                            <span className="action__btn-icon">
                                                                <img
                                                                    src="https://d2lptvt2jijg6f.cloudfront.net/jsplfoundation/custom/1745217944_pdf_icon_2.png"
                                                                    alt="pdf icon"
                                                                    width="30"
                                                                    height="37"
                                                                    decoding="async"
                                                                    data-nimg="1"
                                                                    className="u-img img-fluid"
                                                                />
                                                            </span>
                                                        )}

                                                        <span className="action__btn-value">
                                                            {post?.metaInfo?.category === "Success Stories"
                                                                ? post.media?.some((item) => item.type === "attachment")
                                                                    ? "Download"
                                                                    : "View"
                                                                : "Download"}
                                                        </span>
                                                    </Link>
                                                )}


                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-12"><div className="hw__error">
                            No data available</div></div>
                    )}
                </div>
            }


            <Pagination totalPosts={totalPosts} itemsPerPage={itemsPerPage} />

            {selectedImage && (
                <ImageModal
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    galleryType={dropdownValue}
                    mediaType={selectedMediaType}
                />
            )}
        </>
    );
};

export default CardList;
