import { apiClient } from './client';
import { 
  Transaction, 
  TransactionRequest, 
  TransactionAnalytics, 
  WalletBalance, 
  PaginatedResponse,
  ApiResponse 
} from './types';

export interface TransactionFilters {
  page?: number;
  perPage?: number;
  status?: string;
  processor?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  merchantId?: string;
}

export interface TransferRequest {
  amount: number;
  recipientMerchantId: string;
  description?: string;
}

export interface CashoutRequest {
  amount: number;
  description?: string;
}

export interface WalletFundRequest {
  amount: number;
  description?: string;
}

export class TransactionsService {
  async createTransaction(data: TransactionRequest): Promise<Transaction> {
    const response = await apiClient.post<Transaction>('/transactions', data);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create transaction');
  }

  async createCardTransaction(data: TransactionRequest): Promise<Transaction> {
    const response = await apiClient.post<Transaction>('/transactions/card', data);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create card transaction');
  }

  async getTransactions(filters: TransactionFilters = {}): Promise<PaginatedResponse<Transaction>> {
    const response = await apiClient.get<PaginatedResponse<Transaction>>('/transactions', filters);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch transactions');
  }

  async getTransaction(transactionRef: string): Promise<Transaction> {
    const response = await apiClient.get<Transaction>(`/transactions/${transactionRef}`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch transaction');
  }

  async reQueryTransaction(transactionRef: string): Promise<Transaction> {
    const response = await apiClient.get<Transaction>(`/transactions/${transactionRef}/re-query`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to re-query transaction');
  }

  async reverseTransaction(transactionRef: string): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`/transactions/${transactionRef}/reverse`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to reverse transaction');
  }

  async getAnalytics(filters: { startDate?: string; endDate?: string; merchantId?: string } = {}): Promise<TransactionAnalytics> {
    const response = await apiClient.get<TransactionAnalytics>('/transactions/analytics', filters);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch analytics');
  }

  async cashout(data: CashoutRequest): Promise<Transaction> {
    const response = await apiClient.post<Transaction>('/transactions/cashout', data);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to process cashout');
  }

  async internalTransfer(data: TransferRequest): Promise<Transaction> {
    const response = await apiClient.post<Transaction>('/transactions/transfer/internal', data);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to process internal transfer');
  }

  async fundWallet(data: WalletFundRequest): Promise<Transaction> {
    const response = await apiClient.post<Transaction>('/transactions/wallet/fund', data);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fund wallet');
  }

  async getWalletBalance(): Promise<WalletBalance> {
    const response = await apiClient.get<WalletBalance>('/transactions/wallet/balance');
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch wallet balance');
  }
}

export const transactionsService = new TransactionsService();