import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

// Thị trường xuất khẩu — cho trang Export Track Record + bản đồ.
export const ExportMarkets: CollectionConfig = {
  slug: 'export-markets',
  labels: { singular: 'Export Market', plural: 'Export Markets' },
  admin: {
    useAsTitle: 'country',
    group: 'Content',
    defaultColumns: ['country', 'region', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'country',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'countryCode',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Mã ISO 2 ký tự (vd: KR, JP, US) — dùng cho cờ/bản đồ. Không cần localize.',
      },
    },
    {
      name: 'region',
      type: 'text',
      localized: true,
      admin: { description: 'Khu vực, vd: East Asia, Middle East, Europe.' },
    },
    {
      name: 'note',
      type: 'textarea',
      localized: true,
    },
  ],
}
