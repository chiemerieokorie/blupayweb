'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, ChevronsUpDown, Search, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Mock branch data - replace with actual API when available
const MOCK_BRANCHES = [
  {
    id: 'br1e1e1e-1e1e-1e1e-1e1e-1e1e1e1e1e1e',
    name: 'Accra Main Branch',
    code: 'ACC-MAIN',
    address: 'High Street, Accra',
    city: 'Accra',
    bankId: 'b1e1e1e1-1e1e-1e1e-1e1e-1e1e1e1e1e1e'
  },
  {
    id: 'br2e2e2e-2e2e-2e2e-2e2e-2e2e2e2e2e2e',
    name: 'Kumasi Branch',
    code: 'KUM-001',
    address: 'Kejetia Market, Kumasi',
    city: 'Kumasi',
    bankId: 'b1e1e1e1-1e1e-1e1e-1e1e-1e1e1e1e1e1e'
  },
  {
    id: 'br3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e3e',
    name: 'Tema Branch',
    code: 'TEM-001',
    address: 'Community 1, Tema',
    city: 'Tema',
    bankId: 'b1e1e1e1-1e1e-1e1e-1e1e-1e1e1e1e1e1e'
  },
  {
    id: 'br4e4e4e-4e4e-4e4e-4e4e-4e4e4e4e4e4e',
    name: 'East Legon Branch',
    code: 'EL-001',
    address: 'East Legon Road, Accra',
    city: 'Accra',
    bankId: 'b2e2e2e2-2e2e-2e2e-2e2e-2e2e2e2e2e2e'
  },
  {
    id: 'br5e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e',
    name: 'Airport Branch',
    code: 'APT-001',
    address: 'Airport Residential Area, Accra',
    city: 'Accra',
    bankId: 'b2e2e2e2-2e2e-2e2e-2e2e-2e2e2e2e2e2e'
  }
];

interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  bankId: string;
}

interface BranchSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  bankId?: string;
}

export function BranchSelect({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select branch...",
  className,
  bankId
}: BranchSelectProps) {
  const [open, setOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call when available
        // const response = await branchService.getBranches({ bankId });
        // setBranches(response.data);
        
        // Mock implementation
        const filteredBranches = bankId 
          ? MOCK_BRANCHES.filter(branch => branch.bankId === bankId)
          : MOCK_BRANCHES;
        setBranches(filteredBranches);
      } catch (error) {
        console.error('Failed to fetch branches:', error);
        setBranches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [bankId]);

  const filteredBranches = useMemo(() => {
    if (!searchValue) return branches;
    return branches.filter(branch =>
      branch.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      branch.code.toLowerCase().includes(searchValue.toLowerCase()) ||
      branch.city.toLowerCase().includes(searchValue.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [branches, searchValue]);

  const selectedBranch = branches.find((branch) => branch.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
          disabled={disabled || loading || !bankId}
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {selectedBranch ? (
              <span className="truncate">
                {selectedBranch.name} ({selectedBranch.code})
              </span>
            ) : (
              <span className="text-muted-foreground">
                {!bankId ? "Select bank first..." : placeholder}
              </span>
            )}
          </div>
          {loading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search branches..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading branches..." : "No branches found."}
            </CommandEmpty>
            <CommandGroup>
              {filteredBranches.map((branch) => (
                <CommandItem
                  key={branch.id}
                  value={branch.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{branch.name}</span>
                        <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                          {branch.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{branch.city}</span>
                        <span>•</span>
                        <span className="truncate">{branch.address}</span>
                      </div>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === branch.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}