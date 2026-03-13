import { useState, useEffect, useMemo } from 'react'
import { Plus, Search } from 'lucide-react'
import type { Course, CourseInput } from '../../types'
import { getCourses, createCourse, updateCourse, deleteCourse, togglePublish } from '../../services/courseService'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import CourseTable from './CourseTable'
import CreateCourseModal from './CreateCourseModal'
import EditCourseModal from './EditCourseModal'

const CATEGORIES = ['All', 'Project Management', 'Business Analysis', 'Agile', 'Scrum', 'Data & AI', 'Leadership', 'IT & Cloud', 'Other']

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editCourse, setEditCourse] = useState<Course | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  async function load() {
    setLoading(true)
    try {
      const data = await getCourses()
      setCourses(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const stats = useMemo(() => ({
    total:     courses.length,
    published: courses.filter((c) => c.published).length,
    draft:     courses.filter((c) => !c.published).length,
  }), [courses])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return courses.filter((c) => {
      const matchesSearch = !q ||
        c.courseName.toLowerCase().includes(q) ||
        (c.vendor || '').toLowerCase().includes(q) ||
        (c.shortDescription || '').toLowerCase().includes(q)
      const matchesCat = categoryFilter === 'All' || c.category === categoryFilter
      return matchesSearch && matchesCat
    })
  }, [courses, search, categoryFilter])

  async function handleCreate(data: CourseInput) {
    const created = await createCourse(data)
    setCourses((prev) => [created, ...prev])
  }

  async function handleSave(id: string, data: Partial<CourseInput>) {
    const updated = await updateCourse(id, data)
    setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)))
  }

  async function handleDelete(course: Course) {
    setDeletingId(course.id)
  }

  async function confirmDelete() {
    if (!deletingId) return
    await deleteCourse(deletingId)
    setCourses((prev) => prev.filter((c) => c.id !== deletingId))
    setDeletingId(null)
  }

  async function handleTogglePublish(course: Course, published: boolean) {
    const updated = await togglePublish(course.id, published)
    setCourses((prev) => prev.map((c) => (c.id === course.id ? updated : c)))
  }

  return (
    <div className="p-6 space-y-5 max-w-screen-xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Courses', value: stats.total, color: 'text-gray-900' },
          { label: 'Published',     value: stats.published, color: 'text-green-600' },
          { label: 'Draft',         value: stats.draft, color: 'text-orange-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 px-6 py-5">
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">All Courses</h2>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses…"
                className="pl-8 w-48 text-xs h-8"
              />
            </div>
            {/* Category filter */}
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-44 text-xs h-8 py-0"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Button onClick={() => setShowCreate(true)} size="sm" className="gap-1 h-8">
              <Plus className="w-3.5 h-3.5" />
              New Course
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin w-7 h-7 text-teal-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <CourseTable
            courses={filtered}
            onEdit={setEditCourse}
            onDelete={handleDelete}
            onTogglePublish={handleTogglePublish}
          />
        )}
      </div>

      {/* Modals */}
      <CreateCourseModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreate}
      />

      <EditCourseModal
        course={editCourse}
        open={editCourse !== null}
        onClose={() => setEditCourse(null)}
        onSaved={handleSave}
      />

      {/* Delete confirm */}
      {deletingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setDeletingId(null) }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Delete Course?</h3>
            <p className="text-sm text-gray-500 mb-5">
              {courses.find((c) => c.id === deletingId)?.courseName}<br />
              <span className="text-xs">This action cannot be undone.</span>
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="secondary" onClick={() => setDeletingId(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
