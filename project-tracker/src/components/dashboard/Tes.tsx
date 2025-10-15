import { ProjectTable } from "./ProjectTable"

const projectData = [
    { title: "Project Alpha", content: "Analyzing data pipeline", status: "ongoing" },
    { title: "Project Beta", content: "Deployment failed", status: "failed" },
    { title: "Project Gamma", content: "Completed successfully", status: "success" },
]

export default function Tes() {
  return <ProjectTable data={projectData} />
}