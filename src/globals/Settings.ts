import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { revalidateSettings } from '../hooks/revalidate'

/**
 * Cấu hình toàn site: tên công ty, pháp nhân, liên hệ, mạng xã hội, số liệu trust bar, logo.
 * Chủ doanh nghiệp điền/sửa tại /admin -> Globals -> Settings. KHÔNG hardcode trong code.
 */
export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Settings',
  admin: { group: 'Configuration' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateSettings] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Company',
          fields: [
            { name: 'companyName', type: 'text', localized: true, admin: { description: 'Tên brand hiển thị. Bỏ trống -> dùng tên mặc định.' } },
            { name: 'foundedYear', type: 'number', admin: { description: 'Năm thành lập (hero "…since 20XX").' } },
            { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Logo. Bỏ trống -> hiện tên công ty dạng chữ.' } },
            { name: 'tagline', type: 'textarea', localized: true, admin: { description: 'Slogan ngắn hiển thị ở footer.' } },
            {
              name: 'legalEntity',
              type: 'group',
              label: 'Legal Entity',
              fields: [
                { name: 'name', type: 'text', localized: true, admin: { description: 'Tên pháp nhân đầy đủ.' } },
                { name: 'businessCode', type: 'text', admin: { description: 'Mã số doanh nghiệp.' } },
                { name: 'taxCode', type: 'text', admin: { description: 'Mã số thuế.' } },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'salesEmail', type: 'email', admin: { description: 'Email nhận đơn RFQ (dạng sales@domain). KHÔNG dùng gmail cá nhân.' } },
            { name: 'whatsappNumber', type: 'text', admin: { description: 'Số WhatsApp dạng quốc tế, vd +84901234567 (dùng cho nút nổi & link).' } },
            { name: 'phone', type: 'text' },
            {
              name: 'offices',
              type: 'array',
              labels: { singular: 'Office', plural: 'Offices' },
              fields: [
                { name: 'label', type: 'text', localized: true, admin: { description: 'Vd: Head Office, Factory.' } },
                { name: 'address', type: 'textarea', localized: true },
              ],
            },
            {
              name: 'socialLinks',
              type: 'array',
              labels: { singular: 'Social link', plural: 'Social links' },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Alibaba', value: 'alibaba' },
                    { label: 'WhatsApp', value: 'whatsapp' },
                    { label: 'Other', value: 'other' },
                  ],
                },
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Trust Bar',
          fields: [
            {
              name: 'trustBar',
              type: 'group',
              label: 'Trust Bar Figures',
              admin: { description: 'Con số uy tín hiển thị dưới hero. Bỏ trống ô nào thì ẩn ô đó.' },
              fields: [
                { name: 'containersPerMonth', type: 'text', admin: { description: 'Vd: 80+' } },
                { name: 'countries', type: 'text', admin: { description: 'Số quốc gia xuất khẩu, vd: 15+' } },
                { name: 'certsNote', type: 'text', localized: true, admin: { description: 'Vd: ISO 9001, SGS' } },
                { name: 'yearsExporting', type: 'text', admin: { description: 'Vd: 12+' } },
              ],
            },
          ],
        },
      ],
    },
  ],
}
