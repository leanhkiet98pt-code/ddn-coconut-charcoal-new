import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
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
import { rfqEndpoint, rfqAutosaveEndpoint } from './endpoints/rfq'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ------------------------------------------------------------
// serverURL + CSRF + CORS — đọc từ env, tự thêm cả www lẫn non-www
// để đăng nhập admin không lỗi khi domain khác biến thể.
// ------------------------------------------------------------
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

function originVariants(url: string): string[] {
  const out = new Set<string>()
  try {
    const u = new URL(url)
    out.add(u.origin)
    // Thêm biến thể www <-> non-www của cùng domain.
    if (u.hostname.startsWith('www.')) {
      out.add(`${u.protocol}//${u.hostname.slice(4)}${u.port ? `:${u.port}` : ''}`)
    } else {
      out.add(`${u.protocol}//www.${u.hostname}${u.port ? `:${u.port}` : ''}`)
    }
  } catch {
    /* URL không hợp lệ -> bỏ qua */
  }
  return [...out]
}

// Gồm domain thật (www + non-www) và localhost cho dev.
const allowedOrigins = Array.from(new Set([...originVariants(SITE_URL), 'http://localhost:3000']))

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

// Lưu media lên Vercel Blob khi có token; nếu không (dev không token) -> tạm dùng local disk.
// QUAN TRỌNG: Vercel serverless có filesystem read-only (trừ /tmp) -> nếu thiếu token,
// KHÔNG được để rơi vào nhánh ghi đĩa cục bộ khi deploy, vì `fs.mkdir('media')` sẽ lỗi
// ENOENT ngay khi upload (đây chính là nguyên nhân lỗi Media 500 trên production).
const blobToken = process.env.BLOB_READ_WRITE_TOKEN
const storagePlugins = blobToken
  ? [
      vercelBlobStorage({
        enabled: true,
        token: blobToken,
        // clientUploads: true -> browser upload thẳng lên Vercel Blob qua URL ký sẵn,
        // không qua server function -> né giới hạn 4.5MB body của Vercel serverless.
        clientUploads: true,
        collections: {
          // Gắn cho collection Media (mọi upload field trỏ tới Media đều đi qua đây).
          // Không truyền disableLocalStorage -> plugin tự mặc định true, tránh 2 cơ chế
          // lưu trữ chồng nhau (local disk + Blob) trên cùng 1 collection.
          [Media.slug]: true,
        },
      }),
    ]
  : []

export default buildConfig({
  serverURL: SITE_URL,
  cors: allowedOrigins,
  csrf: allowedOrigins,
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
  endpoints: [rfqEndpoint, rfqAutosaveEndpoint],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  // DB = Postgres (Neon). Connection string đọc từ env DATABASE_URI.
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      // Ổn định với Neon (free tier tự suspend/cold-start): giữ kết nối sống,
      // cho phép chờ lâu hơn khi DB đang "thức dậy".
      keepAlive: true,
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      max: 10,
    },
    // Dùng MIGRATION làm nguồn schema duy nhất (cả dev lẫn prod) -> ổn định trên Neon,
    // tránh dev-mode "push" introspect gây rớt kết nối. Đổi field -> chạy migrate:create + migrate.
    push: false,
    // Thư mục chứa migration (payload migrate:create / migrate).
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  ...(emailAdapter ? { email: emailAdapter } : {}),
  plugins: storagePlugins,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
