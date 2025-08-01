import { apiClient } from './client';
import { User, CreateUserDto, UpdateUserDto } from './types';

export const userService = {
  async getUsers(params?: Record<string, unknown>): Promise<{data: User[], total: number}> {
    const data = await apiClient.get<User[]>('/users', params);
    
    // Transform the direct array response into expected format
    return {
      data: data || [],
      total: (data || []).length // We don't have total from API, so use current page length
    };
  },

  async getUser(id: string): Promise<User> {
    return apiClient.get(`/users/${id}`);
  },

  async createUser(data: CreateUserDto): Promise<User> {
    return apiClient.post('/users/create', data);
  },

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    return apiClient.put(`/users/${id}`, data);
  },

  async deleteUser(id: string): Promise<void> {
    return apiClient.delete(`/users/${id}`);
  },

  async getUsersByRole(role: string): Promise<User[]> {
    return apiClient.get(`/users/role/${role}`);
  },

  async getUsersByPartnerBank(partnerBankId: string): Promise<User[]> {
    return apiClient.get(`/users/partner-bank/${partnerBankId}`);
  },
};