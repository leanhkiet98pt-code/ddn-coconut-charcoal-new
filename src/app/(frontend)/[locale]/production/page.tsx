import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { AppLocale } from '../../../../i18n/routing'
import { buildMetadata } from '../../../../lib/seo'
import { getProductionSteps } from '../../../../lib/payload'
import { PageHeader } from '../../../../components/ui/PageHeader'
import { MediaImage } from '../../../../components/ui/MediaImage'
import { RfqCta } from '../../../../components/sections/RfqCta'
import { cn, safeCatch } from '../../../../lib/utils'

// An toàn dự phòng: tự làm mới tối đa sau 60s thay vì đóng băng từ lúc build trên Vercel.
export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'production' })
  return buildMetadata({ locale: locale as AppLocale, path: '/production', title: t('title'), description: t('subtitle') })
}

export default async function ProductionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as AppLocale

  const [steps, t, tc] = await Promise.all([
    getProductionSteps(l).catch(safeCatch('production:getProductionSteps', [])),
    getTranslations('production'),
    getTranslations('common'),
  ])

  return (
    <>
      <PageHeader eyebrow={t('title')} title={t('title')} subtitle={t('subtitle')} />

      <section className="section bg-white">
        <div className="container-content">
          {steps.length > 0 ? (
            <div className="space-y-16">
              {steps.map((step, i) => (
                <div
                  key={step.id}
                  className={cn(
                    'grid items-center gap-8 lg:grid-cols-2',
                    i % 2 === 1 && 'lg:[&>*:first-child]:order-2',
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-sand-200 bg-sand-100">
                    <MediaImage media={step.image} size="feature" className="h-full w-full object-cover" sizes="(max-width:1024px) 100vw, 50vw" placeholderLabel={tc('imageComingSoon')} />
                  </div>
                  <div>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gold text-lg font-bold text-ink-900">
                      {step.order ?? i + 1}
                    </span>
                    <h2 className="mt-4 text-2xl">{step.title}</h2>
                    {step.description ? (
                      <p className="mt-3 leading-relaxed text-ink-600">{step.description}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-ink-500">{tc('noItems')}</p>
          )}
        </div>
      </section>

      <RfqCta />
    </>
  )
}
