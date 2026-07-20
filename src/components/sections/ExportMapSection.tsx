import { getTranslations } from 'next-intl/server'
import { Link } from '../../i18n/navigation'
import { SectionHeading } from '../ui/SectionHeading'
import type { Home, ExportMarket } from '../../payload-types'
import { withFallback } from '../../lib/utils'

type Props = { data: Home['exportMap']; markets: ExportMarket[] }

/**
 * Section "Export Track Record" trên trang chủ.
 * Hiển thị con số quốc gia + danh sách chip quốc gia (nhóm theo region nếu có).
 * (Bản đồ tương tác đầy đủ có thể bổ sung sau; ở đây dùng dạng chip nhẹ, không phụ thuộc lib ngoài.)
 */
export async function ExportMapSection({ data, markets }: Props) {
  const t = await getTranslations('home')
  const tc = await getTranslations('common')
  const title = withFallback(data?.title ?? '', t('exportTitle'))
  const subtitle = withFallback(data?.subtitle ?? '', t('exportSubtitle'))

  return (
    <section className="section bg-ink-900 text-white">
      <div className="container-content">
        <SectionHeading eyebrow={t('exportTitle')} title={title} subtitle={subtitle} tone="light" />

        {markets.length > 0 ? (
          <>
            <p className="mt-10 text-center text-5xl font-bold text-gold">{markets.length}+</p>
            <p className="mb-8 text-center text-sm uppercase tracking-widest text-sand-200/70">
              {t('exportTitle')}
            </p>
            <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
              {markets.map((m) => (
                <span
                  key={m.id}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-sand-200"
                >
                  {m.country}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-10 text-center text-sand-200/70">{tc('noItems')}</p>
        )}

        <div className="mt-10 text-center">
          <Link href="/export-markets" className="btn-outline-light">{tc('viewAll')}</Link>
        </div>
      </div>
    </section>
  )
}
