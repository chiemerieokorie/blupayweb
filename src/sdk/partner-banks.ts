import { apiClient } from './client';
import { PartnerBank, PaginatedResponse } from './types';

export interface CreatePartnerBankRequest {
  name: string;
  commissionRatio: number;
  settlementBank: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    sortCode?: string;
  };
  commissionBank: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    sortCode?: string;
  };
  fileHeaders: string[];
}

export interface UpdatePartnerBankRequest {
  name?: string;
  commissionRatio?: number;
  settlementBank?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    sortCode?: string;
  };
  commissionBank?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    sortCode?: string;
  };
  fileHeaders?: string[];
}

export interface PartnerBankFilters {
  page?: number;
  perPage?: number;
  search?: string;
}

export class PartnerBanksService {
  async createPartnerBank(data: CreatePartnerBankRequest): Promise<PartnerBank> {
    const response = await apiClient.post<PartnerBank>('/partner-banks', data);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create partner bank');
  }

  async getPartnerBanks(filters: PartnerBankFilters = {}): Promise<PaginatedResponse<PartnerBank>> {
    const response = await apiClient.get<PaginatedResponse<PartnerBank>>('/partner-banks', filters);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch partner banks');
  }

  async getPartnerBank(partnerBankId: string): Promise<PartnerBank> {
    const response = await apiClient.get<PartnerBank>(`/partner-banks/${partnerBankId}`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch partner bank');
  }

  async updatePartnerBank(partnerBankId: string, data: UpdatePartnerBankRequest): Promise<PartnerBank> {
    const response = await apiClient.patch<PartnerBank>(`/partner-banks/${partnerBankId}`, data);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update partner bank');
  }

  async deletePartnerBank(partnerBankId: string): Promise<void> {
    const response = await apiClient.delete(`/partner-banks/${partnerBankId}`);
    if (!response.status) {
      throw new Error(response.message || 'Failed to delete partner bank');
    }
  }

  async getPartnerBankMerchants(partnerBankId: string): Promise<any[]> {
    const response = await apiClient.get<any[]>(`/partner-banks/${partnerBankId}/merchants`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch partner bank merchants');
  }

  async getPartnerBankDevices(partnerBankId: string): Promise<any[]> {
    const response = await apiClient.get<any[]>(`/partner-banks/${partnerBankId}/devices`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch partner bank devices');
  }

  async getPartnerBankAnalytics(partnerBankId: string, filters: { startDate?: string; endDate?: string } = {}): Promise<any> {
    const response = await apiClient.get<any>(`/partner-banks/${partnerBankId}/analytics`, filters);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch partner bank analytics');
  }
}

export const partnerBanksService = new PartnerBanksService();