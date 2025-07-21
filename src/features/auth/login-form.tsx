'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  partnerBank: z.string().optional().transform(val => {
    // Transform empty string or 'undefined' to actual undefined
    if (!val || val === '' || val === 'undefined') {
      return undefined;
    }
    return val;
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const partnerBanks = [
  { value: 'gcb', label: 'GCB Bank' },
  { value: 'boa', label: 'Bank of Africa' },
  { value: 'zenith', label: 'Zenith Bank' },
  { value: 'stanbic', label: 'Stanbic Bank' },
];

export function LoginForm() {
  const router = useRouter();
  const [showPartnerBank, setShowPartnerBank] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: '',
      password: '',
      partnerBank: undefined,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      const callbackUrl = '/';
      
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        partnerBank: data.partnerBank,
        redirect: false,
      });
      
      if (result?.error) {
        setError('Invalid credentials. Please try again.');
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome to Blupay</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...form.register('email')}
              disabled={loading}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...form.register('password')}
              disabled={loading}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="partnerBank">Partner Bank (Optional)</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPartnerBank(!showPartnerBank)}
              >
                {showPartnerBank ? 'Hide' : 'Show'}
              </Button>
            </div>
            
            {showPartnerBank && (
              <Select onValueChange={(value) => form.setValue('partnerBank', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select partner bank" />
                </SelectTrigger>
                <SelectContent>
                  {partnerBanks.map((bank) => (
                    <SelectItem key={bank.value} value={bank.value}>
                      {bank.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center">
          <Button variant="link" size="sm" onClick={() => router.push('/auth/forgot-password')}>
            Forgot your password?
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}