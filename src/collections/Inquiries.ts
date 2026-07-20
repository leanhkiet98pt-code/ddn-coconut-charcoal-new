import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

/**
 * Lưu toàn bộ đơn RFQ gửi từ form Contact.
 * - create: ai cũng gửi được (form công khai POST qua API).
 * - read/delete: chỉ admin.
 * - Các field dữ liệu đặt readOnly trong admin (đọc-only), chỉ "status" sửa được để theo dõi.
 */
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Inquiry (RFQ)', plural: 'Inquiries (RFQ)' },
  admin: {
    useAsTitle: 'name',
    group: 'Leads',
    defaultColumns: ['name', 'company', 'product', 'email', 'status', 'createdAt'],
  },
  access: {
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'locale',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true, description: 'Ngôn ngữ khi khách gửi.' },
    },
    // --- 11 trường của form RFQ (readOnly) ---
    { name: 'product', type: 'text', admin: { readOnly: true } },
    { name: 'quantity', type: 'text', admin: { readOnly: true, description: 'Quantity / month' } },
    { name: 'destinationPort', type: 'text', admin: { readOnly: true } },
    { name: 'incoterm', type: 'text', admin: { readOnly: true } },
    { name: 'packaging', type: 'text', admin: { readOnly: true } },
    { name: 'targetPrice', type: 'text', admin: { readOnly: true } },
    { name: 'name', type: 'text', required: true, admin: { readOnly: true } },
    { name: 'company', type: 'text', admin: { readOnly: true } },
    { name: 'email', type: 'email', required: true, admin: { readOnly: true } },
    { name: 'phone', type: 'text', admin: { readOnly: true } },
    { name: 'message', type: 'textarea', admin: { readOnly: true } },
  ],
}
