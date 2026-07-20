import type { Config } from 'tailwindcss'

/**
 * Design system — tông màu brand: VÀNG (gold/amber) + ĐEN (charcoal).
 * Chỉnh mã màu ở đây là đổi toàn site, không phải sửa từng component.
 * Chỉ quét file frontend + components để Tailwind preflight KHÔNG đụng tới admin Payload.
 */
const config: Config = {
  content: [
    './src/app/(frontend)/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/blocks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Đen than — màu nền tối / chữ đậm
        ink: {
          DEFAULT: '#141414',
          950: '#0B0B0B',
          900: '#141414',
          800: '#1E1E1E',
          700: '#2A2A2A',
          600: '#3C3C3C',
          500: '#555555',
          400: '#7A7A7A',
        },
        // Vàng gold/amber — màu nhấn thương hiệu
        gold: {
          DEFAULT: '#E6A400',
          50: '#FCF7E8',
          100: '#FAECC4',
          200: '#F4D888',
          300: '#EFC44D',
          400: '#EBB424',
          500: '#E6A400',
          600: '#C88A00',
          700: '#9F6C00',
          800: '#7A5200',
          900: '#5A3D00',
        },
        // Nền be/kem trung tính
        sand: {
          DEFAULT: '#FAF8F3',
          50: '#FDFCF9',
          100: '#F5F1E8',
          200: '#EBE5D6',
          300: '#DAD2BE',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
      borderRadius: {
        card: '0.75rem',
      },
    },
  },
  plugins: [],
}

export default config
