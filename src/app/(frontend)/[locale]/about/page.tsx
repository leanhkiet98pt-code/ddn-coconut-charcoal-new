import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { AppLocale } from '../../../../i18n/routing'
import { buildMetadata } from '../../../../lib/seo'
import { getPages, getSettings } from '../../../../lib/payload'
import { PageHeader } from '../../../../components/ui/PageHeader'
import { MediaImage } from '../../../../components/ui/MediaImage'
import { RichText } from '../../../../components/ui/RichText'
import { RfqCta } from '../../../../components/sections/RfqCta'
import { withFallback, safeCatch } from '../../../../lib/utils'

// An toàn dự phòng: nếu hook afterChange của Pages/Settings không tới kịp, trang vẫn tự
// làm mới tối đa sau 60s thay vì đóng băng từ lúc build trên Vercel.
export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const pages = await getPages(locale as AppLocale).catch(safeCatch('about.generateMetadata:getPages', null))
  const t = await getTranslations({ locale, namespace: 'about' })
  return buildMetadata({
    locale: locale as AppLocale,
    path: '/about',
    title: pages?.about?.title || t('title'),
    description: pages?.about?.subtitle || t('subtitle'),
  })
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as AppLocale

  const [pages, settings, t, tc] = await Promise.all([
    getPages(l).catch(safeCatch('about:getPages', null)),
    getSettings(l).catch(safeCatch('about:getSettings', null)),
    getTranslations('about'),
    getTranslations('common'),
  ])
  const about = pages?.about

  const title = withFallback(about?.title ?? '', t('title'))
  const subtitle = withFallback(about?.subtitle ?? '', t('subtitle'))
  const showDetails = about?.showCompanyDetails !== false

  const legal = settings?.legalEntity
  const offices = settings?.offices ?? []

  const detailRows = [
    settings?.companyName ? { label: t('legalEntity'), value: legal?.name || settings.companyName } : null,
    settings?.foundedYear ? { label: t('founded'), value: String(settings.foundedYear) } : null,
    legal?.businessCode ? { label: t('businessCode'), value: legal.businessCode } : null,
    legal?.taxCode ? { label: t('taxCode'), value: legal.taxCode } : null,
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <>
      <PageHeader eyebrow={t('title')} title={title} subtitle={subtitle} />

      <section className="section bg-white">
        <div className="container-content grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {about?.coverImage ? (
              <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-card bg-sand-100">
                <MediaImage media={about.coverImage} size="feature" className="h-full w-full object-cover" sizes="(max-width:1024px) 100vw, 66vw" placeholderLabel={tc('imageComingSoon')} />
              </div>
            ) : null}
            {about?.body ? <RichText data={about.body} /> : <p className="text-ink-500">{tc('contentComingSoon')}</p>}
          </div>

          {/* Khối thông tin công ty có thể kiểm chứng */}
          {showDetails && (detailRows.length > 0 || offices.length > 0) ? (
            <aside className="h-fit rounded-card border border-sand-200 bg-sand-50 p-6">
              <h2 className="text-lg font-semibold text-ink-900">{t('companyDetails')}</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {detailRows.map((row) => (
                  <div key={row.label}>
                    <dt className="text-ink-500">{row.label}</dt>
                    <dd className="font-medium text-ink-900">{row.value}</dd>
                  </div>
                ))}
              </dl>

              {offices.length > 0 ? (
                <div className="mt-6 border-t border-sand-200 pt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-500">{t('offices')}</h3>
                  <ul className="mt-3 space-y-3 text-sm">
                    {offices.map((o, i) => (
                      <li key={i}>
                        {o.label ? <span className="block font-medium text-ink-900">{o.label}</span> : null}
                        <span className="text-ink-600">{o.address}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          ) : null}
        </div>
      </section>

      <RfqCta />
    </>
  )
}
