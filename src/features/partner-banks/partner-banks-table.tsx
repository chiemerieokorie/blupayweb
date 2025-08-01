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
import { usePartnerBanks, useSelectedPartnerBank } from "./hooks";
import { PartnerBank } from "@/sdk/types";
import { useToast } from "@/hooks/use-toast";

interface PartnerBanksTableProps {
  onEdit?: (partnerBank: PartnerBank) => void;
  onView?: (partnerBank: PartnerBank) => void;
  showCreateDialog: boolean;
  setShowCreateDialog: (show: boolean) => void;
}

export function PartnerBanksTable({ onEdit, onView, setShowCreateDialog, showCreateDialog }: PartnerBanksTableProps) {
  const { partnerBanks, loading, deletePartnerBank } = usePartnerBanks();
  const { selectPartnerBank } = useSelectedPartnerBank();
  const { toast } = useToast();

  const handleDelete = async (partnerBank: PartnerBank) => {
    if (window.confirm(`Are you sure you want to delete partner bank ${partnerBank.name}?`)) {
      try {
        await deletePartnerBank(partnerBank.uuid);
        toast({
          title: "Success",
          description: "Partner bank deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete partner bank",
          variant: "destructive",
        });
      }
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
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Commission Ratio</TableHead>
              <TableHead>Devices</TableHead>
              <TableHead>Merchants</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partnerBanks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No partner banks found
                </TableCell>
              </TableRow>
            ) : (
              partnerBanks.map((partnerBank) => (
                <TableRow key={partnerBank.uuid}>
                  <TableCell className="font-medium">
                    {partnerBank.name}
                  </TableCell>
                  <TableCell>{partnerBank.slug || '-'}</TableCell>
                  <TableCell>
                    {partnerBank.commissionRatio ? `${(partnerBank.commissionRatio * 100).toFixed(1)}%` : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {partnerBank.devices?.length || 0} devices
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {partnerBank.merchants?.length || 0} merchants
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(partnerBank.createdAt).toLocaleDateString()}
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
                            selectPartnerBank(partnerBank);
                            onView?.(partnerBank);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            selectPartnerBank(partnerBank);
                            onEdit?.(partnerBank);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(partnerBank)}
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
    </>
  );
}