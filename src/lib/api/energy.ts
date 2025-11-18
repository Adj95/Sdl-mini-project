import apiClient from '../api-client';
import type { EnergyData } from '@/types';

export const getEnergyData = async (): Promise<EnergyData> => {
    const { data } = await apiClient.get<EnergyData>('/energy');
    return data;
};
