import 'server-only'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import config from '@payload-config'
import type { AppLocale } from '../i18n/routing'
import { CACHE_TAGS } from './cacheTags'

/**
 * Tầng truy cập dữ liệu Payload cho Server Components.
 * Luôn truyền fallbackLocale='en' để nội dung chưa dịch (ko/ja) hiện tiếng Anh, không trống.
 */
export async function getPayloadClient() {
  return getPayload({ config })
}

const FALLBACK: AppLocale = 'en'

/**
 * getSettings/getHome/getPages đọc trực tiếp Postgres qua Payload Local API (KHÔNG qua
 * fetch()), nên Next.js không tự nhận diện được để tham gia Data Cache / Full Route Cache.
 * Hệ quả thực tế: trang liên quan bị Next build tĩnh 1 lần rồi đóng băng, Save trong /admin
 * không đẩy ra frontend cho tới khi redeploy.
 * -> Bọc unstable_cache() gắn tag để (1) hưởng ISR revalidate=60 ở page, và quan trọng hơn
 *    (2) cho phép `revalidateTag()` trong hooks/revalidate.ts xoá đúng cache khi admin Save,
 *    thấy cập nhật ngay không cần đợi 60s hay redeploy.
 */
const cachedGetSettings = unstable_cache(
  async (locale: AppLocale) => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'settings', locale, fallbackLocale: FALLBACK, depth: 2 })
  },
  ['global-settings'],
  { tags: [CACHE_TAGS.settings], revalidate: 60 },
)
export const getSettings = (locale: AppLocale) => cachedGetSettings(locale)

const cachedGetHome = unstable_cache(
  async (locale: AppLocale) => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'home', locale, fallbackLocale: FALLBACK, depth: 2 })
  },
  ['global-home'],
  { tags: [CACHE_TAGS.home], revalidate: 60 },
)
export const getHome = (locale: AppLocale) => cachedGetHome(locale)

const cachedGetPages = unstable_cache(
  async (locale: AppLocale) => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'pages', locale, fallbackLocale: FALLBACK, depth: 2 })
  },
  ['global-pages'],
  { tags: [CACHE_TAGS.pages], revalidate: 60 },
)
export const getPages = (locale: AppLocale) => cachedGetPages(locale)

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
