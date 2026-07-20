import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'

/**
 * Lưu đơn RFQ + lead thu tự động (autosave) từ form Contact.
 * - Ghi công khai được thực hiện qua endpoint /api/rfq và /api/rfq/autosave
 *   (dùng overrideAccess phía server sau khi qua honeypot + rate-limit) → access ở đây
 *   để authenticated cho an toàn khi truy cập REST trực tiếp.
 * - 1 phiên (sessionId) = 1 bản ghi: luôn cập nhật, không tạo trùng.
 * - Vòng đời: partial → qualified → complete.
 */
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Inquiry (RFQ)', plural: 'Inquiries (RFQ)' },
  admin: {
    useAsTitle: 'name',
    group: 'Leads',
    defaultColumns: ['name', 'company', 'product', 'email', 'status', 'salesStage', 'lastUpdated'],
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    // --- Vòng đời lead (tự động) ---
    {
      name: 'status',
      type: 'select',
      defaultValue: 'partial',
      options: [
        { label: 'Partial (đang nhập)', value: 'partial' },
        { label: 'Qualified (đủ điều kiện)', value: 'qualified' },
        { label: 'Complete (đã bấm gửi)', value: 'complete' },
      ],
      admin: { position: 'sidebar', description: 'Vòng đời lead — tự cập nhật theo mức độ hoàn thiện form.' },
    },
    // --- Pipeline bán hàng (thủ công, để sales theo dõi) ---
    {
      name: 'salesStage',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar', description: 'Trạng thái xử lý của sales (tự điền).' },
    },
    { name: 'qualified', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', readOnly: true } },
    { name: 'notified', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', readOnly: true, description: 'Đã gửi email báo sales cho phiên này chưa.' } },
    { name: 'pushedToSheet', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', readOnly: true, description: 'Đã đẩy dòng qualified sang Google Sheet (qua Make) chưa — tránh gửi trùng.' } },
    {
      name: 'sessionId',
      type: 'text',
      index: true,
      admin: { position: 'sidebar', readOnly: true, description: 'Định danh phiên khách (chống trùng).' },
    },
    { name: 'sourcePage', type: 'text', admin: { position: 'sidebar', readOnly: true, description: 'Trang khách điền form.' } },
    { name: 'lastUpdated', type: 'date', admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'locale', type: 'text', admin: { position: 'sidebar', readOnly: true } },

    // --- 11 trường của form RFQ (readOnly trong admin) ---
    { name: 'product', type: 'text', admin: { readOnly: true } },
    { name: 'quantity', type: 'text', admin: { readOnly: true, description: 'Quantity / month' } },
    { name: 'destinationPort', type: 'text', admin: { readOnly: true } },
    { name: 'incoterm', type: 'text', admin: { readOnly: true } },
    { name: 'packaging', type: 'text', admin: { readOnly: true } },
    { name: 'targetPrice', type: 'text', admin: { readOnly: true } },
    { name: 'name', type: 'text', admin: { readOnly: true } },
    { name: 'company', type: 'text', admin: { readOnly: true } },
    { name: 'email', type: 'email', admin: { readOnly: true } },
    { name: 'phone', type: 'text', admin: { readOnly: true } },
    { name: 'message', type: 'textarea', admin: { readOnly: true } },
  ],
}
