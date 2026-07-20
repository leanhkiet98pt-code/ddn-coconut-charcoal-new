import type { Product } from '../../payload-types'

type Labels = Record<string, string>

/**
 * Bảng thông số kỹ thuật. Chỉ hiện dòng có giá trị (bỏ trống dòng nào thì ẩn dòng đó).
 * Buyer B2B ra quyết định bằng bảng số này.
 */
export function SpecTable({ specs, labels }: { specs: Product['specs']; labels: Labels }) {
  if (!specs) return null

  // Thứ tự hiển thị cố định + ánh xạ tới nhãn i18n.
  const order: Array<[keyof NonNullable<Product['specs']>, string]> = [
    ['fixedCarbon', labels.fixedCarbon],
    ['ash', labels.ash],
    ['moisture', labels.moisture],
    ['volatileMatter', labels.volatileMatter],
    ['calorificValue', labels.calorificValue],
    ['burningTime', labels.burningTime],
    ['dimensions', labels.dimensions],
    ['packing', labels.packing],
    ['moq', labels.moq],
    ['loadingPort', labels.loadingPort],
    ['hsCode', labels.hsCode],
  ]

  const rows = order.filter(([key]) => {
    const v = specs[key]
    return typeof v === 'string' && v.trim().length > 0
  })

  if (rows.length === 0) return null

  return (
    <div className="overflow-hidden rounded-card border border-sand-200">
      <table className="w-full text-sm">
        <tbody className="divide-y divide-sand-200">
          {rows.map(([key, label], i) => (
            <tr key={key} className={i % 2 === 0 ? 'bg-white' : 'bg-sand-50'}>
              <th scope="row" className="w-1/2 px-4 py-3 text-left font-medium text-ink-600 sm:w-2/5">
                {label}
              </th>
              <td className="px-4 py-3 font-semibold text-ink-900">{specs[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
