'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '../../i18n/navigation'
import { mainNav } from '../../lib/nav'
import { cn } from '../../lib/utils'
import { LanguageSwitcher } from './LanguageSwitcher'

type Props = {
  companyName: string
  logoUrl: string | null
}

// Header: logo + menu + language switcher + CTA. Client để xử lý menu mobile & active state.
export function Header({ companyName, logoUrl }: Props) {
  const t = useTranslations('nav')
  const pathname = usePathname() // không kèm locale
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-white/95 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between gap-4 lg:h-20">
        {/* Logo / tên công ty */}
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={companyName}>
          {logoUrl ? (
            <Image src={logoUrl} alt={companyName} width={160} height={48} className="h-9 w-auto object-contain lg:h-11" priority />
          ) : (
            <span className="text-lg font-bold tracking-tight text-ink-900 lg:text-xl">
              {companyName}
            </span>
          )}
        </Link>

        {/* Menu desktop */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {mainNav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="nav-link"
              data-active={isActive(item.href)}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Bên phải: switcher + CTA (desktop) */}
        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher tone="dark" />
          <Link href="/contact" className="btn-primary !px-4 !py-2 text-sm">
            {t('requestQuote')}
          </Link>
        </div>

        {/* Nút menu mobile */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-ink-800 lg:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Menu mobile mở rộng */}
      <div className={cn('lg:hidden', open ? 'block' : 'hidden')}>
        <nav className="container-content flex flex-col gap-1 border-t border-sand-200 py-4" aria-label="Mobile">
          {mainNav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'rounded-md px-3 py-2 text-base font-medium',
                isActive(item.href) ? 'bg-sand-100 text-ink-900' : 'text-ink-700',
              )}
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="mt-3 flex items-center justify-between border-t border-sand-200 pt-4">
            <LanguageSwitcher tone="dark" />
            <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary !px-4 !py-2 text-sm">
              {t('requestQuote')}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
