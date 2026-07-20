import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/**
 * Wrapper điều hướng có nhận biết locale.
 * Dùng <Link> / useRouter / usePathname từ đây để tự giữ tiền tố /en /ko /ja.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
