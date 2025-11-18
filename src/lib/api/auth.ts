import apiClient from '../api-client';
import { z } from 'zod';
import { User } from '@/types';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;

type AuthResponse = {
  token: string;
  user: User;
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', credentials);
  return data;
};
