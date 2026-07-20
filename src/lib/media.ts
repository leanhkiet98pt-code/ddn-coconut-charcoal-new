import type { Media } from '../payload-types'

// Kiểu media có thể là số (chưa populate), object đã populate, null/undefined.
export type MediaLike = number | Media | null | undefined

export function isMedia(m: MediaLike): m is Media {
  return typeof m === 'object' && m !== null && 'url' in m
}

// Lấy URL ảnh (ưu tiên size cụ thể nếu có). Trả null nếu không có ảnh -> render placeholder.
export function mediaUrl(m: MediaLike, size?: 'thumbnail' | 'card' | 'feature'): string | null {
  if (!isMedia(m)) return null
  if (size && m.sizes && m.sizes[size]?.url) return m.sizes[size]!.url as string
  return m.url ?? null
}

export function mediaAlt(m: MediaLike, fallback = ''): string {
  if (isMedia(m) && m.alt) return m.alt
  return fallback
}

// Kiểm tra file có phải PDF (dùng cho nút download spec sheet / chứng chỉ).
export function isPdf(m: MediaLike): boolean {
  return isMedia(m) && (m.mimeType?.includes('pdf') ?? false)
}
