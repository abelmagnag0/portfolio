"use client";
import Image from 'next/image';
import React, { useState } from 'react';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

type Props = {
  src?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
};

export function ImageWithFallback(props: Props) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, priority } = props

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} style={style}>
      {didError ? (
        <Image src={ERROR_IMG_SRC} alt="Error loading image" fill sizes="100vw" unoptimized />
      ) : (
        <Image
          src={src || ''}
          alt={alt || ''}
          fill
          sizes="100vw"
          onError={handleError}
          unoptimized
          priority={priority}
          className="object-cover"
        />
      )}
    </div>
  )
}
