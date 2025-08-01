'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, ChevronsUpDown, Search, Landmark, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Mock bank data - replace with actual API when available
const MOCK_BANKS = [
  {
    id: 'b1e1e1e1-1e1e-1e1e-1e1e-1e1e1e1e1e1e',
    name: 'Ghana Commercial Bank',
    code: 'GCB',
    swiftCode: 'GCBLGHAC',
    country: 'Ghana'
  },
  {
    id: 'b2e2e2e2-2e2e-2e2e-2e2e-2e2e2e2e2e2e',
    name: 'Ecobank Ghana',
    code: 'ECO',
    swiftCode: 'ECOCGHAC',
    country: 'Ghana'
  },
  {
    id: 'b3e3e3e3-3e3e-3e3e-3e3e-3e3e3e3e3e3e',
    name: 'Standard Chartered Bank',
    code: 'SCB',
    swiftCode: 'SCBLGHAC',
    country: 'Ghana'
  },
  {
    id: 'b4e4e4e4-4e4e-4e4e-4e4e-4e4e4e4e4e4e',
    name: 'Fidelity Bank Ghana',
    code: 'FBG',
    swiftCode: 'FBLIGHAC',
    country: 'Ghana'
  },
  {
    id: 'b5e5e5e5-5e5e-5e5e-5e5e-5e5e5e5e5e5e',
    name: 'Access Bank Ghana',
    code: 'ABG',
    swiftCode: 'ABCLGHAC',
    country: 'Ghana'
  }
];

interface Bank {
  id: string;
  name: string;
  code: string;
  swiftCode?: string;
  country: string;
}

interface BankSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  country?: string;
}

export function BankSelect({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select bank...",
  className,
  country = 'Ghana'
}: BankSelectProps) {
  const [open, setOpen] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchBanks = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call when available
        // const response = await bankService.getBanks({ country });
        // setBanks(response.data);
        
        // Mock implementation
        const filteredBanks = MOCK_BANKS.filter(bank => 
          bank.country.toLowerCase() === country.toLowerCase()
        );
        setBanks(filteredBanks);
      } catch (error) {
        console.error('Failed to fetch banks:', error);
        setBanks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, [country]);

  const filteredBanks = useMemo(() => {
    if (!searchValue) return banks;
    return banks.filter(bank =>
      bank.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      bank.code.toLowerCase().includes(searchValue.toLowerCase()) ||
      (bank.swiftCode && bank.swiftCode.toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [banks, searchValue]);

  const selectedBank = banks.find((bank) => bank.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
          disabled={disabled || loading}
        >
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-muted-foreground" />
            {selectedBank ? (
              <span className="truncate">
                {selectedBank.name} ({selectedBank.code})
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
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
              placeholder="Search banks..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading banks..." : "No banks found."}
            </CommandEmpty>
            <CommandGroup>
              {filteredBanks.map((bank) => (
                <CommandItem
                  key={bank.id}
                  value={bank.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{bank.name}</span>
                        <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                          {bank.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{bank.country}</span>
                        {bank.swiftCode && (
                          <>
                            <span>•</span>
                            <span>SWIFT: {bank.swiftCode}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === bank.id ? "opacity-100" : "opacity-0"
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