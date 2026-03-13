import { useState } from 'react'
import Sidebar from './Sidebar'
import CoursesPage from './CoursesPage'

const VIEWS = ['courses', 'batches', 'registrations', 'discounts', 'trainers'] as const
type View = typeof VIEWS[number]

const VIEW_LABELS: Record<View, string> = {
  courses: 'Courses',
  batches: 'Batches',
  registrations: 'Registrations',
  discounts: 'Discounts',
  trainers: 'Trainers',
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" />
        </svg>
      </div>
      <p className="text-base font-semibold text-gray-600">{label}</p>
      <p className="text-sm mt-1">Coming soon</p>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<View>('courses')

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar active={view} onNavigate={(v) => setView(v as View)} />
      <div className="flex-1 flex flex-col ml-[210px]">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-sm font-semibold text-gray-900">{VIEW_LABELS[view]}</h1>
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-full px-3 py-1.5 hover:border-gray-400 transition-colors"
            target="_blank"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            View Live Site
          </a>
        </header>

        <main className="flex-1 p-6">
          {view === 'courses' ? <CoursesPage /> : <ComingSoon label={VIEW_LABELS[view]} />}
        </main>
      </div>
    </div>
  )
}
