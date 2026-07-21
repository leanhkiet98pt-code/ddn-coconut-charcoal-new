import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { AppLocale } from '../../../../i18n/routing'
import { buildMetadata } from '../../../../lib/seo'
import { getSettings } from '../../../../lib/payload'
import { PageHeader } from '../../../../components/ui/PageHeader'
import { RfqForm } from '../../../../components/forms/RfqForm'
import { safeCatch } from '../../../../lib/utils'

// An toàn dự phòng: tự làm mới tối đa sau 60s thay vì đóng băng từ lúc build trên Vercel.
export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return buildMetadata({ locale: locale as AppLocale, path: '/contact', title: t('title'), description: t('subtitle') })
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as AppLocale

  const [settings, t, tr] = await Promise.all([
    getSettings(l).catch(safeCatch('contact:getSettings', null)),
    getTranslations('contact'),
    getTranslations('rfq'),
  ])

  const email = settings?.salesEmail ?? ''
  const phone = settings?.phone ?? ''
  const whatsapp = settings?.whatsappNumber ?? ''
  const offices = settings?.offices ?? []

  return (
    <>
      <PageHeader eyebrow={t('formTitle')} title={t('title')} subtitle={t('subtitle')} />

      <section className="section bg-sand">
        <div className="container-content grid gap-10 lg:grid-cols-3">
          {/* Cột thông tin liên hệ */}
          <aside className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-ink-900">{t('infoTitle')}</h2>
            <ul className="mt-6 space-y-5 text-sm">
              {email ? (
                <li>
                  <p className="text-ink-500">{t('email')}</p>
                  <a href={`mailto:${email}`} className="font-medium text-ink-900 hover:text-gold-700">{email}</a>
                </li>
              ) : null}
              {phone ? (
                <li>
                  <p className="text-ink-500">{t('phone')}</p>
                  <p className="font-medium text-ink-900">{phone}</p>
                </li>
              ) : null}
              {whatsapp ? (
                <li>
                  <p className="text-ink-500">{t('whatsapp')}</p>
                  <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-medium text-ink-900 hover:text-gold-700">{whatsapp}</a>
                </li>
              ) : null}
              {offices.map((o, i) => (
                <li key={i}>
                  <p className="text-ink-500">{o.label || t('address')}</p>
                  <p className="font-medium text-ink-900">{o.address}</p>
                </li>
              ))}
            </ul>
          </aside>

          {/* Form RFQ */}
          <div className="lg:col-span-2">
            <div className="rounded-card border border-sand-200 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-ink-900">{tr('submit')}</h2>
              <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>
              <div className="mt-6">
                <RfqForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
