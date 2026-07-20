import { getTranslations } from 'next-intl/server'
import { SectionHeading } from '../ui/SectionHeading'
import { MediaImage } from '../ui/MediaImage'
import type { Home } from '../../payload-types'
import { withFallback } from '../../lib/utils'

// Chuyển link YouTube/Vimeo thường thành URL nhúng (embed). Trả null nếu không nhận diện được.
function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
    return url
  } catch {
    return null
  }
}

export async function FactorySection({ data }: { data: Home['factory'] }) {
  const t = await getTranslations('home')
  const title = withFallback(data?.title ?? '', t('factoryTitle'))
  const subtitle = withFallback(data?.subtitle ?? '', t('factorySubtitle'))
  const embed = data?.videoUrl ? toEmbedUrl(data.videoUrl) : null
  const images = data?.images ?? []

  return (
    <section className="section bg-white">
      <div className="container-content">
        <SectionHeading eyebrow={t('factoryTitle')} title={title} subtitle={subtitle} />

        <div className="mt-12">
          {embed ? (
            <div className="mx-auto aspect-video max-w-4xl overflow-hidden rounded-card border border-sand-200 bg-ink-900">
              <iframe
                src={embed}
                title={title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {images.map((img, i) => (
                <div key={img.id ?? i} className="relative aspect-[4/3] overflow-hidden rounded-card bg-sand-100">
                  <MediaImage media={img.image} size="card" className="h-full w-full object-cover" sizes="(max-width:768px) 50vw, 33vw" />
                </div>
              ))}
            </div>
          ) : (
            // Không có video/ảnh -> ô placeholder trung tính, không vỡ layout
            <div className="mx-auto flex aspect-video max-w-4xl items-center justify-center rounded-card border border-dashed border-sand-300 bg-sand-100 text-ink-400">
              <MediaImage media={null} className="h-full w-full rounded-card" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
