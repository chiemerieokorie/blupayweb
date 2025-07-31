"use client";

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
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { IconDots, IconTrash, IconEdit, IconEye } from "@tabler/icons-react";
import { User, UserRoleEnum } from "@/sdk/types";

interface UserTableRowProps {
  user: User;
  onEdit?: (user: User) => void;
  onView?: (user: User) => void;
  onDelete?: (user: User) => void;
  onSelect?: (user: User) => void;
  isSelected?: boolean;
}

export function UserTableRow({ 
  user, 
  onEdit, 
  onView, 
  onDelete, 
  onSelect,
  isSelected 
}: UserTableRowProps) {
  
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case UserRoleEnum.ADMIN:
        return "destructive";
      case UserRoleEnum.MERCHANT:
        return "default";
      case UserRoleEnum.PARTNER_BANK:
        return "secondary";
      case UserRoleEnum.SUB_MERCHANT:
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
      case "SUSPENDED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <TableRow data-state={isSelected && "selected"}>
      <TableCell className="font-medium">
        {user.firstName} {user.lastName}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge variant={getRoleBadgeVariant(user.role)}>
          {user.role}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(user.status)}>
          {user.status}
        </Badge>
      </TableCell>
      <TableCell>{user.phoneNumber || "-"}</TableCell>
      <TableCell>
        {new Date(user.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <IconDots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                onSelect?.(user);
                onView?.(user);
              }}
            >
              <IconEye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onSelect?.(user);
                onEdit?.(user);
              }}
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(user)}
              className="text-red-600"
            >
              <IconTrash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

// Also create a separate actions component for use in column definitions
interface UserTableActionsProps {
  user: User;
  onEdit?: (user: User) => void;
  onView?: (user: User) => void;
  onDelete?: (user: User) => void;
  onSelect?: (user: User) => void;
}

export function UserTableActions({ 
  user, 
  onEdit, 
  onView, 
  onDelete, 
  onSelect 
}: UserTableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <IconDots className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            onSelect?.(user);
            onView?.(user);
          }}
        >
          <IconEye className="h-4 w-4 mr-2" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onSelect?.(user);
            onEdit?.(user);
          }}
        >
          <IconEdit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete?.(user)}
          className="text-red-600"
        >
          <IconTrash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}