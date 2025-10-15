import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

type Commit = {
  sha: string
  message: string
  author: string
  avatar?: string
  branch?: string
  date: string
}

export function LastActivityTable({ commits }: { commits: Commit[] }) {
  return (
    <Card className="w-full overflow-hidden border rounded-xl">
      <div className="divide-y divide-border">
        {commits.map((c, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition"
          >
            {/* Left section */}
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage src={c.avatar} alt={c.author} />
                <AvatarFallback>{c.author[0]}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <span className="font-medium text-sm">{c.message}</span>
                <span className="text-xs text-muted-foreground">
                  {c.author} • {new Date(c.date).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {c.branch && (
                <Badge variant="outline" className="text-xs">
                  {c.branch}
                </Badge>
              )}
              <code className="text-xs text-muted-foreground font-mono">
                {c.sha.slice(0, 7)}
              </code>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
