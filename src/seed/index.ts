/**
 * Script seed dữ liệu mẫu — chạy: `npm run seed`
 * - Idempotent: bỏ qua bản ghi đã tồn tại (theo slug), globals thì update đè.
 * - Không seed ảnh (upload cần file thật); ô ảnh trống hiển thị placeholder trung tính.
 * - Seed 3 ngôn ngữ (en/ko/ja) cho các field chính để minh họa đa ngôn ngữ.
 */
// Nạp biến môi trường từ .env TRƯỚC khi import config (config đọc process.env).
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import type { Payload } from 'payload'

type Locale = 'en' | 'ko' | 'ja'
const LOCALES: Locale[] = ['en', 'ko', 'ja']

// Tạo bản ghi có slug nếu chưa tồn tại; trả về id. Sau đó set bản dịch ko/ja cho field cho trước.
async function upsertBySlug(
  payload: Payload,
  collection: 'categories' | 'products' | 'posts',
  slug: string,
  base: Record<string, unknown>,
  translations?: Partial<Record<Locale, Record<string, unknown>>>,
): Promise<number> {
  const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, locale: 'en' })
  let id: number
  if (existing.docs[0]) {
    id = existing.docs[0].id as number
  } else {
    const created = await payload.create({ collection, locale: 'en', data: { ...base, slug } as never })
    id = created.id as number
  }
  // Áp bản dịch (ko/ja)
  if (translations) {
    for (const loc of ['ko', 'ja'] as Locale[]) {
      if (translations[loc]) {
        await payload.update({ collection, id, locale: loc, data: translations[loc] as never })
      }
    }
  }
  return id
}

