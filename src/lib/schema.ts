import type { Setting, Product, Category } from '../payload-types'
import { SITE_URL, absoluteUrl } from './seo'
import { mediaUrl } from './media'

// Schema.org Organization từ Global Settings.
export function buildOrganizationSchema(settings: Setting | null, companyName: string): Record<string, unknown> {
  const logo = mediaUrl(settings?.logo)
  const sameAs = (settings?.socialLinks ?? [])
    .map((s) => s.url)
    .filter((u): u is string => Boolean(u))

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings?.companyName || companyName,
    url: SITE_URL,
    ...(logo ? { logo: logo.startsWith('http') ? logo : `${SITE_URL}${logo}` } : {}),
    ...(settings?.salesEmail ? { email: settings.salesEmail } : {}),
    ...(settings?.phone ? { telephone: settings.phone } : {}),
    ...(settings?.foundedYear ? { foundingDate: String(settings.foundedYear) } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

// Schema.org Product từ 1 sản phẩm.
export function buildProductSchema(product: Product, locale: string): Record<string, unknown> {
  const category = typeof product.category === 'object' ? (product.category as Category) : null
  const image = mediaUrl(product.featuredImage, 'feature')

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    ...(product.shortDescription ? { description: product.shortDescription } : {}),
    ...(image ? { image: image.startsWith('http') ? image : `${SITE_URL}${image}` } : {}),
    ...(category?.title ? { category: category.title } : {}),
    ...(product.specs?.hsCode ? { productID: `HS:${product.specs.hsCode}` } : {}),
    url: absoluteUrl(locale, `/products/${product.slug}`),
    brand: { '@type': 'Brand', name: 'Charcoal Export' },
  }
}
