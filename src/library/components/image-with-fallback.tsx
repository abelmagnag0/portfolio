"use client";
import Image, { type StaticImageData } from 'next/image';
import React, { useState } from 'react';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

type Props = {
  src?: string | StaticImageData;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  sizes?: string; // permite ajustar responsividade do carregamento
};

export function ImageWithFallback(props: Props) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, priority, sizes } = props
  // Grid: lg=3 col (~33vw), md=2 col (~50vw), mobile=100vw
  const defaultSizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} style={style}>
      {didError ? (
        <Image src={ERROR_IMG_SRC} alt="Error loading image" fill sizes={sizes || defaultSizes} unoptimized />
      ) : (
        <Image
          src={src || ''}
          alt={alt || ''}
          fill
          sizes={sizes || defaultSizes}
          onError={handleError}
          unoptimized
          priority={priority}
          fetchPriority={priority ? 'high' : undefined}
          className="object-cover"
        />
      )}
    </div>
  )
}
