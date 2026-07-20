import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations, getFormatter } from 'next-intl/server'
import type { AppLocale } from '../../../../../i18n/routing'
import { Link } from '../../../../../i18n/navigation'
import { getPostBySlug } from '../../../../../lib/payload'
import { mediaUrl } from '../../../../../lib/media'
import { buildMetadata } from '../../../../../lib/seo'
import { MediaImage } from '../../../../../components/ui/MediaImage'
import { RichText } from '../../../../../components/ui/RichText'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPostBySlug(slug, locale as AppLocale).catch(() => null)
  if (!post) return {}
  const img = mediaUrl(post.coverImage, 'feature')
  return buildMetadata({
    locale: locale as AppLocale,
    path: `/blog/${post.slug}`,
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt || undefined,
    images: img ? [img] : undefined,
  })
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const l = locale as AppLocale

  const post = await getPostBySlug(slug, l).catch(() => null)
  if (!post) notFound()

  const [tc, format] = await Promise.all([getTranslations('common'), getFormatter()])
  const date = post.publishedDate ? format.dateTime(new Date(post.publishedDate), { dateStyle: 'long' }) : null

  return (
    <article className="bg-white">
      <div className="container-content max-w-3xl py-12">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          {tc('backToBlog')}
        </Link>

        <header className="mt-6">
          {date ? <p className="text-sm font-medium uppercase tracking-wide text-gold-700">{date}</p> : null}
          <h1 className="mt-2 text-3xl sm:text-4xl">{post.title}</h1>
          {post.excerpt ? <p className="mt-4 text-lg text-ink-600">{post.excerpt}</p> : null}
        </header>

        {post.coverImage ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-card bg-sand-100">
            <MediaImage media={post.coverImage} size="feature" className="h-full w-full object-cover" sizes="(max-width:768px) 100vw, 768px" priority placeholderLabel={tc('imageComingSoon')} />
          </div>
        ) : null}

        <div className="mt-10">
          {post.richContent ? <RichText data={post.richContent} /> : <p className="text-ink-500">{tc('contentComingSoon')}</p>}
        </div>
      </div>
    </article>
  )
}
