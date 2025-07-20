import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import {
  dashboardAnalyticsAtom,
  walletBalanceAtom,
  recentTransactionsAtom,
  dashboardLoadingAtom,
  dashboardErrorAtom,
  analyticsDateRangeAtom,
  fetchDashboardAnalyticsAtom,
  fetchWalletBalanceAtom,
  fetchRecentTransactionsAtom,
  refreshDashboardAtom,
} from './atoms';
import { useAuth } from '@/features/auth/hooks';

export function useDashboardAnalytics() {
  const analytics = useAtomValue(dashboardAnalyticsAtom);
  const loading = useAtomValue(dashboardLoadingAtom);
  const error = useAtomValue(dashboardErrorAtom);
  const [, fetchAnalytics] = useAtom(fetchDashboardAnalyticsAtom);
  const { user } = useAuth();

  const refetch = useCallback(async () => {
    const merchantId = user?.role === 'MERCHANT' || user?.role === 'SUB_MERCHANT' 
      ? user.merchantId 
      : undefined;
    await fetchAnalytics(merchantId);
  }, [fetchAnalytics, user]);

  return {
    analytics,
    loading,
    error,
    refetch,
  };
}

export function useWalletBalance() {
  const balance = useAtomValue(walletBalanceAtom);
  const [, fetchBalance] = useAtom(fetchWalletBalanceAtom);

  const refetch = useCallback(async () => {
    await fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    refetch,
  };
}

export function useRecentTransactions() {
  const transactions = useAtomValue(recentTransactionsAtom);
  const [, fetchTransactions] = useAtom(fetchRecentTransactionsAtom);
  const { user } = useAuth();

  const refetch = useCallback(async () => {
    const merchantId = user?.role === 'MERCHANT' || user?.role === 'SUB_MERCHANT' 
      ? user.merchantId 
      : undefined;
    await fetchTransactions(merchantId);
  }, [fetchTransactions, user]);

  return {
    transactions,
    refetch,
  };
}

export function useAnalyticsDateRange() {
  const [dateRange, setDateRange] = useAtom(analyticsDateRangeAtom);

  const updateDateRange = useCallback(
    (startDate: string, endDate: string) => {
      setDateRange({ startDate, endDate });
    },
    [setDateRange]
  );

  return {
    dateRange,
    updateDateRange,
  };
}

export function useDashboard() {
  const analytics = useDashboardAnalytics();
  const balance = useWalletBalance();
  const transactions = useRecentTransactions();
  const dateRange = useAnalyticsDateRange();
  const [, refreshDashboard] = useAtom(refreshDashboardAtom);
  const { user } = useAuth();

  const refresh = useCallback(async () => {
    const merchantId = user?.role === 'MERCHANT' || user?.role === 'SUB_MERCHANT' 
      ? user.merchantId 
      : undefined;
    await refreshDashboard(merchantId);
  }, [refreshDashboard, user]);

  useEffect(() => {
    if (user) {
      refresh();
    }
  }, [user, refresh, dateRange.dateRange]);

  const getRoleSpecificMetrics = useCallback(() => {
    if (!analytics.analytics || !user) return null;

    const baseMetrics = {
      totalTransactions: analytics.analytics.totalTransactions,
      totalAmount: analytics.analytics.totalAmount,
      successfulTransactions: analytics.analytics.successfulTransactions,
      failedTransactions: analytics.analytics.failedTransactions,
      pendingTransactions: analytics.analytics.pendingTransactions,
    };

    switch (user.role) {
      case 'ADMIN':
        return {
          ...baseMetrics,
          title: 'System Overview',
          showMerchantBreakdown: true,
          showPartnerBankBreakdown: true,
        };
      
      case 'PARTNER_BANK':
        return {
          ...baseMetrics,
          title: 'Partner Bank Dashboard',
          showMerchantBreakdown: true,
          showPartnerBankBreakdown: false,
        };
      
      case 'MERCHANT':
        return {
          ...baseMetrics,
          title: 'Merchant Dashboard',
          showWalletBalance: true,
          showApiKeyManagement: true,
        };
      
      case 'SUB_MERCHANT':
        return {
          ...baseMetrics,
          title: 'Sub-Merchant Dashboard',
          showWalletBalance: true,
        };
      
      default:
        return baseMetrics;
    }
  }, [analytics.analytics, user]);

  return {
    ...analytics,
    balance: balance.balance,
    transactions: transactions.transactions,
    dateRange: dateRange.dateRange,
    updateDateRange: dateRange.updateDateRange,
    refresh,
    roleSpecificMetrics: getRoleSpecificMetrics(),
    user,
  };
}