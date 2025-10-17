"use client"
import { Line, LineChart, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export const description = "A line chart"

const chartData = [
  { day: "Mon", commits: 12 },
  { day: "Tue", commits: 19 },
  { day: "Wed", commits: 15 },
  { day: "Thu", commits: 25 },
  { day: "Fri", commits: 22 },
]

const chartConfig = {
  commits: {
    label: "Commits",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function CardProject() {
  return (
    <Card className="aspect-square flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">Project Commits</CardTitle>
        <CardDescription>Last 5 days</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line dataKey="commits" type="natural" stroke="var(--color-commits)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
