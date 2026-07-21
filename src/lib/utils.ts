// Ghép className đơn giản (bỏ falsy), tránh phải cài thêm clsx.
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

// Fallback: trả về value nếu có nội dung, ngược lại trả về giá trị mặc định.
export function withFallback(value: string | null | undefined, fallback: string): string {
  return value && value.trim().length > 0 ? value : fallback
}

/**
 * Dùng với `.catch(safeCatch('getHome', null))` thay vì `.catch(() => null)`.
 * Vẫn cho trang render fallback khi Payload/DB lỗi (không sập trang), NHƯNG log lỗi ra
 * server console/Vercel logs để phân biệt được "field trống thật" và "request bị lỗi" —
 * tránh việc lỗi API bị nuốt âm thầm rồi hiện nhầm thành nội dung mặc định.
 */
export function safeCatch<T>(label: string, fallback: T) {
  return (error: unknown): T => {
    console.error(`[CMS fetch failed] ${label} — rendering fallback content instead of throwing.`, error)
    return fallback
  }
}
