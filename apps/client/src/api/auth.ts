import { apiClient } from './client';

// Interface for API response
interface LoginResponse {
  token: string;
}

export const authApi = {
  login: async (password: string): Promise<LoginResponse> => {
    // Phase 0/1: Mock implementation until backend is ready
    // In strict Phase 3+, this would be: return apiClient.post('/auth/login', { password });
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password === 'admin') {
          resolve({ token: 'mock-jwt-token-123-secure' });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  }
};