import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import {
  currentUserAtom,
  isAuthenticatedAtom,
  authLoadingAtom,
  authErrorAtom,
  loginAtom,
  logoutAtom,
  initializeAuthAtom,
  requestPasswordResetAtom,
  completePasswordResetAtom,
  partnerBankAtom,
} from './atoms';
import { User, UserRole } from '@/sdk/types';

export function useAuth() {
  const [user, setUser] = useAtom(currentUserAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const loading = useAtomValue(authLoadingAtom);
  const error = useAtomValue(authErrorAtom);
  const partnerBank = useAtomValue(partnerBankAtom);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    partnerBank,
  };
}

export function useLogin() {
  const [, login] = useAtom(loginAtom);
  const loading = useAtomValue(authLoadingAtom);
  const error = useAtomValue(authErrorAtom);

  const handleLogin = useCallback(
    async (credentials: { email: string; password: string; partnerBank?: string }) => {
      return await login(credentials);
    },
    [login]
  );

  return {
    login: handleLogin,
    loading,
    error,
  };
}

export function useLogout() {
  const [, logout] = useAtom(logoutAtom);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return {
    logout: handleLogout,
  };
}

export function useInitializeAuth() {
  const [, initialize] = useAtom(initializeAuthAtom);

  const initializeAuth = useCallback(async () => {
    await initialize();
  }, [initialize]);

  return {
    initializeAuth,
  };
}

export function usePasswordReset() {
  const [, requestReset] = useAtom(requestPasswordResetAtom);
  const [, completeReset] = useAtom(completePasswordResetAtom);
  const loading = useAtomValue(authLoadingAtom);
  const error = useAtomValue(authErrorAtom);

  const requestPasswordReset = useCallback(
    async (email: string) => {
      await requestReset(email);
    },
    [requestReset]
  );

  const completePasswordReset = useCallback(
    async (token: string, newPassword: string) => {
      await completeReset({ token, newPassword });
    },
    [completeReset]
  );

  return {
    requestPasswordReset,
    completePasswordReset,
    loading,
    error,
  };
}

export function usePermissions() {
  const user = useAtomValue(currentUserAtom);

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]) => {
      if (!user) return false;
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(user.role);
    },
    [user]
  );

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) return false;
      
      const permissions = {
        ADMIN: [
          'view_all_merchants',
          'create_merchant',
          'edit_merchant',
          'delete_merchant',
          'view_all_transactions',
          'view_all_users',
          'create_user',
          'edit_user',
          'delete_user',
          'view_partner_banks',
          'create_partner_bank',
          'edit_partner_bank',
          'delete_partner_bank',
          'view_devices',
          'create_device',
          'edit_device',
          'delete_device',
          'view_analytics',
        ],
        MERCHANT: [
          'view_own_merchant',
          'edit_own_merchant',
          'view_own_transactions',
          'create_transaction',
          'view_own_users',
          'create_sub_merchant',
          'edit_sub_merchant',
          'view_own_analytics',
          'manage_api_keys',
          'manage_webhooks',
        ],
        PARTNER_BANK: [
          'view_assigned_merchants',
          'create_merchant',
          'edit_assigned_merchant',
          'view_assigned_transactions',
          'view_assigned_users',
          'view_assigned_devices',
          'assign_device',
          'view_partner_analytics',
        ],
        SUB_MERCHANT: [
          'view_own_merchant',
          'view_own_transactions',
          'create_transaction',
          'view_own_analytics',
        ],
      };

      const userPermissions = permissions[user.role] || [];
      return userPermissions.includes(permission);
    },
    [user]
  );

  return {
    hasRole,
    hasPermission,
    role: user?.role,
  };
}