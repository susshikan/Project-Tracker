import { Line, LineChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { type ProjectListItem } from "@/types/project"
import { Link } from "react-router-dom"

type CommitData = {
  date: string
  count: number
}

const chartConfig = {
  commits: {
    label: "Commits",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function CardProject(props: ProjectListItem) {
  const today = new Date()
  const last5Days: string[] = []
  for (let i = 4; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    last5Days.push(d.toISOString().split("T")[0]) 
  }

  const commitCountMap: Record<string, number> = {}
  props.commits.forEach((commit) => {
    const date = new Date(commit.createAt).toISOString().split("T")[0]
    commitCountMap[date] = (commitCountMap[date] || 0) + 1
  })

  const chartData: CommitData[] = last5Days.map((day) => ({
    date: day,
    count: commitCountMap[day] || 0,
  }))

  return (
    <Link
      to={'/projects/' + props.localId}>
    <Card className="aspect-square flex flex-col">
      <CardHeader className="">
        <CardTitle className="text-2xl">{props.projectName}</CardTitle>
        <CardDescription>Last 5 days</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12, top: 12, bottom: 5 }}
          >

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
    </Link>
  )
}
