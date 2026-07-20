import type { Metadata } from 'next'
import { routing, type AppLocale } from '../i18n/routing'

// Domain thật đọc từ env (canonical + hreflang). Bỏ dấu "/" cuối.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

// URL tuyệt đối cho 1 locale + path (path KHÔNG gồm locale, bắt đầu bằng "/" hoặc rỗng).
export function absoluteUrl(locale: string, path = ''): string {
  const clean = path === '/' ? '' : path
  return `${SITE_URL}/${locale}${clean}`
}

type BuildArgs = {
  locale: AppLocale
  path?: string
  title?: string | null
  description?: string | null
  images?: string[]
  noIndex?: boolean
}

/**
 * Tạo Metadata Next.js với canonical + hreflang cho cả 3 locale (+ x-default = en).
 * title/description bỏ trống -> caller nên truyền fallback trước khi gọi.
 */
export function buildMetadata({ locale, path = '', title, description, images, noIndex }: BuildArgs): Metadata {
  const languages: Record<string, string> = {}
  for (const loc of routing.locales) {
    languages[loc] = absoluteUrl(loc, path)
  }
  languages['x-default'] = absoluteUrl(routing.defaultLocale, path)

  const canonical = absoluteUrl(locale, path)
  const ogImages = images && images.length > 0 ? images.map((url) => (url.startsWith('http') ? url : `${SITE_URL}${url}`)) : undefined

  return {
    title: title ?? undefined,
    description: description ?? undefined,
    alternates: { canonical, languages },
    openGraph: {
      title: title ?? undefined,
      description: description ?? undefined,
      url: canonical,
      siteName: title ?? undefined,
      locale,
      type: 'website',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: title ?? undefined,
      description: description ?? undefined,
      images: ogImages,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  }
}
