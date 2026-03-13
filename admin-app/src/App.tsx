import { useState } from 'react'
import { BookOpen, LogOut, GraduationCap } from 'lucide-react'
import CoursesPage from './admin/courses/CoursesPage'

// TODO: restore SESSION_KEY and LoginPage before going live
const SESSION_KEY = 'synaptiv_admin_auth'
void SESSION_KEY // suppress unused warning

type NavItem = {
  label: string
  icon: React.ReactNode
  active: boolean
  coming: boolean
}

export default function App() {
  // Auth disabled — re-enable before going live by restoring the login gate
  const [authed, _setAuthed] = useState(true)

  function handleLogout() {
    // no-op until credentials are added
    void authed
  }

  const navItems: NavItem[] = [
    {
      label: 'Courses',
      icon: <BookOpen className="w-4 h-4" />,
      active: true,
      coming: false,
    },
    {
      label: 'Students',
      icon: <GraduationCap className="w-4 h-4" />,
      active: false,
      coming: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-teal-600 rounded-lg">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm tracking-tight">
              Synaptiv Admin
            </span>
            <span className="hidden sm:inline-block text-gray-300 text-sm">|</span>
            <span className="hidden sm:inline-block text-xs text-gray-500 font-medium">
              Learning Management
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-150"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0 pt-4 pb-8">
          <nav className="px-3 space-y-0.5">
            <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Navigation
            </p>
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                <button
                  disabled={item.coming}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    item.active
                      ? 'bg-teal-50 text-teal-700'
                      : item.coming
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={item.active ? 'text-teal-600' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  {item.label}
                  {item.coming && (
                    <span className="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full font-normal">
                      Soon
                    </span>
                  )}
                </button>
                {item.active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-teal-600 rounded-r-full" />
                )}
              </div>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 w-56 p-4 border-t border-gray-100">
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-teal-700">A</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">Administrator</p>
                <p className="text-xs text-gray-400 truncate">admin@synaptiv.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <CoursesPage />
        </main>
      </div>
    </div>
  )
}
