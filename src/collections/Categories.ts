import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { seoField } from '../fields/seo'

/**
 * Dòng sản phẩm (Coconut Shell Charcoal, BBQ Briquette, White Charcoal, Shisha...).
 * User thêm/sửa/xóa thoải mái trong admin.
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Category', plural: 'Categories' },
  admin: {
    useAsTitle: 'title',
    group: 'Catalog',
    defaultColumns: ['title', 'slug', 'order'],
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Định danh trên URL, vd: coconut-shell-charcoal (không dấu, không khoảng trắng).',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Thứ tự hiển thị (số nhỏ hiện trước).' },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    seoField,
  ],
}
