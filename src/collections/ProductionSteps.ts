import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

// Các bước trong quy trình sản xuất (trang Production).
export const ProductionSteps: CollectionConfig = {
  slug: 'production-steps',
  labels: { singular: 'Production Step', plural: 'Production Steps' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['order', 'title', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 1,
      admin: { position: 'sidebar', description: 'Thứ tự bước (1, 2, 3...).' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
  ],
}
