import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type {ColumnDef} from "@tanstack/react-table"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  IconCircleCheckFilled,
  IconLoader,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"

export const schema = z.object({
  id: z.number(),
  projectName: z.string(),
  status: z.string(),
  lastCommit: z.string(),
  deadline: z.string(),
})

const columns: ColumnDef<z.infer<typeof schema>>[] = [
    {
        id: "index",
        header: "#",
        cell: ({ row }) => row.index + 1, // row.index dimulai dari 0
    },
  {
    accessorKey: "projectName",
    header: "Project Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.projectName}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="flex items-center gap-1 text-muted-foreground px-2"
      >
        {row.original.status === "Done" ? (
          <IconCircleCheckFilled className="size-3 fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader className="size-3 animate-spin" />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "lastCommit",
    header: "Last Commit",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.lastCommit}
      </span>
    ),
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.deadline}
      </span>
    ),
  },
]

export function ProjectTable({
  data,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
  })

  return (
    <div className="w-full border rounded-xl overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center h-24">
                No projects found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center p-3 border-t bg-muted/20">
        <div className="text-xs text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <IconChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <IconChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
