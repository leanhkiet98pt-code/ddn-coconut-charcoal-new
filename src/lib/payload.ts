import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { AppLocale } from '../i18n/routing'

/**
 * Tầng truy cập dữ liệu Payload cho Server Components.
 * Luôn truyền fallbackLocale='en' để nội dung chưa dịch (ko/ja) hiện tiếng Anh, không trống.
 */
export async function getPayloadClient() {
  return getPayload({ config })
}

const FALLBACK: AppLocale = 'en'

export async function getSettings(locale: AppLocale) {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'settings', locale, fallbackLocale: FALLBACK, depth: 2 })
}

export async function getHome(locale: AppLocale) {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'home', locale, fallbackLocale: FALLBACK, depth: 2 })
}

export async function getPages(locale: AppLocale) {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'pages', locale, fallbackLocale: FALLBACK, depth: 2 })
}

export async function getCategories(locale: AppLocale) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'categories',
    locale,
    fallbackLocale: FALLBACK,
    sort: 'order',
    limit: 100,
    depth: 1,
  })
  return res.docs
}

export async function getProducts(locale: AppLocale, categorySlug?: string) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'products',
    locale,
    fallbackLocale: FALLBACK,
    limit: 100,
    depth: 1,
    sort: 'title',
    ...(categorySlug
      ? { where: { 'category.slug': { equals: categorySlug } } }
      : {}),
  })
  return res.docs
}

export async function getProductBySlug(slug: string, locale: AppLocale) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'products',
    locale,
    fallbackLocale: FALLBACK,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
}

export async function getCertificates(locale: AppLocale) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'certificates',
    locale,
    fallbackLocale: FALLBACK,
    limit: 100,
    depth: 1,
  })
  return res.docs
}

export async function getExportMarkets(locale: AppLocale) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'export-markets',
    locale,
    fallbackLocale: FALLBACK,
    limit: 200,
    depth: 0,
  })
  return res.docs
}

export async function getProductionSteps(locale: AppLocale) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'production-steps',
    locale,
    fallbackLocale: FALLBACK,
    sort: 'order',
    limit: 100,
    depth: 1,
  })
  return res.docs
}

export async function getPosts(locale: AppLocale) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'posts',
    locale,
    fallbackLocale: FALLBACK,
    sort: '-publishedDate',
    limit: 100,
    depth: 1,
  })
  return res.docs
}

export async function getPostBySlug(slug: string, locale: AppLocale) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'posts',
    locale,
    fallbackLocale: FALLBACK,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
}
