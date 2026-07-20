import { MediaImage } from '../ui/MediaImage'
import { isMedia, isPdf, mediaUrl } from '../../lib/media'
import type { Certificate } from '../../payload-types'

// Thẻ chứng chỉ. File ảnh -> hiện thumbnail; file PDF -> icon tài liệu. Có file -> click mở.
export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const file = certificate.file
  const url = isMedia(file) ? mediaUrl(file) : null
  const pdf = isPdf(file)

  const inner = (
    <>
      <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-sand-100">
        {pdf ? (
          <div className="flex flex-col items-center gap-2 text-gold-700">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
            <span className="text-xs font-semibold uppercase">PDF</span>
          </div>
        ) : (
          <MediaImage media={file} size="card" className="h-full w-full object-contain p-3" sizes="25vw" />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-ink-900">{certificate.title}</h3>
        {certificate.type ? <p className="mt-1 text-xs text-ink-500">{certificate.type}</p> : null}
      </div>
    </>
  )

  const className = 'card group flex flex-col transition hover:-translate-y-1 hover:shadow-md'

  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <div className={className}>{inner}</div>
  )
}
