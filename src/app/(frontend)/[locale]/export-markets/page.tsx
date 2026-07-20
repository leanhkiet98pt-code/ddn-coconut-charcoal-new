import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { AppLocale } from '../../../../i18n/routing'
import { buildMetadata } from '../../../../lib/seo'
import { getExportMarkets } from '../../../../lib/payload'
import { PageHeader } from '../../../../components/ui/PageHeader'
import { RfqCta } from '../../../../components/sections/RfqCta'
import type { ExportMarket } from '../../../../payload-types'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'exportMarkets' })
  return buildMetadata({ locale: locale as AppLocale, path: '/export-markets', title: t('title'), description: t('subtitle') })
}

export default async function ExportMarketsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as AppLocale

  const [markets, t, tc] = await Promise.all([
    getExportMarkets(l).catch(() => []),
    getTranslations('exportMarkets'),
    getTranslations('common'),
  ])

  // Nhóm quốc gia theo region (region trống -> "Other").
  const groups = new Map<string, ExportMarket[]>()
  for (const m of markets) {
    const key = (m.region && m.region.trim()) || '—'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(m)
  }

  return (
    <>
      <PageHeader eyebrow={t('title')} title={t('title')} subtitle={t('subtitle')} />

      <section className="section bg-white">
        <div className="container-content">
          {markets.length > 0 ? (
            <>
              <p className="mb-12 text-center">
                <span className="text-5xl font-bold text-gold">{markets.length}+</span>
                <span className="mt-2 block text-sm uppercase tracking-widest text-ink-500">{t('title')}</span>
              </p>

              <div className="space-y-10">
                {[...groups.entries()].map(([region, list]) => (
                  <div key={region}>
                    {region !== '—' ? (
                      <h2 className="mb-4 border-b border-sand-200 pb-2 text-lg font-semibold text-ink-800">{region}</h2>
                    ) : null}
                    <div className="flex flex-wrap gap-3">
                      {list.map((m) => (
                        <span key={m.id} className="rounded-full border border-sand-300 bg-sand-50 px-4 py-2 text-sm font-medium text-ink-800">
                          {m.country}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="py-12 text-center text-ink-500">{tc('noItems')}</p>
          )}
        </div>
      </section>

      <RfqCta />
    </>
  )
}
