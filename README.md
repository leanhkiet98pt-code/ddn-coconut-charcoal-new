# Charcoal B2B Website (Next.js 15 + Payload CMS 3)

Website B2B tạo uy tín cho nhà sản xuất & xuất khẩu **THAN** (than gáo dừa, BBQ briquette,
than trắng/binchotan, than shisha). Buyer quốc tế vào xem → tin tưởng → điền form **RFQ**
(Request for Quotation).

- **Frontend + SEO**: Next.js 15 (App Router, TypeScript, Tailwind), đa ngôn ngữ EN / KO / JP.
- **CMS**: Payload 3 — chủ doanh nghiệp tự sửa mọi nội dung tại `/admin`, **không cần đụng code**.
- **Hạ tầng (deploy Vercel)**: DB = **Postgres (Neon)**, media = **Vercel Blob** (serverless-friendly,
  không dùng ổ đĩa local).

---

## 1. Yêu cầu môi trường

- Node.js **>= 20.9** (khuyến nghị 20 LTS)
- npm 10+

## 2. Cài đặt & chạy local

Cần một **Postgres** để chạy (kể cả local). Dễ nhất: tạo 1 database miễn phí trên
[Neon](https://neon.tech) và dùng chung cho cả local lẫn production, hoặc chạy Postgres cục bộ.

```bash
npm install                 # cài dependencies
cp .env.example .env         # tạo file env (Windows: copy .env.example .env)
# → Mở .env, điền PAYLOAD_SECRET và DATABASE_URI (connection string Postgres/Neon)
npm run seed                # nạp dữ liệu mẫu (tự tạo bảng ở chế độ dev)
npm run dev                 # chạy dev server
```

> Schema quản lý bằng **migration** (cả dev lẫn prod) — ổn định trên Neon. Lần đầu / sau khi đổi
> collection/field: chạy `npm run migrate:create` rồi `npm run migrate` (xem mục 7). `npm run seed`
> chỉ nạp dữ liệu mẫu, không tạo bảng.
> Chưa có `BLOB_READ_WRITE_TOKEN` khi dev → ảnh upload tạm lưu local disk; có token → lưu Vercel Blob.

Mở trình duyệt:

| URL | Nội dung |
|-----|----------|
| http://localhost:3000/en | Site tiếng Anh (mặc định) |
| http://localhost:3000/ko | Site tiếng Hàn |
| http://localhost:3000/ja | Site tiếng Nhật |
| http://localhost:3000/admin | **CMS quản trị** (tạo tài khoản admin lần đầu ngay tại đây) |

> Lần đầu vào `/admin`, Payload sẽ yêu cầu tạo **tài khoản admin đầu tiên** (email + mật khẩu).

### Các lệnh khác

| Lệnh | Tác dụng |
|------|----------|
| `npm run build` | Build production |
| `npm run start` | Chạy bản production (sau khi build) |
| `npm run seed` | Nạp lại dữ liệu mẫu (idempotent — không tạo trùng) |
| `npm run generate:types` | Sinh lại `payload-types.ts` sau khi đổi cấu trúc collection |
| `npm run generate:importmap` | Sinh lại import map của admin sau khi đổi field tùy biến |

---

## 3. Quản lý nội dung trong `/admin`

Tất cả nội dung nằm trong CMS, chia nhóm ở menu bên trái:

### Catalog
- **Products** — mỗi sản phẩm là một *trang thông số kỹ thuật*: tiêu đề, ảnh đại diện, gallery,
  bảng specs (Fixed Carbon, Ash, Moisture, Calorific Value, MOQ, HS Code…), file **Spec Sheet PDF**,
  applications, nội dung chi tiết, SEO. Bỏ trống dòng spec nào thì dòng đó tự ẩn ngoài site.
- **Categories** — 4 dòng mẫu (Coconut Shell, BBQ Briquette, White Charcoal, Shisha).
  Thêm/sửa/xóa thoải mái; sản phẩm gắn vào category qua trường *Category*.
- **Certificates** — ISO/SGS/Phytosanitary… tải ảnh hoặc PDF; PDF hiển thị icon tài liệu, bấm mở file.

### Content
- **Posts (Blog)** — bài viết: tiêu đề, ảnh bìa, ngày đăng, nội dung, SEO.
- **Export Markets** — quốc gia/khu vực xuất khẩu (cho trang Export Track Record + số liệu trang chủ).
- **Production Steps** — các bước quy trình sản xuất (có thứ tự + ảnh).

### Leads
- **Inquiries (RFQ)** — đơn khách gửi từ form (chỉ đọc). Có trường **Status** (New/Contacted/Quoted/Closed)
  để bạn theo dõi.

### Configuration (Globals)
- **Settings** — tên công ty, năm thành lập, logo, **salesEmail**, **WhatsApp**, văn phòng,
  mã số DN + mã số thuế, mạng xã hội, số liệu Trust Bar.
- **Home Page** — **bật/tắt** và chỉnh sửa từng section trang chủ (hero, trust bar, product groups,
  factory, certificates, export map, buying process, FAQ, RFQ CTA).
- **Pages (About / OEM)** — nội dung 2 trang About và OEM.

> **Thêm 1 sản phẩm → hiện ngay ngoài site**: vào *Products → Create New*, điền tiếng Anh, Save.
> Reload trang `/en/products` sẽ thấy ngay (dev server tự cập nhật).

---

## 4. Quản lý bản dịch KO / JP

Có **2 lớp** ngôn ngữ:

1. **Nội dung CMS** (tên sản phẩm, mô tả, bài viết…): dùng bộ chọn ngôn ngữ **góc trên phải trong admin**.
   - Chọn *English* → điền tiếng Anh → Save.
   - Chuyển sang *한국어* / *日本語* → điền bản dịch cho đúng bản ghi đó → Save.
   - Locale nào **chưa dịch sẽ tự hiển thị tiếng Anh** ngoài site (không để trống).

2. **Chuỗi giao diện** (menu, nút, nhãn form…): nằm trong file
   `src/messages/en.json`, `ko.json`, `ja.json`. Chỉ cần sửa khi muốn đổi chữ cố định của giao diện.
   Key nào thiếu ở `ko`/`ja` cũng **tự fallback về `en`**.

---

## 5. Kiểm tra nhanh (verify)

- Mở `/en`, `/ko`, `/ja` — cả ba đều chạy, chuyển ngôn ngữ bằng nút **EN / KO / JP** trên header.
- Thêm 1 sản phẩm trong `/admin` → xuất hiện ở `/en/products`.
- Gửi form RFQ ở `/en/contact` (hoặc cuối trang sản phẩm) → bản ghi mới xuất hiện trong
  **Inquiries** ở admin; nếu đã cấu hình SMTP thì email gửi tới `salesEmail`.

---

## 6. Biến môi trường (`.env`)

| Biến | Bắt buộc | Mô tả |
|------|:---:|------|
| `PAYLOAD_SECRET` | ✅ | Chuỗi bí mật ký JWT/cookie. Sinh: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `DATABASE_URI` | ✅ | Connection string **Postgres (Neon)**. Dạng `postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require` (dùng chuỗi *Pooled connection* của Neon). |
| `BLOB_READ_WRITE_TOKEN` | ✅ (prod) | Token **Vercel Blob** để lưu media. Bỏ trống khi dev → ảnh lưu local disk. |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Domain thật (canonical + hreflang + sitemap + serverURL + CSRF/CORS). Local: `http://localhost:3000`; production: `https://your-domain.com` |
| `SMTP_HOST` | — | Máy chủ SMTP gửi email RFQ. **Để trống** → đơn vẫn lưu, email chỉ log ra console. |
| `SMTP_PORT` | — | Cổng SMTP (587 mặc định, 465 = SSL) |
| `SMTP_USER` / `SMTP_PASS` | — | Tài khoản SMTP |
| `SMTP_FROM` | — | Địa chỉ hiển thị ở trường *From* |
| `MAKE_WEBHOOK_URL` | — | URL webhook Make.com để đẩy lead sang Google Sheet. **Để trống** → bỏ qua, site vẫn chạy. |

> ⚠️ **Không commit `.env`** (đã có trong `.gitignore`). Email công ty nên dạng `sales@your-domain.com`.

### Cần điền thông tin thật trước khi golive
Dữ liệu seed dùng **placeholder** (tên "Your Company", email `sales@example.com`, mã số `0000…`,
WhatsApp `+840000000000`). Vào **Settings** trong admin để thay bằng thông tin thật:
brand + năm thành lập, salesEmail, WhatsApp/điện thoại, địa chỉ, mã số DN + mã số thuế, logo.
Và đặt `NEXT_PUBLIC_SITE_URL` = domain thật.

---

## 6b. Đẩy lead sang Google Sheet (qua Make.com)

Thu lead tự động có thể đồng bộ sang Google Sheet **mà app KHÔNG giữ credential Google** —
đẩy qua 1 webhook Make.com, Make lo phần ghi Sheet.

**Cách bật:**
1. Tạo scenario trên [Make.com](https://www.make.com): trigger **Webhooks → Custom webhook** → copy URL.
2. Dán URL vào `.env`: `MAKE_WEBHOOK_URL=https://hook.eu2.make.com/xxxxx`
3. Trong Make, nối webhook → module **Google Sheets → Add/Update a Row**, khớp cột theo các field
   nhận được (xem bên dưới), dùng **`sessionId`** làm khóa để *upsert* đúng dòng (không tạo trùng).

**App gửi POST JSON (payload phẳng)** vào 2 thời điểm — KHÔNG gửi mỗi keystroke:
- khi lead đạt **qualified lần đầu** (email hợp lệ + product + quantity),
- khi khách bấm **Submit** (chuyển **complete**) → Make cập nhật lại đúng dòng theo `sessionId`.

Các field trong payload: `sessionId, status, product, quantityPerMonth, destinationPort, incoterm,
packaging, targetPrice, name, company, email, phone, message, sourcePage, createdAt, lastUpdated`
(field trống = chuỗi rỗng). Field `pushedToSheet` trong Inquiries chống đẩy trùng dòng qualified.

> Make lỗi/timeout (URL sai, Make down) → **không ảnh hưởng**: lead vẫn lưu DB + email vẫn gửi,
> chỉ ghi 1 cảnh báo trong log. Cuộc gọi Make chạy nền (non-blocking), timeout 5s.

## 7. Deploy lên Vercel (Postgres Neon + Vercel Blob)

Stack này serverless-friendly: **không dùng ổ đĩa local**. DB nằm trên Neon, media trên Vercel Blob.

### Bước 0 — Tạo migration (một lần, trên máy có DATABASE_URI trỏ Postgres)

Migration là các file SQL mô tả schema, **được commit vào repo** để Vercel tạo bảng lúc deploy.

```bash
# .env đã có DATABASE_URI trỏ Neon/Postgres
npm run migrate:create        # sinh file trong src/migrations (đặt tên, vd: initial)
git add src/migrations && git commit -m "Add Postgres migrations"
```

> Sau này mỗi lần đổi collection/field → chạy lại `npm run migrate:create` rồi commit file mới.

### Bước 1 — Tạo Neon Postgres
1. Vào [neon.tech](https://neon.tech) → tạo project → copy **Pooled connection** string.
2. Đó chính là `DATABASE_URI` (đuôi có `?sslmode=require`).

### Bước 2 — Tạo Vercel Blob store
1. Vercel → **Storage → Create → Blob** → tạo store, gắn vào project.
2. Copy **`BLOB_READ_WRITE_TOKEN`** (Vercel thường tự thêm biến này khi gắn store).

### Bước 3 — Import repo vào Vercel + nhập ENV
Vercel → **Add New → Project → Import** repo GitHub. Vào **Settings → Environment Variables**,
nhập CHÍNH XÁC các biến sau (mục 6 mô tả chi tiết):

| Biến | Bắt buộc |
|------|:---:|
| `PAYLOAD_SECRET` | ✅ |
| `DATABASE_URI` | ✅ (Neon pooled) |
| `BLOB_READ_WRITE_TOKEN` | ✅ (Vercel Blob) |
| `NEXT_PUBLIC_SITE_URL` | ✅ (`https://your-domain.com`) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | tùy chọn (email RFQ) |
| `MAKE_WEBHOOK_URL` | tùy chọn (đẩy Google Sheet) |

### Bước 4 — Deploy → migrate chạy TỰ ĐỘNG
- Vercel dùng script **`vercel-build`** = `payload migrate && next build`, nên **migration chạy trước
  khi build**, tự tạo/cập nhật bảng trên Neon. Không cần thao tác thủ công.
- Build không ghi vào ổ đĩa local; media đi thẳng lên Blob.

### Bước 5 — Tạo admin đầu tiên + (tùy chọn) seed
1. Mở `https://your-domain.com/admin` → tạo **tài khoản admin đầu tiên** (email + mật khẩu).
2. Muốn có dữ liệu mẫu: chạy `npm run seed` **một lần** từ máy local (với `.env` trỏ Neon production),
   hoặc tự nhập nội dung trong `/admin`.
3. Vào **Settings** điền thông tin công ty thật; upload logo/ảnh → lưu trên Vercel Blob, hiện ngoài site.

> **Thứ tự tóm tắt**: tạo Neon + Blob → nhập ENV trên Vercel → deploy (migrate tự chạy → tạo bảng)
> → mở `/admin` tạo admin → seed/nhập nội dung.

---

## 8. Cấu trúc thư mục

```
src/
├─ app/
│  ├─ (frontend)/[locale]/   # Site đa ngôn ngữ (Home, Products, Blog, Contact…)
│  ├─ (payload)/             # Admin CMS + REST/GraphQL API (tự sinh)
│  ├─ sitemap.ts, robots.ts  # SEO
├─ collections/              # Products, Categories, Certificates, Posts, ...
├─ globals/                  # Settings, Home, Pages
├─ endpoints/rfq.ts          # POST /api/rfq — lưu Inquiry + gửi email
├─ components/               # UI, sections, cards, forms
├─ messages/                 # Chuỗi giao diện en/ko/ja
├─ lib/                      # Truy cập dữ liệu Payload, SEO, media helpers
├─ i18n/                     # Cấu hình next-intl
└─ payload.config.ts         # Cấu hình Payload (DB, localization, collections)
```

---

## 9. Ghi chú kỹ thuật

- **Đa ngôn ngữ**: route `/[locale]/…` (next-intl) cho giao diện + Payload localization cho nội dung.
  Fallback về `en` ở cả hai lớp.
- **SEO**: meta động theo trang, `canonical` + `hreflang` (en/ko/ja/x-default) đọc từ
  `NEXT_PUBLIC_SITE_URL`, structured data **Organization** (toàn site) + **Product** (trang sản phẩm),
  `sitemap.xml`, `robots.txt`.
- **Ảnh thiếu**: hiển thị ô placeholder trung tính, không dùng ảnh giả, không vỡ layout.
- **Email RFQ**: nếu chưa cấu hình SMTP, đơn vẫn được lưu vào *Inquiries* và email được ghi ra console.
- **Hạ tầng lưu trữ**: DB = Postgres (`@payloadcms/db-postgres`, đọc `DATABASE_URI`), media =
  Vercel Blob (`@payloadcms/storage-vercel-blob`, đọc `BLOB_READ_WRITE_TOKEN`). Dev không có Blob
  token → media tạm ở local disk. `serverURL`/CSRF/CORS đọc từ `NEXT_PUBLIC_SITE_URL` và tự thêm
  cả biến thể `www` lẫn non-`www` để đăng nhập admin không lỗi domain.
- **Migration**: schema Postgres quản lý bằng migration trong `src/migrations` (commit vào repo);
  Vercel chạy `payload migrate` trước khi build (script `vercel-build`).
