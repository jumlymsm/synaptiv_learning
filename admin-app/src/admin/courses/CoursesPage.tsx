import { useState, useEffect, useMemo } from 'react'
import {
  Plus,
  Search,
  Download,
  TrendingUp,
  BookOpen,
  Calendar,
  ChevronDown,
} from 'lucide-react'
import type { CourseBatch } from '../../types'
import {
  getCourseBatches,
  deleteCourseBatch,
} from '../../services/courseService'
import CourseTable from './CourseTable'
import AddCourseModal from './AddCourseModal'
import EditCourseModal from './EditCourseModal'

const PROGRAM_OPTIONS = [
  'All Programs',
  'CBAP Certification',
  'PMP Certification',
  'Certified Scrum Master (CSM)',
  'SAFe Scrum Master',
  'SAFe POPM',
]

function StatCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function CoursesPage() {
  const [batches, setBatches] = useState<CourseBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editBatch, setEditBatch] = useState<CourseBatch | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [programFilter, setProgramFilter] = useState('All Programs')

  async function loadData() {
    setLoading(true)
    try {
      const data = await getCourseBatches()
      setBatches(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const today = new Date().toISOString().split('T')[0]

  const stats = useMemo(() => {
    const total = batches.length
    const upcoming = batches.filter((b) => b.startDate > today).length
    const revenue = batches.reduce((sum, b) => {
      const price = b.discountedPrice > 0 ? b.discountedPrice : b.listPrice
      return sum + price
    }, 0)
    return { total, upcoming, revenue }
  }, [batches, today])

  const filtered = useMemo(() => {
    return batches.filter((b) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        !q ||
        b.programName.toLowerCase().includes(q) ||
        b.trainerName.toLowerCase().includes(q) ||
        b.courseCode.toLowerCase().includes(q)
      const matchesProgram =
        programFilter === 'All Programs' || b.programName === programFilter
      return matchesSearch && matchesProgram
    })
  }, [batches, searchQuery, programFilter])

  function handleExportCSV() {
    const headers = [
      'Program Name',
      'Course Code',
      'Trainer',
      'Start Date',
      'End Date',
      'List Price',
      'Discounted Price',
      'Currency',
      'Discount Start',
      'Discount End',
      'Max Seats',
      'Created At',
    ]

    const rows = filtered.map((b) => [
      `"${b.programName}"`,
      `"${b.courseCode}"`,
      `"${b.trainerName}"`,
      b.startDate,
      b.endDate,
      b.listPrice,
      b.discountedPrice,
      b.currency,
      b.discountStartDate || '',
      b.discountEndDate || '',
      b.maxSeats,
      `"${b.createdAt}"`,
    ])

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `synaptiv-courses-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleDelete(id: string) {
    try {
      await deleteCourseBatch(id)
      setBatches((prev) => prev.filter((b) => b.id !== id))
    } catch {
      alert('Failed to delete course batch. Please try again.')
    }
  }

  const formatCurrency = (n: number) =>
    '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Course Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage training batches, pricing, and trainer assignments.
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Batches"
          value={stats.total}
          sub="All programs"
          icon={<BookOpen className="w-5 h-5 text-teal-700" />}
          color="bg-teal-50"
        />
        <StatCard
          label="Upcoming"
          value={stats.upcoming}
          sub={`Start date after ${today}`}
          icon={<Calendar className="w-5 h-5 text-blue-700" />}
          color="bg-blue-50"
        />
        <StatCard
          label="Est. Revenue"
          value={formatCurrency(stats.revenue)}
          sub="Sum of active prices"
          icon={<TrendingUp className="w-5 h-5 text-green-700" />}
          color="bg-green-50"
        />
      </div>

      {/* Filter Bar */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search programs, trainers, codes…"
              className="input-field pl-9"
            />
          </div>

          {/* Program Filter */}
          <div className="relative">
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="input-field pr-8 appearance-none"
            >
              {PROGRAM_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Export */}
          <button onClick={handleExportCSV} className="btn-secondary whitespace-nowrap">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Filter summary */}
        {(searchQuery || programFilter !== 'All Programs') && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <span>
              Showing {filtered.length} of {batches.length} batches
            </span>
            <button
              onClick={() => {
                setSearchQuery('')
                setProgramFilter('All Programs')
              }}
              className="text-teal-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <svg
                className="animate-spin w-8 h-8 text-teal-500"
                fill="none"
                viewBox="0 0 24 24"
              >
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
              <span className="text-sm text-gray-500">Loading courses…</span>
            </div>
          </div>
        ) : (
          <CourseTable
            batches={filtered}
            onEdit={(batch) => setEditBatch(batch)}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modals */}
      {showAdd && (
        <AddCourseModal
          onClose={() => setShowAdd(false)}
          onCreated={(batch) => {
            setBatches((prev) => [batch, ...prev])
            setShowAdd(false)
          }}
        />
      )}

      {editBatch && (
        <EditCourseModal
          batch={editBatch}
          onClose={() => setEditBatch(null)}
          onUpdated={(updated) => {
            setBatches((prev) =>
              prev.map((b) => (b.id === updated.id ? updated : b)),
            )
            setEditBatch(null)
          }}
        />
      )}
    </div>
  )
}
