import type { Endpoint, PayloadRequest } from 'payload'

// Danh sách trường được nhận từ form (khớp collection Inquiries).
const FIELDS = [
  'product',
  'quantity',
  'destinationPort',
  'incoterm',
  'packaging',
  'targetPrice',
  'name',
  'company',
  'email',
  'phone',
  'message',
  'locale',
] as const

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Endpoint nhận đơn RFQ: POST /api/rfq
 * - Lưu bản ghi vào collection Inquiries.
 * - Gửi email thông báo tới salesEmail (đọc từ Global Settings).
 *   Nếu chưa cấu hình SMTP, Payload ghi email ra console (dev) — đơn vẫn được lưu.
 * Dùng Payload endpoint (thay vì Next route) để không đụng catch-all /api/[...slug].
 */
export const rfqEndpoint: Endpoint = {
  path: '/rfq',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    let body: Record<string, unknown> = {}
    try {
      body = typeof req.json === 'function' ? await req.json() : {}
    } catch {
      body = {}
    }

    // Trích đúng các trường cho phép (tránh nhận field lạ).
    const data: Record<string, string> = {}
    for (const key of FIELDS) {
      const v = body[key]
      if (typeof v === 'string') data[key] = v.trim()
    }

    // Bắt buộc tối thiểu: name + email hợp lệ.
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? '')
    if (!data.name || !emailOk) {
      return Response.json(
        { success: false, error: 'Missing required fields (name, valid email).' },
        { status: 400 },
      )
    }

    // 1) Lưu Inquiry
    const created = await req.payload.create({
      collection: 'inquiries',
      // Dữ liệu đã lọc theo whitelist FIELDS; cast để khớp kiểu input của Payload.
      data: { ...data, status: 'new' } as never,
    })

    // 2) Gửi email tới sales (không chặn phản hồi nếu email lỗi)
    try {
      const settings = await req.payload.findGlobal({ slug: 'settings' })
      const to = settings?.salesEmail
      if (to) {
        const rows = FIELDS.filter((f) => f !== 'locale' && data[f])
          .map((f) => `<tr><td style="padding:4px 12px 4px 0;color:#555"><b>${f}</b></td><td style="padding:4px 0">${escapeHtml(data[f]!)}</td></tr>`)
          .join('')
        await req.payload.sendEmail({
          to,
          subject: `New RFQ from ${data.name}${data.company ? ` (${data.company})` : ''}`,
          html: `<h2>New Request for Quotation</h2><table>${rows}</table><p style="color:#888">Locale: ${data.locale ?? 'en'}</p>`,
        })
      } else {
        req.payload.logger.warn('RFQ received but Settings.salesEmail is empty — email not sent.')
      }
    } catch (err) {
      req.payload.logger.error({ err }, 'RFQ email failed (inquiry still saved).')
    }

    return Response.json({ success: true, id: created.id }, { status: 201 })
  },
}
