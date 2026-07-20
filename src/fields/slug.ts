import type { Field } from 'payload'

// Chuẩn hóa chuỗi thành slug: bỏ dấu, chữ thường, nối bằng "-".
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // bỏ dấu tiếng Việt/quốc tế (combining marks)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Field slug tái sử dụng. Nếu để trống, tự sinh từ field nguồn (mặc định "title").
 * KHÔNG localize: slug dùng chung cho mọi ngôn ngữ để URL ổn định.
 */
export function slugField(sourceField = 'title'): Field {
  return {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Định danh trên URL. Bỏ trống sẽ tự tạo từ tiêu đề.',
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (typeof value === 'string' && value.length > 0) return slugify(value)
          const source = data?.[sourceField]
          if (typeof source === 'string' && source.length > 0) return slugify(source)
          return value
        },
      ],
    },
  }
}
