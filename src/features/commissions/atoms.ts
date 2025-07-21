"use client";

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Commission } from '@/sdk/types';

export interface CommissionsFilter {
  search?: string;
  type?: string;
  status?: string;
  merchantId?: string;
  partnerBankId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CommissionsState {
  commissions: Commission[];
  total: number;
  loading: boolean;
  error: string | null;
  selectedCommission: Commission | null;
  filter: CommissionsFilter;
}

const initialCommissionsState: CommissionsState = {
  commissions: [],
  total: 0,
  loading: false,
  error: null,
  selectedCommission: null,
  filter: {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

export const commissionsAtom = atom<CommissionsState>(initialCommissionsState);

export const commissionsFilterAtom = atomWithStorage<CommissionsFilter>('commissions-filter', {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
});

export const selectedCommissionAtom = atom<Commission | null>(null);