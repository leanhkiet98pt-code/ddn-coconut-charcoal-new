import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

// Trỏ tới file cấu hình request của next-intl (chọn locale + nạp messages)
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cho phép <Image> nạp ảnh do Payload phục vụ ở /api/media/... (local) và domain thật khi deploy
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Payload sinh nhiều output tracing lớn; giữ mặc định. reactStrictMode bật để bắt lỗi sớm.
  reactStrictMode: true,
}

// Bọc lần lượt: next-intl (i18n) rồi Payload (admin + API). Thứ tự này an toàn.
export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
