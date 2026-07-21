import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { AppLocale } from '../../../../../i18n/routing'
import { Link } from '../../../../../i18n/navigation'
import { getProductBySlug } from '../../../../../lib/payload'
import { mediaUrl, mediaAlt, isMedia } from '../../../../../lib/media'
import { buildMetadata } from '../../../../../lib/seo'
import { buildProductSchema } from '../../../../../lib/schema'
import { ProductGallery } from '../../../../../components/products/ProductGallery'
import { SpecTable } from '../../../../../components/products/SpecTable'
import { RichText } from '../../../../../components/ui/RichText'
import { RfqForm } from '../../../../../components/forms/RfqForm'
import { JsonLd } from '../../../../../components/seo/JsonLd'
import { safeCatch } from '../../../../../lib/utils'
import type { Category } from '../../../../../payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

// An toàn dự phòng: tự làm mới tối đa sau 60s thay vì đóng băng từ lúc build trên Vercel.
export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const product = await getProductBySlug(slug, locale as AppLocale).catch(safeCatch('productDetail.generateMetadata:getProductBySlug', null))
  if (!product) return {}
  const title = product.seo?.title || product.title
  const description = product.seo?.description || product.shortDescription || undefined
  const img = mediaUrl(product.featuredImage, 'feature')
  return buildMetadata({
    locale: locale as AppLocale,
    path: `/products/${product.slug}`,
    title,
    description,
    images: img ? [img] : undefined,
  })
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const l = locale as AppLocale

  const product = await getProductBySlug(slug, l).catch(safeCatch('productDetail:getProductBySlug', null))
  if (!product) notFound()

  const [t, tc] = await Promise.all([getTranslations('products'), getTranslations('common')])
  const category = typeof product.category === 'object' ? (product.category as Category) : null

  // Gộp ảnh cho gallery: featured + gallery[], resolve URL trên server.
  const galleryImages = [
    product.featuredImage,
    ...(product.gallery ?? []).map((g) => g.image),
  ]
    .map((m) => {
      const url = mediaUrl(m, 'card')
      return url ? { url, alt: mediaAlt(m, product.title) } : null
    })
    .filter((x): x is { url: string; alt: string } => x !== null)

  const specLabels = {
    fixedCarbon: t('specsTable.fixedCarbon'),
    ash: t('specsTable.ash'),
    moisture: t('specsTable.moisture'),
    volatileMatter: t('specsTable.volatileMatter'),
    calorificValue: t('specsTable.calorificValue'),
    burningTime: t('specsTable.burningTime'),
    dimensions: t('specsTable.dimensions'),
    packing: t('specsTable.packing'),
    moq: t('specsTable.moq'),
    loadingPort: t('specsTable.loadingPort'),
    hsCode: t('specsTable.hsCode'),
  }

  const pdfUrl = isMedia(product.specSheetPdf) ? mediaUrl(product.specSheetPdf) : null
  const applications = product.applications ?? []

  return (
    <>
      {/* Structured data: Product */}
      <JsonLd data={buildProductSchema(product, locale)} />

      {/* Breadcrumb */}
      <div className="border-b border-sand-200 bg-white">
        <div className="container-content flex items-center gap-2 py-4 text-sm text-ink-500">
          <Link href="/products" className="inline-flex items-center gap-1 hover:text-ink-900">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            {tc('backToProducts')}
          </Link>
        </div>
      </div>

      {/* Phần trên: gallery + tóm tắt + CTA */}
      <section className="section bg-sand">
        <div className="container-content grid gap-10 lg:grid-cols-2">
          <ProductGallery images={galleryImages} placeholderLabel={tc('imageComingSoon')} />

          <div>
            {category?.title ? <p className="eyebrow">{category.title}</p> : null}
            <h1 className="mt-2 text-3xl sm:text-4xl">{product.title}</h1>
            {product.shortDescription ? (
              <p className="mt-4 text-lg text-ink-600">{product.shortDescription}</p>
            ) : null}

            {/* Vài chỉ số nổi bật (nếu có) */}
            {product.specs ? (
              <dl className="mt-6 grid grid-cols-2 gap-4">
                {product.specs.fixedCarbon ? (
                  <div className="rounded-md border border-sand-200 bg-white p-4">
                    <dt className="text-xs uppercase tracking-wide text-ink-500">{specLabels.fixedCarbon}</dt>
                    <dd className="mt-1 text-lg font-bold text-ink-900">{product.specs.fixedCarbon}</dd>
                  </div>
                ) : null}
                {product.specs.moq ? (
                  <div className="rounded-md border border-sand-200 bg-white p-4">
                    <dt className="text-xs uppercase tracking-wide text-ink-500">{t('moq')}</dt>
                    <dd className="mt-1 text-lg font-bold text-ink-900">{product.specs.moq}</dd>
                  </div>
                ) : null}
              </dl>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#rfq" className="btn-primary">{t('requestQuoteForProduct')}</a>
              {pdfUrl ? (
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-dark">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  {tc('downloadSpecSheet')}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Bảng thông số + ứng dụng */}
      <section className="section bg-white">
        <div className="container-content grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl">{t('specifications')}</h2>
            <div className="mt-6">
              <SpecTable specs={product.specs} labels={specLabels} />
            </div>
            {product.richContent ? (
              <div className="mt-10">
                <RichText data={product.richContent} />
              </div>
            ) : null}
          </div>

          {applications.length > 0 ? (
            <aside>
              <h2 className="text-2xl">{t('applications')}</h2>
              <ul className="mt-6 space-y-3">
                {applications.map((a, i) => (
                  <li key={a.id ?? i} className="flex items-start gap-2 text-ink-700">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-gold-700" aria-hidden>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {a.item}
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </section>

      {/* Form RFQ cho chính sản phẩm này */}
      <section id="rfq" className="section bg-sand scroll-mt-20">
        <div className="container-content max-w-3xl">
          <h2 className="text-center text-2xl sm:text-3xl">{t('requestQuoteForProduct')}</h2>
          <div className="mt-8 rounded-card border border-sand-200 bg-white p-6 sm:p-8">
            <RfqForm defaultProduct={product.title} />
          </div>
        </div>
      </section>
    </>
  )
}
