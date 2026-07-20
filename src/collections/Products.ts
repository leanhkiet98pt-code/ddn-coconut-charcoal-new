import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

/**
 * Sản phẩm = TRANG THÔNG SỐ KỸ THUẬT cho buyer B2B.
 * Mọi field nội dung đều localized (en/ko/ja). Số liệu spec là text để linh hoạt
 * ghi khoảng/đơn vị (vd "78-82%", "5,000-7,000 kcal/kg").
 */
export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Product', plural: 'Products' },
  admin: {
    useAsTitle: 'title',
    group: 'Catalog',
    defaultColumns: ['title', 'category', 'slug', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          admin: { width: '70%' },
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          admin: { width: '30%' },
        },
      ],
    },
    slugField('title'),
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      admin: { description: 'Mô tả ngắn hiển thị ở thẻ listing.' },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      labels: { singular: 'Image', plural: 'Gallery images' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      // Nhóm thông số kỹ thuật — buyer B2B quyết định bằng bảng số này.
      name: 'specs',
      type: 'group',
      label: 'Technical Specifications',
      admin: { description: 'Bảng thông số. Bỏ trống dòng nào thì dòng đó ẩn ngoài site.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'fixedCarbon', type: 'text', localized: true, admin: { width: '25%', description: 'Fixed Carbon %' } },
            { name: 'ash', type: 'text', localized: true, admin: { width: '25%', description: 'Ash %' } },
            { name: 'moisture', type: 'text', localized: true, admin: { width: '25%', description: 'Moisture %' } },
            { name: 'volatileMatter', type: 'text', localized: true, admin: { width: '25%', description: 'Volatile Matter %' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'calorificValue', type: 'text', localized: true, admin: { width: '50%', description: 'kcal/kg' } },
            { name: 'burningTime', type: 'text', localized: true, admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'dimensions', type: 'text', localized: true, admin: { width: '50%' } },
            { name: 'packing', type: 'text', localized: true, admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'moq', type: 'text', localized: true, admin: { width: '50%', description: 'Minimum Order Quantity' } },
            { name: 'loadingPort', type: 'text', localized: true, admin: { width: '50%', description: 'Loading Port / FCL capacity' } },
          ],
        },
        {
          name: 'hsCode',
          type: 'text',
          admin: { description: 'HS Code (không cần localize).' },
        },
      ],
    },
    {
      name: 'specSheetPdf',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'File PDF spec sheet cho nút "Download Spec Sheet".' },
    },
    {
      name: 'applications',
      type: 'array',
      localized: true,
      labels: { singular: 'Application', plural: 'Applications' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'richContent',
      type: 'richText',
      localized: true,
      admin: { description: 'Nội dung mô tả chi tiết (tùy chọn).' },
    },
    seoField,
  ],
}
