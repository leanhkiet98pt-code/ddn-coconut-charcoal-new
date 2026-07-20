import { useTranslations } from 'next-intl'
import { Link } from '../../../i18n/navigation'

// 404 trong phạm vi locale (render bên trong layout, có Header/Footer).
export default function NotFound() {
  const t = useTranslations('notFound')
  return (
    <section className="container-content flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl font-bold text-gold">404</p>
      <h1 className="mt-4 text-2xl">{t('title')}</h1>
      <p className="mt-2 text-ink-500">{t('body')}</p>
      <Link href="/" className="btn-primary mt-8">{t('backHome')}</Link>
    </section>
  )
}
