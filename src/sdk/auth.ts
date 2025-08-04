import { apiClient } from './client';
import { LoginRequest, LoginResponse, User, ApiResponse } from './types';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  partnerBank?: string;
}

export interface OTPRequest {
  requestedFor: 'registration' | 'password-reset' | 'remittance';
}

export interface VerifyOTPRequest {
  otp: string;
  requestedFor: 'registration' | 'password-reset' | 'remittance';
}

export interface CompleteResetPasswordRequest {
  token: string;
  password: string;
}

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {...credentials, userType: 'administrator'});
    apiClient.setAuth(response.token);
    return response;
  }

  async loginWithPartnerBank(credentials: LoginRequest, partnerBank: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(`/auth/login/${partnerBank}`, {...credentials, userType: 'administrator'});
    apiClient.setAuth(response.token, partnerBank);
    return response;
  }

  async register(data: RegisterRequest): Promise<void> {
    // TODO: Backend endpoint needs to be added to auth.controller.ts
    // For now, we'll prepare the request structure
    const { partnerBank, ...userData } = data;
    if (partnerBank) {
      // Register with partner bank
      return apiClient.post(`/auth/register/${partnerBank}`, userData);
    }
    // Register as admin
    return apiClient.post('/auth/register', userData);
  }

  async getMe(): Promise<User> {
    return apiClient.get('/auth/me');
  }

  async requestOtp(requestedFor: OTPRequest['requestedFor'] = 'registration'): Promise<void> {
    return apiClient.post('/auth/otp-request', { requestedFor });
  }

  async verifyOtp(data: VerifyOTPRequest): Promise<any> {
    // TODO: Backend endpoint needs to be exposed in auth.controller.ts
    // The service exists but no controller endpoint
    return apiClient.post('/auth/verify-otp', data);
  }

  async initiatePasswordReset(email: string): Promise<any> {
    return apiClient.post('/auth/initiate-reset-password', { email });
  }

  async completePasswordReset(data: CompleteResetPasswordRequest): Promise<any> {
    return apiClient.post('/auth/complete-reset-password', data);
  }

  async requestRemittanceOtp(): Promise<void> {
    return apiClient.post('/auth/remittance-otp-request');
  }

  logout(): void {
    apiClient.clearAuth();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
      sessionStorage.clear();
    }
  }
}

export const authService = new AuthService();