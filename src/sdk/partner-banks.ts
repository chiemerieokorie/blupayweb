import { apiClient } from './client';
import { PartnerBank, CreatePartnerBankDto, UpdatePartnerBankDto, PaginatedResponse, PartnerBankStatus } from './types';

export const partnerBankService = {
  async getPartnerBanks(params?: Record<string, unknown>): Promise<PaginatedResponse<PartnerBank>> {
    try {
      return await apiClient.get('/partner-banks', { params });
    } catch (error) {
      console.warn('Partner banks endpoint not available, returning mock data:', error);
      return {
        data: [],
        meta: {
          total: 0,
          page: params?.page as number || 1,
          limit: params?.limit as number || 10,
          totalPages: 0
        }
      };
    }
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
    try {
      return await apiClient.post('/partner-banks', data);
    } catch (error) {
      console.warn('Create partner bank endpoint not available - using mock implementation:', error);
      
      // Mock implementation for development - extract data from FormData if needed
      let mockData: any = data;
      if (data instanceof FormData) {
        mockData = {
          name: data.get('name'),
          email: data.get('email'),
          commissionBank: data.get('commissionBank'),
          settlementBank: data.get('settlementBank'),
          commissionRatio: data.get('commissionRatio'),
          headers: []
        };
        
        // Extract headers
        let headerIndex = 0;
        while (data.get(`headers[${headerIndex}]`)) {
          mockData.headers.push(data.get(`headers[${headerIndex}]`));
          headerIndex++;
        }
      }
      
      // Return mock partner bank
      const mockPartnerBank: PartnerBank = {
        id: `mock-${Date.now()}`,
        name: mockData.name || 'Mock Partner Bank',
        code: `PB${Math.floor(Math.random() * 1000)}`,
        country: 'Ghana',
        status: 'ACTIVE' as PartnerBankStatus,
        contactEmail: mockData.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: 'Mock partner bank created for development',
        address: '',
        contactPhone: '',
        swiftCode: '',
        routingNumber: ''
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockPartnerBank;
    }
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