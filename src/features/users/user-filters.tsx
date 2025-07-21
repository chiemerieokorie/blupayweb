"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useUsers } from "./hooks";
import { UsersFilter } from "./atoms";

export function UserFilters() {
  const { filter, updateFilter, resetFilter, fetchUsers } = useUsers();
  const [isOpen, setIsOpen] = useState(false);
  const [localFilter, setLocalFilter] = useState<UsersFilter>(filter);

  const handleApplyFilters = () => {
    updateFilter(localFilter);
    fetchUsers(localFilter);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc' as const,
    };
    setLocalFilter(resetFilters);
    resetFilter();
    fetchUsers(resetFilters);
    setIsOpen(false);
  };

  const handleSearchChange = (value: string) => {
    const newFilter = { ...filter, search: value, page: 1 };
    updateFilter(newFilter);
    
    const timeoutId = setTimeout(() => {
      fetchUsers(newFilter);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filter.search) count++;
    if (filter.role) count++;
    if (filter.status) count++;
    if (filter.partnerBankId) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="flex items-center space-x-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={filter.search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Users</SheetTitle>
            <SheetDescription>
              Refine your user search with these filters
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={localFilter.role || ""}
                onValueChange={(value) =>
                  setLocalFilter(prev => ({ ...prev, role: value || undefined }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MERCHANT">Merchant</SelectItem>
                  <SelectItem value="PARTNER_BANK">Partner Bank</SelectItem>
                  <SelectItem value="SUB_MERCHANT">Sub Merchant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={localFilter.status || ""}
                onValueChange={(value) =>
                  setLocalFilter(prev => ({ ...prev, status: value || undefined }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Partner Bank ID</label>
              <Input
                placeholder="Enter partner bank ID"
                value={localFilter.partnerBankId || ""}
                onChange={(e) =>
                  setLocalFilter(prev => ({ ...prev, partnerBankId: e.target.value || undefined }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select
                value={localFilter.sortBy || "createdAt"}
                onValueChange={(value) =>
                  setLocalFilter(prev => ({ ...prev, sortBy: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="firstName">First Name</SelectItem>
                  <SelectItem value="lastName">Last Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="role">Role</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort Order</label>
              <Select
                value={localFilter.sortOrder || "desc"}
                onValueChange={(value) =>
                  setLocalFilter(prev => ({ ...prev, sortOrder: value as 'asc' | 'desc' }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8 flex space-x-2">
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleResetFilters}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {activeFiltersCount > 0 && (
        <Button variant="ghost" size="sm" onClick={handleResetFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
}