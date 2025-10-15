import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ProjectTable({ data }: { data: CardData[] }) {
  return (
    <div className="p-4 bg-background rounded-2xl border w-full max-w-md mx-auto">
      <ScrollArea className="h-[300px] w-full rounded-xl border p-4">
        <div className="flex flex-col gap-4">
          {data.map((item, index) => (
            <Card key={index} className="rounded-xl border hover:shadow-sm transition">
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                {item.subtitle && (
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                )}
                {item.description && (
                  <p className="text-sm mt-2 text-muted-foreground">{item.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export type CardData = {
  title: string
  subtitle?: string
  description?: string
}
