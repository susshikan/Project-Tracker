import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Dashboard from "./components/dashboard/Dashboard"
import Navbar from "./components/navbar/Navbar"
import ProjectListPage from "./components/ProjectListPage/ProjectListPage"
import SettingsPage from "./components/Settings/SettingsPage"
import LoginPage from "./components/auth/LoginPage"
import RegisterPage from "./components/auth/RegisterPage"
import { AuthProvider } from "./components/auth/AuthContext"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import ProjectPage from "./components/projectPage/ProjectPage"
import HeroSection from "./components/hero/HeroSection"


function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  )
}

function AppLayout() {
  const location = useLocation()
  const hideNavbar = ["/login", "/register", "/hero", "/"].includes(location.pathname)

  return (
    <div className="min-h-screen">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HeroSection />} />
      </Routes>
    </div>
  )
}

export default App
