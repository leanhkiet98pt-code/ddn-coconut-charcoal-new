import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { AppLocale } from '../../../../i18n/routing'
import { buildMetadata } from '../../../../lib/seo'
import { getCertificates } from '../../../../lib/payload'
import { PageHeader } from '../../../../components/ui/PageHeader'
import { CertificateCard } from '../../../../components/cards/CertificateCard'
import { RfqCta } from '../../../../components/sections/RfqCta'
import { safeCatch } from '../../../../lib/utils'

// An toàn dự phòng: tự làm mới tối đa sau 60s thay vì đóng băng từ lúc build trên Vercel.
export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'certificates' })
  return buildMetadata({ locale: locale as AppLocale, path: '/certificates', title: t('title'), description: t('subtitle') })
}

export default async function CertificatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as AppLocale

  const [certs, t, tc] = await Promise.all([
    getCertificates(l).catch(safeCatch('certificates:getCertificates', [])),
    getTranslations('certificates'),
    getTranslations('common'),
  ])

  return (
    <>
      <PageHeader eyebrow={t('title')} title={t('title')} subtitle={t('subtitle')} />

      <section className="section bg-sand">
        <div className="container-content">
          {certs.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {certs.map((c) => (
                <CertificateCard key={c.id} certificate={c} />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-ink-500">{tc('noItems')}</p>
          )}
        </div>
      </section>

      <RfqCta />
    </>
  )
}
