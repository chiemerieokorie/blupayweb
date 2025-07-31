import { apiClient } from './client';
import { User, CreateUserDto, UpdateUserDto, ApiResponse } from './types';

export const userService = {
  async getUsers(params?: Record<string, unknown>): Promise<ApiResponse<User[]>> {
    return apiClient.get('/users', params);
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