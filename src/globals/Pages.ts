import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '../access'

/**
 * Nội dung biên tập cho các trang tĩnh (About, OEM) — để chủ doanh nghiệp sửa trong CMS,
 * không phải sửa code. Tất cả field localized (en/ko/ja); bỏ trống -> frontend dùng fallback.
 */
export const Pages: GlobalConfig = {
  slug: 'pages',
  label: 'Pages (About / OEM)',
  admin: { group: 'Configuration' },
  access: { read: anyone, update: authenticated },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'About',
          fields: [
            {
              name: 'about',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', localized: true },
                { name: 'subtitle', type: 'textarea', localized: true },
                { name: 'coverImage', type: 'upload', relationTo: 'media' },
                { name: 'body', type: 'richText', localized: true },
                {
                  name: 'showCompanyDetails',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { description: 'Hiện khối thông tin pháp nhân/văn phòng (lấy từ Settings).' },
                },
              ],
            },
          ],
        },
        {
          label: 'OEM',
          fields: [
            {
              name: 'oem',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', localized: true },
                { name: 'subtitle', type: 'textarea', localized: true },
                { name: 'coverImage', type: 'upload', relationTo: 'media' },
                { name: 'body', type: 'richText', localized: true },
                {
                  name: 'features',
                  type: 'array',
                  labels: { singular: 'Feature', plural: 'Features' },
                  fields: [
                    { name: 'title', type: 'text', localized: true, required: true },
                    { name: 'description', type: 'textarea', localized: true },
                  ],
                },
                {
                  name: 'gallery',
                  type: 'array',
                  labels: { singular: 'Image', plural: 'Gallery' },
                  fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
