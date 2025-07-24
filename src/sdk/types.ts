export interface ApiResponse<T = unknown> {
  status: boolean;
  message: string;
  data: T;
  total?: number;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

// Standardized Error Types
export interface ApiError extends Error {
  code: string;
  statusCode: number;
  details?: unknown;
  timestamp: string;
}

export interface ValidationError extends ApiError {
  field: string;
  value: unknown;
  constraints: string[];
}

export interface NetworkError extends ApiError {
  timeout: boolean;
  offline: boolean;
  retryable: boolean;
}

export interface BusinessError extends ApiError {
  businessCode: string;
  category: 'AUTHENTICATION' | 'AUTHORIZATION' | 'BUSINESS_RULE' | 'RESOURCE_NOT_FOUND';
}

export type ErrorType = 'VALIDATION' | 'NETWORK' | 'BUSINESS' | 'UNKNOWN';

export interface ErrorContext {
  endpoint: string;
  method: string;
  requestId?: string;
  userId?: string;
}

// Filter Interfaces
export interface TransactionFilters extends Record<string, unknown> {
  status?: TransactionStatus;
  type?: TransactionType;
  source?: TransactionSource;
  processor?: Telco;
  startDate?: string;
  endDate?: string;
  merchantId?: string;
  customerPhone?: string;
  amountMin?: number;
  amountMax?: number;
  page?: number;
  limit?: number;
}

export interface MerchantFilters extends Record<string, unknown> {
  status?: string;
  country?: string;
  partnerBankId?: string;
  canProcessCardTransactions?: boolean;
  canProcessMomoTransactions?: boolean;
  search?: string;
  page?: number;
  perPage?: number;
  limit?: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  status: UserStatus;
  smsEnabled?: boolean;
  emailEnabled?: boolean;
  merchantId?: string;
  partnerBankId?: string;
  merchant?: Merchant;
  subMerchant?: SubMerchant;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'ADMIN' | 'MERCHANT' | 'PARTNER_BANK' | 'SUB_MERCHANT';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';

export interface Merchant {
  uuid: string;
  merchantCode: string;
  merchantName: string;
  merchantNameSlug: string;
  merchantCategoryCode: string;
  canProcessCardTransactions: boolean;
  canProcessMomoTransactions: boolean;
  merchantKey: string;
  merchantToken: string;
  notificationEmail: string;
  country: string;
  partnerBankId: string;
  webhookUrl?: string;
  settlementDetails: Settlement;
  bankDetails: MerchantBankDetails;
  apiKey: MerchantApiKeys;
}

export interface SubMerchant {
  uuid: string;
  name: string;
  email: string;
  phoneNumber: string;
  merchantId: string;
  status: UserStatus;
}

export interface Settlement {
  uuid: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  sortCode?: string;
}

export interface MerchantBankDetails {
  uuid: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  sortCode?: string;
}

export interface MerchantApiKeys {
  uuid: string;
  publicKey: string;
  secretKey: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  uuid: string;
  merchantId: string;
  processor: Telco;
  status: TransactionStatus;
  type: TransactionType;
  source: TransactionSource;
  amount: number;
  surchargeOnCustomer: number;
  surchargeOnMerchant: number;
  customer: Customer;
  currency: string;
  transactionRef: string;
  description: string;
  processorResponse: Record<string, unknown>;
  elevyResponse: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type Telco = 'AIRTEL' | 'MTN' | 'TIGO' | 'VODAFONE' | 'ORANGE';
export type TransactionStatus = 'PENDING' | 'FAILED' | 'SUCCESSFUL';
export type TransactionType = 'MONEY_IN' | 'MONEY_OUT' | 'RE_QUERY' | 'REVERSAL';
export type TransactionSource = 'MOMO' | 'CARD';

export interface Customer {
  name: string;
  email?: string;
  phoneNumber: string;
}

export type DeviceStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'ASSIGNED';
export type DeviceType = 'POS' | 'ATM' | 'MOBILE';
export type PartnerBankStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';

export interface Device {
  id: string;
  serialNumber: string;
  deviceType: DeviceType;
  model: string;
  manufacturer: string;
  status: DeviceStatus;
  location?: string;
  partnerBankId?: string;
  merchantId?: string;
  description?: string;
  lastActivity?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerBank {
  id: string;
  name: string;
  code: string;
  country: string;
  status: PartnerBankStatus;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  description?: string;
  swiftCode?: string;
  routingNumber?: string;
  commissionRatio?: number;
  settlementBank?: Record<string, unknown>;
  commissionBank?: Record<string, unknown>;
  fileHeaders?: string[];
  devices?: Device[];
  merchants?: Merchant[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthTokenPayload {
  user: User;
  partnerBankId?: string;
  merchantId?: string;
}

export interface TransactionRequest {
  amount: number;
  phoneNumber: string;
  processor: Telco;
  description?: string;
  customerName?: string;
  customerEmail?: string;
}

export interface TransactionAnalytics {
  totalTransactions: number;
  totalAmount: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  
  // Enhanced analytics matching Angular dashboard
  successTotalMoneyInCount?: number;
  successTotalMoneyInAmount?: number;
  successTotalMoneyOutCount?: number;
  successTotalMoneyOutAmount?: number;
  failedTotalCount?: number;
  failedTotalAmount?: number;
  
  transactionsByDate: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
}

export interface WalletBalance {
  balance: number;
  currency: string;
  lastUpdated: string;
}

// Commission Types
export interface Commission {
  id: string;
  type: CommissionType;
  rate?: number;
  amount?: number;
  currency?: string;
  status: CommissionStatus;
  merchantId?: string;
  partnerBankId?: string;
  minTransactionAmount?: number;
  maxTransactionAmount?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type CommissionType = 'PERCENTAGE' | 'FIXED' | 'TIERED';
export type CommissionStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface CreateCommissionDto {
  type: CommissionType;
  rate?: number;
  amount?: number;
  currency?: string;
  merchantId?: string;
  partnerBankId?: string;
  minTransactionAmount?: number;
  maxTransactionAmount?: number;
  description?: string;
}

export interface UpdateCommissionDto {
  type?: CommissionType;
  rate?: number;
  amount?: number;
  currency?: string;
  status?: CommissionStatus;
  merchantId?: string;
  partnerBankId?: string;
  minTransactionAmount?: number;
  maxTransactionAmount?: number;
  description?: string;
}

// Device Types (extended)
export interface CreateDeviceDto {
  serialNumber: string;
  deviceType: DeviceType;
  model: string;
  manufacturer: string;
  location?: string;
  partnerBankId?: string;
  merchantId?: string;
  description?: string;
}

export interface UpdateDeviceDto {
  serialNumber?: string;
  deviceType?: DeviceType;
  model?: string;
  manufacturer?: string;
  location?: string;
  status?: DeviceStatus;
  partnerBankId?: string;
  merchantId?: string;
  description?: string;
}

// Partner Bank Types (extended)
export interface CreatePartnerBankDto {
  name: string;
  code: string;
  country: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  description?: string;
  swiftCode?: string;
  routingNumber?: string;
}

export interface UpdatePartnerBankDto {
  name?: string;
  code?: string;
  country?: string;
  status?: PartnerBankStatus;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  description?: string;
  swiftCode?: string;
  routingNumber?: string;
}

// User Types (extended)
export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: UserRole;
  partnerBankId?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRole;
  status?: UserStatus;
  partnerBankId?: string;
}


// Merchant Types (extended)
export interface CreateMerchantDto {
  merchantName: string;
  merchantCategoryCode: string;
  notificationEmail: string;
  country: string;
  canProcessCardTransactions?: boolean;
  canProcessMomoTransactions?: boolean;
  settlementBankName: string;
  settlementAccountNumber: string;
  settlementAccountName: string;
  settlementSortCode?: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  sortCode?: string;
  partnerBankId?: string;
  webhookUrl?: string;
}

export interface UpdateMerchantDto {
  merchantName?: string;
  merchantCategoryCode?: string;
  notificationEmail?: string;
  country?: string;
  canProcessCardTransactions?: boolean;
  canProcessMomoTransactions?: boolean;
  settlementBankName?: string;
  settlementAccountNumber?: string;
  settlementAccountName?: string;
  settlementSortCode?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  sortCode?: string;
  partnerBankId?: string;
  webhookUrl?: string;
  status?: string;
}