'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSetAtom } from 'jotai';
import { currentUserAtom, authTokenAtom, partnerBankAtom } from '@/features/auth/atoms';
import { apiClient } from '@/sdk/client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const setCurrentUser = useSetAtom(currentUserAtom);
  const setAuthToken = useSetAtom(authTokenAtom);
  const setPartnerBank = useSetAtom(partnerBankAtom);

  useEffect(() => {
    if (status === 'loading') return;

    if (session) {
      // Set auth state from session
      setCurrentUser(session.user);
      setAuthToken(session.accessToken);
      setPartnerBank(session.partnerBank || null);
      
      // Configure API client
      apiClient.setAuth(session.accessToken, session.partnerBank);
    } else {
      // Clear auth state
      setCurrentUser(null);
      setAuthToken(null);
      setPartnerBank(null);
      apiClient.clearAuth();
    }
  }, [session, status, setCurrentUser, setAuthToken, setPartnerBank]);

  return <>{children}</>;
}