import type { Field } from 'payload'

/**
 * Nhóm field SEO tái sử dụng cho mọi collection có trang riêng.
 * Localized để mỗi ngôn ngữ có title/description meta riêng.
 * Bỏ trống -> code sẽ tự fallback sang tiêu đề/มô tả mặc định.
 */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: {
    description: 'Tiêu đề & mô tả cho công cụ tìm kiếm. Bỏ trống sẽ tự dùng nội dung mặc định.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: { description: 'Meta title (≈ 60 ký tự).' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Meta description (≈ 160 ký tự).' },
    },
  ],
}
