import { useState, useEffect } from 'react'
import type { CourseBatchInput } from '../../types'

const PROGRAM_OPTIONS = [
  'CBAP Certification',
  'PMP Certification',
  'Certified Scrum Master (CSM)',
  'SAFe Scrum Master',
  'SAFe POPM',
]

const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'NGN']

interface CourseFormProps {
  initialValues?: Partial<CourseBatchInput>
  onSubmit: (data: CourseBatchInput) => void
  onCancel: () => void
  loading: boolean
}

type FormErrors = Partial<Record<keyof CourseBatchInput, string>>

const DEFAULT_VALUES: CourseBatchInput = {
  programName: '',
  courseCode: '',
  trainerName: '',
  startDate: '',
  endDate: '',
  listPrice: 0,
  discountedPrice: 0,
  discountStartDate: '',
  discountEndDate: '',
  currency: 'USD',
  maxSeats: 20,
}

export default function CourseForm({
  initialValues,
  onSubmit,
  onCancel,
  loading,
}: CourseFormProps) {
  const [values, setValues] = useState<CourseBatchInput>({
    ...DEFAULT_VALUES,
    ...initialValues,
  })
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    setValues({ ...DEFAULT_VALUES, ...initialValues })
  }, [initialValues])

  function setField<K extends keyof CourseBatchInput>(key: K, val: CourseBatchInput[K]) {
    setValues((prev) => ({ ...prev, [key]: val }))
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  function validate(): boolean {
    const newErrors: FormErrors = {}

    if (!values.programName.trim()) {
      newErrors.programName = 'Program name is required.'
    }
    if (!values.startDate) {
      newErrors.startDate = 'Start date is required.'
    }
    if (!values.endDate) {
      newErrors.endDate = 'End date is required.'
    }
    if (values.startDate && values.endDate && values.startDate >= values.endDate) {
      newErrors.endDate = 'End date must be after start date.'
    }
    if (
      values.listPrice > 0 &&
      values.discountedPrice > 0 &&
      values.discountedPrice > values.listPrice
    ) {
      newErrors.discountedPrice = 'Discounted price must not exceed list price.'
    }
    if (
      values.discountEndDate &&
      values.startDate &&
      values.discountEndDate > values.startDate
    ) {
      newErrors.discountEndDate = 'Discount end date must be on or before start date.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    onSubmit(values)
  }

  const currencySymbol: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'AED',
    SAR: 'SAR',
    NGN: '₦',
  }
  const sym = currencySymbol[values.currency] ?? values.currency

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Program Name */}
      <div>
        <label className="label" htmlFor="programName">
          Program Name <span className="text-red-500">*</span>
        </label>
        <select
          id="programName"
          value={values.programName}
          onChange={(e) => setField('programName', e.target.value)}
          className={`input-field ${errors.programName ? 'input-error' : ''}`}
        >
          <option value="">Select a program…</option>
          {PROGRAM_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {errors.programName && (
          <p className="mt-1 text-xs text-red-600">{errors.programName}</p>
        )}
      </div>

      {/* Course Code */}
      <div>
        <label className="label" htmlFor="courseCode">
          Course Code
        </label>
        <input
          id="courseCode"
          type="text"
          value={values.courseCode}
          onChange={(e) => setField('courseCode', e.target.value)}
          placeholder="e.g. CBAP-APR-2026"
          className="input-field font-mono"
        />
      </div>

      {/* Trainer Name */}
      <div>
        <label className="label" htmlFor="trainerName">
          Trainer Name
        </label>
        <input
          id="trainerName"
          type="text"
          value={values.trainerName}
          onChange={(e) => setField('trainerName', e.target.value)}
          placeholder="e.g. Sarah Mitchell"
          className="input-field"
        />
      </div>

      {/* Start & End Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="startDate">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            id="startDate"
            type="date"
            value={values.startDate}
            onChange={(e) => setField('startDate', e.target.value)}
            className={`input-field ${errors.startDate ? 'input-error' : ''}`}
          />
          {errors.startDate && (
            <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>
          )}
        </div>
        <div>
          <label className="label" htmlFor="endDate">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            id="endDate"
            type="date"
            value={values.endDate}
            onChange={(e) => setField('endDate', e.target.value)}
            className={`input-field ${errors.endDate ? 'input-error' : ''}`}
          />
          {errors.endDate && (
            <p className="mt-1 text-xs text-red-600">{errors.endDate}</p>
          )}
        </div>
      </div>

      {/* Currency */}
      <div>
        <label className="label" htmlFor="currency">
          Currency
        </label>
        <select
          id="currency"
          value={values.currency}
          onChange={(e) => setField('currency', e.target.value)}
          className="input-field"
        >
          {CURRENCY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* List Price & Discounted Price */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="listPrice">
            List Price
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-sm text-gray-500 pointer-events-none">
              {sym}
            </span>
            <input
              id="listPrice"
              type="number"
              min={0}
              step={0.01}
              value={values.listPrice || ''}
              onChange={(e) => setField('listPrice', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className={`input-field pl-8 ${errors.listPrice ? 'input-error' : ''}`}
            />
          </div>
          {errors.listPrice && (
            <p className="mt-1 text-xs text-red-600">{errors.listPrice}</p>
          )}
        </div>
        <div>
          <label className="label" htmlFor="discountedPrice">
            Discounted Price
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-sm text-gray-500 pointer-events-none">
              {sym}
            </span>
            <input
              id="discountedPrice"
              type="number"
              min={0}
              step={0.01}
              value={values.discountedPrice || ''}
              onChange={(e) =>
                setField('discountedPrice', parseFloat(e.target.value) || 0)
              }
              placeholder="0.00"
              className={`input-field pl-8 ${errors.discountedPrice ? 'input-error' : ''}`}
            />
          </div>
          {errors.discountedPrice && (
            <p className="mt-1 text-xs text-red-600">{errors.discountedPrice}</p>
          )}
        </div>
      </div>

      {/* Discount Period */}
      <div>
        <p className="label">Discount Period</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block" htmlFor="discountStartDate">
              From
            </label>
            <input
              id="discountStartDate"
              type="date"
              value={values.discountStartDate}
              onChange={(e) => setField('discountStartDate', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block" htmlFor="discountEndDate">
              To
            </label>
            <input
              id="discountEndDate"
              type="date"
              value={values.discountEndDate}
              onChange={(e) => setField('discountEndDate', e.target.value)}
              className={`input-field ${errors.discountEndDate ? 'input-error' : ''}`}
            />
            {errors.discountEndDate && (
              <p className="mt-1 text-xs text-red-600">{errors.discountEndDate}</p>
            )}
          </div>
        </div>
      </div>

      {/* Max Seats */}
      <div>
        <label className="label" htmlFor="maxSeats">
          Max Seats
        </label>
        <input
          id="maxSeats"
          type="number"
          min={1}
          value={values.maxSeats || ''}
          onChange={(e) => setField('maxSeats', parseInt(e.target.value) || 0)}
          placeholder="e.g. 20"
          className="input-field"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Saving…
            </>
          ) : (
            'Save Batch'
          )}
        </button>
      </div>
    </form>
  )
}
