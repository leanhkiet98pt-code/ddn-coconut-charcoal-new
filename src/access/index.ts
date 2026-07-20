import type { Access } from 'payload'

// Ai cũng đọc được (nội dung công khai trên site).
export const anyone: Access = () => true

// Chỉ user đã đăng nhập (admin) mới thao tác.
export const authenticated: Access = ({ req: { user } }) => Boolean(user)
