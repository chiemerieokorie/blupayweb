'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSetAtom, useAtomValue } from 'jotai';
import { currentUserAtom, authTokenAtom, partnerBankAtom } from '@/features/auth/atoms';
import { apiClient } from '@/sdk/client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const setCurrentUser = useSetAtom(currentUserAtom);
  const setAuthToken = useSetAtom(authTokenAtom);
  const setPartnerBank = useSetAtom(partnerBankAtom);
  
  // Read current values from atoms (persisted in localStorage)
  const currentToken = useAtomValue(authTokenAtom);
  const currentPartnerBank = useAtomValue(partnerBankAtom);
  const currentUser = useAtomValue(currentUserAtom);

  useEffect(() => {
    if (status === 'loading') {
      // During loading, check if we have persisted auth data and restore API client
      if (currentToken && currentUser) {
        apiClient.setAuth(currentToken, currentPartnerBank || undefined);
      }
      return;
    }

    if (session) {
      // Set auth state from session (NextAuth takes precedence)
      setCurrentUser(session.user);
      setAuthToken(session.accessToken);
      setPartnerBank(session.partnerBank || null);
      
      // Configure API client
      apiClient.setAuth(session.accessToken, session.partnerBank);
    } else {
      // Only clear if we don't have persisted auth data
      // (prevents clearing during hot reload when session temporarily becomes null)
      if (!currentToken || !currentUser) {
        setCurrentUser(null);
        setAuthToken(null);
        setPartnerBank(null);
        apiClient.clearAuth();
      }
    }
  }, [session, status, setCurrentUser, setAuthToken, setPartnerBank, currentToken, currentPartnerBank, currentUser]);

  return <>{children}</>;
}