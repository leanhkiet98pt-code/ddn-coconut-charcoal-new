import type { Endpoint, PayloadRequest } from 'payload'
import { handleLead } from './leadCore'

/**
 * Endpoint autosave: POST /api/rfq/autosave
 * Gọi mỗi khi khách gõ (debounce ở client). Upsert lead theo sessionId, không tạo trùng.
 * Đạt "qualified" (email hợp lệ + product + quantity) lần đầu -> gửi 1 email cho sales.
 */
export const rfqAutosaveEndpoint: Endpoint = {
  path: '/rfq/autosave',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    const { status, body } = await handleLead(req, { complete: false })
    return Response.json(body, { status })
  },
}

/**
 * Endpoint hoàn tất: POST /api/rfq
 * Khách bấm "Submit RFQ" -> đánh dấu status=complete (và gửi email nếu chưa gửi).
 * KHÔNG bắt buộc để thu lead — lead đã được lưu dần qua autosave.
 */
export const rfqEndpoint: Endpoint = {
  path: '/rfq',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    const { status, body } = await handleLead(req, { complete: true })
    return Response.json(body, { status })
  },
}
