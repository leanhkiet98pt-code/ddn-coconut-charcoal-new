# Charcoal B2B Website (Next.js 15 + Payload CMS 3)

Website B2B tạo uy tín cho nhà sản xuất & xuất khẩu **THAN** (than gáo dừa, BBQ briquette,
than trắng/binchotan, than shisha). Buyer quốc tế vào xem → tin tưởng → điền form **RFQ**
(Request for Quotation).

- **Frontend + SEO**: Next.js 15 (App Router, TypeScript, Tailwind), đa ngôn ngữ EN / KO / JP.
- **CMS**: Payload 3 self-host, DB **SQLite** — chủ doanh nghiệp tự sửa mọi nội dung tại `/admin`,
  **không cần đụng code**.

---

## 1. Yêu cầu môi trường

- Node.js **>= 20.9** (khuyến nghị 20 LTS)
- npm 10+

## 2. Cài đặt & chạy local

```bash
npm install           # cài dependencies
cp .env.example .env   # tạo file biến môi trường (xem mục 6) — Windows: copy .env.example .env
npm run seed          # nạp dữ liệu mẫu (4 sản phẩm, chứng chỉ, blog, thị trường…)
npm run dev           # chạy dev server
```

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
| `DATABASE_URI` | ✅ | Kết nối SQLite, mặc định `file:./ddn.db` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Domain thật (canonical + hreflang + sitemap). Local: `http://localhost:3000`; production: `https://your-domain.com` |
| `SMTP_HOST` | — | Máy chủ SMTP gửi email RFQ. **Để trống** → đơn vẫn lưu, email chỉ log ra console. |
| `SMTP_PORT` | — | Cổng SMTP (587 mặc định, 465 = SSL) |
| `SMTP_USER` / `SMTP_PASS` | — | Tài khoản SMTP |
| `SMTP_FROM` | — | Địa chỉ hiển thị ở trường *From* |

> ⚠️ **Không commit `.env`** (đã có trong `.gitignore`). Email công ty nên dạng `sales@your-domain.com`.

### Cần điền thông tin thật trước khi golive
Dữ liệu seed dùng **placeholder** (tên "Your Company", email `sales@example.com`, mã số `0000…`,
WhatsApp `+840000000000`). Vào **Settings** trong admin để thay bằng thông tin thật:
brand + năm thành lập, salesEmail, WhatsApp/điện thoại, địa chỉ, mã số DN + mã số thuế, logo.
Và đặt `NEXT_PUBLIC_SITE_URL` = domain thật.

---

## 7. Hướng dẫn deploy (giữ SQLite + volume bền vững)

SQLite lưu dữ liệu trong **1 file** (`ddn.db`) và ảnh upload trong thư mục **`media/`**.
Khi deploy phải gắn **persistent volume** cho cả hai, nếu không dữ liệu sẽ mất mỗi lần deploy lại.

### Cách nhanh nhất — Railway

1. Push code lên GitHub (đã có `.gitignore` loại `.env`, `ddn.db`, `media/`).
2. Tạo project mới trên [Railway](https://railway.app) → *Deploy from GitHub repo*.
3. **Variables**: thêm `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL` (= domain Railway/domain thật),
   `DATABASE_URI=file:/data/ddn.db`, và SMTP nếu có.
4. **Volume**: tạo 1 volume, mount vào `/data` (chứa file DB) — và mount thêm cho `media/`
   (hoặc trỏ upload sang `/data/media`). Đặt `DATABASE_URI=file:/data/ddn.db`.
5. Build command: `npm run build` — Start command: `npm run start`.
6. Sau khi deploy lần đầu, chạy `npm run seed` **một lần** (qua Railway shell) nếu muốn dữ liệu mẫu;
   hoặc bỏ qua và tự nhập trong `/admin`.

> Nền tảng khác (Fly.io, VPS, Render…) tương tự: điều kiện là **file `ddn.db` và thư mục `media/`
> nằm trên ổ đĩa bền vững**. Khi cần quy mô lớn hơn, có thể chuyển sang Postgres bằng
> `@payloadcms/db-postgres` (đổi adapter trong `src/payload.config.ts` + migrate dữ liệu).

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
