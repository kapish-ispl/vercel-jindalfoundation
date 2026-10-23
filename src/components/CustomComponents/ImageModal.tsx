'use client'
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';

const ImageModal = ({ selectedImage, setSelectedImage, galleryType, mediaType }: {
    galleryType?: string | null;
    selectedImage: string | null;
    mediaType?: string | null;
    setSelectedImage: (img: string | null) => void;
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || selectedImage === null) return null;
    const isYoutube = selectedImage.includes('youtube.com');
    const isVideo = galleryType === 'Video' || mediaType === 'video';

    return ReactDOM.createPortal(
        <div className="modal-backdrop image-modal" onClick={() => setSelectedImage(null)}>
            <div onClick={(e) => e.stopPropagation()}
                style={{ position: 'relative', width: '90vw', height: '90vh' }}
            >
                <button className='btn-close-modal' onClick={() => setSelectedImage(null)}>
                    &times;
                </button>
                {
                    isVideo ? (
                        <div style={{ position: 'relative', width: '90vw', height: '90vh', textAlign: 'center' }}>
                            {isYoutube ? (
                                <iframe
                                    width="90%"
                                    height="100%"
                                    src={selectedImage}
                                    title="YouTube video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ borderRadius: '8px' }}
                                />
                            ) : (
                                <video controls width="90%" height="100%" autoPlay>
                                    <source src={selectedImage} type="video/mp4" />
                                </video>
                            )}
                        </div>
                    ) : (
                        <div style={{ position: 'relative', width: '100%', height: '100%', textAlign: 'center' }}>
                            <Image
                                src={selectedImage}
                                alt="Full Image"
                                fill
                                sizes="100vw"
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                    )
                }


            </div>
        </div>,
        document.body
    );
};


export default ImageModal
