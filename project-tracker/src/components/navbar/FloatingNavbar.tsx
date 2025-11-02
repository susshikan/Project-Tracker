import { Link, useLocation } from "react-router-dom"

export default function FloatingNavbar() {
  const location = useLocation()
  const activePath = location.pathname

  const isActive = (path: string) => activePath === path

  return (
    <nav className="">
      <div className="border-white/10 bg-white/60 backdrop-blur-xl dark:bg-zinc-900/40 text-white rounded-xl px-8 py-4 shadow-lg border">
        <div className="flex items-center justify-center gap-12">
          {/* Logo/Brand */}
          

          {/* Navigation Links */}
          <Link
            to={'/'}
            className={`transition-colors ${
              isActive("/") ? "text-white font-semibold" : "text-gray-400 hover:text-white"
            }`}
          >
            Home
          </Link>

          <Link
            to='/projects'
            className={`transition-colors ${
              isActive("/projects") ? "text-white font-semibold" : "text-gray-400 hover:text-white"
            }`}
          >
            Projects
          </Link> 
          <Link
            to='/settings'
            className={`transition-colors ${
              isActive("/settings") ? "text-white font-semibold" : "text-gray-400 hover:text-white"
            }`}
          >
            Settings
          </Link>

          {/* Right side - profile */}
          <div className="w-10 h-10 bg-white rounded-full" />
        </div>
      </div>
    </nav>
  )
}
