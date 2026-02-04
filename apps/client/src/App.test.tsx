import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import * as authApi from './src/api/auth';
import { storage } from './src/utils/storage';

// Declare globals to resolve TypeScript errors when @types/jest is missing
declare const jest: any;
declare const describe: any;
declare const beforeEach: any;
declare const test: any;
declare const expect: any;

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

// Mock Auth API
jest.mock('./src/api/auth', () => ({
  authApi: {
    login: jest.fn()
  }
}));

// Mock Storage
jest.mock('./src/utils/storage', () => ({
  storage: {
    getToken: jest.fn(),
    setToken: jest.fn(),
    removeToken: jest.fn()
  }
}));

describe('App Integration', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  test('redirects to login when not authenticated', async () => {
    // storage.getToken returns null
    (storage.getToken as any).mockReturnValue(null);
    
    render(<App />);
    
    await waitFor(() => {
       // Check for login button
      const loginButton = screen.getByText('auth.loginButton');
      expect(loginButton).toBeInTheDocument();
    });
  });

  test('allows login with correct credentials', async () => {
    (storage.getToken as any).mockReturnValue(null);
    (authApi.authApi.login as any).mockResolvedValue({ token: 'test-token' });

    render(<App />);
    
    const passwordInput = screen.getByLabelText('auth.passwordLabel');
    fireEvent.change(passwordInput, { target: { value: 'admin' } });
    
    const loginButton = screen.getByText('auth.loginButton');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(authApi.authApi.login).toHaveBeenCalledWith('admin');
      expect(storage.setToken).toHaveBeenCalledWith('test-token');
      // Navigation happens after state update
      expect(screen.getByText('dashboard.welcome')).toBeInTheDocument();
    });
  });

  test('shows error on invalid credentials', async () => {
    (storage.getToken as any).mockReturnValue(null);
    (authApi.authApi.login as any).mockRejectedValue(new Error('Invalid credentials'));

    render(<App />);
    
    const passwordInput = screen.getByLabelText('auth.passwordLabel');
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    
    const loginButton = screen.getByText('auth.loginButton');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('auth.error')).toBeInTheDocument();
    });
  });
});