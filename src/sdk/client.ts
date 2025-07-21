import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from './types';
import { createApiError, validateApiResponse } from './error-utils';
import {ENV_VARIABLES} from "@/lib/constants";

export class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private partnerBankId: string | null = null;

  constructor(baseURL: string = ENV_VARIABLES.NEXT_PUBLIC_API_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        
        if (this.partnerBankId) {
          config.headers['Partner-Bank-Id'] = this.partnerBankId;
        }

        config.headers['Idempotency-Key'] = crypto.randomUUID();
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setAuth(token: string, partnerBankId?: string) {
    this.token = token;
    this.partnerBankId = partnerBankId || null;
  }

  clearAuth() {
    this.token = null;
    this.partnerBankId = null;
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, { params });
      return validateApiResponse(
        response.data,
        { endpoint: url, method: 'GET' },
        `Failed to fetch data from ${url}`
      );
    } catch (error) {
      throw createApiError(
        error,
        { endpoint: url, method: 'GET' },
        `Failed to fetch data from ${url}`
      );
    }
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data);
      return validateApiResponse(
        response.data,
        { endpoint: url, method: 'POST' },
        `Failed to post data to ${url}`
      );
    } catch (error) {
      throw createApiError(
        error,
        { endpoint: url, method: 'POST' },
        `Failed to post data to ${url}`
      );
    }
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data);
      return validateApiResponse(
        response.data,
        { endpoint: url, method: 'PATCH' },
        `Failed to update data at ${url}`
      );
    } catch (error) {
      throw createApiError(
        error,
        { endpoint: url, method: 'PATCH' },
        `Failed to update data at ${url}`
      );
    }
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data);
      return validateApiResponse(
        response.data,
        { endpoint: url, method: 'PUT' },
        `Failed to update data at ${url}`
      );
    } catch (error) {
      throw createApiError(
        error,
        { endpoint: url, method: 'PUT' },
        `Failed to update data at ${url}`
      );
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url);
      return validateApiResponse(
        response.data,
        { endpoint: url, method: 'DELETE' },
        `Failed to delete data at ${url}`
      );
    } catch (error) {
      throw createApiError(
        error,
        { endpoint: url, method: 'DELETE' },
        `Failed to delete data at ${url}`
      );
    }
  }
}

export const apiClient = new ApiClient();