import { useState, useMemo } from 'react'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import type { Course, CourseInput } from './types'
import { getCourses, createCourse, updateCourse, deleteCourse, togglePublish } from './courseService'
import CourseModal from './CourseModal'

const CATEGORIES = ['All', 'Agile', 'Business Analysis', 'Project Management', 'Data & AI', 'Leadership', 'IT & Cloud', 'Other']

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(() => getCourses())
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const stats = useMemo(() => ({
    total: courses.length,
    published: courses.filter(c => c.published).length,
    draft: courses.filter(c => !c.published).length,
  }), [courses])

  const filtered = useMemo(() => courses.filter(c => {
    const q = search.toLowerCase()
    const matchQ = !q || c.courseName.toLowerCase().includes(q) || c.vendor.toLowerCase().includes(q)
    const matchCat = category === 'All' || c.category === category
    return matchQ && matchCat
  }), [courses, search, category])

  function handleCreate(input: CourseInput) {
    const c = createCourse(input)
    setCourses(prev => [c, ...prev])
  }

  function handleUpdate(input: CourseInput) {
    if (!editing) return
    const c = updateCourse(editing.id, input)
    setCourses(prev => prev.map(x => x.id === c.id ? c : x))
  }

  function handleDelete() {
    if (!deleteId) return
    deleteCourse(deleteId)
    setCourses(prev => prev.filter(c => c.id !== deleteId))
    setDeleteId(null)
  }

  function handleToggle(course: Course, val: boolean) {
    const c = togglePublish(course.id, val)
    setCourses(prev => prev.map(x => x.id === c.id ? c : x))
  }

  function pct(c: Course) {
    if (c.listPrice && c.discountedPrice && c.discountedPrice < c.listPrice)
      return Math.round((1 - c.discountedPrice / c.listPrice) * 100)
    return null
  }

  return (
    <div className="space-y-4 max-w-screen-xl mx-auto">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Courses', value: stats.total, cls: 'text-gray-900' },
          { label: 'Published',     value: stats.published, cls: 'text-green-600' },
          { label: 'Draft',         value: stats.draft, cls: 'text-orange-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-6 py-5">
            <div className={`text-3xl font-bold ${s.cls}`}>{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <span className="font-semibold text-sm text-gray-900">All Courses</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search…"
                className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-40"
              />
            </div>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <button
              onClick={() => { setEditing(null); setModalOpen(true) }}
              className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> New Course
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100">
                {['Course','Vendor','Category','Duration','Seats','Pricing','Status','Published',''].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-14 text-gray-400 text-sm">No courses found.</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  {/* Course */}
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-[13px]">{c.courseName}</div>
                        {c.shortDescription && <div className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{c.shortDescription}</div>}
                      </div>
                    </div>
                  </td>
                  {/* Vendor */}
                  <td className="px-4 py-3">
                    <span className="border border-gray-200 rounded-full px-2.5 py-0.5 text-xs text-gray-700 max-w-[160px] truncate inline-block" title={c.vendor}>{c.vendor || '—'}</span>
                  </td>
                  {/* Category */}
                  <td className="px-4 py-3">
                    {c.category ? <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-0.5 text-xs font-medium">{c.category}</span> : <span className="text-gray-300">—</span>}
                  </td>
                  {/* Duration */}
                  <td className="px-4 py-3 text-[13px] text-gray-700">{c.duration || <span className="text-gray-300">—</span>}</td>
                  {/* Seats */}
                  <td className="px-4 py-3 text-[13px] text-gray-700">{c.seatCapacity ?? <span className="text-gray-300">—</span>}</td>
                  {/* Pricing */}
                  <td className="px-4 py-3">
                    {c.listPrice ? (
                      <div>
                        {pct(c) && <div className="text-xs text-gray-400 line-through">${c.listPrice.toLocaleString()}</div>}
                        <div className="text-[13px] font-semibold text-teal-600">
                          ${(c.discountedPrice ?? c.listPrice).toLocaleString()}
                          {pct(c) && <span className="text-xs font-normal ml-1">({pct(c)}% off)</span>}
                        </div>
                      </div>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3">
                    {c.published ? (
                      <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 rounded-full px-2.5 py-0.5 text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600" />Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 rounded-full px-2.5 py-0.5 text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Draft
                      </span>
                    )}
                  </td>
                  {/* Toggle */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(c, !c.published)}
                      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 ${c.published ? 'bg-teal-500' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${c.published ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                    </button>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditing(c); setModalOpen(true) }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course modal */}
      <CourseModal
        open={modalOpen}
        course={editing}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSave={editing ? handleUpdate : handleCreate}
      />

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={e => { if (e.target === e.currentTarget) setDeleteId(null) }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Delete Course?</h3>
            <p className="text-sm text-gray-500 mb-5">
              <strong>{courses.find(c => c.id === deleteId)?.courseName}</strong><br />
              <span className="text-xs">This action cannot be undone.</span>
            </p>
            <div className="flex justify-center gap-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
