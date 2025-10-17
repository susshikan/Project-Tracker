import { AddButton } from "./AddButton";
import type { Project } from "./TableCard";
import TableCard from "./TableCard";
//flex items-center justify-center min-h-screen bg-background p-4 flex-col
 
export default function ProjectListPage(){ 
    return( 
        <div className="item-center"> 
        <div className="flex justify-center min-h-screen p-4 flex-col"> 
            <div className="pl-4"> 
                <AddButton /> 
            </div> 
            <TableCard projects={demoProjects}/> 
        </div> 
        </div> 
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