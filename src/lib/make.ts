// Đẩy lead sang Google Sheet QUA webhook Make.com.
// App KHÔNG giữ credential Google — chỉ POST JSON tới MAKE_WEBHOOK_URL, Make lo phần ghi Sheet.

type Loggerish = { warn: (msg: string) => void; error: (obj: unknown, msg?: string) => void }

// Bản ghi inquiry (chỉ các field cần cho Sheet). Nhận lỏng để dùng thẳng doc từ Payload.
export type MakeInput = {
  sessionId?: string | null
  status?: string | null
  product?: string | null
  quantity?: string | null
  destinationPort?: string | null
  incoterm?: string | null
  packaging?: string | null
  targetPrice?: string | null
  name?: string | null
  company?: string | null
  email?: string | null
  phone?: string | null
  message?: string | null
  sourcePage?: string | null
  createdAt?: string | null
  lastUpdated?: string | null
}

const s = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : String(v))

/**
 * Gửi 1 lead tới webhook Make. Payload PHẲNG, field trống = chuỗi rỗng (không bỏ).
 * - Bỏ qua nếu MAKE_WEBHOOK_URL rỗng.
 * - Timeout ~5s; mọi lỗi/timeout được nuốt (chỉ log cảnh báo) để KHÔNG ảnh hưởng lưu DB/phản hồi form.
 * - sessionId luôn có trong payload để Make upsert đúng dòng.
 */
export async function postToMake(input: MakeInput, logger?: Loggerish): Promise<void> {
  const url = process.env.MAKE_WEBHOOK_URL
  if (!url) return // chưa cấu hình -> bỏ qua, site vẫn chạy bình thường

  const payload = {
    sessionId: s(input.sessionId),
    status: s(input.status),
    product: s(input.product),
    quantityPerMonth: s(input.quantity),
    destinationPort: s(input.destinationPort),
    incoterm: s(input.incoterm),
    packaging: s(input.packaging),
    targetPrice: s(input.targetPrice),
    name: s(input.name),
    company: s(input.company),
    email: s(input.email),
    phone: s(input.phone),
    message: s(input.message),
    sourcePage: s(input.sourcePage),
    createdAt: s(input.createdAt),
    lastUpdated: s(input.lastUpdated),
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    if (!res.ok) {
      logger?.warn(`Make webhook trả về HTTP ${res.status} (lead vẫn đã lưu DB).`)
    }
  } catch (err) {
    // Timeout/mạng lỗi/URL sai -> chỉ cảnh báo, không làm hỏng luồng.
    logger?.error({ err }, 'Make webhook thất bại (lead vẫn đã lưu DB + email đã gửi).')
  } finally {
    clearTimeout(timer)
  }
}
