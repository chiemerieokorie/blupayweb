'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, ChevronsUpDown, Search, Terminal, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { deviceService } from '@/sdk/devices';
import { Device } from '@/sdk/types';

interface TerminalSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  merchantId?: string;
  partnerBankId?: string;
  className?: string;
}

export function TerminalSelect({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select terminal...",
  merchantId,
  partnerBankId,
  className
}: TerminalSelectProps) {
  const [open, setOpen] = useState(false);
  const [terminals, setTerminals] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchTerminals = async () => {
      setLoading(true);
      try {
        let response;
        if (merchantId) {
          response = await deviceService.getDevicesByMerchant(merchantId);
        } else if (partnerBankId) {
          response = await deviceService.getDevicesByPartnerBank(partnerBankId);
        } else {
          const devicesResponse = await deviceService.getDevices();
          response = devicesResponse.data || [];
        }
        
        const deviceArray = Array.isArray(response) ? response : [response];
        setTerminals(deviceArray.filter(device => device.deviceType === 'POS' || device.deviceType === 'ATM'));
      } catch (error) {
        console.error('Failed to fetch terminals:', error);
        setTerminals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTerminals();
  }, [merchantId, partnerBankId]);

  const filteredTerminals = useMemo(() => {
    if (!searchValue) return terminals;
    return terminals.filter(terminal =>
      terminal.serialNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
      terminal.model.toLowerCase().includes(searchValue.toLowerCase()) ||
      terminal.manufacturer.toLowerCase().includes(searchValue.toLowerCase()) ||
      (terminal.location && terminal.location.toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [terminals, searchValue]);

  const selectedTerminal = terminals.find((terminal) => terminal.id === value);

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
            <Terminal className="h-4 w-4 text-muted-foreground" />
            {selectedTerminal ? (
              <span className="truncate">
                {selectedTerminal.serialNumber} - {selectedTerminal.model}
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
              placeholder="Search terminals..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading terminals..." : "No terminals found."}
            </CommandEmpty>
            <CommandGroup>
              {filteredTerminals.map((terminal) => (
                <CommandItem
                  key={terminal.id}
                  value={terminal.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{terminal.serialNumber}</span>
                        <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                          {terminal.deviceType}
                        </span>
                        {terminal.status === 'ACTIVE' && (
                          <span className="text-xs text-green-600 px-1.5 py-0.5 bg-green-50 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {terminal.manufacturer} {terminal.model}
                        {terminal.location && ` • ${terminal.location}`}
                      </span>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === terminal.id ? "opacity-100" : "opacity-0"
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