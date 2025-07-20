import { atom } from 'jotai';
import { TransactionAnalytics, WalletBalance, Transaction } from '@/sdk/types';

export const dashboardAnalyticsAtom = atom<TransactionAnalytics | null>(null);

export const walletBalanceAtom = atom<WalletBalance | null>(null);

export const recentTransactionsAtom = atom<Transaction[]>([]);

export const dashboardLoadingAtom = atom(false);

export const dashboardErrorAtom = atom<string | null>(null);

export const analyticsDateRangeAtom = atom({
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
  endDate: new Date().toISOString().split('T')[0], // today
});

export const fetchDashboardAnalyticsAtom = atom(
  null,
  async (get, set, merchantId?: string) => {
    try {
      set(dashboardLoadingAtom, true);
      set(dashboardErrorAtom, null);
      
      const { transactionsService } = await import('@/sdk/transactions');
      const dateRange = get(analyticsDateRangeAtom);
      
      const filters = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        ...(merchantId && { merchantId }),
      };
      
      const analytics = await transactionsService.getAnalytics(filters);
      set(dashboardAnalyticsAtom, analytics);
      
      return analytics;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch analytics';
      set(dashboardErrorAtom, message);
      throw error;
    } finally {
      set(dashboardLoadingAtom, false);
    }
  }
);

export const fetchWalletBalanceAtom = atom(
  null,
  async (get, set) => {
    try {
      const { transactionsService } = await import('@/sdk/transactions');
      const balance = await transactionsService.getWalletBalance();
      set(walletBalanceAtom, balance);
      return balance;
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
      throw error;
    }
  }
);

export const fetchRecentTransactionsAtom = atom(
  null,
  async (get, set, merchantId?: string) => {
    try {
      const { transactionsService } = await import('@/sdk/transactions');
      
      const filters = {
        page: 1,
        perPage: 10,
        ...(merchantId && { merchantId }),
      };
      
      const response = await transactionsService.getTransactions(filters);
      set(recentTransactionsAtom, response.data);
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch recent transactions:', error);
      throw error;
    }
  }
);

export const refreshDashboardAtom = atom(
  null,
  async (get, set, merchantId?: string) => {
    await Promise.all([
      set(fetchDashboardAnalyticsAtom, merchantId),
      set(fetchWalletBalanceAtom),
      set(fetchRecentTransactionsAtom, merchantId),
    ]);
  }
);