'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconDeviceMobile, IconArrowLeft, IconCheck } from '@tabler/icons-react';
import { ROUTES } from '@/lib/constants';
import { 
  ovaDetailsSchema, 
  type OvaDetailsFormData,
  createMerchantSchema,
  type CreateMerchantFormData
} from '../schema';
import { 
  ovaDetailsAtom, 
  currentStepAtom, 
  markStepCompletedAtom,
  canNavigateToStepAtom,
  bankDetailsAtom,
  merchantOnboardingAtom,
  resetFormAtom
} from '../store';
import { useCreateMerchant } from '../../hooks';
import { ExtendedCreateMerchantDto } from '@/sdk/types';

// Mock OVA data - in real app, this would come from an API
const mtnOvas = [
  { uuid: '11111111-1111-1111-1111-111111111111', name: 'MTN OVA 1', telco: 'mtn' },
  { uuid: '22222222-2222-2222-2222-222222222222', name: 'MTN OVA 2', telco: 'mtn' },
];

const airtelOvas = [
  { uuid: '33333333-3333-3333-3333-333333333333', name: 'AIRTEL OVA 1', telco: 'airtel' },
  { uuid: '44444444-4444-4444-4444-444444444444', name: 'AIRTEL OVA 2', telco: 'airtel' },
];

const telecelOvas = [
  { uuid: '55555555-5555-5555-5555-555555555555', name: 'TELECEL OVA 1', telco: 'telecel' },
  { uuid: '66666666-6666-6666-6666-666666666666', name: 'TELECEL OVA 2', telco: 'telecel' },
];

