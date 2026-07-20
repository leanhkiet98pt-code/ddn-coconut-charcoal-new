import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

// Deep-merge để chuỗi UI chưa dịch (ko/ja) tự fallback về tiếng Anh, không để trống.
type Dict = { [k: string]: string | Dict }
function deepMerge(base: Dict, override: Dict): Dict {
  const out: Dict = { ...base }
  for (const key of Object.keys(override)) {
    const b = base[key]
    const o = override[key]
    if (typeof b === 'object' && typeof o === 'object' && b && o) {
      out[key] = deepMerge(b as Dict, o as Dict)
    } else {
      out[key] = o
    }
  }
  return out
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  // Nạp tiếng Anh làm nền, rồi phủ bản dịch locale hiện tại lên trên.
  const en = (await import('../messages/en.json')).default as Dict
  const messages =
    locale === 'en'
      ? en
      : deepMerge(en, (await import(`../messages/${locale}.json`)).default as Dict)

  return { locale, messages }
})
