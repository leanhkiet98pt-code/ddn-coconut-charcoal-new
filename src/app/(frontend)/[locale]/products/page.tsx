import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { AppLocale } from '../../../../i18n/routing'
import { buildMetadata } from '../../../../lib/seo'
import { Link } from '../../../../i18n/navigation'
import { getProducts, getCategories } from '../../../../lib/payload'
import { PageHeader } from '../../../../components/ui/PageHeader'
import { ProductCard } from '../../../../components/cards/ProductCard'
import { RfqCta } from '../../../../components/sections/RfqCta'
import { cn } from '../../../../lib/utils'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'products' })
  return buildMetadata({ locale: locale as AppLocale, path: '/products', title: t('title'), description: t('subtitle') })
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { category } = await searchParams
  setRequestLocale(locale)
  const l = locale as AppLocale

  const [products, categories, t, tc] = await Promise.all([
    getProducts(l, category).catch(() => []),
    getCategories(l).catch(() => []),
    getTranslations('products'),
    getTranslations('common'),
  ])

  return (
    <>
      <PageHeader eyebrow={t('title')} title={t('title')} subtitle={t('subtitle')} />

      <section className="section bg-sand">
        <div className="container-content">
          {/* Bộ lọc theo dòng sản phẩm */}
          {categories.length > 0 ? (
            <div className="mb-10 flex flex-wrap gap-2">
              <Link
                href="/products"
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition',
                  !category ? 'border-gold bg-gold text-ink-900' : 'border-sand-300 bg-white text-ink-700 hover:border-ink-400',
                )}
              >
                {tc('allCategories')}
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-medium transition',
                    category === c.slug ? 'border-gold bg-gold text-ink-900' : 'border-sand-300 bg-white text-ink-700 hover:border-ink-400',
                  )}
                >
                  {c.title}
                </Link>
              ))}
            </div>
          ) : null}

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-ink-500">{tc('noItems')}</p>
          )}
        </div>
      </section>

      <RfqCta />
    </>
  )
}
