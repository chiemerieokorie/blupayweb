"use client";

import {useState} from "react";
import {MoreHorizontal, Plus, Trash2, Edit, Eye} from "lucide-react";
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
            case "OUT_OF_ORDER":
                return "destructive";
            default:
                return "outline";
        }
    };

    const getTypeBadgeVariant = (type: string) => {
        switch (type) {
            case "POS":
                return "default";
            case "ATM":
                return "secondary";
            case "MOBILE":
                return "outline";
            default:
                return "outline";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">

            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Serial Number</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Partner Bank</TableHead>
                            <TableHead>Last Activity</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {devices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                    No devices found
                                </TableCell>
                            </TableRow>
                        ) : (
                            devices.map((device) => (
                                <TableRow key={device.id}>
                                    <TableCell className="font-medium">
                                        {device.serialNumber}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getTypeBadgeVariant(device.deviceType)}>
                                            {device.deviceType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(device.status)}>
                                            {device.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{device.location || "-"}</TableCell>
                                    <TableCell>{device.partnerBankId || "-"}</TableCell>
                                    <TableCell>
                                        {device.lastActivity
                                            ? new Date(device.lastActivity).toLocaleDateString()
                                            : "-"
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        selectDevice(device);
                                                        onView?.(device);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4 mr-2"/>
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        selectDevice(device);
                                                        onEdit?.(device);
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4 mr-2"/>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(device)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2"/>
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
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