// Ghép className đơn giản (bỏ falsy), tránh phải cài thêm clsx.
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

// Fallback: trả về value nếu có nội dung, ngược lại trả về giá trị mặc định.
export function withFallback(value: string | null | undefined, fallback: string): string {
  return value && value.trim().length > 0 ? value : fallback
}
