import { Course } from '../../types'
import { Badge } from '../../components/ui/badge'
import { Switch } from '../../components/ui/switch'
import { Button } from '../../components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'

interface CourseTableProps {
  courses: Course[]
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
  onTogglePublish: (course: Course, published: boolean) => void
}

export default function CourseTable({ courses, onEdit, onDelete, onTogglePublish }: CourseTableProps) {
  if (courses.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400 text-sm">
        No courses yet. Click <span className="font-medium text-gray-600">+ New Course</span> to add one.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Course</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Vendor</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Duration</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Seats</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Pricing</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Published</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => {
            const pct =
              c.listPrice && c.discountedPrice && c.discountedPrice < c.listPrice
                ? Math.round((1 - c.discountedPrice / c.listPrice) * 100)
                : null

            return (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                {/* Course */}
                <td className="px-4 py-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">{c.courseName}</div>
                      {c.shortDescription && (
                        <div className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{c.shortDescription}</div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Vendor */}
                <td className="px-4 py-3">
                  {c.vendor ? (
                    <span className="inline-block border border-gray-200 rounded-full px-2.5 py-0.5 text-xs text-gray-700 max-w-[170px] truncate" title={c.vendor}>
                      {c.vendor}
                    </span>
                  ) : <span className="text-gray-300">—</span>}
                </td>

                {/* Category */}
                <td className="px-4 py-3">
                  {c.category ? <Badge>{c.category}</Badge> : <span className="text-gray-300">—</span>}
                </td>

                {/* Duration */}
                <td className="px-4 py-3 text-sm text-gray-700">{c.duration || <span className="text-gray-300">—</span>}</td>

                {/* Seats */}
                <td className="px-4 py-3 text-sm text-gray-700">{c.seatCapacity ? c.seatCapacity : <span className="text-gray-300">—</span>}</td>

                {/* Pricing */}
                <td className="px-4 py-3">
                  {c.listPrice ? (
                    <div>
                      {pct && (
                        <div className="text-xs text-gray-400 line-through">${c.listPrice.toLocaleString()}</div>
                      )}
                      <div className="text-sm font-semibold text-teal-600">
                        ${(c.discountedPrice ?? c.listPrice).toLocaleString()}
                        {pct && <span className="text-xs font-normal ml-1">({pct}% off)</span>}
                      </div>
                    </div>
                  ) : <span className="text-gray-300">—</span>}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  {c.published ? (
                    <Badge variant="success">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block" />
                      Live
                    </Badge>
                  ) : (
                    <Badge variant="draft">
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      Draft
                    </Badge>
                  )}
                </td>

                {/* Published toggle */}
                <td className="px-4 py-3">
                  <Switch
                    checked={c.published ?? false}
                    onCheckedChange={(v) => onTogglePublish(c, v)}
                  />
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="p-1.5" onClick={() => onEdit(c)}>
                      <Pencil className="w-3.5 h-3.5 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1.5 text-red-500 hover:bg-red-50"
                      onClick={() => onDelete(c)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
