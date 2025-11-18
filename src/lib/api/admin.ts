import apiClient from '../api-client';
import type { User } from '@/types';

export const getUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>('/admin/users');
  return data;
};

export const updateUserRole = async (id: string, role: 'user' | 'admin'): Promise<User> => {
  const { data } = await apiClient.patch<User>(`/admin/users/${id}/role`, { role });
  return data;
};
