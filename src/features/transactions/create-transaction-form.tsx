'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, CreditCard, Smartphone } from 'lucide-react';
import { useCreateTransaction } from './hooks';
import { Telco } from '@/sdk/types';

const createTransactionSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  processor: z.enum(['MTN', 'AIRTEL', 'VODAFONE', 'TIGO', 'ORANGE']),
  customerName: z.string().min(2, 'Customer name is required'),
  customerEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  description: z.string().optional(),
  type: z.enum(['momo', 'card']),
});

type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;

const processorOptions = [
  { value: 'MTN' as Telco, label: 'MTN Mobile Money', color: 'bg-yellow-500' },
  { value: 'AIRTEL' as Telco, label: 'Airtel Money', color: 'bg-red-500' },
  { value: 'VODAFONE' as Telco, label: 'Vodafone Cash', color: 'bg-red-600' },
  { value: 'TIGO' as Telco, label: 'Tigo Cash', color: 'bg-blue-500' },
  { value: 'ORANGE' as Telco, label: 'Orange Money', color: 'bg-orange-500' },
];

interface CreateTransactionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateTransactionForm({ onSuccess, onCancel }: CreateTransactionFormProps) {
  const { create, loading, error } = useCreateTransaction();
  const [transactionType, setTransactionType] = useState<'momo' | 'card'>('momo');

  const form = useForm<CreateTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount: 0,
      phoneNumber: '',
      processor: 'MTN',
      customerName: '',
      customerEmail: '',
      description: '',
      type: 'momo',
    },
  });

  const onSubmit = async (data: CreateTransactionFormData) => {
    try {
      const transactionData = {
        amount: data.amount,
        phoneNumber: data.phoneNumber,
        processor: data.processor,
        customerName: data.customerName,
        customerEmail: data.customerEmail || undefined,
        description: data.description || undefined,
      };

      if (data.type === 'card') {
        // Use card transaction endpoint
        // await createCardTransaction(transactionData);
      } else {
        await create(transactionData);
      }

      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error('Transaction creation failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create New Transaction</span>
        </CardTitle>
        <CardDescription>
          Process a new mobile money or card payment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Transaction Type */}
          <div className="space-y-3">
            <Label>Transaction Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={transactionType === 'momo' ? 'default' : 'outline'}
                className="h-16 flex-col space-y-2"
                onClick={() => {
                  setTransactionType('momo');
                  form.setValue('type', 'momo');
                }}
              >
                <Smartphone className="h-6 w-6" />
                <span>Mobile Money</span>
              </Button>
              <Button
                type="button"
                variant={transactionType === 'card' ? 'default' : 'outline'}
                className="h-16 flex-col space-y-2"
                onClick={() => {
                  setTransactionType('card');
                  form.setValue('type', 'card');
                }}
              >
                <CreditCard className="h-6 w-6" />
                <span>Card Payment</span>
              </Button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (GHS)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...form.register('amount', { valueAsNumber: true })}
              disabled={loading}
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
            )}
          </div>

          {/* Customer Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                placeholder="Enter customer name"
                {...form.register('customerName')}
                disabled={loading}
              />
              {form.formState.errors.customerName && (
                <p className="text-sm text-red-500">{form.formState.errors.customerName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="0241234567"
                {...form.register('phoneNumber')}
                disabled={loading}
              />
              {form.formState.errors.phoneNumber && (
                <p className="text-sm text-red-500">{form.formState.errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">Customer Email (Optional)</Label>
            <Input
              id="customerEmail"
              type="email"
              placeholder="customer@example.com"
              {...form.register('customerEmail')}
              disabled={loading}
            />
            {form.formState.errors.customerEmail && (
              <p className="text-sm text-red-500">{form.formState.errors.customerEmail.message}</p>
            )}
          </div>

          {/* Processor Selection (for mobile money) */}
          {transactionType === 'momo' && (
            <div className="space-y-2">
              <Label>Mobile Money Provider</Label>
              <Select
                onValueChange={(value) => form.setValue('processor', value as Telco)}
                defaultValue="MTN"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {processorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Payment description..."
              {...form.register('description')}
              disabled={loading}
              rows={3}
            />
          </div>

          {/* Transaction Summary */}
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Transaction Type:</span>
                  <Badge variant="outline">
                    {transactionType === 'momo' ? 'Mobile Money' : 'Card Payment'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">
                    GHS {form.watch('amount')?.toFixed(2) || '0.00'}
                  </span>
                </div>
                {transactionType === 'momo' && (
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span className="font-medium">{form.watch('processor')}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Processing...' : 'Create Transaction'}
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