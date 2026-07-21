import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { AppLocale } from '../../../../i18n/routing'
import { buildMetadata } from '../../../../lib/seo'
import { getPages } from '../../../../lib/payload'
import { PageHeader } from '../../../../components/ui/PageHeader'
import { MediaImage } from '../../../../components/ui/MediaImage'
import { RichText } from '../../../../components/ui/RichText'
import { RfqCta } from '../../../../components/sections/RfqCta'
import { withFallback, safeCatch } from '../../../../lib/utils'

// An toàn dự phòng: nếu hook afterChange của Pages không tới kịp, trang vẫn tự làm mới
// tối đa sau 60s thay vì đóng băng từ lúc build trên Vercel.
export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const pages = await getPages(locale as AppLocale).catch(safeCatch('oem.generateMetadata:getPages', null))
  const t = await getTranslations({ locale, namespace: 'oem' })
  return buildMetadata({
    locale: locale as AppLocale,
    path: '/oem',
    title: pages?.oem?.title || t('title'),
    description: pages?.oem?.subtitle || t('subtitle'),
  })
}

export default async function OemPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as AppLocale

  const [pages, t, tc] = await Promise.all([
    getPages(l).catch(safeCatch('oem:getPages', null)),
    getTranslations('oem'),
    getTranslations('common'),
  ])
  const oem = pages?.oem

  const title = withFallback(oem?.title ?? '', t('title'))
  const subtitle = withFallback(oem?.subtitle ?? '', t('subtitle'))
  const features = oem?.features ?? []
  const gallery = oem?.gallery ?? []

  return (
    <>
      <PageHeader eyebrow={t('title')} title={title} subtitle={subtitle} />

      <section className="section bg-white">
        <div className="container-content">
          {oem?.body ? (
            <div className="mx-auto max-w-3xl">
              <RichText data={oem.body} />
            </div>
          ) : null}

          {features.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <div key={f.id ?? i} className="rounded-card border border-sand-200 bg-sand-50 p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-gold text-ink-900">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-ink-900">{f.title}</h3>
                  {f.description ? <p className="mt-2 text-sm text-ink-500">{f.description}</p> : null}
                </div>
              ))}
            </div>
          ) : null}

          {gallery.length > 0 ? (
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
              {gallery.map((g, i) => (
                <div key={g.id ?? i} className="relative aspect-square overflow-hidden rounded-card bg-sand-100">
                  <MediaImage media={g.image} size="card" className="h-full w-full object-cover" sizes="(max-width:768px) 50vw, 25vw" placeholderLabel={tc('imageComingSoon')} />
                </div>
              ))}
            </div>
          ) : null}

          {/* Nếu chưa có nội dung nào từ CMS, vẫn giữ trang không trống */}
          {!oem?.body && features.length === 0 && gallery.length === 0 ? (
            <p className="py-8 text-center text-ink-500">{tc('contentComingSoon')}</p>
          ) : null}
        </div>
      </section>

      <RfqCta />
    </>
  )
}
