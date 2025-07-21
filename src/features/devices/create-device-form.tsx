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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDevices } from "./hooks";
import { useToast } from "@/hooks/use-toast";

const createDeviceSchema = z.object({
  serialNumber: z.string().min(1, "Serial number is required"),
  deviceType: z.enum(["POS", "ATM", "MOBILE"]),
  model: z.string().min(1, "Model is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  location: z.string().optional(),
  partnerBankId: z.string().optional(),
  merchantId: z.string().optional(),
  description: z.string().optional(),
});

type CreateDeviceFormData = z.infer<typeof createDeviceSchema>;

interface CreateDeviceFormProps {
  onSuccess?: () => void;
}

export function CreateDeviceForm({ onSuccess }: CreateDeviceFormProps) {
  const { createDevice, loading } = useDevices();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateDeviceFormData>({
    resolver: zodResolver(createDeviceSchema),
    defaultValues: {
      serialNumber: "",
      deviceType: "POS",
      model: "",
      manufacturer: "",
      location: "",
      partnerBankId: "",
      merchantId: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateDeviceFormData) => {
    try {
      setIsSubmitting(true);
      
      const deviceData = { ...data };
      
      if (!deviceData.location) {
        delete deviceData.location;
      }
      
      if (!deviceData.partnerBankId) {
        delete deviceData.partnerBankId;
      }
      
      if (!deviceData.merchantId) {
        delete deviceData.merchantId;
      }
      
      if (!deviceData.description) {
        delete deviceData.description;
      }

      await createDevice(deviceData);
      
      toast({
        title: "Success",
        description: "Device created successfully",
      });
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create device",
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
            name="serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter serial number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Device Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="POS">POS Terminal</SelectItem>
                    <SelectItem value="ATM">ATM</SelectItem>
                    <SelectItem value="MOBILE">Mobile Device</SelectItem>
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
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="Enter device model" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer</FormLabel>
                <FormControl>
                  <Input placeholder="Enter manufacturer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="partnerBankId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partner Bank ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter partner bank ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="merchantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Merchant ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter merchant ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter device location" {...field} />
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
                  placeholder="Enter device description"
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
            {isSubmitting ? "Creating..." : "Create Device"}
          </Button>
        </div>
      </form>
    </Form>
  );
}