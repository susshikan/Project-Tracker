import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Tes from "./components/dashboard/Tes"
import Dashboard from "./components/dashboard/Dashboard"
import Navbar from "./components/navbar/Navbar"
import ProjectListPage from "./components/ProjectListPage/ProjectListPage"
import SettingsPage from "./components/Settings/SettingsPage"



function App() {
  

  return (
    <Router>
      <div>
        <Navbar />
        <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
