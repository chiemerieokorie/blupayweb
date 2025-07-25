import { apiClient } from './client';
import {
  Merchant,
  CreateMerchantDto,
  UpdateMerchantDto,
  PaginatedResponse,
  SubMerchant,
  MerchantApiKeys,
} from './types';

export class MerchantsService {
  async getAllMerchants(filters?: Record<string, unknown>): Promise<PaginatedResponse<Merchant>> {
    try {
      return await apiClient.get('/merchants', { params: filters });
    } catch (error) {
      console.warn('Merchants endpoint not available, returning mock data:', error);
      return {
        data: [],
        meta: {
          total: 0,
          page: filters?.page as number || 1,
          limit: filters?.limit as number || 10,
          totalPages: 0
        }
      };
    }
  }

  async getMerchant(id: string): Promise<Merchant> {
    try {
      return await apiClient.get(`/merchants/${id}`);
    } catch (error) {
      console.warn('Merchant details endpoint not available');
      throw new Error('Merchant details endpoint not implemented yet');
    }
  }

  async createMerchant(data: CreateMerchantDto): Promise<Merchant> {
    try {
      return await apiClient.post('/merchants', data);
    } catch (error) {
      console.warn('Create merchant endpoint not available');
      throw new Error('Merchant creation not implemented yet');
    }
  }

  async updateMerchant(id: string, data: UpdateMerchantDto): Promise<Merchant> {
    try {
      return await apiClient.put(`/merchants/${id}`, data);
    } catch (error) {
      console.warn('Update merchant endpoint not available');
      throw new Error('Merchant update not implemented yet');
    }
  }

  async deleteMerchant(id: string): Promise<void> {
    try {
      return await apiClient.delete(`/merchants/${id}`);
    } catch (error) {
      console.warn('Delete merchant endpoint not available');
      throw new Error('Merchant deletion not implemented yet');
    }
  }

  async getMerchantByCode(merchantCode: string): Promise<Merchant> {
    return apiClient.get(`/merchants/code/${merchantCode}`);
  }

  async addMerchantKey(merchantId: string): Promise<MerchantApiKeys> {
    return apiClient.post(`/merchants/${merchantId}/api-keys`);
  }

  async getMerchantAnalytics(merchantId: string, filters: { startDate?: string; endDate?: string } = {}): Promise<Record<string, unknown>> {
    return apiClient.get(`/merchants/${merchantId}/analytics`, filters);
  }

  async testWebhook(merchantId: string): Promise<Record<string, unknown>> {
    return apiClient.post(`/merchants/${merchantId}/test-webhook`);
  }

  async getTransactions(merchantId: string, filters: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    return apiClient.get(`/merchants/${merchantId}/transactions`, filters);
  }

  async enableMerchant(id: string): Promise<Merchant> {
    return apiClient.patch(`/merchants/${id}/enable`);
  }

  async disableMerchant(id: string): Promise<Merchant> {
    return apiClient.patch(`/merchants/${id}/disable`);
  }

  async deleteMerchantKey(merchantId: string, keyId: string): Promise<void> {
    return apiClient.delete(`/merchants/${merchantId}/api-keys/${keyId}`);
  }

  // Sub-merchants
  async getSubMerchants(merchantId: string): Promise<SubMerchant[]> {
    return apiClient.get(`/merchants/${merchantId}/sub-merchants`);
  }

  async createSubMerchant(merchantId: string, data: Record<string, unknown>): Promise<SubMerchant> {
    return apiClient.post(`/merchants/${merchantId}/sub-merchants`, data);
  }

  async updateSubMerchant(merchantId: string, subMerchantId: string, data: Record<string, unknown>): Promise<SubMerchant> {
    return apiClient.put(`/merchants/${merchantId}/sub-merchants/${subMerchantId}`, data);
  }

  async deleteSubMerchant(merchantId: string, subMerchantId: string): Promise<void> {
    return apiClient.delete(`/merchants/${merchantId}/sub-merchants/${subMerchantId}`);
  }

  // API Keys
  async getApiKeys(merchantId: string): Promise<MerchantApiKeys> {
    return apiClient.get(`/merchants/${merchantId}/api-keys`);
  }

  async regenerateApiKeys(merchantId: string): Promise<MerchantApiKeys> {
    return apiClient.post(`/merchants/${merchantId}/api-keys/regenerate`);
  }

  async toggleApiKeyStatus(merchantId: string): Promise<Merchant> {
    return apiClient.patch(`/merchants/${merchantId}/api-keys/toggle`);
  }
}

export const merchantsService = new MerchantsService();