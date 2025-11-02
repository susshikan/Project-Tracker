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
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import type { CommitsListItem } from "@/types/project"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

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
    <div>
        <Table className="max-w-[550px]">
        <TableHeader className="bg-muted/50">
            <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell className="text-right">{invoice.totalAmount}</TableCell>
            </TableRow>
            ))}
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
