import { defineRouting } from 'next-intl/routing'

/**
 * Cấu hình route đa ngôn ngữ.
 * - locales: en (mặc định), ko, ja
 * - localePrefix 'always': mọi trang đều có tiền tố /en /ko /ja (kể cả tiếng Anh)
 *   -> khớp yêu cầu "mở /en /ko /ja đều chạy".
 */
export const routing = defineRouting({
  locales: ['en', 'ko', 'ja'],
  defaultLocale: 'en',
  localePrefix: 'always',
})

export type AppLocale = (typeof routing.locales)[number]
