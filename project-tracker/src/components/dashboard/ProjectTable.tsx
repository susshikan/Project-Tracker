import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { IconChevronLeft, IconChevronRight, IconCircleCheckFilled, IconLoader } from "@tabler/icons-react"

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
import { projectSchema, type ProjectListItem } from "@/types/project"

export const schema = projectSchema

const columns: ColumnDef<ProjectListItem>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "projectName",
    header: "Project Name",
    cell: ({ row }) => <div className="font-medium">{row.original.projectName}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="flex items-center gap-1 px-2 text-muted-foreground">
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
    id: "lastCommit",
    header: "Last Commit",
    cell: ({ row }) => {
      const commits = row.original.commits
      const lastCommit = commits.length > 0 
        ? commits.reduce((a, b) => (a.createAt > b.createAt ? a : b)).createAt 
        : "-"
      return <span className="text-sm text-muted-foreground">{lastCommit}</span>
    },
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.deadline}</span>,
  },
]

export function ProjectTable({ data }: { data: ProjectListItem[] }) {
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
    <div className="w-full overflow-hidden rounded-xl border">
      <Table>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No projects found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t bg-muted/20 p-3">
        <div className="text-xs text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
            <IconChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
            <IconChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
