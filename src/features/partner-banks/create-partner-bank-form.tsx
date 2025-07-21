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
import { Textarea } from "@/components/ui/textarea";
import { usePartnerBanks } from "./hooks";
import { useToast } from "@/hooks/use-toast";

const createPartnerBankSchema = z.object({
  name: z.string().min(2, "Bank name must be at least 2 characters"),
  code: z.string().min(2, "Bank code must be at least 2 characters"),
  country: z.string().min(2, "Country is required"),
  contactEmail: z.string().email("Invalid email address").optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  swiftCode: z.string().optional(),
  routingNumber: z.string().optional(),
});

type CreatePartnerBankFormData = z.infer<typeof createPartnerBankSchema>;

interface CreatePartnerBankFormProps {
  onSuccess?: () => void;
}

export function CreatePartnerBankForm({ onSuccess }: CreatePartnerBankFormProps) {
  const { createPartnerBank, loading } = usePartnerBanks();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreatePartnerBankFormData>({
    resolver: zodResolver(createPartnerBankSchema),
    defaultValues: {
      name: "",
      code: "",
      country: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      description: "",
      swiftCode: "",
      routingNumber: "",
    },
  });

  const onSubmit = async (data: CreatePartnerBankFormData) => {
    try {
      setIsSubmitting(true);
      
      const partnerBankData = { ...data };
      
      if (!partnerBankData.contactEmail) {
        delete partnerBankData.contactEmail;
      }
      
      if (!partnerBankData.contactPhone) {
        delete partnerBankData.contactPhone;
      }
      
      if (!partnerBankData.address) {
        delete partnerBankData.address;
      }
      
      if (!partnerBankData.description) {
        delete partnerBankData.description;
      }
      
      if (!partnerBankData.swiftCode) {
        delete partnerBankData.swiftCode;
      }
      
      if (!partnerBankData.routingNumber) {
        delete partnerBankData.routingNumber;
      }

      await createPartnerBank(partnerBankData);
      
      toast({
        title: "Success",
        description: "Partner bank created successfully",
      });
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create partner bank",
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter bank name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter bank code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Enter country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email (Optional)</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter contact email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="swiftCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SWIFT Code (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter SWIFT code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="routingNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Routing Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter routing number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter bank address"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter bank description"
                  className="resize-none"
                  {...field}
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
            {isSubmitting ? "Creating..." : "Create Partner Bank"}
          </Button>
        </div>
      </form>
    </Form>
  );
}