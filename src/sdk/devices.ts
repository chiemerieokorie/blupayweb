import { apiClient } from './client';
import { Device, CreateDeviceDto, UpdateDeviceDto, ApiResponse } from './types';

export const deviceService = {
  async getDevices(params?: Record<string, unknown>): Promise<ApiResponse<Device[]>> {
    return apiClient.get('/devices', params);
  },

  async getDevice(id: string): Promise<Device> {
    return apiClient.get(`/devices/${id}`);
  },

  async createDevice(data: CreateDeviceDto): Promise<Device> {
    return apiClient.post('/devices', data);
  },

  async updateDevice(id: string, data: UpdateDeviceDto): Promise<Device> {
    return apiClient.put(`/devices/${id}`, data);
  },

  async deleteDevice(id: string): Promise<void> {
    return apiClient.delete(`/devices/${id}`);
  },

  async getDevicesByMerchant(merchantId: string): Promise<Device[]> {
    return apiClient.get(`/devices/merchant/${merchantId}`);
  },

  async getDevicesByPartnerBank(partnerBankId: string): Promise<Device[]> {
    return apiClient.get(`/devices/partner-bank/${partnerBankId}`);
  },
};