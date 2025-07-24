import { atom } from 'jotai';
import { TransactionAnalytics, WalletBalance, Transaction } from '@/sdk/types';

export const dashboardAnalyticsAtom = atom<TransactionAnalytics | null>(null);

export const walletBalanceAtom = atom<WalletBalance | null>(null);

export const recentTransactionsAtom = atom<Transaction[]>([]);

// New paginated transactions structure
export interface PaginatedTransactions {
  data: Transaction[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number;
  to: number;
  nextPage: string | null;
  prevPage: string | null;
}

export const paginatedTransactionsAtom = atom<PaginatedTransactions | null>(null);
export const transactionsPaginationAtom = atom({
  page: 1,
  perPage: 10,
});
export const transactionsLoadingAtom = atom(false);
export const transactionsErrorAtom = atom<string | null>(null);

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
      set(walletBalanceAtom, null);
      return null;
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
      set(recentTransactionsAtom, response?.data || []);
      
      return response?.data || [];
    } catch (error) {
      set(recentTransactionsAtom, []);
      return [];
    }
  }
);

export const fetchPaginatedTransactionsAtom = atom(
  null,
  async (get, set, params?: { page?: number; perPage?: number; merchantId?: string }) => {
    try {
      set(transactionsLoadingAtom, true);
      set(transactionsErrorAtom, null);
      
      const { transactionsService } = await import('@/sdk/transactions');
      const pagination = get(transactionsPaginationAtom);
      
      const filters = {
        page: params?.page || pagination.page,
        perPage: params?.perPage || pagination.perPage,
        ...(params?.merchantId && { merchantId: params.merchantId }),
      };
      
      const response = await transactionsService.getTransactions(filters);
      
      // Update pagination state
      set(transactionsPaginationAtom, {
        page: filters.page,
        perPage: filters.perPage,
      });
      
      set(paginatedTransactionsAtom, response);
      
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch transactions';
      set(transactionsErrorAtom, message);
      set(paginatedTransactionsAtom, null);
      throw error;
    } finally {
      set(transactionsLoadingAtom, false);
    }
  }
);

export const refreshDashboardAtom = atom(
  null,
  async (get, set, merchantId?: string) => {
    const results = await Promise.allSettled([
      set(fetchDashboardAnalyticsAtom, merchantId),
      set(fetchWalletBalanceAtom),
      set(fetchRecentTransactionsAtom, merchantId),
      set(fetchPaginatedTransactionsAtom, { merchantId }),
    ]);
  }
);