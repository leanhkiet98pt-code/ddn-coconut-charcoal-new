import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

// Kho upload chung (ảnh, PDF sản phẩm, ảnh chứng chỉ...).
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  admin: { group: 'System' },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    // Ảnh lưu trong /media (đã gitignore). Tạo sẵn vài kích thước để tối ưu tải trang.
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 576, position: 'centre' },
      { name: 'feature', width: 1600, height: 900, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      admin: { description: 'Mô tả ảnh (alt text) cho SEO & trình đọc màn hình.' },
    },
  ],
}