async function seed() {
  const payload: Payload = await getPayload({ config })
  payload.logger.info('▶ Seeding sample data…')

  // ---------- CATEGORIES ----------
  const categories: Record<string, number> = {}
  const categoryData: Array<{
    slug: string; en: string; ko: string; ja: string; order: number; descEn: string; descKo: string; descJa: string
  }> = [
    { slug: 'coconut-shell-charcoal', en: 'Coconut Shell Charcoal', ko: '코코넛 숯', ja: 'ヤシ殻炭', order: 1,
      descEn: 'High fixed-carbon charcoal from coconut shells.', descKo: '코코넛 껍질로 만든 고정탄소 함량이 높은 숯.', descJa: 'ヤシ殻から作る高固定炭素の木炭。' },
    { slug: 'bbq-briquette', en: 'BBQ Briquette', ko: 'BBQ 브리켓', ja: 'BBQブリケット', order: 2,
      descEn: 'Long-burning briquettes for grilling.', descKo: '오래 타는 그릴용 브리켓.', descJa: '長時間燃焼するグリル用ブリケット。' },
    { slug: 'white-charcoal', en: 'White Charcoal (Binchotan)', ko: '백탄 (비장탄)', ja: '白炭（備長炭）', order: 3,
      descEn: 'Premium hard white charcoal.', descKo: '프리미엄 경질 백탄.', descJa: '高級な硬質白炭。' },
    { slug: 'shisha-charcoal', en: 'Shisha Charcoal', ko: '시샤 숯', ja: 'シーシャ炭', order: 4,
      descEn: 'Clean-burning cube charcoal for hookah.', descKo: '깨끗하게 타는 후카용 큐브 숯.', descJa: 'クリーンに燃えるフーカ用キューブ炭。' },
  ]
  for (const c of categoryData) {
    categories[c.slug] = await upsertBySlug(
      payload, 'categories', c.slug,
      { title: c.en, order: c.order, shortDescription: c.descEn },
      { ko: { title: c.ko, shortDescription: c.descKo }, ja: { title: c.ja, shortDescription: c.descJa } },
    )
  }
  payload.logger.info(`  ✓ Categories: ${Object.keys(categories).length}`)

  // ---------- PRODUCTS ----------
  const productData = [
    {
      slug: 'coconut-shell-charcoal-lump', cat: 'coconut-shell-charcoal',
      en: 'Coconut Shell Charcoal Lump', ko: '코코넛 숯 (럼프)', ja: 'ヤシ殻炭 ランプ',
      descEn: 'Natural hardwood-alternative lump charcoal with high heat and low ash.',
      descKo: '높은 발열과 낮은 회분의 천연 럼프 숯.',
      descJa: '高発熱・低灰分の天然ランプ炭。',
      specs: { fixedCarbon: '78–82%', ash: '≤ 3%', moisture: '≤ 6%', volatileMatter: '≤ 15%', calorificValue: '7,000–7,500 kcal/kg', burningTime: '3–4 hours', dimensions: '2–5 cm', packing: '10 / 15 kg carton', moq: '1 x 20ft FCL', loadingPort: 'Ho Chi Minh Port', hsCode: '4402.90' },
      apps: ['BBQ & grilling', 'Restaurants & HORECA', 'Industrial fuel'],
    },
    {
      slug: 'bbq-briquette-cube', cat: 'bbq-briquette',
      en: 'BBQ Briquette (Cube)', ko: 'BBQ 브리켓 (큐브)', ja: 'BBQブリケット（キューブ）',
      descEn: 'Compressed cube briquette, consistent size and long burn time.',
      descKo: '균일한 크기와 긴 연소 시간의 압축 큐브 브리켓.',
      descJa: '均一なサイズと長い燃焼時間の圧縮キューブブリケット。',
      specs: { fixedCarbon: '72–75%', ash: '≤ 5%', moisture: '≤ 8%', volatileMatter: '≤ 18%', calorificValue: '6,500–7,000 kcal/kg', burningTime: '2–3 hours', dimensions: '25 x 25 x 25 mm', packing: '10 kg carton', moq: '1 x 20ft FCL', loadingPort: 'Ho Chi Minh Port', hsCode: '4402.90' },
      apps: ['Retail BBQ', 'Private label', 'Outdoor grilling'],
    },
    {
      slug: 'white-charcoal-binchotan', cat: 'white-charcoal',
      en: 'White Charcoal (Binchotan)', ko: '백탄 (비장탄)', ja: '白炭（備長炭）',
      descEn: 'Dense, metallic-ringing white charcoal for premium grilling.',
      descKo: '프리미엄 그릴용 고밀도 백탄.',
      descJa: 'プレミアムグリル用の高密度白炭。',
      specs: { fixedCarbon: '≥ 85%', ash: '≤ 2%', moisture: '≤ 5%', volatileMatter: '≤ 10%', calorificValue: '7,500–8,000 kcal/kg', burningTime: '4–6 hours', dimensions: '3–7 cm', packing: '10 kg carton', moq: '1 x 20ft FCL', loadingPort: 'Ho Chi Minh Port', hsCode: '4402.90' },
      apps: ['Yakitori & fine dining', 'Premium HORECA', 'Air / water purification'],
    },
    {
      slug: 'shisha-cube-charcoal', cat: 'shisha-charcoal',
      en: 'Shisha Cube Charcoal', ko: '시샤 큐브 숯', ja: 'シーシャ キューブ炭',
      descEn: 'Odorless, low-ash coconut cube charcoal for hookah lounges.',
      descKo: '무취·저회분의 후카용 코코넛 큐브 숯.',
      descJa: '無臭・低灰分のフーカ用ヤシ殻キューブ炭。',
      specs: { fixedCarbon: '≥ 80%', ash: '≤ 2.5%', moisture: '≤ 5%', volatileMatter: '≤ 12%', calorificValue: '7,000–7,500 kcal/kg', burningTime: '60–90 min', dimensions: '25 / 26 mm cube', packing: '1 kg box / 20 kg carton', moq: '1 x 20ft FCL', loadingPort: 'Ho Chi Minh Port', hsCode: '4402.90' },
      apps: ['Hookah / shisha lounges', 'Private label', 'Export distribution'],
    },
  ]
  let productCount = 0
  for (const p of productData) {
    await upsertBySlug(
      payload, 'products', p.slug,
      {
        title: p.en, category: categories[p.cat], shortDescription: p.descEn,
        specs: p.specs, applications: p.apps.map((item) => ({ item })),
      },
      {
        ko: { title: p.ko, shortDescription: p.descKo },
        ja: { title: p.ja, shortDescription: p.descJa },
      },
    )
    productCount++
  }
  payload.logger.info(`  ✓ Products: ${productCount}`)

  // ---------- CERTIFICATES ----------
  const certData = [
    { title: 'ISO 9001:2015', type: 'Quality Management', desc: 'Quality management system certification.' },
    { title: 'SGS Test Report', type: 'Lab Analysis', desc: 'Independent lab analysis of fixed carbon, ash and moisture.' },
    { title: 'Phytosanitary Certificate', type: 'Export Compliance', desc: 'Plant health certificate for export shipments.' },
  ]
  for (const c of certData) {
    const exists = await payload.find({ collection: 'certificates', where: { title: { equals: c.title } }, limit: 1, locale: 'en' })
    if (!exists.docs[0]) {
      await payload.create({ collection: 'certificates', locale: 'en', data: { title: c.title, type: c.type, description: c.desc } })
    }
  }
  payload.logger.info(`  ✓ Certificates: ${certData.length}`)

  // ---------- EXPORT MARKETS ----------
  const marketData = [
    { country: 'South Korea', code: 'KR', region: 'East Asia', ko: '대한민국', ja: '韓国' },
    { country: 'Japan', code: 'JP', region: 'East Asia', ko: '일본', ja: '日本' },
    { country: 'Germany', code: 'DE', region: 'Europe', ko: '독일', ja: 'ドイツ' },
    { country: 'United Arab Emirates', code: 'AE', region: 'Middle East', ko: '아랍에미리트', ja: 'アラブ首長国連邦' },
    { country: 'United States', code: 'US', region: 'North America', ko: '미국', ja: 'アメリカ' },
    { country: 'Saudi Arabia', code: 'SA', region: 'Middle East', ko: '사우디아라비아', ja: 'サウジアラビア' },
  ]
  for (const m of marketData) {
    const exists = await payload.find({ collection: 'export-markets', where: { countryCode: { equals: m.code } }, limit: 1, locale: 'en' })
    if (!exists.docs[0]) {
      const created = await payload.create({ collection: 'export-markets', locale: 'en', data: { country: m.country, countryCode: m.code, region: m.region } })
      await payload.update({ collection: 'export-markets', id: created.id, locale: 'ko', data: { country: m.ko } })
      await payload.update({ collection: 'export-markets', id: created.id, locale: 'ja', data: { country: m.ja } })
    }
  }
  payload.logger.info(`  ✓ Export markets: ${marketData.length}`)

  // ---------- PRODUCTION STEPS ----------
  const stepData = [
    { order: 1, en: 'Raw Material Sourcing', ko: '원재료 조달', ja: '原材料の調達', descEn: 'Selected coconut shells and hardwood from controlled suppliers.' },
    { order: 2, en: 'Carbonization', ko: '탄화', ja: '炭化', descEn: 'High-temperature carbonization in controlled kilns.' },
    { order: 3, en: 'Shaping & Pressing', ko: '성형 및 압축', ja: '成形・圧縮', descEn: 'Crushing, mixing and pressing into lumps, cubes or briquettes.' },
    { order: 4, en: 'Quality Control & Packing', ko: '품질 관리 및 포장', ja: '品質管理・梱包', descEn: 'Lab testing, moisture control and export packing.' },
  ]
  for (const s of stepData) {
    const exists = await payload.find({ collection: 'production-steps', where: { order: { equals: s.order } }, limit: 1, locale: 'en' })
    if (!exists.docs[0]) {
      const created = await payload.create({ collection: 'production-steps', locale: 'en', data: { order: s.order, title: s.en, description: s.descEn } })
      await payload.update({ collection: 'production-steps', id: created.id, locale: 'ko', data: { title: s.ko } })
      await payload.update({ collection: 'production-steps', id: created.id, locale: 'ja', data: { title: s.ja } })
    }
  }
  payload.logger.info(`  ✓ Production steps: ${stepData.length}`)

  // ---------- BLOG POSTS ----------
  const richText = (text: string) => ({
    root: {
      type: 'root', direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
      children: [
        { type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1,
          children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }] },
      ],
    },
  })
  const postData = [
    { slug: 'how-to-choose-charcoal-supplier', en: 'How to Choose a Reliable Charcoal Supplier', ko: '신뢰할 수 있는 숯 공급업체 선택 방법', ja: '信頼できる木炭サプライヤーの選び方',
      excerptEn: 'Key criteria B2B buyers should verify before importing charcoal.',
      bodyEn: 'When sourcing charcoal for export, verify fixed carbon, ash content, moisture and consistent supply capacity. Always request an SGS test report and a sample before placing a bulk order.' },
    { slug: 'coconut-vs-hardwood-charcoal', en: 'Coconut Shell vs Hardwood Charcoal', ko: '코코넛 숯 vs 하드우드 숯', ja: 'ヤシ殻炭とハードウッド炭の比較',
      excerptEn: 'Understand the differences in heat, ash and application.',
      bodyEn: 'Coconut shell charcoal offers high heat and low ash, ideal for shisha and grilling, while hardwood charcoal is prized for aroma. Choose based on your end-use and market requirements.' },
  ]
  for (const p of postData) {
    await upsertBySlug(
      payload, 'posts', p.slug,
      { title: p.en, excerpt: p.excerptEn, publishedDate: '2025-01-15T00:00:00.000Z', richContent: richText(p.bodyEn) },
      { ko: { title: p.ko }, ja: { title: p.ja } },
    )
  }
  payload.logger.info(`  ✓ Posts: ${postData.length}`)

  // ---------- GLOBAL: SETTINGS ----------
  await payload.updateGlobal({
    slug: 'settings', locale: 'en',
    data: {
      companyName: 'Your Company',
      foundedYear: 2010,
      tagline: 'Charcoal manufacturer & exporter for global B2B buyers.',
      legalEntity: { name: 'Your Company Co., Ltd.', businessCode: '0000000000', taxCode: '0000000000' },
      salesEmail: 'sales@example.com',
      whatsappNumber: '+840000000000',
      phone: '+84 000 000 000',
      offices: [{ label: 'Head Office', address: '123 Example Street, District 1, Ho Chi Minh City, Vietnam' }],
      trustBar: { containersPerMonth: '80+', countries: '15+', certsNote: 'ISO 9001 · SGS', yearsExporting: '12+' },
      socialLinks: [{ platform: 'alibaba', url: 'https://example.trustpass.alibaba.com' }],
    } as never,
  })
  // Bản dịch companyName / tagline
  await payload.updateGlobal({ slug: 'settings', locale: 'ko', data: { companyName: '귀사명', tagline: '글로벌 B2B 바이어를 위한 숯 제조 및 수출 기업.' } as never })
  await payload.updateGlobal({ slug: 'settings', locale: 'ja', data: { companyName: '貴社名', tagline: 'グローバルB2Bバイヤー向けの木炭製造・輸出企業。' } as never })
  payload.logger.info('  ✓ Global: Settings')

  // ---------- GLOBAL: HOME ----------
  await payload.updateGlobal({
    slug: 'home', locale: 'en',
    data: {
      hero: { enabled: true },
      trustBar: { enabled: true },
      productGroups: { enabled: true },
      factory: { enabled: true },
      certificates: { enabled: true },
      exportMap: { enabled: true },
      buyingProcess: {
        enabled: true,
        steps: [
          { title: 'Send RFQ', description: 'Tell us product, quantity, destination port and Incoterm.' },
          { title: 'Receive Quotation', description: 'Get specs, MOQ and FOB/CIF pricing within 1 business day.' },
          { title: 'Sample & Contract', description: 'Approve a sample, confirm terms and sign the sales contract.' },
          { title: 'Production & Shipping', description: 'We produce, inspect, pack and ship with full export documents.' },
        ],
      },
      faq: {
        enabled: true,
        items: [
          { question: 'What is your MOQ?', answer: 'Typically 1 x 20ft FCL per product. Contact us for mixed containers.' },
          { question: 'Can you do private label / OEM?', answer: 'Yes. We produce under your brand with custom retail packaging.' },
          { question: 'Which Incoterms do you support?', answer: 'FOB, CFR and CIF are most common. We can quote EXW to DDP on request.' },
        ],
      },
      rfqCta: { enabled: true },
    } as never,
  })
  payload.logger.info('  ✓ Global: Home')

  // ---------- GLOBAL: PAGES ----------
  await payload.updateGlobal({
    slug: 'pages', locale: 'en',
    data: {
      about: {
        showCompanyDetails: true,
        body: richText('We are a charcoal manufacturer and exporter serving international B2B buyers with coconut shell charcoal, BBQ briquettes, white charcoal and shisha charcoal. Our own production and quality control ensure consistent, export-ready specifications.'),
      },
      oem: {
        body: richText('We manufacture under your brand — from bulk supply to retail-ready private label packaging. Share your artwork and packaging requirements and we will handle the rest.'),
        features: [
          { title: 'Custom packaging', description: 'Cartons, boxes and bags printed with your brand.' },
          { title: 'Flexible specs', description: 'Adjust size, fixed carbon and burn time to your market.' },
          { title: 'Export documentation', description: 'CO, phytosanitary, SGS and full shipping documents.' },
        ],
      },
    } as never,
  })
  payload.logger.info('  ✓ Global: Pages')

  payload.logger.info('✅ Seed completed.')
  // Chờ một nhịp để log flush trước khi thoát.
  await new Promise((r) => setTimeout(r, 300))
  process.exit(0)
}

seed().catch((err) => {
  console.error('[seed] FAILED:', err)
  process.exit(1)
})
