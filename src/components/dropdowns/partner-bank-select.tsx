'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, ChevronsUpDown, Search, Building2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { partnerBankService } from '@/sdk/partner-banks';
import { PartnerBank } from '@/sdk/types';

interface PartnerBankSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  showActiveOnly?: boolean;
}

export function PartnerBankSelect({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select partner bank...",
  className,
  showActiveOnly = false
}: PartnerBankSelectProps) {
  const [open, setOpen] = useState(false);
  const [partnerBanks, setPartnerBanks] = useState<PartnerBank[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchPartnerBanks = async () => {
      setLoading(true);
      try {
        const response = await partnerBankService.getPartnerBanks();
        let banks = response.data || [];
        
        if (showActiveOnly) {
          banks = banks.filter(bank => bank.status === 'ACTIVE');
        }
        
        setPartnerBanks(banks);
      } catch (error) {
        console.error('Failed to fetch partner banks:', error);
        setPartnerBanks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerBanks();
  }, [showActiveOnly]);

  const filteredPartnerBanks = useMemo(() => {
    if (!searchValue) return partnerBanks;
    return partnerBanks.filter(bank =>
      bank.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      bank.code.toLowerCase().includes(searchValue.toLowerCase()) ||
      bank.country.toLowerCase().includes(searchValue.toLowerCase()) ||
      (bank.swiftCode && bank.swiftCode.toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [partnerBanks, searchValue]);

  const selectedPartnerBank = partnerBanks.find((bank) => bank.id === value);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-50';
      case 'INACTIVE':
        return 'text-gray-600 bg-gray-50';
      case 'SUSPENDED':
        return 'text-red-600 bg-red-50';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

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
            <Building2 className="h-4 w-4 text-muted-foreground" />
            {selectedPartnerBank ? (
              <span className="truncate">
                {selectedPartnerBank.name} ({selectedPartnerBank.code})
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
              placeholder="Search partner banks..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading partner banks..." : "No partner banks found."}
            </CommandEmpty>
            <CommandGroup>
              {filteredPartnerBanks.map((bank) => (
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
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{bank.name}</span>
                        <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                          {bank.code}
                        </span>
                        <span className={cn("text-xs px-1.5 py-0.5 rounded", getStatusColor(bank.status))}>
                          {bank.status}
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