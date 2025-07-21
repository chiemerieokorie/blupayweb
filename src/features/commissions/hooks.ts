"use client";

import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { commissionsAtom, selectedCommissionAtom, commissionsFilterAtom, CommissionsFilter } from './atoms';
import { commissionService } from '@/sdk/commissions';
import { Commission, CreateCommissionDto, UpdateCommissionDto } from '@/sdk/types';

export function useCommissions() {
  const [commissionsState, setCommissionsState] = useAtom(commissionsAtom);
  const [filter, setFilter] = useAtom(commissionsFilterAtom);

  const fetchCommissions = useCallback(async (filterOverrides?: Partial<CommissionsFilter>) => {
    try {
      setCommissionsState(prev => ({ ...prev, loading: true, error: null }));
      
      const currentFilter = { ...filter, ...filterOverrides };
      const response = await commissionService.getCommissions(currentFilter);
      
      setCommissionsState(prev => ({
        ...prev,
        commissions: response.data || [],
        total: response.total || 0,
        loading: false,
      }));
      
      if (filterOverrides) {
        setFilter(currentFilter);
      }
    } catch (error) {
      setCommissionsState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch commissions',
      }));
    }
  }, [filter, setCommissionsState, setFilter]);

  const createCommission = useCallback(async (commissionData: CreateCommissionDto) => {
    try {
      setCommissionsState(prev => ({ ...prev, loading: true, error: null }));
      
      const newCommission = await commissionService.createCommission(commissionData);
      
      setCommissionsState(prev => ({
        ...prev,
        commissions: [newCommission, ...prev.commissions],
        total: prev.total + 1,
        loading: false,
      }));
      
      return newCommission;
    } catch (error) {
      setCommissionsState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create commission',
      }));
      throw error;
    }
  }, [setCommissionsState]);

  const updateCommission = useCallback(async (id: string, commissionData: UpdateCommissionDto) => {
    try {
      setCommissionsState(prev => ({ ...prev, loading: true, error: null }));
      
      const updatedCommission = await commissionService.updateCommission(id, commissionData);
      
      setCommissionsState(prev => ({
        ...prev,
        commissions: prev.commissions.map(commission => 
          commission.id === id ? updatedCommission : commission
        ),
        loading: false,
      }));
      
      return updatedCommission;
    } catch (error) {
      setCommissionsState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update commission',
      }));
      throw error;
    }
  }, [setCommissionsState]);

  const deleteCommission = useCallback(async (id: string) => {
    try {
      setCommissionsState(prev => ({ ...prev, loading: true, error: null }));
      
      await commissionService.deleteCommission(id);
      
      setCommissionsState(prev => ({
        ...prev,
        commissions: prev.commissions.filter(commission => commission.id !== id),
        total: prev.total - 1,
        loading: false,
      }));
    } catch (error) {
      setCommissionsState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete commission',
      }));
      throw error;
    }
  }, [setCommissionsState]);

  const updateFilter = useCallback((newFilter: Partial<CommissionsFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, [setFilter]);

  const resetFilter = useCallback(() => {
    setFilter({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, [setFilter]);

  return {
    commissions: commissionsState.commissions,
    total: commissionsState.total,
    loading: commissionsState.loading,
    error: commissionsState.error,
    filter,
    fetchCommissions,
    createCommission,
    updateCommission,
    deleteCommission,
    updateFilter,
    resetFilter,
  };
}

export function useSelectedCommission() {
  const [selectedCommission, setSelectedCommission] = useAtom(selectedCommissionAtom);

  const selectCommission = useCallback((commission: Commission | null) => {
    setSelectedCommission(commission);
  }, [setSelectedCommission]);

  const clearSelection = useCallback(() => {
    setSelectedCommission(null);
  }, [setSelectedCommission]);

  return {
    selectedCommission,
    selectCommission,
    clearSelection,
  };
}