import { getTranslations } from 'next-intl/server'
import { Link } from '../../i18n/navigation'
import { SectionHeading } from '../ui/SectionHeading'
import { CertificateCard } from '../cards/CertificateCard'
import type { Home, Certificate } from '../../payload-types'
import { withFallback } from '../../lib/utils'

type Props = { data: Home['certificates']; certificates: Certificate[] }

export async function CertificatesSection({ data, certificates }: Props) {
  const t = await getTranslations('home')
  const tc = await getTranslations('common')
  const title = withFallback(data?.title ?? '', t('certificatesTitle'))
  const subtitle = withFallback(data?.subtitle ?? '', t('certificatesSubtitle'))

  return (
    <section className="section bg-sand">
      <div className="container-content">
        <SectionHeading eyebrow={t('certificatesTitle')} title={title} subtitle={subtitle} />

        <div className="mt-12">
          {certificates.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {certificates.slice(0, 8).map((c) => (
                <CertificateCard key={c.id} certificate={c} />
              ))}
            </div>
          ) : (
            <p className="text-center text-ink-500">{tc('noItems')}</p>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link href="/certificates" className="btn-outline-dark">{tc('viewAll')}</Link>
        </div>
      </div>
    </section>
  )
}
