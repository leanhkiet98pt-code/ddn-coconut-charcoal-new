'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '../../lib/utils'

type FaqItem = { question: string; answer: string; id?: string | null }

// FAQ accordion (client). Nhận items đã resolve localized từ server.
export function FaqSection({ title, items }: { title: string; items: FaqItem[] }) {
  const t = useTranslations('home')
  const [open, setOpen] = useState<number | null>(0)

  if (!items || items.length === 0) return null

  return (
    <section className="section bg-sand">
      <div className="container-content max-w-3xl">
        <h2 className="text-center text-3xl sm:text-4xl">{title || t('faqTitle')}</h2>

        <div className="mt-10 divide-y divide-sand-200 rounded-card border border-sand-200 bg-white">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.id ?? i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-semibold text-ink-900">{item.question}</span>
                  <svg
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={cn('shrink-0 text-gold-700 transition', isOpen && 'rotate-180')}
                    aria-hidden
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div className={cn('overflow-hidden px-5 text-ink-500 transition-all', isOpen ? 'max-h-96 pb-5' : 'max-h-0')}>
                  <p className="leading-relaxed">{item.answer}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
