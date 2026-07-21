import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { AppLocale } from '../../../../i18n/routing'
import { buildMetadata } from '../../../../lib/seo'
import { getPosts } from '../../../../lib/payload'
import { PageHeader } from '../../../../components/ui/PageHeader'
import { PostCard } from '../../../../components/cards/PostCard'
import { safeCatch } from '../../../../lib/utils'

// An toàn dự phòng: tự làm mới tối đa sau 60s thay vì đóng băng từ lúc build trên Vercel.
export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  return buildMetadata({ locale: locale as AppLocale, path: '/blog', title: t('title'), description: t('subtitle') })
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as AppLocale

  const [posts, t, tc] = await Promise.all([
    getPosts(l).catch(safeCatch('blog:getPosts', [])),
    getTranslations('blog'),
    getTranslations('common'),
  ])

  return (
    <>
      <PageHeader eyebrow={t('title')} title={t('title')} subtitle={t('subtitle')} />

      <section className="section bg-sand">
        <div className="container-content">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-ink-500">{tc('noItems')}</p>
          )}
        </div>
      </section>
    </>
  )
}
