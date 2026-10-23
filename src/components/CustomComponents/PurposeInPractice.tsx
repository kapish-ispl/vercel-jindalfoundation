'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import ImageModal from './ImageModal';
import Pagination from './Pagination';
import PlayIcon from './PlayIcon';
import { PostData } from '@/types/postData';

export interface PurposeInPracticeProps {
    postData: PostData[];
    totalPosts: number;
    itemsPerPage: number;
}

const PurposeInPractice: React.FC<PurposeInPracticeProps> = ({ postData, totalPosts, itemsPerPage = 9 }) => {
    const [selectedImage, setSelectedImage] = useState<string | null | undefined>(null);
    const [selectedMediaType, setSelectedMediaType] = useState<string | null | undefined>(null);

    const currentItems = postData.slice(0, itemsPerPage);

    return (
        <>
            <div className="row gy-4">
                {currentItems.length > 0 ? (
                    currentItems.map(post => {
                        return (() => {
                                const { title, description, id } = post;
                                const isVideo = post.metaInfo?.type === 'video' || Boolean(post.metaInfo?.video_url);
                                const videoUrl = post.metaInfo?.video_url;
                                const images = post.media?.filter(item => item.type === 'image' && item.cdnPath?.trim());
                                const mediaSrc = images?.length ? images[0].cdnPath : '/images/fallback_Image.jpg';

                                return (
                                    <div key={id} className="col-12 col-lg-4 col-md-6 col-sm-12">
                                        <div className="c-card__wrap">
                                            <div
                                                
                                               
                                                className="c-card__wrap-media cursor-pointer"
                                                style={{ position: 'relative', display: 'block' }}
                                               
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
                                                {isVideo && <PlayIcon />}
                                            </div>
                                            <span className="c-card__wrap-content">
                                                <span className="title">{title}</span>
                                                <span className="desc">{description}</span> 
                                                <Link href="#!"  className="action__btn full-link" 
                                                 onClick={e => {
                                                    e.preventDefault();
                                                    setSelectedImage(isVideo ? videoUrl : mediaSrc);
                                                    setSelectedMediaType(isVideo ? 'video' : 'image');
                                                }}>
                                                    <span hidden>Read More</span>
                                                </Link>
                                            </span>
                                        </div>
                                    </div>
                                );
                            })()
                    })
                ) : (
                    <div className="col-12"><div className="hw__error">
                        No data available</div></div>
                )}
            </div>

            <Pagination totalPosts={totalPosts} itemsPerPage={itemsPerPage} />

            {selectedImage && (
                <ImageModal
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    galleryType={null}
                    mediaType={selectedMediaType}
                />
            )}
        </>
    );
};

export default PurposeInPractice;