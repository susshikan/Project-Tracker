import React, { useMemo, useState } from "react";

type CountMap = Record<string, number>;

type HeatmapProps = {
  startDate?: Date;
  endDate?: Date;
  values?: CountMap;
  maxCount?: number;
  colorScale?: string[];
  showWeekdayLabels?: boolean;
  showMonthLabels?: boolean;
  onCellClick?: (date: string, count: number) => void;
  className?: string;
};

const GRAYSCALE_SCALE = [
  "bg-zinc-100 dark:bg-zinc-800",
  "bg-zinc-300 dark:bg-zinc-700",
  "bg-zinc-400 dark:bg-zinc-600",
  "bg-zinc-500 dark:bg-zinc-500",
  "bg-zinc-700 dark:bg-zinc-400",
];

function toKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function getWeeks(start: Date, end: Date) {
  const s = startOfDay(start);
  const e = startOfDay(end);
  const day = s.getDay();
  const alignedStart = addDays(s, -((day + 7) % 7));
  const totalDays = Math.ceil((startOfDay(addDays(e, 1)).getTime() - alignedStart.getTime()) / (1000 * 3600 * 24));
  const cols = Math.ceil(totalDays / 7);

  const matrix: Date[][] = [];
  for (let c = 0; c < cols; c++) {
    const col: Date[] = [];
    for (let r = 0; r < 7; r++) {
      col.push(addDays(alignedStart, c * 7 + r));
    }
    matrix.push(col);
  }
  return { matrix, alignedStart };
}

function monthLabels(matrix: Date[][]) {
  const labels: { col: number; label: string }[] = [];
  let lastMonth = -1;
  matrix.forEach((col, idx) => {
    const firstDay = col[0];
    const m = firstDay.getMonth();
    if (m !== lastMonth) {
      labels.push({ col: idx, label: firstDay.toLocaleString(undefined, { month: "short" }) });
      lastMonth = m;
    }
  });
  return labels;
}

const weekdayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getBucket(count: number, maxCount: number, steps: number) {
  if (count <= 0) return 0;
  const bucket = Math.min(steps - 1, Math.ceil((count / maxCount) * (steps - 1)));
  return bucket;
}

export function GrayscaleHeatmap({
  startDate,
  endDate,
  values = {},
  maxCount,
  colorScale = GRAYSCALE_SCALE,
  showWeekdayLabels = true,
  showMonthLabels = true,
  onCellClick,
  className = "",
}: HeatmapProps) {
  const today = startOfDay(new Date());
  const defaultEnd = endDate ? startOfDay(endDate) : today;
  const defaultStart = startDate ? startOfDay(startDate) : addDays(defaultEnd, -7 * 52 + 1);

  const derivedMax = useMemo(() => {
    if (maxCount) return maxCount;
    let m = 0;
    for (const k in values) m = Math.max(m, values[k] || 0);
    return Math.max(1, m);
  }, [values, maxCount]);

  const { matrix } = useMemo(() => getWeeks(defaultStart, defaultEnd), [defaultStart, defaultEnd]);
  const months = useMemo(() => monthLabels(matrix), [matrix]);

  const [hoverInfo, setHoverInfo] = useState<{ x: number; y: number; date: string; count: number } | null>(null);

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      {showMonthLabels && (
        <div className="pl-10 mb-1 flex text-xs text-zinc-500 dark:text-zinc-400 select-none">
          {matrix.map((_, i) => {
            const label = months.find((m) => m.col === i)?.label;
            return (
              <div key={i} className="w-3 h-4 flex items-end justify-start" style={{ minWidth: 12 }}>
                {label && <span className="translate-x-0.5">{label}</span>}
              </div>
            );
          })}
        </div>
      )}

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
                const key = toKey(d);
                const count = values[key] || 0;
                const bucket = getBucket(count, derivedMax, colorScale.length);
                const isOutsideRange = d < defaultStart || d > defaultEnd;
                const cellColor = isOutsideRange ? "bg-transparent" : colorScale[bucket];

                return (
                  <button
                    key={key}
                    aria-label={`${key}: ${count} contributions`}
                    title={`${count} contributions on ${d.toLocaleDateString()}`}
                    disabled={isOutsideRange}
                    onClick={() => !isOutsideRange && onCellClick?.(key, count)}
                    onMouseEnter={(e) => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      setHoverInfo({ x: rect.left + rect.width / 2, y: rect.top, date: key, count });
                    }}
                    onMouseLeave={() => setHoverInfo(null)}
                    className={[
                      "w-3 h-3 rounded-[3px] outline-none focus:ring-2 focus:ring-offset-1",
                      "ring-zinc-400/50 ring-offset-transparent",
                      cellColor,
                      isOutsideRange ? "opacity-30 cursor-default" : "hover:opacity-80",
                      "transition",
                    ].join(" ")}
                    style={{ minWidth: 12, minHeight: 12 }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>Less</span>
        <div className="flex items-center gap-1">
          {colorScale.map((c, i) => (
            <div key={i} className={`w-3 h-3 rounded-[3px] ${c}`} />
          ))}
        </div>
        <span>More</span>
      </div>

      {hoverInfo && (
        <div
          className="fixed z-50 px-2 py-1 text-xs rounded-md shadow-lg bg-zinc-900 text-white border border-white/10"
          style={{ left: hoverInfo.x + 8, top: hoverInfo.y - 8 }}
        >
          <div className="font-medium">{hoverInfo.count} contributions</div>
          <div className="opacity-80">{hoverInfo.date}</div>
        </div>
      )}
    </div>
  );
}

function generateMockValues(start: Date, end: Date): CountMap {
  const values: CountMap = {};
  const s = startOfDay(start);
  const e = startOfDay(end);
  for (let d = new Date(s); d <= e; d = addDays(d, 1)) {
    const r = Math.random();
    const val = r < 0.5 ? 0 : r < 0.8 ? 1 + Math.floor(Math.random() * 3) : 4 + Math.floor(Math.random() * 6);
    values[toKey(d)] = val;
  }
  return values;
}

export default function ActivityTable() {
  const end = startOfDay(new Date());
  const start = addDays(end, -7 * 35 + 1);
  const data = useMemo(() => generateMockValues(start, end), []);

  const [lastClick, setLastClick] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-zinc-900 dark:to-zinc-950 p-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Commit Activity</h1>

        <div className="rounded-2xl p-4 border border-white/10 bg-white/60 backdrop-blur-xl dark:bg-zinc-900/40 shadow-sm">
          <GrayscaleHeatmap
            startDate={start}
            endDate={end}
            values={data}
            onCellClick={(date, count) => setLastClick(`${date}: ${count} contributions`)}
          />
        </div>

        {lastClick && (
          <div className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">Clicked: {lastClick}</div>
        )}
      </div>
    </div>
  );
}

/* json data for this component
{
  "2025-01-01": 2,
  "2025-01-02": 5,
  "2025-01-03": 0,
  "2025-01-04": 3,
  "2025-01-05": 1,
  "2025-01-06": 4
}

*/