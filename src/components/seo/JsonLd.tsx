// Chèn structured data (JSON-LD) vào trang. data là object schema.org.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Nội dung do server tạo từ dữ liệu CMS -> an toàn để nhúng.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
