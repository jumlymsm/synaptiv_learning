import { useState } from 'react'
import { Pencil, Trash2, BookOpen } from 'lucide-react'
import type { CourseBatch } from '../../types'

interface CourseTableProps {
  batches: CourseBatch[]
  onEdit: (batch: CourseBatch) => void
  onDelete: (id: string) => void
}

function formatDateRange(start: string, end: string): string {
  if (!start && !end) return '—'
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  const yearOpts: Intl.DateTimeFormatOptions = { year: 'numeric' }

  const startDate = new Date(start + 'T00:00:00')
  const endDate = end ? new Date(end + 'T00:00:00') : null

  const startStr = startDate.toLocaleDateString('en-US', opts)
  const year = startDate.toLocaleDateString('en-US', yearOpts)

  if (!endDate) return `${startStr}, ${year}`

  const endStr = endDate.toLocaleDateString('en-US', opts)
  return `${startStr} – ${endStr}, ${year}`
}

function formatDiscountPeriod(start: string, end: string): string {
  if (!start && !end) return '—'
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  const startStr = start ? new Date(start + 'T00:00:00').toLocaleDateString('en-US', opts) : '—'
  const endStr = end ? new Date(end + 'T00:00:00').toLocaleDateString('en-US', opts) : '—'
  return `${startStr} → ${endStr}`
}

function formatPrice(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'AED ',
    SAR: 'SAR ',
    NGN: '₦',
  }
  const sym = symbols[currency] ?? currency + ' '
  return `${sym}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export default function CourseTable({ batches, onEdit, onDelete }: CourseTableProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  if (batches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <BookOpen className="w-7 h-7 text-gray-400" />
        </div>
        <p className="text-base font-medium text-gray-700">No courses found.</p>
        <p className="text-sm text-gray-400 mt-1">Add your first batch using the button above.</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Program
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Trainer
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Dates
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                List Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Sale Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Discount Period
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Seats
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {batches.map((batch) => {
              const hasDiscount = batch.discountedPrice < batch.listPrice
              return (
                <tr
                  key={batch.id}
                  className="hover:bg-gray-50 transition-colors duration-100 group"
                >
                  <td className="px-4 py-3.5 max-w-[200px]">
                    <span className="font-medium text-gray-900 block truncate">
                      {batch.programName}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                      {batch.courseCode || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-gray-600">
                    {batch.trainerName || '—'}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-gray-600">
                    {formatDateRange(batch.startDate, batch.endDate)}
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap text-gray-600">
                    {formatPrice(batch.listPrice, batch.currency)}
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    {hasDiscount ? (
                      <span className="font-medium text-green-600">
                        {formatPrice(batch.discountedPrice, batch.currency)}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No discount</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-gray-500 text-xs">
                    {batch.discountStartDate || batch.discountEndDate
                      ? formatDiscountPeriod(batch.discountStartDate, batch.discountEndDate)
                      : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold">
                      {batch.maxSeats}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        onClick={() => onEdit(batch)}
                        className="btn-edit"
                        title="Edit batch"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(batch.id)}
                        className="btn-danger"
                        title="Delete batch"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmDeleteId(null)
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Delete Batch</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this course batch? All associated data will be
              permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(confirmDeleteId)
                  setConfirmDeleteId(null)
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
