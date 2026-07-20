import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Certificates } from './collections/Certificates'
import { Posts } from './collections/Posts'
import { ExportMarkets } from './collections/ExportMarkets'
import { ProductionSteps } from './collections/ProductionSteps'
import { Inquiries } from './collections/Inquiries'
import { Settings } from './globals/Settings'
import { Home } from './globals/Home'
import { Pages } from './globals/Pages'
import { rfqEndpoint } from './endpoints/rfq'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Chỉ cấu hình email khi có SMTP_HOST; nếu không, Payload dùng transport mặc định (log console).
const emailAdapter = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromName: 'RFQ Website',
      defaultFromAddress: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
      },
    })
  : undefined

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: '— Charcoal CMS',
    },
  },
  // Đa ngôn ngữ cho NỘI DUNG (mỗi field localized lưu 3 giá trị en/ko/ja).
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: '한국어 (Korean)', code: 'ko' },
      { label: '日本語 (Japanese)', code: 'ja' },
    ],
    defaultLocale: 'en',
    fallback: true, // locale chưa dịch -> tự lấy tiếng Anh
  },
  collections: [
    Users,
    Media,
    Categories,
    Products,
    Certificates,
    Posts,
    ExportMarkets,
    ProductionSteps,
    Inquiries,
  ],
  globals: [Settings, Home, Pages],
  endpoints: [rfqEndpoint],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URI || 'file:./ddn.db' },
  }),
  ...(emailAdapter ? { email: emailAdapter } : {}),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
