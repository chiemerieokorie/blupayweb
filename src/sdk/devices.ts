import { apiClient } from './client';
import { Device, PaginatedResponse, DeviceStatus } from './types';

export interface CreateDeviceRequest {
  deviceId: string;
  assignedTo: string; // Partner Bank ID
}

export interface UpdateDeviceRequest {
  status?: DeviceStatus;
  merchantId?: string;
  assignedTo?: string;
}

export interface DeviceFilters {
  page?: number;
  perPage?: number;
  search?: string;
  status?: DeviceStatus;
  merchantId?: string;
  partnerBankId?: string;
}

export class DevicesService {
  async createDevice(data: CreateDeviceRequest): Promise<Device> {
    const response = await apiClient.post<Device>('/devices', data);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create device');
  }

  async getDevices(filters: DeviceFilters = {}): Promise<PaginatedResponse<Device>> {
    const response = await apiClient.get<PaginatedResponse<Device>>('/devices', filters);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch devices');
  }

  async getDevice(deviceId: string): Promise<Device> {
    const response = await apiClient.get<Device>(`/devices/${deviceId}`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch device');
  }

  async updateDevice(deviceId: string, data: UpdateDeviceRequest): Promise<Device> {
    const response = await apiClient.patch<Device>(`/devices/${deviceId}`, data);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update device');
  }

  async deleteDevice(deviceId: string): Promise<void> {
    const response = await apiClient.delete(`/devices/${deviceId}`);
    if (!response.status) {
      throw new Error(response.message || 'Failed to delete device');
    }
  }

  async assignDevice(deviceId: string, merchantId: string): Promise<Device> {
    const response = await apiClient.patch<Device>(`/devices/${deviceId}/assign`, { merchantId });
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to assign device');
  }

  async unassignDevice(deviceId: string): Promise<Device> {
    const response = await apiClient.patch<Device>(`/devices/${deviceId}/unassign`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to unassign device');
  }

  async activateDevice(deviceId: string): Promise<Device> {
    const response = await apiClient.patch<Device>(`/devices/${deviceId}/activate`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to activate device');
  }

  async deactivateDevice(deviceId: string): Promise<Device> {
    const response = await apiClient.patch<Device>(`/devices/${deviceId}/deactivate`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to deactivate device');
  }

  async setMaintenanceMode(deviceId: string): Promise<Device> {
    const response = await apiClient.patch<Device>(`/devices/${deviceId}/maintenance`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to set device to maintenance mode');
  }
}

export const devicesService = new DevicesService();