import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProjectCard } from "./ProjectCard"

export function ProjectTable({ data }: { data: CardData[] }) {
  return (
    <div className="p-4 bg-amber-900 rounded-2xl border w-full max-w-md mx-auto">
      <ScrollArea className="h-[300px] w-full rounded-xl border p-4 bg-amber-950">
        <div className="flex flex-col gap-4">
            {data.map((card, i) => (
                    <ProjectCard key={i} {...card} />
            ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export type CardData = {
  title: string;
  content: string;
  status?: string;
}
