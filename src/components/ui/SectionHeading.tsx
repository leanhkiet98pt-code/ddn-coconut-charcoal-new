import { cn } from '../../lib/utils'

type Props = {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  className?: string
}

// Tiêu đề section dùng chung: eyebrow (vàng) + title + subtitle.
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  tone = 'dark',
  className,
}: Props) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h2 className={cn('text-3xl sm:text-4xl', tone === 'light' && '!text-white')}>{title}</h2>
      {subtitle ? (
        <p className={cn('mt-4 text-lg', tone === 'light' ? 'text-sand-200' : 'text-ink-500')}>
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
