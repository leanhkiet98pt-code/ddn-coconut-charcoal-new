import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

// Chứng chỉ / giấy tờ tuân thủ (ISO, SGS, phytosanitary, MSDS...).
export const Certificates: CollectionConfig = {
  slug: 'certificates',
  labels: { singular: 'Certificate', plural: 'Certificates' },
  admin: {
    useAsTitle: 'title',
    group: 'Catalog',
    defaultColumns: ['title', 'type', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'type',
      type: 'text',
      localized: true,
      admin: { description: 'Loại chứng chỉ, vd: ISO 9001, SGS Test, Phytosanitary.' },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Ảnh hoặc PDF của chứng chỉ.' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
  ],
}
