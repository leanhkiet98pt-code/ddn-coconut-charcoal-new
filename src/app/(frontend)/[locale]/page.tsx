import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { AppLocale } from '../../../i18n/routing'
import { buildMetadata } from '../../../lib/seo'
import {
  getHome,
  getSettings,
  getCategories,
  getProducts,
  getCertificates,
  getExportMarkets,
} from '../../../lib/payload'
import { Hero } from '../../../components/sections/Hero'
import { TrustBar } from '../../../components/sections/TrustBar'
import { ProductGroups } from '../../../components/sections/ProductGroups'
import { FactorySection } from '../../../components/sections/FactorySection'
import { CertificatesSection } from '../../../components/sections/CertificatesSection'
import { ExportMapSection } from '../../../components/sections/ExportMapSection'
import { BuyingProcess } from '../../../components/sections/BuyingProcess'
import { FaqSection } from '../../../components/sections/FaqSection'
import { RfqCta } from '../../../components/sections/RfqCta'
import { withFallback, safeCatch } from '../../../lib/utils'

// An toàn dự phòng: nếu revalidatePath (hook afterChange của Home/Settings/...) không tới kịp,
// trang chủ vẫn tự làm mới tối đa sau 60s thay vì đóng băng từ lúc build trên Vercel.
export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  // title=null -> dùng title mặc định của layout; vẫn set canonical + hreflang.
  return buildMetadata({ locale: locale as AppLocale, path: '', title: null, description: t('defaultDescription') })
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as AppLocale

  // Kéo toàn bộ dữ liệu song song để trang tải nhanh.
  const [home, settings, categories, products, certificates, markets, t] = await Promise.all([
    getHome(l).catch(safeCatch('home:getHome', null)),
    getSettings(l).catch(safeCatch('home:getSettings', null)),
    getCategories(l).catch(safeCatch('home:getCategories', [])),
    getProducts(l).catch(safeCatch('home:getProducts', [])),
    getCertificates(l).catch(safeCatch('home:getCertificates', [])),
    getExportMarkets(l).catch(safeCatch('home:getExportMarkets', [])),
    getTranslations('home'),
  ])

  // Section bật khi enabled !== false (mặc định bật kể cả khi chưa cấu hình Home).
  const on = (s?: { enabled?: boolean | null }) => s?.enabled !== false

  return (
    <>
      {on(home?.hero) && <Hero hero={home?.hero} settings={settings} />}
      {on(home?.trustBar) && <TrustBar settings={settings} />}
      {on(home?.productGroups) && (
        <ProductGroups data={home?.productGroups} categories={categories} products={products} />
      )}
      {on(home?.factory) && <FactorySection data={home?.factory} />}
      {on(home?.certificates) && (
        <CertificatesSection data={home?.certificates} certificates={certificates} />
      )}
      {on(home?.exportMap) && <ExportMapSection data={home?.exportMap} markets={markets} />}
      {on(home?.buyingProcess) && <BuyingProcess data={home?.buyingProcess} />}
      {on(home?.faq) && (
        <FaqSection
          title={withFallback(home?.faq?.title ?? '', t('faqTitle'))}
          items={home?.faq?.items ?? []}
        />
      )}
      {on(home?.rfqCta) && <RfqCta data={home?.rfqCta} />}
    </>
  )
}
