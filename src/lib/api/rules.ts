import apiClient from '../api-client';
import type { AutomationRule } from '@/types';

type RuleData = Omit<AutomationRule, '_id'>;

export const getRules = async (): Promise<AutomationRule[]> => {
  const { data } = await apiClient.get<AutomationRule[]>('/rules');
  return data;
};

export const createRule = async (ruleData: RuleData): Promise<AutomationRule> => {
  const { data } = await apiClient.post<AutomationRule>('/rules', ruleData);
  return data;
};

export const updateRule = async (id: string, ruleData: Partial<RuleData>): Promise<AutomationRule> => {
  const { data } = await apiClient.put<AutomationRule>(`/rules/${id}`, ruleData);
  return data;
};

export const deleteRule = async (id: string): Promise<void> => {
  await apiClient.delete(`/rules/${id}`);
};
