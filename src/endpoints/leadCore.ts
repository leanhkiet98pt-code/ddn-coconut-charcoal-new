import type { PayloadRequest } from 'payload'
import { postToMake } from '../lib/make'

// Các trường nội dung nhận từ form (whitelist — bỏ qua field lạ).
export const LEAD_FIELDS = [
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

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Tên field honeypot (ẩn với người thật, bot hay điền).
const HONEYPOT = 'company_website'

// ---- Rate limit đơn giản trong bộ nhớ tiến trình (chống spam autosave) ----
const RATE = new Map<string, number[]>()
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 40 // tối đa 40 lần ghi / phút / (ip+session)

function rateLimited(key: string): boolean {
  const now = Date.now()
  const arr = (RATE.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  arr.push(now)
  RATE.set(key, arr)
  // Dọn rác thưa thớt để Map không phình mãi.
  if (RATE.size > 5000) RATE.clear()
  return arr.length > RATE_MAX
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function clientIp(req: PayloadRequest): string {
  const xff = req.headers?.get?.('x-forwarded-for') || ''
  return xff.split(',')[0].trim() || req.headers?.get?.('x-real-ip') || 'unknown'
}

type LeadResult = { status: number; body: Record<string, unknown> }

/**
 * Xử lý một lần ghi lead (autosave hoặc submit hoàn tất).
 * - complete=false: autosave khi khách gõ.
 * - complete=true: khách bấm "Submit RFQ".
 */
export async function handleLead(req: PayloadRequest, { complete }: { complete: boolean }): Promise<LeadResult> {
  const payload = req.payload

  let body: Record<string, unknown> = {}
  try {
    body = typeof req.json === 'function' ? await req.json() : {}
  } catch {
    body = {}
  }

  // 1) Honeypot: nếu có nội dung -> coi như bot, trả OK giả, KHÔNG lưu.
  if (typeof body[HONEYPOT] === 'string' && (body[HONEYPOT] as string).trim().length > 0) {
    return { status: 200, body: { saved: false, bot: true } }
  }

  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : ''
  if (!sessionId || sessionId.length < 8) {
    return { status: 400, body: { saved: false, error: 'Missing sessionId.' } }
  }

  // 2) Rate limit theo IP + session.
  if (rateLimited(`${clientIp(req)}:${sessionId}`)) {
    return { status: 429, body: { saved: false, error: 'Too many requests.' } }
  }

  // 3) Lọc dữ liệu theo whitelist.
  const data: Record<string, string> = {}
  for (const key of LEAD_FIELDS) {
    const v = body[key]
    if (typeof v === 'string') data[key] = v.trim()
  }
  const sourcePage = typeof body.sourcePage === 'string' ? body.sourcePage.slice(0, 300) : undefined

  const emailValid = EMAIL_RE.test(data.email ?? '')
  const hasPhone = Boolean(data.phone && data.phone.length >= 5)

  // 4) Chống rác: chỉ ghi khi có email HỢP LỆ hoặc có phone.
  if (!emailValid && !hasPhone) {
    return { status: 200, body: { saved: false, reason: 'insufficient' } }
  }

  // Điều kiện "qualified": email hợp lệ + product + quantity.
  const isQualified = emailValid && Boolean(data.product) && Boolean(data.quantity)

  // 5) Tìm bản ghi cũ theo sessionId (upsert).
  const existingRes = await payload.find({
    collection: 'inquiries',
    where: { sessionId: { equals: sessionId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const existing = existingRes.docs[0] as
    | { id: number; status?: string; qualified?: boolean; notified?: boolean; pushedToSheet?: boolean }
    | undefined

  const alreadyNotified = Boolean(existing?.notified)
  const alreadyPushed = Boolean(existing?.pushedToSheet)

  // Trạng thái vòng đời (không hạ cấp: complete > qualified > partial).
  const nextStatus = complete
    ? 'complete'
    : existing?.status === 'complete'
      ? 'complete'
      : isQualified || existing?.qualified
        ? 'qualified'
        : 'partial'

  // Gửi email 1 lần/phiên: khi đạt qualified lần đầu, hoặc khi submit hoàn tất (email hợp lệ).
  const shouldNotify = !alreadyNotified && emailValid && (isQualified || complete)

  // Đẩy Make 2 thời điểm: (a) qualified LẦN ĐẦU (guard pushedToSheet), (b) khi complete (Make cập nhật dòng cũ).
  // Chỉ tính khi webhook đã cấu hình -> pushedToSheet phản ánh đúng "đã đẩy tới webhook thật".
  const hasWebhook = Boolean(process.env.MAKE_WEBHOOK_URL)
  const shouldPushQualify = isQualified && !alreadyPushed && !complete
  const shouldPushComplete = complete
  const willPush = hasWebhook && (shouldPushQualify || shouldPushComplete)

  const writeData: Record<string, unknown> = {
    ...data,
    sessionId,
    status: nextStatus,
    qualified: isQualified || Boolean(existing?.qualified),
    notified: alreadyNotified || shouldNotify,
    pushedToSheet: alreadyPushed || willPush,
    lastUpdated: new Date().toISOString(),
    ...(sourcePage ? { sourcePage } : {}),
  }

  let resultDoc: { id: number; createdAt?: string }
  try {
    if (existing) {
      resultDoc = (await payload.update({ collection: 'inquiries', id: existing.id, data: writeData as never, overrideAccess: true })) as never
    } else {
      resultDoc = (await payload.create({ collection: 'inquiries', data: writeData as never, overrideAccess: true })) as never
    }
  } catch {
    // Xử lý đua tạo trùng sessionId: tìm lại rồi update.
    const retry = await payload.find({ collection: 'inquiries', where: { sessionId: { equals: sessionId } }, limit: 1, depth: 0, overrideAccess: true })
    if (retry.docs[0]) {
      resultDoc = (await payload.update({ collection: 'inquiries', id: retry.docs[0].id as number, data: writeData as never, overrideAccess: true })) as never
    } else {
      throw new Error('Lead upsert failed')
    }
  }
  const recordId = resultDoc.id

  // 6) Gửi email thông báo sales (1 lần/phiên).
  if (shouldNotify) {
    try {
      const settings = await payload.findGlobal({ slug: 'settings', overrideAccess: true })
      const to = settings?.salesEmail
      if (to) {
        const rows = LEAD_FIELDS.filter((f) => f !== 'locale' && data[f])
          .map((f) => `<tr><td style="padding:4px 12px 4px 0;color:#555"><b>${f}</b></td><td style="padding:4px 0">${escapeHtml(data[f]!)}</td></tr>`)
          .join('')
        await payload.sendEmail({
          to,
          subject: `${complete ? 'RFQ submitted' : 'New qualified lead'} — ${data.name || data.email || 'Unknown'}${data.company ? ` (${data.company})` : ''}`,
          html:
            `<h2>${complete ? 'RFQ Submitted' : 'New Qualified Lead'}</h2>` +
            `<p style="color:#888">Status: ${nextStatus} · Source: ${escapeHtml(sourcePage ?? '-')} · Locale: ${escapeHtml(data.locale ?? 'en')}</p>` +
            `<table>${rows}</table>`,
        })
      } else {
        payload.logger.warn('Lead qualified but Settings.salesEmail is empty — email not sent.')
      }
    } catch (err) {
      // Email lỗi không được chặn việc lưu lead.
      payload.logger.error({ err }, 'Lead notification email failed (record still saved).')
    }
  }

  // 7) Đẩy sang Google Sheet qua Make — chỉ khi qualified lần đầu hoặc complete.
  //    Dùng setTimeout(…,0) để tách HẲN khỏi vòng đời request: fetch bắt đầu ở tick sau,
  //    nên Make chậm/timeout KHÔNG làm chậm phản hồi form. (Self-host Node vẫn chạy tiếp.)
  //    postToMake tự bỏ qua nếu MAKE_WEBHOOK_URL rỗng và tự nuốt lỗi/timeout (chỉ log).
  if (willPush) {
    const makePayload = {
      sessionId,
      status: nextStatus,
      product: data.product,
      quantity: data.quantity,
      destinationPort: data.destinationPort,
      incoterm: data.incoterm,
      packaging: data.packaging,
      targetPrice: data.targetPrice,
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      message: data.message,
      sourcePage: sourcePage ?? '',
      createdAt: resultDoc.createdAt,
      lastUpdated: writeData.lastUpdated as string,
    }
    setTimeout(() => {
      void postToMake(makePayload, payload.logger)
    }, 0)
  }

  return {
    status: existing ? 200 : 201,
    body: { saved: true, id: recordId, status: nextStatus, qualified: writeData.qualified, notified: writeData.notified, pushedToSheet: writeData.pushedToSheet },
  }
}
