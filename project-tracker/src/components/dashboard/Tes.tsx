import { ProjectTable } from "./ProjectTable"

import Dashboard from "./Dashboard"
import Dummy from "./VerticalActivityStepper"
import FloatingNavbar from "../navbar/FloatingNavbar"
import Title from "../navbar/Title"
import Navbar from "../navbar/Navbar"
import TableCard from "../ProjectListPage/tableCard"
import type { Project } from "../ProjectListPage/tableCard"
import { CardProject } from "../ProjectListPage/Card"
import ProjectListPage from "../ProjectListPage/ProjectListPage"

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
        <ProjectListPage />
    )
}

export const demoProjects: Project[] = [
  { id: "1", name: "Landing Page Revamp", tags: ["frontend", "tailwind", "a11y"] },
  { id: "2", name: "API Gateway", tags: ["backend", "node", "auth"] },
  { id: "3", name: "Mobile App", tags: ["react-native", "offline", "perf"] },
  { id: "4", name: "Analytics Dashboard", tags: ["dashboard", "charts", "etl"] },
  { id: "5", name: "Search Service", tags: ["elasticsearch", "indexing", "ops"] },
  { id: "6", name: "Notification System", tags: ["queue", "workers", "retry"] },
]