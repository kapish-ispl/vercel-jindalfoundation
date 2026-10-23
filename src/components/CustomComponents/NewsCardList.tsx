'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { NEWS_DROPDOWN } from '@/config/constant';
import ImageModal from './ImageModal';
import Pagination from './Pagination';
import { PostData } from '@/types/postData';

export interface NewsCardListProps {
    postData: PostData[];
    totalPosts: number;
    itemsPerPage?: number;
}

const NewsCardList: React.FC<NewsCardListProps> = ({ postData, totalPosts, itemsPerPage = 6 }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const typeDropdownRef = useRef<HTMLDivElement>(null);
    const hasMounted = useRef(false);

    const [dropdownValue, setDropdownValue] = useState<string | null>(() => {
        const urlType = searchParams.get('type');
        return urlType ?? 'Media Coverage';
    });
    const [dropdownActive, setDropdownActive] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null | undefined>(null);
    const [selectedMediaType, setSelectedMediaType] = useState<string | null | undefined>(null);

    const currentItems = postData.slice(0, itemsPerPage);

    // Sync dropdown value to URL
    useEffect(() => {
        if (!dropdownValue) return;

        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

        if (searchParams.get('type') === dropdownValue) return;

        const newParams = new URLSearchParams(searchParams?.toString() || '');
        newParams.set('type', dropdownValue);
        router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    }, [dropdownValue, pathname, router, searchParams]);

    // Reset page when dropdown changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        if (params.has('page')) {
            params.delete('page');
            router.push(`${pathname}?${params.toString()}`);
        }
    }, [dropdownValue]);

    // Close dropdown on outside click or Escape
    useEffect(() => {
        function handleClickOrEscape(event: MouseEvent | KeyboardEvent) {
            if (event instanceof MouseEvent) {
                const target = event.target as Node;
                if (typeDropdownRef.current && !typeDropdownRef.current.contains(target)) {
                    setDropdownActive(false);
                }
            }
            if (event instanceof KeyboardEvent && event.key === 'Escape') {
                setDropdownActive(false);
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
            {/* Dropdown filter */}
            <div className="main_dropdown mb-4">
                <div className="dropdown" ref={typeDropdownRef}>
                    <button
                        className="dropdown-toggle"
                        onClick={() => setDropdownActive(prev => !prev)}
                    >
                        {dropdownValue}
                    </button>
                    <div className={`dropdown-menu ${dropdownActive ? 'dropdown-active' : ''}`}>
                        {NEWS_DROPDOWN.map(type => (
                            <span
                                key={type.label}
                                onClick={() => {
                                    setDropdownValue(type.label);
                                    setDropdownActive(false);
                                }}
                            >
                                {type.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Card grid */}
            <div className="row gy-4">
                {currentItems.length > 0 ? (
                    currentItems.map(post => {
                        const { metaInfo, title, description, id } = post;

                        const isVideo = metaInfo?.type === 'video' || Boolean(metaInfo?.video_url);
                        const videoUrl = metaInfo?.video_url;
                        const images = post.media?.filter(item => item.type === 'image' && item.cdnPath?.trim());
                        const mediaSrc = images?.length ? images[0].cdnPath : '/images/fallback_Image.jpg';
                        const pdfFile = post.media?.filter(item => item.type === 'attachment' && item.extension?.toLowerCase() === 'pdf' && item.cdnPath?.trim());
                        const finalLink = metaInfo?.link || pdfFile?.[0]?.cdnPath;
                        return (
                            <div key={id} className="col-12 col-lg-4 col-md-6 col-sm-12">
                                <div className="c-card__wrap">
                                    <div
                                        className="c-card__wrap-media"

                                    >
                                        <Image
                                            alt="card image"
                                            loading="lazy"
                                            width={500}
                                            height={500}
                                            decoding="async"
                                            className="img-fluid u-img"
                                            src={mediaSrc}
                                            style={{ color: 'transparent' }}
                                        />
                                    </div>
                                    <span className="c-card__wrap-content">
                                        <span className="title">{title}</span>
                                        <span className="desc">{description}</span>
                                        {finalLink ? (
                                            <Link className='action__btn full-link' href={finalLink} prefetch={false} target='_blank'>
                                                <span className='action__btn-value' hidden>
                                                    View
                                                </span>
                                            </Link>
                                        ) : (
                                            <Link className='action__btn full-link' href="#!" prefetch={false} onClick={e => {
                                                e.preventDefault();
                                                setSelectedImage(isVideo ? videoUrl : mediaSrc);
                                                setSelectedMediaType(isVideo ? 'video' : 'image');
                                            }}>
                                                <span className='action__btn-value' hidden>
                                                    View
                                                </span>
                                            </Link>
                                        )}

                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-12"><div className="hw__error">No data available</div></div>
                )}
            </div>

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

export default NewsCardList;