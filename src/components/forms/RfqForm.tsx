'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '../../lib/utils'

const INCOTERMS = ['EXW', 'FOB', 'CFR', 'CIF', 'DAP', 'DDP', 'FCA', 'CPT']

type Status = 'idle' | 'submitting' | 'success' | 'error'

// Form RFQ 11 trường -> POST /api/rfq (lưu Inquiry + gửi email). defaultProduct để prefill từ trang sản phẩm.
export function RfqForm({ defaultProduct = '' }: { defaultProduct?: string }) {
  const t = useTranslations('rfq')
  const locale = useLocale()
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = Object.fromEntries(fd.entries())

    // Kiểm tra client tối thiểu (server cũng kiểm lại).
    const email = String(payload.email ?? '')
    if (!payload.name || !email) {
      setStatus('error')
      setErrorMsg(t('validationRequired'))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
      setErrorMsg(t('validationEmail'))
      return
    }

    setStatus('submitting')
    setErrorMsg('')
    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, locale }),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
      setErrorMsg(t('errorBody'))
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-card border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-ink-900">{t('successTitle')}</h3>
        <p className="mt-2 text-ink-500">{t('successBody')}</p>
      </div>
    )
  }

  const inputCls =
    'w-full rounded-md border border-sand-300 bg-white px-3.5 py-2.5 text-ink-900 shadow-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30 placeholder:text-ink-400'
  const labelCls = 'mb-1.5 block text-sm font-medium text-ink-800'

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t('product')} name="product" placeholder={t('productPlaceholder')} defaultValue={defaultProduct} labelCls={labelCls} inputCls={inputCls} />
        <Field label={t('quantity')} name="quantity" placeholder={t('quantityPlaceholder')} labelCls={labelCls} inputCls={inputCls} />
        <Field label={t('destinationPort')} name="destinationPort" placeholder={t('destinationPortPlaceholder')} labelCls={labelCls} inputCls={inputCls} />
        <div>
          <label htmlFor="rfq-incoterm" className={labelCls}>{t('incoterm')}</label>
          <select id="rfq-incoterm" name="incoterm" className={inputCls} defaultValue="">
            <option value="" disabled>{t('incotermPlaceholder')}</option>
            {INCOTERMS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <Field label={t('packaging')} name="packaging" placeholder={t('packagingPlaceholder')} labelCls={labelCls} inputCls={inputCls} />
        <Field label={t('targetPrice')} name="targetPrice" placeholder={t('targetPricePlaceholder')} labelCls={labelCls} inputCls={inputCls} />
        <Field label={t('name')} name="name" placeholder={t('namePlaceholder')} required labelCls={labelCls} inputCls={inputCls} />
        <Field label={t('company')} name="company" placeholder={t('companyPlaceholder')} labelCls={labelCls} inputCls={inputCls} />
        <Field label={t('emailAddress')} name="email" type="email" placeholder={t('emailPlaceholder')} required labelCls={labelCls} inputCls={inputCls} />
        <Field label={t('phone')} name="phone" placeholder={t('phonePlaceholder')} labelCls={labelCls} inputCls={inputCls} />
      </div>

      <div>
        <label htmlFor="rfq-message" className={labelCls}>{t('message')}</label>
        <textarea id="rfq-message" name="message" rows={4} placeholder={t('messagePlaceholder')} className={inputCls} />
      </div>

      {status === 'error' ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg || t('errorBody')}
        </p>
      ) : null}

      <button type="submit" disabled={status === 'submitting'} className={cn('btn-primary w-full sm:w-auto', status === 'submitting' && 'opacity-70')}>
        {status === 'submitting' ? t('submit') + '…' : t('submit')}
      </button>
    </form>
  )
}

function Field({
  label, name, placeholder, type = 'text', required = false, defaultValue, labelCls, inputCls,
}: {
  label: string; name: string; placeholder?: string; type?: string; required?: boolean
  defaultValue?: string; labelCls: string; inputCls: string
}) {
  const id = `rfq-${name}`
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <input id={id} name={name} type={type} placeholder={placeholder} required={required} defaultValue={defaultValue} className={inputCls} />
    </div>
  )
}
