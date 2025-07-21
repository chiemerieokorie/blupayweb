import { apiClient } from './client';
import { LoginRequest, LoginResponse, User, ApiResponse } from './types';

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('AuthService.login - Making API call to /auth/login');
    // TODO: Implement required userType for login
    const response = await apiClient.post<LoginResponse>('/auth/login', {...credentials, userType: 'administrator'});
    apiClient.setAuth(response.token);
    console.log('AuthService.login - Success');
    return response;
  }

  async loginWithPartnerBank(credentials: LoginRequest, partnerBank: string): Promise<LoginResponse> {
    console.log(`AuthService.loginWithPartnerBank - Making API call to /auth/login/${partnerBank}`);
    // TODO: Implement required userType for partner banks login
    const response = await apiClient.post<LoginResponse>(`/auth/login/${partnerBank}`, {...credentials, userType: 'administrator'});
    apiClient.setAuth(response.token, partnerBank);
    console.log('AuthService.loginWithPartnerBank - Success');
    return response;
  }

  async getMe(): Promise<User> {
    return apiClient.get('/auth/me');
  }

  async requestOtp(): Promise<void> {
    return apiClient.post('/auth/otp-request');
  }

  async initiatePasswordReset(email: string): Promise<void> {
    return apiClient.post('/auth/initiate-reset-password', { email });
  }

  async completePasswordReset(token: string, newPassword: string): Promise<void> {
    return apiClient.post('/auth/complete-reset-password', {
      token,
      newPassword,
    });
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