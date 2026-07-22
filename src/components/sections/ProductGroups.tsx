import { getTranslations } from 'next-intl/server'
import { Link } from '../../i18n/navigation'
import { SectionHeading } from '../ui/SectionHeading'
import { ProductCard } from '../cards/ProductCard'
import type { Home, Product } from '../../payload-types'
import { withFallback } from '../../lib/utils'

type Props = {
  data: Home['productGroups']
  /** Đã resolve sẵn ở page.tsx: ưu tiên featuredProducts admin chọn, fallback 4 sản phẩm đầu. */
  products: Product[]
}

/** Section "Product Groups" trên trang chủ — hiển thị đúng các sản phẩm đã chọn (giữ thứ tự). */
export async function ProductGroups({ data, products }: Props) {
  const t = await getTranslations('home')
  const tc = await getTranslations('common')
  const title = withFallback(data?.title ?? '', t('productGroupsTitle'))
  const subtitle = withFallback(data?.subtitle ?? '', t('productGroupsSubtitle'))

  return (
    <section className="section bg-sand">
      <div className="container-content">
        <SectionHeading eyebrow={t('productGroupsTitle')} title={title} subtitle={subtitle} />

        <div className="mt-12">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
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
