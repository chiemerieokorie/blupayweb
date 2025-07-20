import { apiClient } from './client';
import { LoginRequest, LoginResponse, User, ApiResponse } from './types';

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // TODO: Implement required userType for login
    const response = await apiClient.post<LoginResponse>('/auth/login', {...credentials, userType: 'administrator'});
    if (response.status && response.data) {
      apiClient.setAuth(response.data.token);
      return response.data;
    }
    throw new Error(response.message || 'Login failed');
  }

  async loginWithPartnerBank(credentials: LoginRequest, partnerBank: string): Promise<LoginResponse> {
    // TODO: Implement required userType for partner banks login
    const response = await apiClient.post<LoginResponse>(`/auth/login/${partnerBank}`, {...credentials, userType: 'administrator'});
    if (response.status && response.data) {
      apiClient.setAuth(response.data.token, partnerBank);
      return response.data;
    }
    throw new Error(response.message || 'Login failed');
  }

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch user profile');
  }

  async requestOtp(): Promise<void> {
    const response = await apiClient.post('/auth/otp-request');
    if (!response.status) {
      throw new Error(response.message || 'Failed to request OTP');
    }
  }

  async initiatePasswordReset(email: string): Promise<void> {
    const response = await apiClient.post('/auth/initiate-reset-password', { email });
    if (!response.status) {
      throw new Error(response.message || 'Failed to initiate password reset');
    }
  }

  async completePasswordReset(token: string, newPassword: string): Promise<void> {
    const response = await apiClient.post('/auth/complete-reset-password', {
      token,
      newPassword,
    });
    if (!response.status) {
      throw new Error(response.message || 'Failed to reset password');
    }
  }

  logout(): void {
    apiClient.clearAuth();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
    }
  }
}

export const authService = new AuthService();