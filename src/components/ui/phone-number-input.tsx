"use client"

import React, { forwardRef } from "react"
import { ChevronDownIcon, PhoneIcon } from "lucide-react"
import * as RPNInput from "react-phone-number-input"
import flags from "react-phone-number-input/flags"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface PhoneNumberInputProps {
  value?: string
  onChange?: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  defaultCountry?: RPNInput.Country
  international?: boolean
  id?: string
  name?: string
  required?: boolean
  error?: boolean
}

export const PhoneNumberInput = React.memo(({ 
  value, 
  onChange, 
  placeholder = "Enter phone number", 
  disabled, 
  className,
  defaultCountry = "GH",
  international = true,
  error,
  ...props 
}: PhoneNumberInputProps) => {
  const handleChange = (newValue: string | undefined) => {
    const trimmedValue = newValue?.trim()
    onChange?.(trimmedValue)
  }

  const StablePhoneInput = React.useMemo(() => {
    const Component = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
      (inputProps, ref) => (
        <PhoneInput {...inputProps} ref={ref} error={error} />
      )
    )
    Component.displayName = "StablePhoneInput"
    return Component
  }, [error])

  return (
    <RPNInput.default
      className={cn("flex rounded-md shadow-xs", className)}
      international={international}
      defaultCountry={defaultCountry}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={StablePhoneInput}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      {...props}
    />
  )
})

PhoneNumberInput.displayName = "PhoneNumberInput"

const PhoneInput = forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { error?: boolean }>(
  ({ className, error, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        data-slot="phone-input"
        className={cn(
          "-ms-px rounded-s-none shadow-none focus-visible:z-10",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        {...props}
      />
    )
  }
)

PhoneInput.displayName = "PhoneInput"

type CountrySelectProps = {
  disabled?: boolean
  value: RPNInput.Country
  onChange: (value: RPNInput.Country) => void
  options: { label: string; value: RPNInput.Country | undefined }[]
}

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as RPNInput.Country)
  }

  return (
    <div className="relative inline-flex items-center self-stretch rounded-s-md border border-input bg-background py-2 ps-3 pe-2 text-muted-foreground transition-[color,box-shadow] outline-none hover:bg-accent hover:text-foreground focus-within:z-10 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-aria-invalid:border-destructive/60 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40">
      <div className="inline-flex items-center gap-1" aria-hidden="true">
        <FlagComponent country={value} countryName={value} aria-hidden="true" />
        <span className="text-muted-foreground/80">
          <ChevronDownIcon size={16} aria-hidden="true" />
        </span>
      </div>
      <select
        disabled={disabled}
        value={value}
        onChange={handleSelect}
        className="absolute inset-0 text-sm opacity-0"
        aria-label="Select country"
      >
        <option key="default" value="">
          Select a country
        </option>
        {options
          .filter((x) => x.value)
          .map((option, i) => (
            <option key={option.value ?? `empty-${i}`} value={option.value}>
              {option.label}{" "}
              {option.value &&
                `+${RPNInput.getCountryCallingCode(option.value)}`}
            </option>
          ))}
      </select>
    </div>
  )
}

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country]

  return (
    <span className="w-5 overflow-hidden rounded-sm">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <PhoneIcon size={16} aria-hidden="true" />
      )}
    </span>
  )
}