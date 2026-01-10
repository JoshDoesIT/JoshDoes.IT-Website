'use client';

import { useEffect, useState, useCallback } from 'react';

export default function ImageModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const [imageAlt, setImageAlt] = useState('');

    const closeModal = useCallback(() => {
        setIsOpen(false);
        document.body.style.overflow = '';
    }, []);

    const openModal = useCallback((src: string, alt: string) => {
        setImageSrc(src);
        setImageAlt(alt);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    }, []);

    useEffect(() => {
        // Handle click events on images with .blog-image class
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const clickedImage = target.closest('.blog-image');

            if (clickedImage) {
                e.preventDefault();
                const img = clickedImage as HTMLImageElement;
                const src = img.getAttribute('data-image-src') || img.src;
                const alt = img.getAttribute('data-image-alt') || img.alt;

                // Security check
                const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:'];
                const lowerSrc = src.toLowerCase();
                if (dangerousProtocols.some(proto => lowerSrc.startsWith(proto))) {
                    return;
                }

                openModal(src, alt);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                closeModal();
            }
        };

        document.addEventListener('click', handleClick);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, openModal, closeModal]);

    if (!isOpen) return null;

    return (
        <div
            id="imageModal"
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    closeModal();
                }
            }}
        >
            <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
                <button
                    id="closeModal"
                    className="absolute top-4 right-4 text-white hover:text-terminal-green text-2xl z-10 bg-terminal-bg border border-terminal-border px-4 py-2 rounded"
                    aria-label="Close modal"
                    onClick={closeModal}
                >
                    <i className="fa-solid fa-times"></i>
                </button>
                <img
                    id="modalImage"
                    src={imageSrc}
                    alt={imageAlt}
                    className="max-w-full max-h-full object-contain rounded border border-terminal-border"
                />
            </div>
        </div>
    );
}
