import { getFormatter, getTranslations } from 'next-intl/server'
import { Link } from '../../i18n/navigation'
import { MediaImage } from '../ui/MediaImage'
import type { Post } from '../../payload-types'

// Thẻ bài blog.
export async function PostCard({ post }: { post: Post }) {
  const format = await getFormatter()
  const t = await getTranslations('common')
  const date = post.publishedDate ? format.dateTime(new Date(post.publishedDate), { dateStyle: 'medium' }) : null

  return (
    <Link href={`/blog/${post.slug}`} className="card group flex flex-col transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden bg-sand-100">
        <MediaImage media={post.coverImage} size="card" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {date ? <p className="text-xs font-medium uppercase tracking-wide text-gold-700">{date}</p> : null}
        <h3 className="mt-2 text-lg font-semibold text-ink-900">{post.title}</h3>
        {post.excerpt ? <p className="mt-2 line-clamp-3 text-sm text-ink-500">{post.excerpt}</p> : null}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-700 group-hover:gap-2">
          {t('readMore')}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
