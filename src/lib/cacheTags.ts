// Tag dùng chung giữa lib/payload.ts (nơi gọi unstable_cache) và hooks/revalidate.ts
// (nơi gọi revalidateTag khi admin Save) — giữ 1 nguồn duy nhất để tránh lệch tag.
export const CACHE_TAGS = {
  home: 'global-home',
  settings: 'global-settings',
  pages: 'global-pages',
} as const
