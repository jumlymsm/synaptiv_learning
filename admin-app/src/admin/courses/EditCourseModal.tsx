import { useState } from 'react'
import { X } from 'lucide-react'
import CourseForm from './CourseForm'
import { updateCourseBatch } from '../../services/courseService'
import type { CourseBatch, CourseBatchInput } from '../../types'

interface EditCourseModalProps {
  batch: CourseBatch
  onClose: () => void
  onUpdated: (batch: CourseBatch) => void
}

export default function EditCourseModal({
  batch,
  onClose,
  onUpdated,
}: EditCourseModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: CourseBatchInput) {
    setLoading(true)
    setError(null)
    try {
      const updated = await updateCourseBatch(batch.id, data)
      onUpdated(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course batch.')
    } finally {
      setLoading(false)
    }
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const initialValues: Partial<CourseBatchInput> = {
    programName: batch.programName,
    courseCode: batch.courseCode,
    trainerName: batch.trainerName,
    startDate: batch.startDate,
    endDate: batch.endDate,
    listPrice: batch.listPrice,
    discountedPrice: batch.discountedPrice,
    discountStartDate: batch.discountStartDate,
    discountEndDate: batch.discountEndDate,
    currency: batch.currency,
    maxSeats: batch.maxSeats,
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Edit Course Batch</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Update details for{' '}
              <span className="font-medium text-gray-700">{batch.programName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          <CourseForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onCancel={onClose}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
