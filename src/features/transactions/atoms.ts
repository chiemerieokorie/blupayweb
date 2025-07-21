import { atom } from 'jotai';
import { Transaction, TransactionFilters, PaginatedResponse } from '@/sdk/types';

export const transactionsAtom = atom<PaginatedResponse<Transaction> | null>(null);

export const transactionFiltersAtom = atom<TransactionFilters>({
  page: 1,
  limit: 10,
});

export const transactionsLoadingAtom = atom(false);

export const transactionsErrorAtom = atom<string | null>(null);

export const selectedTransactionAtom = atom<Transaction | null>(null);

export const fetchTransactionsAtom = atom(
  null,
  async (get, set) => {
    try {
      set(transactionsLoadingAtom, true);
      set(transactionsErrorAtom, null);
      
      const { transactionsService } = await import('@/sdk/transactions');
      const filters = get(transactionFiltersAtom);
      
      const response = await transactionsService.getTransactions(filters);
      set(transactionsAtom, response);
      
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch transactions';
      set(transactionsErrorAtom, message);
      throw error;
    } finally {
      set(transactionsLoadingAtom, false);
    }
  }
);

export const fetchTransactionAtom = atom(
  null,
  async (get, set, transactionRef: string) => {
    try {
      set(transactionsLoadingAtom, true);
      set(transactionsErrorAtom, null);
      
      const { transactionsService } = await import('@/sdk/transactions');
      const transaction = await transactionsService.getTransactionById(transactionRef);
      set(selectedTransactionAtom, transaction);
      
      return transaction;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch transaction';
      set(transactionsErrorAtom, message);
      throw error;
    } finally {
      set(transactionsLoadingAtom, false);
    }
  }
);

export const reQueryTransactionAtom = atom(
  null,
  async (get, set, transactionRef: string) => {
    try {
      set(transactionsLoadingAtom, true);
      set(transactionsErrorAtom, null);
      
      const { transactionsService } = await import('@/sdk/transactions');
      const transaction = await transactionsService.getTransactionById(transactionRef);
      
      // Update the transaction in the list
      const currentTransactions = get(transactionsAtom);
      if (currentTransactions) {
        const updatedData = currentTransactions.data.map(t => 
          t.transactionRef === transactionRef ? transaction : t
        );
        set(transactionsAtom, { ...currentTransactions, data: updatedData });
      }
      
      // Update selected transaction if it matches
      const selectedTransaction = get(selectedTransactionAtom);
      if (selectedTransaction?.transactionRef === transactionRef) {
        set(selectedTransactionAtom, transaction);
      }
      
      return transaction;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to re-query transaction';
      set(transactionsErrorAtom, message);
      throw error;
    } finally {
      set(transactionsLoadingAtom, false);
    }
  }
);

export const reverseTransactionAtom = atom(
  null,
  async (get, set, transactionRef: string) => {
    try {
      set(transactionsLoadingAtom, true);
      set(transactionsErrorAtom, null);
      
      const { transactionsService } = await import('@/sdk/transactions');
      const transaction = await transactionsService.reverseTransaction(transactionRef);
      
      // Update the transaction in the list
      const currentTransactions = get(transactionsAtom);
      if (currentTransactions) {
        const updatedData = currentTransactions.data.map(t => 
          t.transactionRef === transactionRef ? transaction : t
        );
        set(transactionsAtom, { ...currentTransactions, data: updatedData });
      }
      
      return transaction;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reverse transaction';
      set(transactionsErrorAtom, message);
      throw error;
    } finally {
      set(transactionsLoadingAtom, false);
    }
  }
);

export const createTransactionAtom = atom(
  null,
  async (get, set, data: any) => {
    try {
      set(transactionsLoadingAtom, true);
      set(transactionsErrorAtom, null);
      
      const { transactionsService } = await import('@/sdk/transactions');
      const transaction = await transactionsService.createTransaction(data);
      
      // Refresh the transactions list
      await set(fetchTransactionsAtom);
      
      return transaction;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create transaction';
      set(transactionsErrorAtom, message);
      throw error;
    } finally {
      set(transactionsLoadingAtom, false);
    }
  }
);