'use client';

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
import { useAtom } from 'jotai';
import { 
  configurationAtom, 
  markStepCompletedAtom,
  partnerBankOnboardingAtom,
  resetFormAtom
} from '@/features/partner-banks/onboarding/store';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { PartnerBankOnboardingStepper } from '@/components/ui/partner-bank-onboarding-stepper';
import { IconArrowLeft, IconPlus, IconX, IconSettings } from '@tabler/icons-react';
import { useState } from 'react';
import { usePartnerBanks } from '@/features/partner-banks/hooks';
import { useToast } from '@/hooks/use-toast';

const configurationSchema = z.object({
  headers: z.array(z.string()).min(1, "At least one header is required"),
});

type ConfigurationFormData = z.infer<typeof configurationSchema>;

export default function ConfigurationPage() {
  const [configuration, setConfiguration] = useAtom(configurationAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);
  const [formData] = useAtom(partnerBankOnboardingAtom);
  const [, resetForm] = useAtom(resetFormAtom);
  
  const { createPartnerBank, loading } = usePartnerBanks();
  const { toast } = useToast();
  const router = useRouter();

  const [headers, setHeaders] = useState<string[]>(configuration.headers || ['Authorization', 'Content-Type']);
  const [newHeader, setNewHeader] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ConfigurationFormData>({
    resolver: zodResolver(configurationSchema),
    defaultValues: {
      headers: headers,
    },
  });

  const addHeader = () => {
    if (newHeader.trim() && !headers.includes(newHeader.trim())) {
      const updatedHeaders = [...headers, newHeader.trim()];
      setHeaders(updatedHeaders);
      form.setValue('headers', updatedHeaders);
      setNewHeader('');
    }
  };

  const removeHeader = (index: number) => {
    const updatedHeaders = headers.filter((_, i) => i !== index);
    setHeaders(updatedHeaders);
    form.setValue('headers', updatedHeaders);
  };

  const onSubmit = async (data: ConfigurationFormData) => {
    try {
      setIsSubmitting(true);
      setConfiguration(data);
      markStepCompleted(4);

      // Prepare form data for submission
      const submitFormData = new FormData();
      
      // Basic details
      if (formData.basicDetails.name) submitFormData.append('name', formData.basicDetails.name);
      if (formData.basicDetails.email) submitFormData.append('email', formData.basicDetails.email);
      if (formData.basicDetails.logo) submitFormData.append('logo', formData.basicDetails.logo);
      
      // Commission details - create commission bank object
      const commissionBank = {
        accountName: formData.commissionDetails.commissionAccountName || '',
        accountNumber: formData.commissionDetails.commissionAccountNumber || '',
        bankName: formData.commissionDetails.commissionBankName || '',
      };
      submitFormData.append('commissionBank', JSON.stringify(commissionBank));
      
      // Settlement details - create settlement bank object
      const settlementBank = {
        accountName: formData.settlementDetails.settlementAccountName || '',
        accountNumber: formData.settlementDetails.settlementAccountNumber || '',
        bankName: formData.settlementDetails.settlementBankName || '',
      };
      submitFormData.append('settlementBank', JSON.stringify(settlementBank));
      
      // Commission ratio
      if (formData.commissionDetails.commissionRatio !== undefined) {
        submitFormData.append('commissionRatio', formData.commissionDetails.commissionRatio.toString());
      }
      
      // Headers
      data.headers.forEach((header, index) => {
        submitFormData.append(`headers[${index}]`, header);
      });

      await createPartnerBank(submitFormData);
      
      toast({
        title: "Success",
        description: "Partner bank created successfully",
      });
      
      resetForm();
      router.push(ROUTES.PARTNER_BANKS.INDEX);
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

  const goBack = () => {
    router.push(ROUTES.PARTNER_BANKS.ONBOARDING.SETTLEMENT_DETAILS);
  };

  return (
    <div className="space-y-6">

      <div className="w-full border rounded-lg p-6">
        <div className="mb-8">
          <h6 className="flex items-center space-x-2 text-foreground mb-2 font-medium">
            <IconSettings className="size-4" />
            <span>Configuration</span>
          </h6>
          <p className="text-muted-foreground text-sm">
            Configure API headers and review your partner bank details
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Headers Management */}
            <div className="space-y-4">
              <FormLabel>API Headers</FormLabel>
              <div className="space-y-2">
                {headers.map((header, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={header} disabled className="flex-1" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeHeader(index)}
                      disabled={headers.length <= 1}
                    >
                      <IconX className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add new header"
                    value={newHeader}
                    onChange={(e) => setNewHeader(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHeader())}
                  />
                  <Button type="button" variant="outline" onClick={addHeader}>
                    <IconPlus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium mb-3">Review Summary</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Partner Bank:</span> {formData.basicDetails.name || 'Not specified'}</div>
                <div><span className="font-medium">Email:</span> {formData.basicDetails.email || 'Not specified'}</div>
                <div><span className="font-medium">Commission Bank:</span> {formData.commissionDetails.commissionBankName || 'Not specified'}</div>
                <div><span className="font-medium">Settlement Bank:</span> {formData.settlementDetails.settlementBankName || 'Not specified'}</div>
                <div><span className="font-medium">Commission Ratio:</span> {formData.commissionDetails.commissionRatio || 0}</div>
                <div><span className="font-medium">API Headers:</span> {headers.length} configured</div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={goBack}>
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting || loading}>
                {isSubmitting ? "Creating Partner Bank..." : "Create Partner Bank"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}