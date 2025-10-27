import { ProjectTable } from "./ProjectTable"

import Dashboard from "./Dashboard"
import Dummy from "./VerticalActivityStepper"
import FloatingNavbar from "../navbar/FloatingNavbar"
import Title from "../navbar/Title"
import Navbar from "../navbar/Navbar"

import { CardProject } from "../ProjectListPage/Card"
import ProjectListPage from "../ProjectListPage/ProjectListPage"

import SettingsPage from "../Settings/SettingsPage"

const data = [
  {
    id: 1,
    projectName: "Sofita Queue System",
    status: "In Progress",
    lastCommit: "2025-10-12",
    deadline: "2025-11-01",
  },
  {
    id: 2,
    projectName: "Sofitify Music Player",
    status: "Done",
    lastCommit: "2025-10-08",
    deadline: "2025-10-10",
  },
  {
    id: 3,
    projectName: "Moodle Sync Bot",
    status: "In Progress",
    lastCommit: "2025-10-14",
    deadline: "2025-11-05",
  },
]


export default function Tes() {
    return (
       <Dashboard />
    )
}

