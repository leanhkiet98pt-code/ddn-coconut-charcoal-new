import type { MetadataRoute } from 'next'
import { SITE_URL } from '../lib/seo'

// robots.txt: cho index toàn site, chặn admin & api; trỏ tới sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
