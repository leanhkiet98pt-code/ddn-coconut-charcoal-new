import { getTranslations } from 'next-intl/server'
import { Link } from '../../i18n/navigation'
import { MediaImage } from '../ui/MediaImage'
import type { Product, Category } from '../../payload-types'

// Thẻ sản phẩm dùng ở listing & trang chủ. Link tới trang thông số chi tiết.
export async function ProductCard({ product }: { product: Product }) {
  const t = await getTranslations('common')
  const category = typeof product.category === 'object' ? (product.category as Category) : null

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card group flex flex-col transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-100">
        <MediaImage
          media={product.featuredImage}
          size="card"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {category?.title ? (
          <p className="eyebrow mb-2 text-xs">{category.title}</p>
        ) : null}
        <h3 className="text-lg font-semibold text-ink-900">{product.title}</h3>
        {product.shortDescription ? (
          <p className="mt-2 line-clamp-2 text-sm text-ink-500">{product.shortDescription}</p>
        ) : null}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-700 group-hover:gap-2">
          {t('learnMore')}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
