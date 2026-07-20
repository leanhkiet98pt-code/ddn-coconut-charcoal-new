import Image from 'next/image'
import { mediaUrl, mediaAlt, type MediaLike } from '../../lib/media'

type Props = {
  media: MediaLike
  size?: 'thumbnail' | 'card' | 'feature'
  alt?: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  priority?: boolean
  /** Nhãn a11y cho ô placeholder khi thiếu ảnh (tùy chọn). */
  placeholderLabel?: string
}

/**
 * Ảnh từ CMS. Thiếu ảnh -> ô placeholder trung tính (KHÔNG dùng ảnh giả), giữ layout.
 * Component đồng bộ để lồng thoải mái trong mọi server/client component.
 */
export function MediaImage({
  media,
  size,
  alt,
  fill = true,
  width,
  height,
  className,
  sizes = '100vw',
  priority = false,
  placeholderLabel,
}: Props) {
  const url = mediaUrl(media, size)

  if (!url) {
    return (
      <div
        className={`flex items-center justify-center bg-sand-200 text-ink-400 ${className ?? ''}`}
        role="img"
        aria-label={placeholderLabel}
        style={fill ? undefined : { width, height }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    )
  }

  const resolvedAlt = alt ?? mediaAlt(media, '')

  if (fill) {
    return (
      <Image src={url} alt={resolvedAlt} fill sizes={sizes} className={className} priority={priority} />
    )
  }

  return (
    <Image
      src={url}
      alt={resolvedAlt}
      width={width ?? 800}
      height={height ?? 600}
      className={className}
      priority={priority}
    />
  )
}
