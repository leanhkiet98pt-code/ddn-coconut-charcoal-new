import { revalidateTag } from 'next/cache'
import type { GlobalAfterChangeHook } from 'payload'
import { CACHE_TAGS } from '../lib/cacheTags'

/**
 * Cơ chế làm mới cache tức thời khi admin bấm Save trong /admin.
 * Vấn đề gốc: getSettings/getHome/getPages đọc thẳng Postgres qua Payload Local API
 * (không qua fetch()), nên Next.js không tự biết để đưa vào Data Cache / Full Route Cache
 * -> các trang liên quan bị build tĩnh 1 lần rồi đóng băng trên Vercel cho tới khi redeploy.
 * Đã bọc 3 hàm đó bằng `unstable_cache(..., { tags })` trong lib/payload.ts — revalidateTag()
 * ở đây xoá đúng cache đã gắn tag đó, kéo theo mọi trang đã render từ cache đó cũng được
 * làm mới ngay, KHÔNG cần đợi revalidate=60s hay redeploy.
 * (`export const revalidate = 60` ở từng page vẫn giữ làm lưới an toàn dự phòng.)
 */

// revalidateTag cần chạy trong ngữ cảnh request/build của Next.js. Khi hook này chạy từ
// script độc lập (vd `npm run seed`, `payload migrate`) thì gọi thẳng sẽ ném lỗi — bắt lại,
// chỉ log cảnh báo, KHÔNG làm gãy thao tác Save/seed đang chạy.
function safeRevalidateTag(tag: string) {
  try {
    revalidateTag(tag)
  } catch (error) {
    console.warn(
      `[revalidate] Bỏ qua revalidateTag("${tag}") — không chạy trong ngữ cảnh request Next.js (seed/migrate script?).`,
      error instanceof Error ? error.message : error,
    )
  }
}

export const revalidateHome: GlobalAfterChangeHook = ({ doc }) => {
  safeRevalidateTag(CACHE_TAGS.home)
  return doc
}

export const revalidateSettings: GlobalAfterChangeHook = ({ doc }) => {
  safeRevalidateTag(CACHE_TAGS.settings)
  return doc
}

export const revalidatePages: GlobalAfterChangeHook = ({ doc }) => {
  safeRevalidateTag(CACHE_TAGS.pages)
  return doc
}
