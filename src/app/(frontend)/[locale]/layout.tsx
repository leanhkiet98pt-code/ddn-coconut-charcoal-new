import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Inter, Sora } from 'next/font/google'
import { routing, type AppLocale } from '../../../i18n/routing'
import { getSettings } from '../../../lib/payload'
import { mediaUrl } from '../../../lib/media'
import { withFallback, safeCatch } from '../../../lib/utils'
import { SITE_URL } from '../../../lib/seo'
import { buildOrganizationSchema } from '../../../lib/schema'
import { Header } from '../../../components/layout/Header'
import { Footer } from '../../../components/layout/Footer'
import { WhatsAppFloat } from '../../../components/layout/WhatsAppFloat'
import { JsonLd } from '../../../components/seo/JsonLd'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const sora = Sora({ subsets: ['latin'], variable: '--font-display', display: 'swap' })

// Sinh sẵn 3 locale để render tĩnh.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// An toàn dự phòng: nếu vì lý do gì đó revalidatePath (hook afterChange) không chạy tới,
// trang vẫn tự làm mới tối đa sau 60s thay vì đóng băng vĩnh viễn từ lúc build trên Vercel.
export const revalidate = 60

// Metadata gốc: metadataBase (cho canonical/hreflang tương đối), title template, mô tả mặc định.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  const settings = await getSettings(locale as AppLocale).catch(safeCatch('layout.generateMetadata:getSettings', null))
  const siteName = withFallback(settings?.companyName ?? '', t('defaultTitle'))
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: siteName, template: `%s | ${siteName}` },
    description: t('defaultDescription'),
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Locale không hợp lệ -> 404.
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as AppLocale
  const settings = await getSettings(typedLocale).catch(safeCatch('layout:getSettings', null))
  const companyName = withFallback(settings?.companyName ?? '', 'Charcoal Export Co.')
  const logoUrl = mediaUrl(settings?.logo)

  return (
    <html lang={locale} className={`${inter.variable} ${sora.variable}`}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <Header companyName={companyName} logoUrl={logoUrl} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} companyName={companyName} />
          <WhatsAppFloat number={settings?.whatsappNumber} />
        </NextIntlClientProvider>
        {/* Structured data: Organization (toàn site) */}
        <JsonLd data={buildOrganizationSchema(settings, companyName)} />
      </body>
    </html>
  )
}
