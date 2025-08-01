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
  async getTransactionById(transactionRef: string): Promise<Transaction> {
    return apiClient.get(`/transactions/${transactionRef}/view`);
  }

  async getTransactionStatus(transactionRef: string): Promise<any> {
    return apiClient.get(`/transactions/${transactionRef}/view`);
  }

  async createTransaction(data: TransactionRequest): Promise<Transaction> {
    return apiClient.post('/transactions', data);
  }

  async getTransactions(filters: TransactionFilters): Promise<PaginatedResponse<Transaction>> {
    const data = await apiClient.get<Transaction[]>('/transactions', filters);
    
    // Transform the direct array response into PaginatedResponse format
    return {
      data: data || [],
      meta: {
        page: filters.page || 1,
        perPage: filters.limit || 10,
        total: (data || []).length, // We don't have total from API, so use current page length
        totalPages: 1 // We don't have total pages from API
      }
    };
  }

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction> {
    return apiClient.put(`/transactions/${id}`, data);
  }

  async deleteTransaction(id: string): Promise<Transaction> {
    return apiClient.delete(`/transactions/${id}`);
  }

  async reverseTransaction(transactionRef: string, otpData?: { otp: string; requestedFor: string }): Promise<Transaction> {
    return apiClient.post(`/transactions/${transactionRef}/reverse`, otpData || {});
  }

  async reQueryTransaction(transactionRef: string): Promise<any> {
    return apiClient.get(`/transactions/${transactionRef}/re-query`);
  }

  async getAnalytics(filters: { 
    startDate?: string; 
    endDate?: string; 
    merchantId?: string;
    range?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    month?: string;
    year?: string;
    partnerBankId?: string;
  } = {}): Promise<TransactionAnalytics> {
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