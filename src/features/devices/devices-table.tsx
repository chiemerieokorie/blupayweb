"use client";

import React, {useState} from "react";
import {MoreHorizontal, Trash2, Edit, Eye} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {useDevices, useSelectedDevice} from "./hooks";
import {Device} from "@/sdk/types";
import {CreateDeviceForm} from "./create-device-form";
import {useToast} from "@/hooks/use-toast";

interface DevicesTableProps {
    onEdit?: (device: Device) => void;
    onView?: (device: Device) => void;
    showCreateDialog: boolean;
    setShowCreateDialog: (show: boolean) => void;
}

export function DevicesTable({onEdit, onView, setShowCreateDialog, showCreateDialog}: DevicesTableProps) {
    const {devices, loading, deleteDevice} = useDevices();
    const {selectDevice} = useSelectedDevice();
    const {toast} = useToast();

    const handleDelete = async (device: Device) => {
        if (window.confirm(`Are you sure you want to delete device ${device.serialNumber}?`)) {
            try {
                await deleteDevice(device.id);
                toast({
                    title: "Success",
                    description: "Device deleted successfully",
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to delete device",
                    variant: "destructive",
                });
            }
        }
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "default";
            case "INACTIVE":
                return "secondary";
            case "MAINTENANCE":
                return "outline";
            case "ASSIGNED":
                return "default";
            default:
                return "outline";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "ALLOCATED";
            case "INACTIVE":
                return "SUBMITTED";
            case "MAINTENANCE":
                return "MAINTENANCE";
            case "ASSIGNED":
                return "ALLOCATED";
            default:
                return status;
        }
    };

    const columns = React.useMemo<ColumnDef<Device>[]>(
        () => [
            {
                accessorKey: "serialNumber",
                header: "TERMINAL ID",
                cell: ({ row }) => (
                    <div className="font-medium">{row.getValue("serialNumber")}</div>
                ),
            },
            {
                accessorKey: "status",
                header: "STATUS",
                cell: ({ row }) => {
                    const status = row.getValue("status") as string;
                    return (
                        <Badge variant={getStatusBadgeVariant(status)}>
                            {getStatusLabel(status)}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "merchantId",
                header: "ALLOCATED TO",
                cell: ({ row }) => {
                    const merchantId = row.getValue("merchantId") as string;
                    return <div>{merchantId || "-"}</div>;
                },
            },
            {
                accessorKey: "createdAt",
                header: "DATE CREATED",
                cell: ({ row }) => {
                    const date = row.getValue("createdAt") as string;
                    return (
                        <div>
                            {new Date(date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    );
                },
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }) => {
                    const device = row.original;
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        selectDevice(device);
                                        onView?.(device);
                                    }}
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        selectDevice(device);
                                        onEdit?.(device);
                                    }}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => handleDelete(device)}
                                    className="text-red-600"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [onEdit, onView, selectDevice]
    );

    const table = useReactTable({
        data: devices,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center py-12 text-muted-foreground"
                                >
                                    No devices found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add New Device</DialogTitle>
                        <DialogDescription>
                            Register a new device/terminal in the system.
                        </DialogDescription>
                    </DialogHeader>
                    <CreateDeviceForm onSuccess={() => setShowCreateDialog(false)}/>
                </DialogContent>
            </Dialog>
        </div>
    );
}