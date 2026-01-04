import { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import type { CommitsListItem } from "@/types/project"

const columns: ColumnDef<CommitsListItem>[] = [
    {
        accessorKey: "createAt",
        header: "createAt",
        cell: ({row}) => row.original.createAt
    },
    {
        accessorKey: "message",
        header: "message",
        cell: ({row}) => row.original.message
    }

]

export function CommitTable({data}: {data: CommitsListItem[]}) {
    const [pagination, setPagination] = useState({
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
                    No commits found.
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