export function OvaDetailsForm() {
  const router = useRouter();
  const [ovaDetails, setOvaDetails] = useAtom(ovaDetailsAtom);
  const [bankDetails] = useAtom(bankDetailsAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);
  const [canNavigateToStep] = useAtom(canNavigateToStepAtom);
  const [onboardingState] = useAtom(merchantOnboardingAtom);
  const [, resetForm] = useAtom(resetFormAtom);
  const { create, loading, error } = useCreateMerchant();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OvaDetailsFormData>({
    resolver: zodResolver(ovaDetailsSchema),
    defaultValues: {
      mtnOva: ovaDetails.mtnOva || { ovaUuid: '', telco: 'mtn' },
      airtelOva: ovaDetails.airtelOva || { ovaUuid: '', telco: 'airtel' },
      telecelOva: ovaDetails.telecelOva || { ovaUuid: '', telco: 'telecel' },
    },
  });

  // Check if user can access this step
  useEffect(() => {
    if (!canNavigateToStep(5)) {
      router.push(ROUTES.MERCHANTS.ONBOARDING.BANK_DETAILS);
      return;
    }

    // Ensure we have required previous step data
    if (!bankDetails.merchantBank || !bankDetails.accountNumber) {
      router.push(ROUTES.MERCHANTS.ONBOARDING.BANK_DETAILS);
    }
  }, [canNavigateToStep, bankDetails, router]);

  const onSubmit = async (data: OvaDetailsFormData) => {
    try {
      setIsSubmitting(true);
      
      // Save OVA details to store
      setOvaDetails(data);
      
      // Mark step as completed
      markStepCompleted(5);

      // Combine all form data for submission
      const completeFormData: CreateMerchantFormData = {
        // Merchant Details
        merchantCode: onboardingState.merchantDetails.merchantCode!,
        merchantName: onboardingState.merchantDetails.merchantName!,
        merchantAddress: onboardingState.merchantDetails.merchantAddress!,
        notificationEmail: onboardingState.merchantDetails.notificationEmail!,
        country: onboardingState.merchantDetails.country!,
        tinNumber: onboardingState.merchantDetails.tinNumber!,
        orgType: onboardingState.merchantDetails.orgType!,
        merchantCategory: onboardingState.merchantDetails.merchantCategory!,
        terminal: onboardingState.merchantDetails.terminal!,
        
        // Settlement Details
        settlementFrequency: onboardingState.settlementDetails.settlementFrequency!,
        surcharge: onboardingState.settlementDetails.surcharge!,
        partnerBank: onboardingState.settlementDetails.partnerBank!,
        settlementAccount: onboardingState.settlementDetails.settlementAccount!,
        totalSurcharge: onboardingState.settlementDetails.totalSurcharge!,
        merchantPercentageSurcharge: onboardingState.settlementDetails.merchantPercentageSurcharge!,
        customerPercentageSurcharge: onboardingState.settlementDetails.customerPercentageSurcharge!,
        surchargeCap: onboardingState.settlementDetails.surchargeCap,
        surchargeHasCap: onboardingState.settlementDetails.surchargeHasCap!,
        
        // User Details  
        firstName: onboardingState.userDetails.firstName!,
        lastName: onboardingState.userDetails.lastName!,
        email: onboardingState.userDetails.email!,
        phoneNumber: onboardingState.userDetails.phoneNumber!,
        
        // Bank Details
        merchantBank: onboardingState.bankDetails.merchantBank!,
        branch: onboardingState.bankDetails.branch!,
        accountType: onboardingState.bankDetails.accountType!,
        accountNumber: onboardingState.bankDetails.accountNumber!,
        accountName: onboardingState.bankDetails.accountName!,
        
        // OVA Details
        mtnOva: data.mtnOva,
        airtelOva: data.airtelOva,
        telecelOva: data.telecelOva,
      };

      // Validate complete form data
      const validatedData = createMerchantSchema.parse(completeFormData);

      // For now, just show success and navigate - actual API call would be implemented later
      console.log('Merchant data ready for creation:', validatedData);
      
      // Reset form data on success
      resetForm();
      
      // Navigate to merchants list
      router.push(ROUTES.MERCHANTS.INDEX);
    } catch (error) {
      console.error('Merchant creation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(4);
    router.push(ROUTES.MERCHANTS.ONBOARDING.BANK_DETAILS);
  };

  return (
    <div className="w-full border rounded-lg p-6">
      <div className="mb-8">
        <h6 className="flex items-center space-x-2 text-foreground mb-2 font-medium">
          <IconDeviceMobile className={'size-4'} />
          <span>OVA Details</span>
        </h6>
        <p className="text-muted-foreground text-sm">
          Select OVAs (Over-the-Air) settings for each mobile network operator
        </p>
      </div>
      <div>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>MTN OVA</Label>
              <Select
                onValueChange={(value) => {
                  const selectedOva = mtnOvas.find(ova => ova.uuid === value);
                  if (selectedOva) {
                    form.setValue('mtnOva', { ovaUuid: selectedOva.uuid, telco: selectedOva.telco });
                  }
                }}
                defaultValue={form.watch('mtnOva')?.ovaUuid}
                disabled={loading || isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select MTN OVA" />
                </SelectTrigger>
                <SelectContent>
                  {mtnOvas.map((ova) => (
                    <SelectItem key={ova.uuid} value={ova.uuid}>
                      {ova.name.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.mtnOva && (
                <p className="text-sm text-red-500">{form.formState.errors.mtnOva.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Airtel OVA</Label>
              <Select
                onValueChange={(value) => {
                  const selectedOva = airtelOvas.find(ova => ova.uuid === value);
                  if (selectedOva) {
                    form.setValue('airtelOva', { ovaUuid: selectedOva.uuid, telco: selectedOva.telco });
                  }
                }}
                defaultValue={form.watch('airtelOva')?.ovaUuid}
                disabled={loading || isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Airtel OVA" />
                </SelectTrigger>
                <SelectContent>
                  {airtelOvas.map((ova) => (
                    <SelectItem key={ova.uuid} value={ova.uuid}>
                      {ova.name.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.airtelOva && (
                <p className="text-sm text-red-500">{form.formState.errors.airtelOva.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Telecel OVA</Label>
              <Select
                onValueChange={(value) => {
                  const selectedOva = telecelOvas.find(ova => ova.uuid === value);
                  if (selectedOva) {
                    form.setValue('telecelOva', { ovaUuid: selectedOva.uuid, telco: selectedOva.telco });
                  }
                }}
                defaultValue={form.watch('telecelOva')?.ovaUuid}
                disabled={loading || isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Telecel OVA" />
                </SelectTrigger>
                <SelectContent>
                  {telecelOvas.map((ova) => (
                    <SelectItem key={ova.uuid} value={ova.uuid}>
                      {ova.name.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.telecelOva && (
                <p className="text-sm text-red-500">{form.formState.errors.telecelOva.message}</p>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack}
              disabled={loading || isSubmitting}
              className="gap-2"
            >
              <IconArrowLeft className="w-4 h-4" />
              Back to Bank Details
            </Button>
            <Button 
              type="submit" 
              disabled={loading || isSubmitting}
              className="gap-2"
            >
              {loading || isSubmitting ? 'Creating Merchant...' : 'Create Merchant'}
              <IconCheck className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}