import { getTranslations } from 'next-intl/server'
import { Link } from '../../i18n/navigation'
import type { Home } from '../../payload-types'
import { withFallback } from '../../lib/utils'

// Dải kêu gọi gửi RFQ (dùng ở cuối trang chủ & một số trang khác).
export async function RfqCta({ data }: { data?: Home['rfqCta'] }) {
  const t = await getTranslations('home')
  const title = withFallback(data?.title ?? '', t('ctaTitle'))
  const subtitle = withFallback(data?.subtitle ?? '', t('ctaSubtitle'))
  const button = withFallback(data?.buttonLabel ?? '', t('ctaButton'))

  return (
    <section className="bg-gold">
      <div className="container-content flex flex-col items-center gap-6 py-14 text-center lg:flex-row lg:justify-between lg:text-left">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">{title}</h2>
          <p className="mt-2 text-ink-800/80">{subtitle}</p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-ink-900 px-8 py-4 font-semibold text-white shadow-sm transition hover:bg-ink-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2 focus-visible:ring-offset-gold"
        >
          {button}
        </Link>
      </div>
    </section>
  )
}
