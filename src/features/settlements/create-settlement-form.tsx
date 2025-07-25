"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSettlements } from "./hooks";
import { useToast } from "@/hooks/use-toast";

const createSettlementSchema = z.object({
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
  surchargeOn: z.enum(["CUSTOMER", "MERCHANT", "CUSTOMER_AND_MERCHANT", "PARENT"]),
  surchargeOnMerchant: z.number().min(0).max(100),
  surchargeOnCustomer: z.number().min(0).max(100), 
  parentBank: z.string().min(1, "Parent bank is required"),
  settlementAcct: z.enum(["PARENT_BANK", "MERCHANT_BANK"]),
  vatApplicable: z.boolean(),
  vatPercentage: z.number().min(0).max(100),
  taxNumber: z.string().optional(),
  surchargeSum: z.boolean(),
  merchantId: z.string().optional(),
});

type CreateSettlementFormData = z.infer<typeof createSettlementSchema>;

interface CreateSettlementFormProps {
  onSuccess?: () => void;
}

export function CreateSettlementForm({ onSuccess }: CreateSettlementFormProps) {
  const { createSettlement, loading } = useSettlements();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateSettlementFormData>({
    resolver: zodResolver(createSettlementSchema),
    defaultValues: {
      frequency: "MONTHLY",
      surchargeOn: "CUSTOMER",
      surchargeOnMerchant: 0,
      surchargeOnCustomer: 0,
      parentBank: "",
      settlementAcct: "PARENT_BANK",
      vatApplicable: false,
      vatPercentage: 0,
      taxNumber: "",
      surchargeSum: false,
      merchantId: "",
    },
  });

  const onSubmit = async (data: CreateSettlementFormData) => {
    try {
      setIsSubmitting(true);
      
      const settlementData = { ...data };
      if (!settlementData.taxNumber) delete settlementData.taxNumber;
      if (!settlementData.merchantId) delete settlementData.merchantId;

      await createSettlement(settlementData);
      
      toast({
        title: "Success",
        description: "Settlement configuration created successfully",
      });
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create settlement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Settlement Frequency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="surchargeOn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surcharge On</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select surcharge target" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                    <SelectItem value="MERCHANT">Merchant</SelectItem>
                    <SelectItem value="CUSTOMER_AND_MERCHANT">Customer & Merchant</SelectItem>
                    <SelectItem value="PARENT">Parent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="surchargeOnMerchant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Merchant Surcharge (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="0.00" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="surchargeOnCustomer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Surcharge (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="0.00" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="parentBank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Bank ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter parent bank UUID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="settlementAcct"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Settlement Account</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PARENT_BANK">Parent Bank</SelectItem>
                    <SelectItem value="MERCHANT_BANK">Merchant Bank</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="vatApplicable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">VAT Applicable</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Apply VAT to settlements
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="surchargeSum"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Surcharge Sum</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Sum surcharges together
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="vatPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VAT Percentage (%)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0.00" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting || loading}>
            {isSubmitting ? "Creating..." : "Create Settlement"}
          </Button>
        </div>
      </form>
    </Form>
  );
}