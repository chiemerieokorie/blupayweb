'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Plus, Building2 } from 'lucide-react';
import { useCreateMerchant } from './hooks';

const createMerchantSchema = z.object({
  merchantName: z.string().min(2, 'Merchant name must be at least 2 characters'),
  merchantCategoryCode: z.string().min(1, 'Category code is required'),
  notificationEmail: z.string().email('Please enter a valid email address'),
  country: z.string().min(1, 'Country is required'),
  canProcessCardTransactions: z.boolean().optional().default(true),
  canProcessMomoTransactions: z.boolean().optional().default(true),
  
  // Settlement Details
  settlementBankName: z.string().min(1, 'Settlement bank name is required'),
  settlementAccountNumber: z.string().min(1, 'Settlement account number is required'),
  settlementAccountName: z.string().min(1, 'Settlement account name is required'),
  settlementSortCode: z.string().optional(),
  
  // Bank Details
  bankName: z.string().min(1, 'Bank name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  accountName: z.string().min(1, 'Account name is required'),
  sortCode: z.string().optional(),
});

type CreateMerchantFormData = z.infer<typeof createMerchantSchema>;

const countries = [
  { value: 'GH', label: 'Ghana' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'KE', label: 'Kenya' },
  { value: 'UG', label: 'Uganda' },
];

const merchantCategories = [
  { value: 'RETAIL', label: 'Retail' },
  { value: 'ECOMMERCE', label: 'E-commerce' },
  { value: 'FINTECH', label: 'Fintech' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'HEALTHCARE', label: 'Healthcare' },
  { value: 'TRANSPORT', label: 'Transport' },
  { value: 'UTILITIES', label: 'Utilities' },
  { value: 'OTHER', label: 'Other' },
];

interface CreateMerchantFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateMerchantForm({ onSuccess, onCancel }: CreateMerchantFormProps) {
  const { create, loading, error } = useCreateMerchant();

  const form = useForm<CreateMerchantFormData>({
    resolver: zodResolver(createMerchantSchema),
    defaultValues: {
      merchantName: '',
      merchantCategoryCode: '',
      notificationEmail: '',
      country: '',
      canProcessCardTransactions: true,
      canProcessMomoTransactions: true,
      settlementBankName: '',
      settlementAccountNumber: '',
      settlementAccountName: '',
      settlementSortCode: '',
      bankName: '',
      accountNumber: '',
      accountName: '',
      sortCode: '',
    },
  });

  const onSubmit = async (data: CreateMerchantFormData) => {
    try {
      const merchantData = {
        merchantName: data.merchantName,
        merchantCategoryCode: data.merchantCategoryCode,
        notificationEmail: data.notificationEmail,
        country: data.country,
        canProcessCardTransactions: data.canProcessCardTransactions,
        canProcessMomoTransactions: data.canProcessMomoTransactions,
        settlementDetails: {
          bankName: data.settlementBankName,
          accountNumber: data.settlementAccountNumber,
          accountName: data.settlementAccountName,
          sortCode: data.settlementSortCode || undefined,
        },
        bankDetails: {
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          accountName: data.accountName,
          sortCode: data.sortCode || undefined,
        },
      };

      await create(merchantData);
      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error('Merchant creation failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>Create New Merchant</span>
        </CardTitle>
        <CardDescription>
          Add a new merchant to the platform with their banking details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="merchantName">Merchant Name</Label>
                <Input
                  id="merchantName"
                  placeholder="Enter merchant name"
                  {...form.register('merchantName')}
                  disabled={loading}
                />
                {form.formState.errors.merchantName && (
                  <p className="text-sm text-red-500">{form.formState.errors.merchantName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  placeholder="notifications@merchant.com"
                  {...form.register('notificationEmail')}
                  disabled={loading}
                />
                {form.formState.errors.notificationEmail && (
                  <p className="text-sm text-red-500">{form.formState.errors.notificationEmail.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Country</Label>
                <Select
                  onValueChange={(value) => form.setValue('country', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.country && (
                  <p className="text-sm text-red-500">{form.formState.errors.country.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Merchant Category</Label>
                <Select
                  onValueChange={(value) => form.setValue('merchantCategoryCode', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {merchantCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.merchantCategoryCode && (
                  <p className="text-sm text-red-500">{form.formState.errors.merchantCategoryCode.message}</p>
                )}
              </div>
            </div>

            {/* Processing Options */}
            <div className="space-y-3">
              <Label>Processing Options</Label>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="canProcessMomoTransactions"
                    checked={form.watch('canProcessMomoTransactions')}
                    onCheckedChange={(checked) => 
                      form.setValue('canProcessMomoTransactions', checked as boolean)
                    }
                    disabled={loading}
                  />
                  <Label htmlFor="canProcessMomoTransactions">Mobile Money</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="canProcessCardTransactions"
                    checked={form.watch('canProcessCardTransactions')}
                    onCheckedChange={(checked) => 
                      form.setValue('canProcessCardTransactions', checked as boolean)
                    }
                    disabled={loading}
                  />
                  <Label htmlFor="canProcessCardTransactions">Card Payments</Label>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Settlement Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Settlement Details</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="settlementBankName">Bank Name</Label>
                <Input
                  id="settlementBankName"
                  placeholder="Bank name for settlements"
                  {...form.register('settlementBankName')}
                  disabled={loading}
                />
                {form.formState.errors.settlementBankName && (
                  <p className="text-sm text-red-500">{form.formState.errors.settlementBankName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="settlementAccountName">Account Name</Label>
                <Input
                  id="settlementAccountName"
                  placeholder="Account holder name"
                  {...form.register('settlementAccountName')}
                  disabled={loading}
                />
                {form.formState.errors.settlementAccountName && (
                  <p className="text-sm text-red-500">{form.formState.errors.settlementAccountName.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="settlementAccountNumber">Account Number</Label>
                <Input
                  id="settlementAccountNumber"
                  placeholder="Settlement account number"
                  {...form.register('settlementAccountNumber')}
                  disabled={loading}
                />
                {form.formState.errors.settlementAccountNumber && (
                  <p className="text-sm text-red-500">{form.formState.errors.settlementAccountNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="settlementSortCode">Sort Code (Optional)</Label>
                <Input
                  id="settlementSortCode"
                  placeholder="Bank sort code"
                  {...form.register('settlementSortCode')}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Bank Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Bank Details</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  placeholder="Primary bank name"
                  {...form.register('bankName')}
                  disabled={loading}
                />
                {form.formState.errors.bankName && (
                  <p className="text-sm text-red-500">{form.formState.errors.bankName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  placeholder="Primary account holder name"
                  {...form.register('accountName')}
                  disabled={loading}
                />
                {form.formState.errors.accountName && (
                  <p className="text-sm text-red-500">{form.formState.errors.accountName.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="Primary account number"
                  {...form.register('accountNumber')}
                  disabled={loading}
                />
                {form.formState.errors.accountNumber && (
                  <p className="text-sm text-red-500">{form.formState.errors.accountNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortCode">Sort Code (Optional)</Label>
                <Input
                  id="sortCode"
                  placeholder="Bank sort code"
                  {...form.register('sortCode')}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Creating...' : 'Create Merchant'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}