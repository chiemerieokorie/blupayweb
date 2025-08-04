'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { ROUTES } from '@/lib/constants';

export function OTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'verify'; // 'verify' or 'reset'
  
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (value.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implement OTP verification API call
      console.log('OTP verification:', { code: value, mode });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect based on mode
      if (mode === 'reset') {
        router.push(ROUTES.AUTH.RESET_PASSWORD);
      } else {
        router.push(ROUTES.DASHBOARD);
      }
    } catch (error) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implement resend OTP API call
      console.log('Resending OTP...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setError(null);
    } catch (error) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="text-muted-foreground text-sm text-balance">
          We've sent a verification code to your email address. Enter the code below to continue.
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(value) => setValue(value)}
            disabled={loading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button type="submit" className="w-full" disabled={loading || value.length !== 6}>
          {loading ? 'Verifying...' : 'Verify code'}
        </Button>

        <div className="flex flex-col gap-3 text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={loading}
          >
            Didn't receive a code? Resend
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => router.push(ROUTES.AUTH.LOGIN)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Button>
        </div>
      </div>
    </form>
  );
}