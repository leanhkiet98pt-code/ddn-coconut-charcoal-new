import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { cn } from '../../lib/utils'

// Render nội dung richText (Lexical) của Payload thành HTML, kèm style prose cơ bản.
export function RichText({ data, className }: { data: unknown; className?: string }) {
  if (!data || typeof data !== 'object') return null
  return (
    <div
      className={cn(
        'prose-charcoal max-w-none',
        '[&_h2]:mt-8 [&_h2]:text-2xl [&_h3]:mt-6 [&_h3]:text-xl',
        '[&_p]:my-4 [&_p]:leading-relaxed [&_p]:text-ink-700',
        '[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6',
        '[&_li]:my-1 [&_a]:text-gold-700 [&_a]:underline [&_strong]:font-semibold',
        '[&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:italic',
        className,
      )}
    >
      <LexicalRichText data={data as SerializedEditorState} />
    </div>
  )
}
