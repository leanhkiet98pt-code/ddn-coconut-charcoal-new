'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '../../lib/utils'

type Img = { url: string; alt: string }

// Gallery sản phẩm: ảnh lớn + thumbnail bấm để đổi. Nếu không có ảnh -> ô placeholder.
export function ProductGallery({ images, placeholderLabel }: { images: Img[]; placeholderLabel: string }) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-card border border-sand-200 bg-sand-100 text-ink-400" role="img" aria-label={placeholderLabel}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    )
  }

  const main = images[active] ?? images[0]

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-card border border-sand-200 bg-white">
        <Image src={main.url} alt={main.alt} fill className="object-contain p-4" sizes="(max-width:1024px) 100vw, 50vw" priority />
      </div>
      {images.length > 1 ? (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Image ${i + 1}`}
              className={cn(
                'relative aspect-square overflow-hidden rounded-md border bg-white transition',
                i === active ? 'border-gold ring-2 ring-gold/30' : 'border-sand-200 hover:border-ink-400',
              )}
            >
              <Image src={img.url} alt={img.alt} fill className="object-contain p-1.5" sizes="20vw" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
