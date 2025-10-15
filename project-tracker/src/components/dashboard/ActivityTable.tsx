"use client"

import React, { useMemo } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type CountMap = Record<string, number>

type HeatmapProps = {
  startDate?: Date
  endDate?: Date
  values?: CountMap
  maxCount?: number
  colorScale?: string[]
  showWeekdayLabels?: boolean
  showMonthLabels?: boolean
  className?: string
}

const GRAYSCALE_SCALE = [
  "bg-zinc-100 dark:bg-zinc-800",
  "bg-zinc-300 dark:bg-zinc-700",
  "bg-zinc-400 dark:bg-zinc-600",
  "bg-zinc-500 dark:bg-zinc-500",
  "bg-zinc-700 dark:bg-zinc-400",
]

function toKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

function addDays(d: Date, days: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + days)
  return x
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function getWeeks(start: Date, end: Date) {
  const s = startOfDay(start)
  const e = startOfDay(end)
  const day = s.getDay()
  const alignedStart = addDays(s, -((day + 7) % 7))
  const totalDays = Math.ceil((startOfDay(addDays(e, 1)).getTime() - alignedStart.getTime()) / (1000 * 3600 * 24))
  const cols = Math.ceil(totalDays / 7)

  const matrix: Date[][] = []
  for (let c = 0; c < cols; c++) {
    const col: Date[] = []
    for (let r = 0; r < 7; r++) {
      col.push(addDays(alignedStart, c * 7 + r))
    }
    matrix.push(col)
  }
  return { matrix, alignedStart }
}

function monthLabels(matrix: Date[][]) {
  const labels: { col: number; label: string }[] = []
  let lastMonth = -1
  matrix.forEach((col, idx) => {
    const firstDay = col[0]
    const m = firstDay.getMonth()
    if (m !== lastMonth) {
      labels.push({ col: idx, label: firstDay.toLocaleString(undefined, { month: "short" }) })
      lastMonth = m
    }
  })
  return labels
}

const weekdayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function getBucket(count: number, maxCount: number, steps: number) {
  if (count <= 0) return 0
  return Math.min(steps - 1, Math.ceil((count / maxCount) * (steps - 1)))
}

export function GrayscaleHeatmap({
  startDate,
  endDate,
  values = {},
  maxCount,
  colorScale = GRAYSCALE_SCALE,
  showWeekdayLabels = true,
  showMonthLabels = true,
  className = "",
}: HeatmapProps) {
  const today = startOfDay(new Date())
  const defaultEnd = endDate ? startOfDay(endDate) : today
  const defaultStart = startDate ? startOfDay(startDate) : addDays(defaultEnd, -7 * 52 + 1)

  const derivedMax = useMemo(() => {
    if (maxCount) return maxCount
    let m = 0
    for (const k in values) m = Math.max(m, values[k] || 0)
    return Math.max(1, m)
  }, [values, maxCount])

  const { matrix } = useMemo(() => getWeeks(defaultStart, defaultEnd), [defaultStart, defaultEnd])
  const months = useMemo(() => monthLabels(matrix), [matrix])

  return (
    <TooltipProvider>
      <div className={`w-full overflow-x-auto ${className}`}>
        {/* Month labels */}
        {showMonthLabels && (
          <div className="pl-10 mb-1 flex text-xs text-zinc-500 dark:text-zinc-400 select-none">
            {matrix.map((_, i) => {
              const label = months.find((m) => m.col === i)?.label
              return (
                <div key={i} className="w-3 h-4 flex items-end justify-start" style={{ minWidth: 12 }}>
                  {label && <span className="translate-x-0.5">{label}</span>}
                </div>
              )
            })}
          </div>
        )}

        {/* Heatmap grid */}
        <div className="flex">
          {showWeekdayLabels && (
            <div className="mr-2 grid grid-rows-7 gap-1 text-[10px] text-zinc-500 dark:text-zinc-400 select-none">
              {weekdayShort.map((d, i) => (
                <div key={d} className="h-3 flex items-center justify-end pr-1">
                  {i % 2 === 1 ? d.slice(0, 3) : ""}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-flow-col auto-cols-max gap-1">
            {matrix.map((col, cIdx) => (
              <div key={cIdx} className="grid grid-rows-7 gap-1">
                {col.map((d) => {
                  const key = toKey(d)
                  const count = values[key] || 0
                  const bucket = getBucket(count, derivedMax, colorScale.length)
                  const isOutsideRange = d < defaultStart || d > defaultEnd
                  const cellColor = isOutsideRange ? "bg-transparent" : colorScale[bucket]

                  return (
                    <Tooltip key={key}>
                      <TooltipTrigger asChild>
                        <div
                          aria-label={`${key}: ${count} contributions`}
                          className={[
                            "w-3 h-3 rounded-[3px]",
                            "outline-none ring-zinc-400/50 ring-offset-transparent focus:ring-2 focus:ring-offset-1",
                            cellColor,
                            isOutsideRange ? "opacity-30" : "hover:opacity-80",
                            "transition",
                          ].join(" ")}
                          style={{ minWidth: 12, minHeight: 12 }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <p className="font-medium">{count} contributions</p>
                        <p className="opacity-80">{d.toLocaleDateString()}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span>Less</span>
          <div className="flex items-center gap-1">
            {colorScale.map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-[3px] ${c}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </TooltipProvider>
  )
}

// Helper functions for mock data
function generateMockValues(start: Date, end: Date): CountMap {
  const values: CountMap = {}
  const s = startOfDay(start)
  const e = startOfDay(end)
  for (let d = new Date(s); d <= e; d = addDays(d, 1)) {
    const r = Math.random()
    const val = r < 0.5 ? 0 : r < 0.8 ? 1 + Math.floor(Math.random() * 3) : 4 + Math.floor(Math.random() * 6)
    values[toKey(d)] = val
  }
  return values
}

export default function ActivityTable() {
  const end = startOfDay(new Date())
  const start = addDays(end, -7 * 35 + 1)
  const data = useMemo(() => generateMockValues(start, end), [])

  return (
    
      <div className="w-full max-w-4xl">
        

        <div className="rounded-2xl p-4 border border-white/10 bg-white/60 backdrop-blur-xl dark:bg-zinc-900/40 shadow-sm">
        <h1 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Commit Activity</h1>
          <GrayscaleHeatmap startDate={start} endDate={end} values={data} />
        </div>
      </div>
    
  )
}
