import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Dashboard from "./components/dashboard/Dashboard"
import Navbar from "./components/navbar/Navbar"
import ProjectListPage from "./components/ProjectListPage/ProjectListPage"
import SettingsPage from "./components/Settings/SettingsPage"
import LoginPage from "./components/auth/LoginPage"
import RegisterPage from "./components/auth/RegisterPage"
import { AuthProvider } from "./components/auth/AuthContext"
import ProtectedRoute from "./components/auth/ProtectedRoute"



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
  const hideNavbar = ["/login", "/register"].includes(location.pathname)

  return (
    <div className="min-h-screen">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  )
}

export default App
