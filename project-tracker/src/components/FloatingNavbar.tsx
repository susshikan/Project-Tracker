import React from "react"
import { useState } from "react"

export default function FloatingNavbar() {
  const [active, setActive] = useState("/")

  const isActive = (path: any) => active === path

  return (
    <nav className="">
      <div className="bg-black text-white rounded-full px-8 py-4 shadow-lg">
        <div className="flex items-center justify-center gap-12">
          {/* Logo/Brand */}
          

          {/* Navigation Links */}
          <button
            onClick={() => setActive("/")}
            className={`transition-colors ${
              isActive("/") ? "text-white font-semibold" : "text-gray-400 hover:text-white"
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setActive("/projects")}
            className={`transition-colors ${
              isActive("/projects") ? "text-white font-semibold" : "text-gray-400 hover:text-white"
            }`}
          >
            Projects
          </button>

          <button
            onClick={() => setActive("/settings")}
            className={`transition-colors ${
              isActive("/settings") ? "text-white font-semibold" : "text-gray-400 hover:text-white"
            }`}
          >
            Settings
          </button>

          {/* Right side - profile */}
          <div className="w-10 h-10 bg-white rounded-full" />
        </div>
      </div>
    </nav>
  )
}
