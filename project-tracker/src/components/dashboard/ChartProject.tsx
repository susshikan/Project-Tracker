import { Pie, PieChart, Sector } from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export const description = "A donut chart with an active sector"

export function ChartProject({projects}: {projects: any}) {
  console.log(projects)
  const ongoing = projects.filter((p: { status: string }) => p.status === 'In Progress').length;
  const done = projects.filter((p: { status: string }) => p.status === 'Done').length;
  console.log(ongoing)
  const chartData = [
    { status: "On Going", count: ongoing, fill: "var(--chart-1)" },
    { status: "Done", count: done, fill: "var(--chart-2)" }
  ];

  const chartConfig = {
    count: { label: "Project" },
    "On Going": { label: "On Going", color: "var(--chart-1)" },
    "Done": { label: "Done", color: "var(--chart-2)" },
  };
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Project Chart</CardTitle>
        <CardDescription>Showing All Time</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total status Project in last 6 month
        </div>
      </CardFooter>
    </Card>
  )
}
