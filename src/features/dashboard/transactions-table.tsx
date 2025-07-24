"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconUser,
  IconCalendar,
  IconHash,
  IconCreditCard,
  IconReceipt,
  IconCurrencyDollar,
  IconCircleFilled,
  IconAlertCircle,
  IconClock,
  IconRefresh,
  IconDownload,
  IconUpload,
  IconRotateClockwise,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Transaction, TransactionStatus, TransactionType } from "@/sdk/types"
import { useDashboard } from "./hooks"

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const getStatusBadge = (status: TransactionStatus) => {
  const variants = {
    SUCCESSFUL: 'default',
    PENDING: 'secondary',
    FAILED: 'destructive',
  } as const;

  const icons = {
    SUCCESSFUL: <IconCircleCheckFilled className="w-3 h-3" />,
    PENDING: <IconClock className="w-3 h-3" />,
    FAILED: <IconAlertCircle className="w-3 h-3" />,
  } as const;

  const labels = {
    SUCCESSFUL: 'SUCCESS',
    PENDING: 'PENDING',
    FAILED: 'FAILED',
  } as const;

  return (
    <Badge variant={variants[status]} className="gap-1">
      {icons[status]}
      {labels[status]}
    </Badge>
  );
};

const getTransactionIcon = (type: TransactionType) => {
  return type === 'MONEY_IN' ? (
    <IconDownload className="h-4 w-4 text-green-500" />
  ) : (
    <IconUpload className="h-4 w-4 text-red-500" />
  );
};

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(amount);
};

const getProcessorLogo = (processor: string) => {
  const processorLogos: Record<string, string> = {
    'MTN': '/logos/mtn.png',
    'VODAFONE': '/logos/vodafone.png',
    'AIRTELTIGO': '/logos/airteltigo.png',
    'ZEEPAY': '/logos/zeepay.png',
    'VISA': '/logos/visa.png',
    'MASTERCARD': '/logos/mastercard.png',
  };
  
  return processorLogos[processor?.toUpperCase()] || '/logos/default.png';
};

const columns: ColumnDef<Transaction>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.uuid} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customer.name",
    header: () => (
      <div className="flex items-center gap-2">
        <IconUser className="w-4 h-4" />
        Customer Name
      </div>
    ),
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getTransactionIcon(transaction.type)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">
              {transaction.customer?.name || 'Unknown Customer'}
            </p>
            <p className="text-xs text-muted-foreground">
              {(transaction as any).merchant?.merchantName || 'Direct'}
            </p>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="flex items-center gap-2">
        <IconCalendar className="w-4 h-4" />
        Date
      </div>
    ),
    cell: ({ row }) => (
      <div>
        <div className="text-sm">
          {new Date(row.original.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "merchant.terminal.deviceId",
    header: () => (
      <div className="flex items-center gap-2">
        <IconHash className="w-4 h-4" />
        TID
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-sm font-mono">
        {(row.original as any).merchant?.terminal?.deviceId || 'N/A'}
      </div>
    ),
  },
  {
    accessorKey: "processor",
    header: () => (
      <div className="flex items-center gap-2">
        <IconCreditCard className="w-4 h-4" />
        Scheme
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <img
          src={getProcessorLogo(row.original.processor)}
          alt={row.original.processor}
          className="h-6 w-6 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <span className="text-xs text-muted-foreground hidden">
          {row.original.processor}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "transactionRef",
    header: () => (
      <div className="flex items-center gap-2">
        <IconReceipt className="w-4 h-4" />
        Reference
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-sm font-mono">
        {row.original.transactionRef}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => (
      <div className="flex items-center gap-2">
        <IconCurrencyDollar className="w-4 h-4" />
        Amount
      </div>
    ),
    cell: ({ row }) => (
      <div>
        <div className={`text-sm font-medium ${
          row.original.type === 'MONEY_IN' ? 'text-green-600' : 'text-red-600'
        }`}>
          {row.original.type === 'MONEY_IN' ? '+' : '-'}
          {formatAmount(row.original.amount)}
        </div>
        <div className="text-xs text-muted-foreground">
          {row.original.source}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="flex items-center gap-2">
        <IconCircleFilled className="w-4 h-4" />
        Status
      </div>
    ),
    cell: ({ row }) => getStatusBadge(row.original.status),
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Download Receipt</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Dispute</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function DraggableRow({ row }: { row: Row<Transaction> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.uuid,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

function LoadingState() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-10 w-10 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <IconAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Transactions</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={onRetry} className="gap-2">
            <IconRefresh className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function TransactionsTable() {
  const { transactions, loading, error, refresh } = useDashboard();
  const [data, setData] = React.useState<Transaction[]>([])
  const [activeTab, setActiveTab] = React.useState("all")
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  // Update data when transactions change
  React.useEffect(() => {
    if (transactions) {
      setData(transactions)
    }
  }, [transactions])

  // Filter data based on active tab
  const filteredData = React.useMemo(() => {
    if (!data) return []
    
    if (activeTab === "all") return data
    if (activeTab === "collection") return data.filter(t => t.type === 'MONEY_IN')
    if (activeTab === "payout") return data.filter(t => t.type === 'MONEY_OUT')
    if (activeTab === "reversal") return data.filter(t => t.status === 'FAILED') // Assuming reversals are failed transactions
    
    return data
  }, [data, activeTab])

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => filteredData?.map(({ uuid }) => uuid) || [],
    [filteredData]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.uuid,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  // Show loading state
  if (loading) {
    return <LoadingState />
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={refresh} />
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between">
        <TabsList className="grid w-fit grid-cols-4">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="collection" className="gap-2">
            <IconDownload className="w-4 h-4" />
            Collection
          </TabsTrigger>
          <TabsTrigger value="reversal" className="gap-2">
            <IconRotateClockwise className="w-4 h-4" />
            Reversal
          </TabsTrigger>
          <TabsTrigger value="payout" className="gap-2">
            <IconUpload className="w-4 h-4" />
            Payout
          </TabsTrigger>
        </TabsList>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <TabsContent value={activeTab} className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}