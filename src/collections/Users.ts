import type { CollectionConfig } from 'payload'

// Tài khoản quản trị đăng nhập vào /admin. Không localize (dữ liệu hệ thống).
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'User', plural: 'Users' },
  admin: {
    useAsTitle: 'name',
    group: 'System',
    defaultColumns: ['name', 'email'],
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
