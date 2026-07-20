import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Middleware i18n: tự thêm/nhận diện tiền tố locale, redirect "/" -> "/en".
export default createMiddleware(routing)

export const config = {
  /**
   * Chạy cho MỌI route TRỪ:
   *  - /admin, /api  -> thuộc Payload CMS, không được i18n-rewrite
   *  - /_next, /_payload -> nội bộ Next/Payload
   *  - bất kỳ path có dấu "." (file tĩnh: .ico, .png, .xml, .txt, ...)
   */
  matcher: ['/((?!api|admin|_next|_payload|.*\\..*).*)'],
}
