import apiClient from '../api-client';
import type { Device } from '@/types';

export const getDevices = async (): Promise<Device[]> => {
  const { data } = await apiClient.get<Device[]>('/devices');
  return data;
};

export const updateDeviceStatus = async (id: string, status: Partial<Device['status']>): Promise<Device> => {
  const { data } = await apiClient.patch<Device>(`/devices/${id}/status`, { status });
  return data;
};

// Admin routes
export const adminGetDevices = async (): Promise<Device[]> => {
  const { data } = await apiClient.get<Device[]>('/admin/devices');
  return data;
}

export const adminCreateDevice = async (deviceData: Omit<Device, '_id' | 'room'> & { room: string }): Promise<Device> => {
  const { data } = await apiClient.post<Device>('/admin/devices', deviceData);
  return data;
}

export const adminUpdateDevice = async (id: string, deviceData: Partial<Omit<Device, '_id'>>): Promise<Device> => {
  const { data } = await apiClient.put<Device>(`/admin/devices/${id}`, deviceData);
  return data;
}

export const adminDeleteDevice = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/devices/${id}`);
}
