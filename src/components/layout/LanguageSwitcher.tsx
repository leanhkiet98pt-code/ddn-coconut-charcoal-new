'use client'

import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '../../i18n/navigation'
import { routing } from '../../i18n/routing'
import { cn } from '../../lib/utils'

/**
 * Chuyển ngôn ngữ EN / KO / JP. Giữ nguyên đường dẫn hiện tại, chỉ đổi locale.
 */
export function LanguageSwitcher({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const t = useTranslations('languageSwitcher')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function switchTo(next: string) {
    if (next === locale) return
    startTransition(() => {
      // usePathname từ next-intl trả path KHÔNG kèm locale -> chỉ cần đặt locale mới.
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <div
      className={cn('flex items-center gap-1 text-sm font-medium', isPending && 'opacity-60')}
      role="group"
      aria-label={t('label')}
    >
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center">
          {i > 0 && <span className={tone === 'light' ? 'text-white/30' : 'text-ink-400'}>/</span>}
          <button
            type="button"
            onClick={() => switchTo(loc)}
            aria-current={loc === locale ? 'true' : undefined}
            className={cn(
              'px-1.5 py-1 transition',
              loc === locale
                ? 'font-bold text-gold'
                : tone === 'light'
                  ? 'text-white/70 hover:text-white'
                  : 'text-ink-500 hover:text-ink-900',
            )}
          >
            {t(loc as 'en' | 'ko' | 'ja')}
          </button>
        </span>
      ))}
    </div>
  )
}
