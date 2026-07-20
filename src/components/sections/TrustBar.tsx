import { getTranslations } from 'next-intl/server'
import type { Setting } from '../../payload-types'

// Dải số liệu uy tín dưới hero. Chỉ hiện ô nào có dữ liệu trong Settings.
export async function TrustBar({ settings }: { settings: Setting | null }) {
  const t = await getTranslations('trustBar')
  const tb = settings?.trustBar

  const items = [
    { value: tb?.containersPerMonth, label: t('containersPerMonth') },
    { value: tb?.countries, label: t('countries') },
    { value: tb?.yearsExporting, label: t('yearsExporting') },
    { value: tb?.certsNote, label: t('certifications') },
  ].filter((i) => i.value && String(i.value).trim().length > 0)

  if (items.length === 0) return null

  return (
    <div className="border-y border-sand-200 bg-white">
      <div className="container-content grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
        {items.map((item, i) => (
          <div key={i} className="text-center">
            <p className="text-2xl font-bold text-ink-900 sm:text-3xl">{item.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-500 sm:text-sm">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
