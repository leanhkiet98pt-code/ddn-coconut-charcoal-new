import { Link } from '../../i18n/navigation'
import { MediaImage } from '../ui/MediaImage'
import type { Category } from '../../payload-types'

// Thẻ dòng sản phẩm (category) trên trang chủ. Link tới listing lọc theo category.
export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="card group relative flex aspect-[4/5] flex-col justify-end overflow-hidden"
    >
      <MediaImage
        media={category.image}
        size="card"
        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-transparent" />
      <div className="relative p-5">
        <h3 className="text-lg font-bold text-white">{category.title}</h3>
        {category.shortDescription ? (
          <p className="mt-1 line-clamp-2 text-sm text-sand-200/90">{category.shortDescription}</p>
        ) : null}
      </div>
    </Link>
  )
}
