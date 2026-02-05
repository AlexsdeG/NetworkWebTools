import axios from 'axios';
import { storage } from '../utils/storage';

const API_URL = (import.meta as any).env?.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject Token
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        storage.removeToken();
        // Simple redirect for HashRouter
        window.location.hash = '#/login';
      } else if (error.response.status === 429) {
        // Handle Rate Limiting
        const headers = error.response.headers;
        let resetTime = Date.now() + 60000; // Default 1 minute fallback

        // Try standard RateLimit-Reset (seconds)
        const resetSeconds = headers['ratelimit-reset'] || headers['x-ratelimit-reset'];
        
        // Try Retry-After (seconds or date)
        const retryAfter = headers['retry-after'];

        if (resetSeconds) {
          resetTime = Date.now() + (parseInt(resetSeconds, 10) * 1000);
        } else if (retryAfter) {
           const retrySeconds = parseInt(retryAfter, 10);
           if (!isNaN(retrySeconds)) {
             resetTime = Date.now() + (retrySeconds * 1000);
           } else {
             // Try parsing as date
             const retryDate = new Date(retryAfter).getTime();
             if (!isNaN(retryDate)) {
               resetTime = retryDate;
             }
           }
        }

        window.dispatchEvent(new CustomEvent('api-rate-limit', { 
          detail: { resetTime } 
        }));
      }
    }
    return Promise.reject(error);
  }
);