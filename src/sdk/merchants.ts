import { apiClient } from './client';
import { 
  Merchant, 
  SubMerchant, 
  MerchantApiKeys,
  PaginatedResponse,
  ApiResponse 
} from './types';

export interface CreateMerchantRequest {
  merchantName: string;
  merchantCategoryCode: string;
  notificationEmail: string;
  country: string;
  canProcessCardTransactions?: boolean;
  canProcessMomoTransactions?: boolean;
  settlementDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    sortCode?: string;
  };
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    sortCode?: string;
  };
}

export interface UpdateMerchantRequest {
  merchantName?: string;
  merchantCategoryCode?: string;
  notificationEmail?: string;
  canProcessCardTransactions?: boolean;
  canProcessMomoTransactions?: boolean;
  webhookUrl?: string;
}

export interface CreateSubMerchantRequest {
  name: string;
  email: string;
  phoneNumber: string;
}

export interface MerchantFilters {
  page?: number;
  perPage?: number;
  search?: string;
  partnerBankId?: string;
  status?: string;
}

export class MerchantsService {
  async createMerchant(data: CreateMerchantRequest): Promise<Merchant> {
    const response = await apiClient.post<Merchant>('/merchants', data);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create merchant');
  }

  async getMerchants(filters: MerchantFilters = {}): Promise<PaginatedResponse<Merchant>> {
    const response = await apiClient.get<PaginatedResponse<Merchant>>('/merchants', filters);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch merchants');
  }

  async getMerchant(merchantId: string): Promise<Merchant> {
    const response = await apiClient.get<Merchant>(`/merchants/${merchantId}`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch merchant');
  }

  async getMerchantBySlug(slug: string): Promise<Merchant> {
    const response = await apiClient.get<Merchant>(`/merchants/web/${slug}`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch merchant');
  }

  async updateMerchant(merchantId: string, data: UpdateMerchantRequest): Promise<Merchant> {
    const response = await apiClient.patch<Merchant>(`/merchants/${merchantId}`, data);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update merchant');
  }

  async deleteMerchant(merchantId: string): Promise<void> {
    const response = await apiClient.delete(`/merchants/${merchantId}`);
    if (!response.status) {
      throw new Error(response.message || 'Failed to delete merchant');
    }
  }

  async getSubMerchants(merchantId: string): Promise<SubMerchant[]> {
    const response = await apiClient.get<SubMerchant[]>(`/merchants/${merchantId}/sub-merchants`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch sub-merchants');
  }

  async createSubMerchant(merchantId: string, data: CreateSubMerchantRequest): Promise<SubMerchant> {
    const response = await apiClient.post<SubMerchant>(`/merchants/${merchantId}/sub-merchants`, data);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create sub-merchant');
  }

  async updateSubMerchant(merchantId: string, subMerchantId: string, data: Partial<CreateSubMerchantRequest>): Promise<SubMerchant> {
    const response = await apiClient.patch<SubMerchant>(`/merchants/${merchantId}/sub-merchants/${subMerchantId}`, data);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update sub-merchant');
  }

  async deleteSubMerchant(merchantId: string, subMerchantId: string): Promise<void> {
    const response = await apiClient.delete(`/merchants/${merchantId}/sub-merchants/${subMerchantId}`);
    if (!response.status) {
      throw new Error(response.message || 'Failed to delete sub-merchant');
    }
  }

  async issueApiKey(): Promise<MerchantApiKeys> {
    const response = await apiClient.get<MerchantApiKeys>('/merchants/apikey/issue');
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to issue API key');
  }

  async reIssueApiKey(): Promise<MerchantApiKeys> {
    const response = await apiClient.patch<MerchantApiKeys>('/merchants/apikey/re-issue');
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to re-issue API key');
  }

  async registerWebhook(webhookUrl: string): Promise<Merchant> {
    const response = await apiClient.patch<Merchant>('/merchants/webhook/register', { webhookUrl });
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to register webhook');
  }
}

export const merchantsService = new MerchantsService();