'use client';

import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

/**
 * ImageGallery — A responsive image gallery with thumbnails and lightbox.
 *
 * Features:
 *   - Large primary image with thumbnail navigation
 *   - Keyboard navigation (ArrowLeft/ArrowRight)
 *   - Lightbox modal for full-screen view
 *   - next/image optimization with priority loading
 *   - Smooth transitions between images
 *
 * Design System Compliance:
 *   - Apex §5A: rounded-md (8px) for thumbnails
 *   - Apex §6: motion-safe transitions
 */

export interface ImageGalleryProps {
  /** Array of image URLs to display */
  images: string[];
  /** Alt text for images */
  alt?: string;
  /** Priority loading for first image (LCP optimization) */
  priority?: boolean;
  className?: string;
}

/**
 * Lightbox Modal — Full-screen image viewer
 */
function LightboxModal({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  onSelectIndex,
}: {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onSelectIndex: (index: number) => void;
}) {
  if (!isOpen) return null;

  const src = images[currentIndex];
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        aria-label="Close lightbox"
      >
        <Maximize2 className="size-5 rotate-45" />
      </button>

      {/* Navigation - Previous */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('prev');
          }}
          className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Previous image"
        >
          <ChevronLeft className="size-6" />
        </button>
      )}

      {/* Navigation - Next */}
      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('next');
          }}
          className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Next image"
        >
          <ChevronRight className="size-6" />
        </button>
      )}

      {/* Main Image */}
      <div
        className="relative max-h-[85vh] w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes="80vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 flex gap-2">
          {images.map((img, idx) => (
            <button
              key={img}
              onClick={(e) => {
                e.stopPropagation();
                onSelectIndex(idx);
              }}
              className={cn(
                'relative h-16 w-24 overflow-hidden rounded-md border-2 transition-all',
                idx === currentIndex
                  ? 'scale-110 border-white'
                  : 'border-transparent opacity-60 hover:opacity-100'
              )}
              aria-label={`View image ${idx + 1}`}
              aria-current={idx === currentIndex ? 'true' : undefined}
            >
              <Image src={img} alt="" fill sizes="6rem" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Main ImageGallery Component
 */
export function ImageGallery({
  images,
  alt = 'Gallery image',
  priority = false,
  className,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Keyboard navigation — only active while lightbox is open
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => Math.min(images.length - 1, prev + 1));
      } else if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);

  // Single image — just show it, no gallery chrome
  if (images.length === 1) {
    const src = images[0];
    if (!src) return null;
    return (
      <div className={cn('relative aspect-video overflow-hidden rounded-lg', className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  const activeSrc = images[selectedIndex];

  // Multiple images — gallery with thumbnails
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Main Image */}
      <div className="group relative aspect-video overflow-hidden rounded-lg bg-surface-subtle">
        {activeSrc ? (
          <Image
            src={activeSrc}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}

        {/* Lightbox trigger */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 focus:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Open full screen"
        >
          <Maximize2 className="size-5" />
        </button>

        {/* Prev arrow */}
        {selectedIndex > 0 && (
          <button
            onClick={() => setSelectedIndex((prev) => prev - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 focus:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}

        {/* Next arrow */}
        {selectedIndex < images.length - 1 && (
          <button
            onClick={() => setSelectedIndex((prev) => prev + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 focus:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Next image"
          >
            <ChevronRight className="size-5" />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            key={img}
            onClick={() => setSelectedIndex(idx)}
            className={cn(
              'relative h-20 w-32 shrink-0 overflow-hidden rounded-md border-2 transition-all',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              idx === selectedIndex
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border opacity-70 hover:border-border-strong hover:opacity-100'
            )}
            aria-label={`View image ${idx + 1}`}
            aria-pressed={idx === selectedIndex}
          >
            <Image
              src={img}
              alt={`${alt} ${idx + 1}`}
              fill
              sizes="8rem"
              className="object-cover"
              priority={idx === 0}
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        images={images}
        currentIndex={selectedIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={(direction) =>
          setSelectedIndex((prev) =>
            direction === 'prev' ? Math.max(0, prev - 1) : Math.min(images.length - 1, prev + 1)
          )
        }
        onSelectIndex={setSelectedIndex}
      />
    </div>
  );
}

/**
 * ImageGallerySkeleton — Skeleton loader for the gallery
 */
export function ImageGallerySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 w-32 shrink-0 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
