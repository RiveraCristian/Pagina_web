import { useState, useRef } from 'react';
import { LazyImage } from './LazyImage';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import '../styles/ImageGallery.css';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  if (!images || images.length === 0) return null;

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToIndex = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  // Gestos táctiles para navegación
  useSwipeGesture(galleryRef, {
    onSwipeLeft: () => {
      if (images.length > 1) {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    },
    onSwipeRight: () => {
      if (images.length > 1) {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    },
    threshold: 50
  });

  return (
    <div ref={galleryRef} className="image-gallery">
      <div className="gallery-main">
        <LazyImage
          src={images[currentIndex]} 
          alt={`${alt} - Imagen ${currentIndex + 1}`}
          className="gallery-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
          }}
        />
        
        {images.length > 1 && (
          <>
            <button 
              className="gallery-nav gallery-nav-prev" 
              onClick={goToPrevious}
              aria-label="Imagen anterior"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            <button 
              className="gallery-nav gallery-nav-next" 
              onClick={goToNext}
              aria-label="Siguiente imagen"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="gallery-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`gallery-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={(e) => goToIndex(e, index)}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
