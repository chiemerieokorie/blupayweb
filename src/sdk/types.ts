export interface ApiResponse<T = unknown> {
  status: boolean;
  message: string;
  data: T;
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

export interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  smsEnabled: boolean;
  emailEnabled: boolean;
  merchantId?: string;
  merchant?: Merchant;
  subMerchant?: SubMerchant;
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

export interface Device {
  uuid: string;
  deviceId: string;
  status: DeviceStatus;
  merchant: Merchant;
  assignedTo: PartnerBank;
}

export type DeviceStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'ASSIGNED';

export interface PartnerBank {
  uuid: string;
  name: string;
  commissionRatio: number;
  settlementBank: Record<string, unknown>;
  commissionBank: Record<string, unknown>;
  fileHeaders: string[];
  devices: Device[];
  merchants: Merchant[];
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