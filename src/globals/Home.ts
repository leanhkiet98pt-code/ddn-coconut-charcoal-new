import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { revalidateHome } from '../hooks/revalidate'

// Toggle bật/tắt dùng chung cho mỗi section.
const enabledField = {
  name: 'enabled',
  type: 'checkbox' as const,
  defaultValue: true,
  admin: { description: 'Bật/tắt hiển thị section này ngoài trang chủ.' },
}

/**
 * Trang chủ: bật/tắt & chỉnh sửa từng section.
 * Text bỏ trống -> frontend tự fallback sang chuỗi mặc định trong messages (en/ko/ja).
 * Dữ liệu danh sách (sản phẩm, chứng chỉ, thị trường) kéo từ collection tương ứng.
 */
export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home Page',
  admin: { group: 'Configuration' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateHome] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                enabledField,
                { name: 'kicker', type: 'text', localized: true },
                { name: 'title', type: 'text', localized: true },
                { name: 'subtitle', type: 'textarea', localized: true },
                { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
                { name: 'ctaPrimaryLabel', type: 'text', localized: true },
                { name: 'ctaSecondaryLabel', type: 'text', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Sections',
          fields: [
            {
              name: 'trustBar',
              type: 'group',
              label: 'Trust Bar',
              fields: [enabledField],
            },
            {
              name: 'productGroups',
              type: 'group',
              label: 'Product Groups',
              fields: [
                enabledField,
                { name: 'title', type: 'text', localized: true },
                { name: 'subtitle', type: 'textarea', localized: true },
              ],
            },
            {
              name: 'factory',
              type: 'group',
              label: 'Factory / Production',
              fields: [
                enabledField,
                { name: 'title', type: 'text', localized: true },
                { name: 'subtitle', type: 'textarea', localized: true },
                { name: 'videoUrl', type: 'text', admin: { description: 'Link YouTube/Vimeo (tùy chọn).' } },
                {
                  name: 'images',
                  type: 'array',
                  labels: { singular: 'Image', plural: 'Images' },
                  fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
                },
              ],
            },
            {
              name: 'certificates',
              type: 'group',
              label: 'Certificates',
              fields: [
                enabledField,
                { name: 'title', type: 'text', localized: true },
                { name: 'subtitle', type: 'textarea', localized: true },
              ],
            },
            {
              name: 'exportMap',
              type: 'group',
              label: 'Export Map',
              fields: [
                enabledField,
                { name: 'title', type: 'text', localized: true },
                { name: 'subtitle', type: 'textarea', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Process & FAQ',
          fields: [
            {
              name: 'buyingProcess',
              type: 'group',
              label: 'Buying Process',
              fields: [
                enabledField,
                { name: 'title', type: 'text', localized: true },
                { name: 'subtitle', type: 'textarea', localized: true },
                {
                  name: 'steps',
                  type: 'array',
                  labels: { singular: 'Step', plural: 'Steps' },
                  fields: [
                    { name: 'title', type: 'text', localized: true, required: true },
                    { name: 'description', type: 'textarea', localized: true },
                  ],
                },
              ],
            },
            {
              name: 'faq',
              type: 'group',
              label: 'FAQ',
              fields: [
                enabledField,
                { name: 'title', type: 'text', localized: true },
                {
                  name: 'items',
                  type: 'array',
                  labels: { singular: 'Q&A', plural: 'Q&A items' },
                  fields: [
                    { name: 'question', type: 'text', localized: true, required: true },
                    { name: 'answer', type: 'textarea', localized: true, required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'RFQ CTA',
          fields: [
            {
              name: 'rfqCta',
              type: 'group',
              label: 'RFQ Call-to-Action',
              fields: [
                enabledField,
                { name: 'title', type: 'text', localized: true },
                { name: 'subtitle', type: 'textarea', localized: true },
                { name: 'buttonLabel', type: 'text', localized: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
