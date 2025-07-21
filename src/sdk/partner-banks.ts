import { apiClient } from './client';
import { PartnerBank, CreatePartnerBankDto, UpdatePartnerBankDto, ApiResponse } from './types';

export const partnerBankService = {
  async getPartnerBanks(params?: Record<string, unknown>): Promise<ApiResponse<PartnerBank[]>> {
    return apiClient.get('/partner-banks', params);
  },

  async getPartnerBank(id: string): Promise<PartnerBank> {
    return apiClient.get(`/partner-banks/${id}`);
  },

  async createPartnerBank(data: CreatePartnerBankDto): Promise<PartnerBank> {
    return apiClient.post('/partner-banks', data);
  },

  async updatePartnerBank(id: string, data: UpdatePartnerBankDto): Promise<PartnerBank> {
    return apiClient.put(`/partner-banks/${id}`, data);
  },

  async deletePartnerBank(id: string): Promise<void> {
    return apiClient.delete(`/partner-banks/${id}`);
  },

  async getPartnerBankAnalytics(partnerBankId: string, filters: { startDate?: string; endDate?: string } = {}): Promise<Record<string, unknown>> {
    return apiClient.get(`/partner-banks/${partnerBankId}/analytics`, filters);
  },
};