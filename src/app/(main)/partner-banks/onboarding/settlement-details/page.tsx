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
import { settlementDetailsAtom, markStepCompletedAtom } from '@/features/partner-banks/onboarding/store';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { PartnerBankOnboardingStepper } from '@/components/ui/partner-bank-onboarding-stepper';
import { IconArrowLeft, IconCreditCard } from '@tabler/icons-react';

const settlementDetailsSchema = z.object({
  settlementBankName: z.string().min(2, "Bank name must be at least 2 characters"),
  settlementAccountName: z.string().min(2, "Account name must be at least 2 characters"),
  settlementAccountNumber: z.string().min(5, "Account number must be at least 5 characters"),
});

type SettlementDetailsFormData = z.infer<typeof settlementDetailsSchema>;

export default function SettlementDetailsPage() {
  const [settlementDetails, setSettlementDetails] = useAtom(settlementDetailsAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);
  const router = useRouter();

  const form = useForm<SettlementDetailsFormData>({
    resolver: zodResolver(settlementDetailsSchema),
    defaultValues: {
      settlementBankName: settlementDetails.settlementBankName || "",
      settlementAccountName: settlementDetails.settlementAccountName || "",
      settlementAccountNumber: settlementDetails.settlementAccountNumber || "",
    },
  });

  const onSubmit = async (data: SettlementDetailsFormData) => {
    setSettlementDetails(data);
    markStepCompleted(3);
    router.push(ROUTES.PARTNER_BANKS.ONBOARDING.CONFIGURATION);
  };

  const goBack = () => {
    router.push(ROUTES.PARTNER_BANKS.ONBOARDING.COMMISSION_DETAILS);
  };

  return (
    <div className="space-y-6">
      <div className="w-full border rounded-lg p-6">
        <div className="mb-8">
          <h6 className="flex items-center space-x-2 text-foreground mb-2 font-medium">
            <IconCreditCard className="size-4" />
            <span>Settlement Details</span>
          </h6>
          <p className="text-muted-foreground text-sm">
            Enter the settlement bank information for transaction settlements
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="settlementBankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Settlement Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter settlement bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="settlementAccountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter account name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="settlementAccountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter account number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={goBack}>
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit">
                Continue to Configuration
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}