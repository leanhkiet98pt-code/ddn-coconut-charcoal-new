import { getTranslations } from 'next-intl/server'
import { Link } from '../../i18n/navigation'
import { MediaImage } from '../ui/MediaImage'
import type { Home, Setting } from '../../payload-types'
import { withFallback } from '../../lib/utils'

type Props = { hero: Home['hero']; settings: Setting | null }

// Hero trang chủ: nền tối, ảnh nền tùy chọn, kicker + tiêu đề + 2 CTA + "since 20XX".
export async function Hero({ hero, settings }: Props) {
  const t = await getTranslations('home')
  const kicker = withFallback(hero?.kicker ?? '', t('heroKicker'))
  const title = withFallback(hero?.title ?? '', t('heroTitle'))
  const subtitle = withFallback(hero?.subtitle ?? '', t('heroSubtitle'))
  const ctaPrimary = withFallback(hero?.ctaPrimaryLabel ?? '', t('heroCtaPrimary'))
  const ctaSecondary = withFallback(hero?.ctaSecondaryLabel ?? '', t('heroCtaSecondary'))
  const foundedYear = settings?.foundedYear

  return (
    <section className="relative isolate overflow-hidden bg-ink-900 text-white">
      {/* Ảnh nền (tùy chọn) + lớp phủ tối để chữ luôn đọc được */}
      {hero?.backgroundImage ? (
        <>
          <div className="absolute inset-0 -z-10">
            <MediaImage
              media={hero.backgroundImage}
              size="feature"
              className="h-full w-full object-cover"
              sizes="100vw"
              priority
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-ink-900/75" />
        </>
      ) : (
        // Không có ảnh -> nền gradient than + đốm vàng, không cần ảnh giả
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(230,164,0,0.18),transparent_55%)]" />
      )}

      <div className="container-content py-24 sm:py-32 lg:py-40">
        <div className="max-w-3xl">
          <p className="eyebrow !text-gold-400">{kicker}</p>
          <h1 className="mt-4 text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg text-sand-200/90">{subtitle}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/contact" className="btn-primary">{ctaPrimary}</Link>
            <Link href="/products" className="btn-outline-light">{ctaSecondary}</Link>
          </div>

          {foundedYear ? (
            <p className="mt-8 text-sm text-sand-200/70">
              {t('since')} {foundedYear}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
