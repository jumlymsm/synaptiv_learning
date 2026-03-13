import { useState, useEffect } from 'react'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Select } from '../../components/ui/select'
import { Switch } from '../../components/ui/switch'
import { generateSlug } from '../../lib/utils'
import type { CourseInput } from '../../types'

const VENDORS = [
  'PMI (Project Management Institute)',
  'IIBA (International Institute of Business Analysis)',
  'Scrum Alliance',
  'Scaled Agile, Inc.',
  'AXELOS',
  'CompTIA',
  'Microsoft',
  'AWS',
  'Google',
  'Other',
]

const CATEGORIES = [
  'Project Management',
  'Business Analysis',
  'Agile',
  'Scrum',
  'Data & AI',
  'Leadership',
  'IT & Cloud',
  'Other',
]

const DURATIONS = ['1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '1 Week', '2 Weeks', '4 Weeks', 'Self-Paced']

interface CourseFormProps {
  initial?: Partial<CourseInput>
  onChange: (data: CourseInput, valid: boolean) => void
}

const EMPTY: CourseInput = {
  courseName: '',
  vendor: '',
  category: '',
  duration: '',
  seatCapacity: undefined,
  listPrice: undefined,
  discountedPrice: undefined,
  badgeLogoUrl: '',
  shortDescription: '',
  fullDescription: '',
  learningObjectives: '',
  curriculumOverview: '',
  targetAudience: '',
  certificationDetails: '',
  trainerProfile: '',
  urlSlug: '',
  published: false,
}

export default function CourseForm({ initial, onChange }: CourseFormProps) {
  const [data, setData] = useState<CourseInput>({ ...EMPTY, ...initial })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [slugManual, setSlugManual] = useState(false)

  function update<K extends keyof CourseInput>(key: K, value: CourseInput[K]) {
    setData((prev) => {
      const next = { ...prev, [key]: value }
      // Auto-generate slug from course name unless manually edited
      if (key === 'courseName' && !slugManual) {
        next.urlSlug = generateSlug(value as string)
      }
      return next
    })
  }

  function handleSlugChange(val: string) {
    setSlugManual(true)
    update('urlSlug', val)
  }

  useEffect(() => {
    const errs: Record<string, string> = {}
    if (!data.courseName.trim()) errs.courseName = 'Course name is required'
    if (!data.vendor.trim()) errs.vendor = 'Vendor is required'
    if (!data.category) errs.category = 'Category is required'
    if (!data.shortDescription?.trim()) errs.shortDescription = 'Short description is required'
    if (data.discountedPrice && data.listPrice && data.discountedPrice >= data.listPrice) {
      errs.discountedPrice = 'Discounted price must be less than list price'
    }
    setErrors(errs)
    onChange(data, Object.keys(errs).length === 0)
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      {/* Basic Info */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Course Name <span className="text-red-500">*</span>
        </label>
        <Input
          value={data.courseName}
          onChange={(e) => update('courseName', e.target.value)}
          placeholder="e.g. PMP Certification Training"
          className={errors.courseName ? 'border-red-400 focus:ring-red-400' : ''}
        />
        {errors.courseName && <p className="text-xs text-red-500 mt-1">{errors.courseName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Vendor / Certification Body <span className="text-red-500">*</span>
          </label>
          <Select
            value={data.vendor}
            onChange={(e) => update('vendor', e.target.value)}
            className={errors.vendor ? 'border-red-400' : ''}
          >
            <option value="">— Select vendor —</option>
            {VENDORS.map((v) => <option key={v} value={v}>{v}</option>)}
          </Select>
          {errors.vendor && <p className="text-xs text-red-500 mt-1">{errors.vendor}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <Select
            value={data.category}
            onChange={(e) => update('category', e.target.value)}
            className={errors.category ? 'border-red-400' : ''}
          >
            <option value="">— Select category —</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Duration</label>
          <Select value={data.duration || ''} onChange={(e) => update('duration', e.target.value)}>
            <option value="">— Select —</option>
            {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </Select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Seat Capacity</label>
          <Input
            type="number"
            value={data.seatCapacity ?? ''}
            onChange={(e) => update('seatCapacity', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="e.g. 20"
            min={1}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">URL Slug</label>
        <Input
          value={data.urlSlug || ''}
          onChange={(e) => handleSlugChange(e.target.value)}
          placeholder="pmp-certification-training"
        />
        <p className="text-xs text-gray-400 mt-1">Auto-generated from course name. Used in public URLs.</p>
      </div>

      {/* Pricing */}
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Pricing</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">List Price ($)</label>
            <Input
              type="number"
              value={data.listPrice ?? ''}
              onChange={(e) => update('listPrice', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="e.g. 1500"
              min={0}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Discounted Price ($)</label>
            <Input
              type="number"
              value={data.discountedPrice ?? ''}
              onChange={(e) => update('discountedPrice', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Leave empty if no discount"
              min={0}
              className={errors.discountedPrice ? 'border-red-400' : ''}
            />
            {errors.discountedPrice && <p className="text-xs text-red-500 mt-1">{errors.discountedPrice}</p>}
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Media</p>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Badge / Logo URL</label>
          <Input
            value={data.badgeLogoUrl || ''}
            onChange={(e) => update('badgeLogoUrl', e.target.value)}
            placeholder="/images/badge-pmp.png"
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Content</p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Short Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={data.shortDescription || ''}
              onChange={(e) => update('shortDescription', e.target.value)}
              placeholder="Prepare for the globally recognized PMP® certification."
              className={`min-h-[70px] ${errors.shortDescription ? 'border-red-400' : ''}`}
            />
            {errors.shortDescription && <p className="text-xs text-red-500 mt-1">{errors.shortDescription}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Description</label>
            <Textarea
              value={data.fullDescription || ''}
              onChange={(e) => update('fullDescription', e.target.value)}
              placeholder="Detailed course overview..."
              className="min-h-[90px]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Learning Objectives</label>
            <Textarea
              value={data.learningObjectives || ''}
              onChange={(e) => update('learningObjectives', e.target.value)}
              placeholder="What participants will learn..."
              className="min-h-[70px]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Curriculum Overview</label>
            <Textarea
              value={data.curriculumOverview || ''}
              onChange={(e) => update('curriculumOverview', e.target.value)}
              placeholder="Course topics and modules..."
              className="min-h-[70px]"
            />
          </div>
        </div>
      </div>

      {/* Additional */}
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Additional Details</p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Target Audience</label>
            <Input
              value={data.targetAudience || ''}
              onChange={(e) => update('targetAudience', e.target.value)}
              placeholder="e.g. Project managers with 3+ years experience"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Certification Details</label>
            <Input
              value={data.certificationDetails || ''}
              onChange={(e) => update('certificationDetails', e.target.value)}
              placeholder="e.g. 35 PDUs provided"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Trainer Profile</label>
            <Textarea
              value={data.trainerProfile || ''}
              onChange={(e) => update('trainerProfile', e.target.value)}
              placeholder="e.g. PMP, MBA – 15 years industry experience"
              className="min-h-[60px]"
            />
          </div>
        </div>
      </div>

      {/* Published */}
      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-700">Publish Course</p>
          <p className="text-xs text-gray-400 mt-0.5">Course will appear on the public website when enabled</p>
        </div>
        <Switch
          checked={data.published ?? false}
          onCheckedChange={(v) => update('published', v)}
        />
      </div>

    </div>
  )
}
