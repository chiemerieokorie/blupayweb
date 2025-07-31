'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconUser, IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { ROUTES } from '@/lib/constants';
import { 
  userDetailsSchema, 
  type UserDetailsFormData
} from '../schema';
import { 
  userDetailsAtom, 
  currentStepAtom, 
  markStepCompletedAtom,
  canNavigateToStepAtom,
  settlementDetailsAtom
} from '../store';

export function UserDetailsForm() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);
  const [settlementDetails] = useAtom(settlementDetailsAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);
  const [canNavigateToStep] = useAtom(canNavigateToStepAtom);

  const form = useForm<UserDetailsFormData>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      firstName: userDetails.firstName || '',
      lastName: userDetails.lastName || '',
      email: userDetails.email || '',
      phoneNumber: userDetails.phoneNumber || '',
    },
  });

  // Check if user can access this step
  useEffect(() => {
    if (!canNavigateToStep(3)) {
      router.push(ROUTES.MERCHANTS.ONBOARDING.SETTLEMENT_DETAILS);
      return;
    }

    // Ensure we have required previous step data
    if (!settlementDetails.settlementFrequency || !settlementDetails.partnerBank) {
      router.push(ROUTES.MERCHANTS.ONBOARDING.SETTLEMENT_DETAILS);
    }
  }, [canNavigateToStep, settlementDetails, router]);

  const onSubmit = (data: UserDetailsFormData) => {
    // Save form data to store
    setUserDetails(data);
    
    // Mark step as completed
    markStepCompleted(3);
    
    // Navigate to next step
    setCurrentStep(4);
    router.push(ROUTES.MERCHANTS.ONBOARDING.BANK_DETAILS);
  };

  const handleBack = () => {
    setCurrentStep(2);
    router.push(ROUTES.MERCHANTS.ONBOARDING.SETTLEMENT_DETAILS);
  };

  return (
    <div className="w-full border rounded-lg p-6">
      <div className="mb-8">
        <h6 className="flex items-center space-x-2 text-foreground mb-2 font-medium">
          <IconUser className={'size-4'} />
          <span>User Details</span>
        </h6>
        <p className="text-muted-foreground text-sm">
          Create the user account for this merchant
        </p>
      </div>
      <div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                {...form.register('firstName')}
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                {...form.register('lastName')}
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@merchant.com"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="0501234567 (10-12 digits)"
                {...form.register('phoneNumber')}
              />
              {form.formState.errors.phoneNumber && (
                <p className="text-sm text-red-500">{form.formState.errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> A default password will be generated automatically using the pattern: <code>{form.watch('firstName') || '[firstName]'}_001</code>
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack}
              className="gap-2"
            >
              <IconArrowLeft className="w-4 h-4" />
              Back to Settlement Details
            </Button>
            <Button type="submit" className="gap-2">
              Continue to Bank Details
              <IconArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}