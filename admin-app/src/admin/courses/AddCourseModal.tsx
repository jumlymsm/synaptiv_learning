import { useState } from 'react'
import { X } from 'lucide-react'
import CourseForm from './CourseForm'
import { createCourseBatch } from '../../services/courseService'
import type { CourseBatch, CourseBatchInput } from '../../types'

interface AddCourseModalProps {
  onClose: () => void
  onCreated: (batch: CourseBatch) => void
}

export default function AddCourseModal({ onClose, onCreated }: AddCourseModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: CourseBatchInput) {
    setLoading(true)
    setError(null)
    try {
      const created = await createCourseBatch(data)
      onCreated(created)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course batch.')
    } finally {
      setLoading(false)
    }
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose()
    }
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
            <h2 className="text-lg font-semibold text-gray-900">Add Course Batch</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Create a new training batch for your course catalog.
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
            onSubmit={handleSubmit}
            onCancel={onClose}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
