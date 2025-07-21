"use client";

import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { usersAtom, selectedUserAtom, usersFilterAtom, UsersFilter } from './atoms';
import { userService } from '@/sdk/users';
import { User, CreateUserDto, UpdateUserDto } from '@/sdk/types';

export function useUsers() {
  const [usersState, setUsersState] = useAtom(usersAtom);
  const [filter, setFilter] = useAtom(usersFilterAtom);

  const fetchUsers = useCallback(async (filterOverrides?: Partial<UsersFilter>) => {
    try {
      setUsersState(prev => ({ ...prev, loading: true, error: null }));
      
      const currentFilter = { ...filter, ...filterOverrides };
      const response = await userService.getUsers(currentFilter);
      
      setUsersState(prev => ({
        ...prev,
        users: response.data || [],
        total: response.total || 0,
        loading: false,
      }));
      
      if (filterOverrides) {
        setFilter(currentFilter);
      }
    } catch (error) {
      setUsersState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
      }));
    }
  }, [filter, setUsersState, setFilter]);

  const createUser = useCallback(async (userData: CreateUserDto) => {
    try {
      setUsersState(prev => ({ ...prev, loading: true, error: null }));
      
      const newUser = await userService.createUser(userData);
      
      setUsersState(prev => ({
        ...prev,
        users: [newUser, ...prev.users],
        total: prev.total + 1,
        loading: false,
      }));
      
      return newUser;
    } catch (error) {
      setUsersState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create user',
      }));
      throw error;
    }
  }, [setUsersState]);

  const updateUser = useCallback(async (id: string, userData: UpdateUserDto) => {
    try {
      setUsersState(prev => ({ ...prev, loading: true, error: null }));
      
      const updatedUser = await userService.updateUser(id, userData);
      
      setUsersState(prev => ({
        ...prev,
        users: prev.users.map(user => 
          user.id === id ? updatedUser : user
        ),
        loading: false,
      }));
      
      return updatedUser;
    } catch (error) {
      setUsersState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update user',
      }));
      throw error;
    }
  }, [setUsersState]);

  const deleteUser = useCallback(async (id: string) => {
    try {
      setUsersState(prev => ({ ...prev, loading: true, error: null }));
      
      await userService.deleteUser(id);
      
      setUsersState(prev => ({
        ...prev,
        users: prev.users.filter(user => user.id !== id),
        total: prev.total - 1,
        loading: false,
      }));
    } catch (error) {
      setUsersState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete user',
      }));
      throw error;
    }
  }, [setUsersState]);

  const updateFilter = useCallback((newFilter: Partial<UsersFilter>) => {
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
    users: usersState.users,
    total: usersState.total,
    loading: usersState.loading,
    error: usersState.error,
    filter,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    updateFilter,
    resetFilter,
  };
}

export function useSelectedUser() {
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom);

  const selectUser = useCallback((user: User | null) => {
    setSelectedUser(user);
  }, [setSelectedUser]);

  const clearSelection = useCallback(() => {
    setSelectedUser(null);
  }, [setSelectedUser]);

  return {
    selectedUser,
    selectUser,
    clearSelection,
  };
}