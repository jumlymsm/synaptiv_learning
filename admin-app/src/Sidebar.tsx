type View = string

const NAV = [
  { id: 'courses', label: 'Courses', icon: <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />, icon2: <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /> },
  { id: 'batches', label: 'Batches', icon: <rect x="3" y="4" width="18" height="18" rx="2" />, icon2: <><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></> },
  { id: 'registrations', label: 'Registrations', icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />, icon2: <circle cx="9" cy="7" r="4" /> },
  { id: 'discounts', label: 'Discounts', icon: <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />, icon2: <line x1="7" y1="7" x2="7.01" y2="7" /> },
  { id: 'trainers', label: 'Trainers', icon: <circle cx="12" cy="8" r="4" />, icon2: <path d="M6 20v-1a6 6 0 0 1 12 0v1" /> },
]

export default function Sidebar({ active, onNavigate }: { active: View; onNavigate: (v: View) => void }) {
  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[210px] bg-[#0d1b2e] flex flex-col z-40">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-white font-bold text-sm">Admin <span className="text-teal-400">Portal</span></span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5">
        {NAV.map(({ id, label, icon, icon2 }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium w-full text-left transition-colors ${
              active === id
                ? 'bg-teal-500/20 text-teal-300'
                : 'text-white/50 hover:text-white/90 hover:bg-white/7'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              {icon}{icon2}
            </svg>
            {label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
