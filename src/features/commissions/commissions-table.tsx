"use client";

import { useState } from "react";
import { MoreHorizontal, Plus, Trash2, Edit, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useCommissions, useSelectedCommission } from "./hooks";
import { Commission } from "@/sdk/types";
import { CreateCommissionForm } from "./create-commission-form";
import { useToast } from "@/hooks/use-toast";

interface CommissionsTableProps {
  onEdit?: (commission: Commission) => void;
  onView?: (commission: Commission) => void;
}

export function CommissionsTable({ onEdit, onView }: CommissionsTableProps) {
  const { commissions, loading, deleteCommission } = useCommissions();
  const { selectCommission } = useSelectedCommission();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleDelete = async (commission: Commission) => {
    if (window.confirm(`Are you sure you want to delete this commission rule?`)) {
      try {
        await deleteCommission(commission.id);
        toast({
          title: "Success",
          description: "Commission deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete commission",
          variant: "destructive",
        });
      }
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "PERCENTAGE":
        return "default";
      case "FIXED":
        return "secondary";
      case "TIERED":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
      case "PENDING":
        return "outline";
      default:
        return "outline";
    }
  };

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
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
        <h2 className="text-lg font-semibold">Commissions</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Commission Rule
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Rate/Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead>Partner Bank</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No commissions found
                </TableCell>
              </TableRow>
            ) : (
              commissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(commission.type)}>
                      {commission.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {commission.type === 'PERCENTAGE' 
                      ? `${commission.rate}%`
                      : formatCurrency(commission.amount || 0)
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(commission.status)}>
                      {commission.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{commission.merchantId || "-"}</TableCell>
                  <TableCell>{commission.partnerBankId || "-"}</TableCell>
                  <TableCell>
                    {new Date(commission.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
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
                            selectCommission(commission);
                            onView?.(commission);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            selectCommission(commission);
                            onEdit?.(commission);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(commission)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
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
            <DialogTitle>Create Commission Rule</DialogTitle>
            <DialogDescription>
              Set up a new commission structure for transactions.
            </DialogDescription>
          </DialogHeader>
          <CreateCommissionForm onSuccess={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}