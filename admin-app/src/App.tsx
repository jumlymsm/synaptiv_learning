import { useState } from 'react'
import { BookOpen, LogOut, GraduationCap, Lock } from 'lucide-react'
import CoursesPage from './admin/courses/CoursesPage'

const ADMIN_PASSWORD = 'admin2025'
const SESSION_KEY = 'synaptiv_admin_auth'

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, 'true')
        onLogin()
      } else {
        setError('Incorrect password. Please try again.')
      }
      setLoading(false)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Synaptiv Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your courses</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="password">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`input-field pl-9 ${error ? 'input-error' : ''}`}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  required
                />
              </div>
              {error && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="btn-primary w-full justify-center py-2.5"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
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
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Synaptiv Learning &mdash; Admin Portal
        </p>
      </div>
    </div>
  )
}

type NavItem = {
  label: string
  icon: React.ReactNode
  active: boolean
  coming: boolean
}

export default function App() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'true',
  )

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthed(false)
  }

  if (!authed) {
    return <LoginPage onLogin={() => setAuthed(true)} />
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
