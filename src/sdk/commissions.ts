import { apiClient } from './client';
import { ApiResponse, PaginatedResponse, Commission, CreateCommissionDto, UpdateCommissionDto } from './types';

export const commissionService = {
  async getCommissions(params?: Record<string, unknown>): Promise<PaginatedResponse<Commission>> {
    try {
      return await apiClient.get('/commissions', { params });
    } catch (error) {
      console.warn('Commissions endpoint not available, returning mock data:', error);
      // Fallback to mock data if endpoint doesn't exist
      return {
        data: [],
        meta: {
          total: 0,
          page: params?.page as number || 1,
          perPage: params?.perPage as number || 10,
          totalPages: 0
        }
      };
    }
  },

  async getCommission(id: string): Promise<Commission> {
    try {
      return await apiClient.get(`/commissions/${id}`);
    } catch (error) {
      console.warn('Commission endpoint not available');
      throw new Error('Commission endpoint not implemented yet');
    }
  },

  async createCommission(data: CreateCommissionDto): Promise<Commission> {
    try {
      return await apiClient.post('/commissions', data);
    } catch (error) {
      console.warn('Create commission endpoint not available');
      throw new Error('Commission creation not implemented yet');
    }
  },

  async updateCommission(id: string, data: UpdateCommissionDto): Promise<Commission> {
    try {
      return await apiClient.put(`/commissions/${id}`, data);
    } catch (error) {
      console.warn('Update commission endpoint not available');
      throw new Error('Commission update not implemented yet');
    }
  },

  async deleteCommission(id: string): Promise<void> {
    try {
      return await apiClient.delete(`/commissions/${id}`);
    } catch (error) {
      console.warn('Delete commission endpoint not available');
      throw new Error('Commission deletion not implemented yet');
    }
  },

  async getCommissionsByMerchant(merchantId: string): Promise<Commission[]> {
    try {
      return await apiClient.get(`/commissions/merchant/${merchantId}`);
    } catch (error) {
      console.warn('Commission by merchant endpoint not available');
      return [];
    }
  },

  async getCommissionsByPartnerBank(partnerBankId: string): Promise<Commission[]> {
    try {
      return await apiClient.get(`/commissions/partner-bank/${partnerBankId}`);
    } catch (error) {
      console.warn('Commission by partner bank endpoint not available');
      return [];
    }
  },
};