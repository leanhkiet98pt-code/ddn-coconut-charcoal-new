import { getTranslations } from 'next-intl/server'
import { Link } from '../../i18n/navigation'
import { mainNav } from '../../lib/nav'
import type { Setting } from '../../payload-types'
import { withFallback } from '../../lib/utils'

type Props = {
  settings: Setting | null
  companyName: string
}

// Footer: giới thiệu ngắn, quick links, liên hệ, pháp nhân, bản quyền.
export async function Footer({ settings, companyName }: Props) {
  const t = await getTranslations('footer')
  const tn = await getTranslations('nav')
  const year = new Date().getFullYear()

  const tagline = withFallback(settings?.tagline ?? '', t('tagline'))
  const salesEmail = settings?.salesEmail ?? ''
  const phone = settings?.phone ?? ''
  const whatsapp = settings?.whatsappNumber ?? ''
  const businessCode = settings?.legalEntity?.businessCode ?? ''
  const taxCode = settings?.legalEntity?.taxCode ?? ''
  const offices = settings?.offices ?? []

  return (
    <footer className="mt-auto bg-ink-900 text-sand-200">
      <div className="container-content grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Cột 1: brand + tagline */}
        <div className="lg:col-span-1">
          <p className="text-lg font-bold text-white">{companyName}</p>
          <p className="mt-3 text-sm leading-relaxed text-sand-200/80">{tagline}</p>
        </div>

        {/* Cột 2: quick links */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">{t('quickLinks')}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {mainNav.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className="text-sand-200/80 transition hover:text-white">
                  {tn(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3: liên hệ */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">{t('contact')}</p>
          <ul className="mt-4 space-y-2 text-sm text-sand-200/80">
            {salesEmail ? (
              <li>
                <a href={`mailto:${salesEmail}`} className="transition hover:text-white">{salesEmail}</a>
              </li>
            ) : null}
            {phone ? <li>{phone}</li> : null}
            {whatsapp ? (
              <li>
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  WhatsApp: {whatsapp}
                </a>
              </li>
            ) : null}
          </ul>
        </div>

        {/* Cột 4: pháp nhân + văn phòng */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">{t('company')}</p>
          <ul className="mt-4 space-y-2 text-sm text-sand-200/80">
            {offices.map((o, i) => (
              <li key={i}>
                {o.label ? <span className="font-medium text-sand-200">{o.label}: </span> : null}
                {o.address}
              </li>
            ))}
            {businessCode ? <li>{t('legalInfo')}: {businessCode}</li> : null}
            {taxCode ? <li>{t('taxInfo')}: {taxCode}</li> : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-content flex flex-col items-center justify-between gap-2 py-6 text-xs text-sand-200/60 sm:flex-row">
          <p>© {year} {companyName}. {t('rightsReserved')}</p>
        </div>
      </div>
    </footer>
  )
}
