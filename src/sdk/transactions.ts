import { apiClient } from './client';
import {
  Transaction,
  TransactionRequest,
  TransactionAnalytics,
  WalletBalance,
  ApiResponse,
  PaginatedResponse,
  TransactionFilters,
} from './types';

// Request types for additional transaction operations
interface CashoutRequest {
  amount: number;
  phoneNumber: string;
  description?: string;
}

interface TransferRequest {
  fromWallet: string;
  toWallet: string;
  amount: number;
  description?: string;
}

interface WalletFundRequest {
  amount: number;
  source: string;
  description?: string;
}

export class TransactionsService {
  async getTransactionById(id: string): Promise<Transaction> {
    return apiClient.get(`/transactions/${id}`);
  }

  async createTransaction(data: TransactionRequest): Promise<Transaction> {
    return apiClient.post('/transactions', data);
  }

  async getTransactions(filters: TransactionFilters): Promise<PaginatedResponse<Transaction>> {
    return apiClient.get('/transactions', filters);
  }

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction> {
    return apiClient.put(`/transactions/${id}`, data);
  }

  async deleteTransaction(id: string): Promise<Transaction> {
    return apiClient.delete(`/transactions/${id}`);
  }

  async reverseTransaction(id: string): Promise<Transaction> {
    return apiClient.post(`/transactions/${id}/reverse`);
  }

  async getAnalytics(filters: { startDate?: string; endDate?: string; merchantId?: string } = {}): Promise<TransactionAnalytics> {
    return apiClient.get('/transactions/analytics', filters);
  }

  async cashout(data: CashoutRequest): Promise<Transaction> {
    return apiClient.post('/transactions/cashout', data);
  }

  async internalTransfer(data: TransferRequest): Promise<Transaction> {
    return apiClient.post('/transactions/transfer/internal', data);
  }

  async fundWallet(data: WalletFundRequest): Promise<Transaction> {
    return apiClient.post('/transactions/wallet/fund', data);
  }

  async getWalletBalance(): Promise<WalletBalance> {
    return apiClient.get('/transactions/wallet/balance');
  }
}

export const transactionsService = new TransactionsService();