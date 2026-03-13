import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Course, CourseInput } from './types'

const VENDORS = ['PMI (Project Management Institute)', 'IIBA (International Institute of Business Analysis)', 'Scrum Alliance', 'Scaled Agile, Inc.', 'AXELOS', 'CompTIA', 'Microsoft', 'AWS', 'Google', 'Other']
const CATEGORIES = ['Agile', 'Business Analysis', 'Project Management', 'Data & AI', 'Leadership', 'IT & Cloud', 'Other']
const DURATIONS = ['1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '1 Week', '2 Weeks', '4 Weeks', 'Self-Paced']

function slug(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
}

const EMPTY: CourseInput = {
  courseName: '', vendor: '', category: '', duration: '', seatCapacity: null,
  listPrice: null, discountedPrice: null, badgeLogoUrl: '', shortDescription: '',
  fullDescription: '', learningObjectives: '', curriculumOverview: '',
  targetAudience: '', certificationDetails: '', trainerProfile: '',
  urlSlug: '', published: false,
}

interface Props {
  open: boolean
  course: Course | null
  onClose: () => void
  onSave: (input: CourseInput) => void
}

export default function CourseModal({ open, course, onClose, onSave }: Props) {
  const [f, setF] = useState<CourseInput>(EMPTY)
  const [slugManual, setSlugManual] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      setF(course ? { ...course } : { ...EMPTY })
      setSlugManual(!!course)
      setErrors({})
    }
  }, [open, course])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  function set<K extends keyof CourseInput>(k: K, v: CourseInput[K]) {
    setF(prev => {
      const next = { ...prev, [k]: v }
      if (k === 'courseName' && !slugManual) next.urlSlug = slug(v as string)
      return next
    })
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!f.courseName.trim()) e.courseName = 'Required'
    if (!f.vendor.trim()) e.vendor = 'Required'
    if (!f.category) e.category = 'Required'
    if (!f.shortDescription.trim()) e.shortDescription = 'Required'
    if (f.discountedPrice && f.listPrice && f.discountedPrice >= f.listPrice)
      e.discountedPrice = 'Must be less than list price'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    onSave(f)
    onClose()
  }

  if (!open) return null

  const inp = (label: string, key: keyof CourseInput, opts?: { required?: boolean; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {label}{opts?.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={opts?.type ?? 'text'}
        value={(f[key] as string | number) ?? ''}
        onChange={e => set(key, (opts?.type === 'number' ? (e.target.value ? Number(e.target.value) : null) : e.target.value) as CourseInput[typeof key])}
        placeholder={opts?.placeholder}
        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors[key] ? 'border-red-400' : 'border-gray-200'}`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )

  const ta = (label: string, key: keyof CourseInput, opts?: { required?: boolean; placeholder?: string; rows?: number }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {label}{opts?.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        value={(f[key] as string) ?? ''}
        onChange={e => set(key, e.target.value as CourseInput[typeof key])}
        placeholder={opts?.placeholder}
        rows={opts?.rows ?? 2}
        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y ${errors[key] ? 'border-red-400' : 'border-gray-200'}`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )

  const sel = (label: string, key: keyof CourseInput, options: string[], required = false) => (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        value={(f[key] as string) ?? ''}
        onChange={e => set(key, e.target.value as CourseInput[typeof key])}
        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors[key] ? 'border-red-400' : 'border-gray-200'}`}
      >
        <option value="">— Select —</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="font-semibold text-gray-900">{course ? 'Edit Course' : 'New Course'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"><X className="w-4 h-4" /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {inp('Course Name', 'courseName', { required: true, placeholder: 'e.g. PMP Certification Training' })}

          <div className="grid grid-cols-2 gap-3">
            {sel('Vendor / Certification Body', 'vendor', VENDORS, true)}
            {sel('Category', 'category', CATEGORIES, true)}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {sel('Duration', 'duration', DURATIONS)}
            {inp('Seat Capacity', 'seatCapacity', { type: 'number', placeholder: 'e.g. 20' })}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">URL Slug</label>
            <input
              value={f.urlSlug}
              onChange={e => { setSlugManual(true); set('urlSlug', e.target.value) }}
              placeholder="pmp-certification-training"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-xs text-gray-400 mt-1">Auto-generated from course name</p>
          </div>

          {/* Pricing */}
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Pricing</p>
            <div className="grid grid-cols-2 gap-3">
              {inp('List Price ($)', 'listPrice', { type: 'number', placeholder: '1500' })}
              {inp('Discounted Price ($)', 'discountedPrice', { type: 'number', placeholder: 'Leave empty if no discount' })}
            </div>
          </div>

          {/* Content */}
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Content</p>
            <div className="space-y-3">
              {ta('Short Description', 'shortDescription', { required: true, placeholder: 'Prepare for the globally recognized PMP® certification.', rows: 2 })}
              {ta('Full Description', 'fullDescription', { placeholder: 'Detailed course overview…', rows: 3 })}
              {ta('Learning Objectives', 'learningObjectives', { placeholder: 'What participants will learn…', rows: 2 })}
              {ta('Curriculum Overview', 'curriculumOverview', { placeholder: 'Course topics and modules…', rows: 2 })}
            </div>
          </div>

          {/* Details */}
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Additional Details</p>
            <div className="space-y-3">
              {inp('Target Audience', 'targetAudience', { placeholder: 'e.g. Project managers with 3+ years experience' })}
              {inp('Certification Details', 'certificationDetails', { placeholder: 'e.g. 35 PDUs provided' })}
              {inp('Badge / Logo URL', 'badgeLogoUrl', { placeholder: '/images/badge-pmp.png' })}
              {ta('Trainer Profile', 'trainerProfile', { placeholder: 'e.g. PMP, MBA – 15 years industry experience', rows: 2 })}
            </div>
          </div>

          {/* Publish */}
          <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-700">Publish Course</p>
              <p className="text-xs text-gray-400 mt-0.5">Appears on the public website when enabled</p>
            </div>
            <button
              type="button"
              onClick={() => set('published', !f.published)}
              className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 ${f.published ? 'bg-teal-500' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${f.published ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600">
            {course ? 'Save Changes' : 'Create Course'}
          </button>
        </div>
      </div>
    </div>
  )
}
