import type { MetadataRoute } from 'next'
import { routing } from '../i18n/routing'
import { absoluteUrl } from '../lib/seo'
import { getPayloadClient } from '../lib/payload'

// Các trang tĩnh (path không gồm locale).
const STATIC_PATHS = ['', '/products', '/production', '/certificates', '/export-markets', '/oem', '/about', '/blog', '/contact']

// Tạo map hreflang cho 1 path (mọi locale + x-default).
function languagesFor(path: string): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const loc of routing.locales) languages[loc] = absoluteUrl(loc, path)
  languages['x-default'] = absoluteUrl(routing.defaultLocale, path)
  return languages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Lấy slug động (sản phẩm, bài viết) từ CMS.
  let productPaths: string[] = []
  let postPaths: string[] = []
  try {
    const payload = await getPayloadClient()
    const [products, posts] = await Promise.all([
      payload.find({ collection: 'products', limit: 1000, depth: 0, pagination: false }),
      payload.find({ collection: 'posts', limit: 1000, depth: 0, pagination: false }),
    ])
    productPaths = products.docs.map((p) => `/products/${p.slug}`)
    postPaths = posts.docs.map((p) => `/blog/${p.slug}`)
  } catch {
    // Nếu DB chưa sẵn sàng, vẫn xuất sitemap cho trang tĩnh.
  }

  const allPaths = [...STATIC_PATHS, ...productPaths, ...postPaths]

  for (const path of allPaths) {
    const languages = languagesFor(path)
    for (const loc of routing.locales) {
      entries.push({
        url: absoluteUrl(loc, path),
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : path.startsWith('/products') ? 0.8 : 0.6,
        alternates: { languages },
      })
    }
  }

  return entries
}

export const revalidate = 3600
