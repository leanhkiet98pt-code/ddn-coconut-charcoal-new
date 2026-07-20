// Menu chính — key trỏ tới messages nav.*, href là đường dẫn (chưa gồm locale).
export const mainNav = [
  { key: 'products', href: '/products' },
  { key: 'production', href: '/production' },
  { key: 'certificates', href: '/certificates' },
  { key: 'exportMarkets', href: '/export-markets' },
  { key: 'oem', href: '/oem' },
  { key: 'about', href: '/about' },
  { key: 'blog', href: '/blog' },
  { key: 'contact', href: '/contact' },
] as const

export type NavItem = (typeof mainNav)[number]
