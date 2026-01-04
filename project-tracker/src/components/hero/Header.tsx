import { Link } from "react-router-dom"

export default function Header() {
  return (
    <header className="relative z-20 flex items-center justify-between p-6">

      {/* Navigation */}
      <nav className="flex items-center space-x-2"></nav>

      {/* Login Button Group with Register */}
      <div className="flex items-center gap-4 relative z-20">
        <Link to="/register" className="text-white hover:text-white/80 text-xs font-medium px-4 py-2 transition-colors cursor-pointer">
          Register
        </Link>
        <div id="gooey-btn" className="relative flex items-center group" style={{ filter: "url(#gooey-filter)" }}>
          <button className="absolute right-0 px-2.5 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center justify-center -translate-x-10 group-hover:-translate-x-19 z-0">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </button>
          <Link to="/login" className="px-6 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center z-10">
            Login
          </Link>
        </div>
      </div>
    </header>
  )
}
