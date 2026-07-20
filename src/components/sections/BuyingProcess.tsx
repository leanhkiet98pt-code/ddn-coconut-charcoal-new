import { getTranslations } from 'next-intl/server'
import { SectionHeading } from '../ui/SectionHeading'
import type { Home } from '../../payload-types'
import { withFallback } from '../../lib/utils'

// Quy trình mua hàng — các bước đánh số. Dữ liệu từ Home.buyingProcess.steps.
export async function BuyingProcess({ data }: { data: Home['buyingProcess'] }) {
  const t = await getTranslations('home')
  const title = withFallback(data?.title ?? '', t('processTitle'))
  const subtitle = withFallback(data?.subtitle ?? '', t('processSubtitle'))
  const steps = data?.steps ?? []

  if (steps.length === 0) return null

  return (
    <section className="section bg-white">
      <div className="container-content">
        <SectionHeading eyebrow={t('processTitle')} title={title} subtitle={subtitle} />

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.id ?? i} className="relative rounded-card border border-sand-200 bg-sand-50 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-lg font-bold text-ink-900">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink-900">{step.title}</h3>
              {step.description ? (
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.description}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
