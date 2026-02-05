import { apiClient } from './client';

// Interface for API responses
interface LoginResponse {
  token: string;
}

interface VerifyResponse {
  status: string;
  user: { role: string };
}

export const authApi = {
  /**
   * Authenticate with password and receive JWT token.
   */
  login: async (password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', { password });
    return response.data;
  },

  /**
   * Verify if the current stored token is still valid.
   */
  verify: async (): Promise<VerifyResponse> => {
    const response = await apiClient.get<VerifyResponse>('/auth/verify');
    return response.data;
  }
};