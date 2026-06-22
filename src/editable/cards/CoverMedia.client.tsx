'use client'

import { useState, type ReactNode } from 'react'

export function CoverMedia({
  src,
  alt,
  containerClassName,
  imageClassName,
  fallback,
}: {
  src: string | null
  alt: string
  containerClassName: string
  imageClassName: string
  fallback: ReactNode
}) {
  const [failed, setFailed] = useState(!src || src.includes('/placeholder.svg'))

  if (failed || !src) {
    return <>{fallback}</>
  }

  return (
    <div className={containerClassName}>
      <img src={src} alt={alt} className={imageClassName} onError={() => setFailed(true)} />
    </div>
  )
}
