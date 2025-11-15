import { useState, useEffect, useRef } from 'react';
import type { ImgHTMLAttributes } from 'react';
import '../styles/LazyImage.css';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  threshold?: number;
  srcSet?: string;
  sizes?: string;
  webpSrc?: string;
}

export function LazyImage({ 
  src, 
  alt, 
  placeholderSrc, 
  threshold = 0.1,
  className = '',
  srcSet,
  sizes,
  webpSrc,
  ...props 
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(placeholderSrc || '');
  const [imageSrcSet, setImageSrcSet] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [useWebP, setUseWebP] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Detect WebP support
  useEffect(() => {
    if (!webpSrc) return;
    
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      if (canvas.getContext && canvas.getContext('2d')) {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      }
      return false;
    };

    setUseWebP(checkWebPSupport());
  }, [webpSrc]);

  useEffect(() => {
    // IntersectionObserver para detectar cuando la imagen entra en viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !imageLoaded) {
            // Use WebP if supported and available
            const imageToLoad = (useWebP && webpSrc) ? webpSrc : src;
            
            // Precargar la imagen
            const img = new Image();
            if (srcSet) {
              img.srcset = srcSet;
              if (sizes) {
                img.sizes = sizes;
              }
            }
            img.src = imageToLoad;
            img.onload = () => {
              setImageSrc(imageToLoad);
              if (srcSet) {
                setImageSrcSet(srcSet);
              }
              setImageLoaded(true);
            };
            img.onerror = () => {
              console.error(`Failed to load image: ${imageToLoad}`);
              // Try fallback to original src if WebP failed
              if (useWebP && webpSrc && imageToLoad === webpSrc) {
                img.src = src;
                img.onload = () => {
                  setImageSrc(src);
                  setImageLoaded(true);
                };
              } else {
                setImageLoaded(true); // Marcar como cargado para evitar reintentos
              }
            };
            
            // Dejar de observar una vez que se cargó
            if (imgRef.current) {
              observer.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        threshold,
        rootMargin: '50px' // Empezar a cargar 50px antes de que entre en viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, threshold, imageLoaded]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      srcSet={imageSrcSet || undefined}
      sizes={sizes}
      alt={alt}
      className={`lazy-image ${imageLoaded ? 'loaded' : 'loading'} ${className}`}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
}
