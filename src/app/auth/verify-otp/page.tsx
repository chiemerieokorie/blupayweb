import {Metadata} from 'next';
import {Suspense} from 'react';
import {OTPForm} from '@/features/auth/otp-form';

export const metadata: Metadata = {
    title: 'Verify Email - Blupay Africa',
    description: 'Verify your Blupay Africa account',
};

export default function VerifyOTPPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OTPForm/>
        </Suspense>
    );
}