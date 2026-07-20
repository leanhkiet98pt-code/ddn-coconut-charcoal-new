import { getTranslations } from 'next-intl/server'
import { Link } from '../../i18n/navigation'
import { SectionHeading } from '../ui/SectionHeading'
import { CategoryCard } from '../cards/CategoryCard'
import { ProductCard } from '../cards/ProductCard'
import type { Home, Category, Product } from '../../payload-types'
import { withFallback } from '../../lib/utils'

type Props = {
  data: Home['productGroups']
  categories: Category[]
  products: Product[]
}

/**
 * Section "Product Groups" trên trang chủ.
 * Ưu tiên hiển thị category; nếu chưa có category thì fallback hiển thị vài product.
 */
export async function ProductGroups({ data, categories, products }: Props) {
  const t = await getTranslations('home')
  const tc = await getTranslations('common')
  const title = withFallback(data?.title ?? '', t('productGroupsTitle'))
  const subtitle = withFallback(data?.subtitle ?? '', t('productGroupsSubtitle'))

  const hasCategories = categories.length > 0

  return (
    <section className="section bg-sand">
      <div className="container-content">
        <SectionHeading eyebrow={t('productGroupsTitle')} title={title} subtitle={subtitle} />

        <div className="mt-12">
          {hasCategories ? (
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {categories.map((c) => (
                <CategoryCard key={c.id} category={c} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-center text-ink-500">{tc('noItems')}</p>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link href="/products" className="btn-outline-dark">{tc('viewAllProducts')}</Link>
        </div>
      </div>
    </section>
  )
}
