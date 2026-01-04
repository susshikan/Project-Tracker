import { Link } from "react-router-dom"

export default function HeroContent() {
  return (
    <main className="absolute bottom-8 left-8 z-20 max-w-lg">
      <div className="text-left">
        

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl md:leading-16 tracking-tight font-light text-white mb-4">
          <span className="font-medium italic instrument">Ship</span> Projects
          <br />
          <span className="font-light tracking-tight text-white">Faster than ever</span>
        </h1>

        {/* Description */}
        <p className="text-xs font-light text-white/70 mb-4 leading-relaxed">
          The complete platform for team collaboration and project management. Track progress, manage sprints, and scale
          your development workflow with precision.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-4 flex-wrap">
          <Link to="/login" className="px-8 py-3 rounded-full bg-white text-black font-normal text-xs transition-all duration-200 hover:bg-white/90 cursor-pointer">
            Login to Workspace
          </Link>
          <Link to="/register" className="px-8 py-3 rounded-full bg-transparent border border-white/30 text-white font-normal text-xs transition-all duration-200 hover:bg-white/10 hover:border-white/50 cursor-pointer">
            Create Account
          </Link>
        </div>
      </div>
    </main>
  )
}
