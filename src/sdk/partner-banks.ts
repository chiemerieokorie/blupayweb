import { apiClient } from './client';
import { PartnerBank, CreatePartnerBankDto, UpdatePartnerBankDto, PaginatedResponse, PartnerBankStatus } from './types';

export const partnerBankService = {
  async getPartnerBanks(params?: Record<string, unknown>): Promise<PaginatedResponse<PartnerBank>> {
    // Map params to match legacy API format
    const apiParams = params ? {
      page: params.page,
      perPage: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder
    } : undefined;
    
    return await apiClient.get('/banks/partners', apiParams);
  },

  async getPartnerBank(id: string): Promise<PartnerBank> {
    try {
      return await apiClient.get(`/partner-banks/${id}`);
    } catch (error) {
      console.warn('Partner bank details endpoint not available');
      throw new Error('Partner bank details endpoint not implemented yet');
    }
  },

  async createPartnerBank(data: CreatePartnerBankDto | FormData): Promise<PartnerBank> {
    return await apiClient.post('/banks/partners', data);
  },

  async updatePartnerBank(id: string, data: UpdatePartnerBankDto): Promise<PartnerBank> {
    try {
      return await apiClient.put(`/partner-banks/${id}`, data);
    } catch (error) {
      console.warn('Update partner bank endpoint not available');
      throw new Error('Partner bank update not implemented yet');
    }
  },

  async deletePartnerBank(id: string): Promise<void> {
    try {
      return await apiClient.delete(`/partner-banks/${id}`);
    } catch (error) {
      console.warn('Delete partner bank endpoint not available');
      throw new Error('Partner bank deletion not implemented yet');
    }
  },

  async getPartnerBankAnalytics(partnerBankId: string, filters: { startDate?: string; endDate?: string } = {}): Promise<Record<string, unknown>> {
    return apiClient.get(`/partner-banks/${partnerBankId}/analytics`, filters);
  },
};