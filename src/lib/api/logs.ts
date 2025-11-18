import apiClient from '../api-client';
import type { ActivityLog } from '@/types';

export const getLogs = async (): Promise<ActivityLog[]> => {
  const { data } = await apiClient.get<ActivityLog[]>('/logs');
  return data;
};
