'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '../../lib/utils'

const INCOTERMS = ['EXW', 'FOB', 'CFR', 'CIF', 'DAP', 'DDP', 'FCA', 'CPT']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SESSION_KEY = 'rfq_session_id'

type Status = 'idle' | 'submitting' | 'success' | 'error'
type SaveState = 'idle' | 'saving' | 'saved' | 'error'

// Lấy/tạo sessionId lưu trong sessionStorage: 1 tab = 1 phiên, reload vẫn giữ nguyên.
function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = (crypto.randomUUID?.() ?? `s-${Date.now()}-${Math.random().toString(36).slice(2)}`)
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return `s-${Date.now()}`
  }
}

/**
 * Form RFQ có AUTOSAVE: khách gõ -> tự lưu (debounce 1.5s) 1 bản ghi Inquiry theo sessionId.
 * Đủ điều kiện (email hợp lệ + product + quantity) -> server gửi 1 email cho sales.
 * Nút "Submit" chỉ để xác nhận HOÀN TẤT (không bắt buộc để thu lead).
 */
export function RfqForm({ defaultProduct = '' }: { defaultProduct?: string }) {
  const t = useTranslations('rfq')
  const locale = useLocale()
  const formRef = useRef<HTMLFormElement>(null)
  const sessionIdRef = useRef<string>('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')

  useEffect(() => {
    sessionIdRef.current = getSessionId()
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  function collect(): Record<string, string> | null {
    const form = formRef.current
    if (!form) return null
    return Object.fromEntries(new FormData(form).entries()) as Record<string, string>
  }

  // Gửi autosave (chỉ khi đã có email hợp lệ hoặc phone -> tránh ghi rác).
  async function autosave() {
    if (status === 'success' || status === 'submitting') return
    const obj = collect()
    if (!obj) return
    const emailOk = EMAIL_RE.test(obj.email ?? '')
    const hasPhone = (obj.phone ?? '').trim().length >= 5
    if (!emailOk && !hasPhone) return // chưa đủ để lưu -> im lặng

    setSaveState('saving')
    try {
      const res = await fetch('/api/rfq/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...obj, sessionId: sessionIdRef.current, sourcePage: getPath(), locale }),
      })
      const data = (await res.json().catch(() => ({}))) as { saved?: boolean }
      setSaveState(res.ok && data.saved ? 'saved' : res.ok ? 'idle' : 'error')
    } catch {
      setSaveState('error')
    }
  }

  function onChange() {
    if (status === 'success') return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(autosave, 1500)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const obj = collect()
    if (!obj) return

    const email = obj.email ?? ''
    if (!obj.name || !email) {
      setStatus('error')
      setErrorMsg(t('validationRequired'))
      return
    }
    if (!EMAIL_RE.test(email)) {
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
        body: JSON.stringify({ ...obj, sessionId: sessionIdRef.current, sourcePage: getPath(), locale }),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
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
    <form ref={formRef} onSubmit={onSubmit} onChange={onChange} noValidate className="space-y-5">
      {/* Honeypot chống bot — ẩn với người dùng thật; bot điền -> server bỏ qua. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

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

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button type="submit" disabled={status === 'submitting'} className={cn('btn-primary', status === 'submitting' && 'opacity-70')}>
          {status === 'submitting' ? t('submit') + '…' : t('submitComplete')}
        </button>
        <SaveIndicator note={t('autosaveNote')} saveState={saveState} labels={{ saving: t('saving'), saved: t('saved'), error: t('savedError') }} />
      </div>
    </form>
  )
}

// Đường dẫn trang hiện tại (để lưu sourcePage). An toàn khi SSR.
function getPath(): string {
  try {
    return window.location.pathname
  } catch {
    return ''
  }
}

// Dòng minh bạch "tự lưu" + chỉ báo trạng thái lưu.
function SaveIndicator({
  note, saveState, labels,
}: {
  note: string; saveState: SaveState; labels: { saving: string; saved: string; error: string }
}) {
  return (
    <p className="flex items-center gap-2 text-xs text-ink-500" aria-live="polite">
      {saveState === 'saving' ? (
        <span className="inline-flex items-center gap-1 text-ink-600">
          <span className="h-2 w-2 animate-pulse rounded-full bg-gold" /> {labels.saving}
        </span>
      ) : saveState === 'saved' ? (
        <span className="inline-flex items-center gap-1 text-green-700">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden><path d="M20 6L9 17l-5-5" /></svg>
          {labels.saved}
        </span>
      ) : saveState === 'error' ? (
        <span className="text-amber-700">{labels.error}</span>
      ) : null}
      <span className="text-ink-400">· {note}</span>
    </p>
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
