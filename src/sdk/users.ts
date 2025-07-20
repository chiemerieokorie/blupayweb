import { apiClient } from './client';
import { User, PaginatedResponse, UserRole, UserStatus } from './types';

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  merchantId?: string;
  smsEnabled?: boolean;
  emailEnabled?: boolean;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  status?: UserStatus;
  smsEnabled?: boolean;
  emailEnabled?: boolean;
}

export interface UserFilters {
  page?: number;
  perPage?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  merchantId?: string;
}

export class UsersService {
  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>('/users', data);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create user');
  }

  async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>('/users', filters);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch users');
  }

  async getUser(userId: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${userId}`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch user');
  }

  async updateUser(userId: string, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${userId}`, data);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update user');
  }

  async deleteUser(userId: string): Promise<void> {
    const response = await apiClient.delete(`/users/${userId}`);
    if (!response.status) {
      throw new Error(response.message || 'Failed to delete user');
    }
  }

  async activateUser(userId: string): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${userId}/activate`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to activate user');
  }

  async deactivateUser(userId: string): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${userId}/deactivate`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to deactivate user');
  }

  async suspendUser(userId: string): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${userId}/suspend`);
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to suspend user');
  }

  async resetUserPassword(userId: string): Promise<void> {
    const response = await apiClient.post(`/users/${userId}/reset-password`);
    if (!response.status) {
      throw new Error(response.message || 'Failed to reset user password');
    }
  }
}

export const usersService = new UsersService();