import { ProjectTable } from "./ProjectTable"

const projectData = [
  {
    title: "Frontend Dashboard",
    subtitle: "React + Tailwind",
    description: "Menampilkan metrik performa projek dan status deployment.",
  },
  {
    title: "API Service",
    subtitle: "Node.js + Express",
    description: "Backend untuk autentikasi dan CRUD data pengguna.",
  },
  {
    title: "Database Migration",
    subtitle: "PostgreSQL",
    description: "Menyusun ulang struktur tabel untuk optimisasi query.",
  },
]

export default function Tes() {
  return <ProjectTable data={projectData} />
}