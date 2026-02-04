import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './src/App';
import * as authApi from './src/api/auth';
import { storage } from './src/utils/storage';
import { toolsApi } from './src/api/tools';
import { toast } from 'sonner';

// Declare globals
declare const jest: any;
declare const describe: any;
declare const beforeEach: any;
declare const test: any;
declare const expect: any;

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => options?.count ? `Translated ${options.count}` : key,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

// Mock Sonner Toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Toaster: () => <div data-testid="toaster" />,
}));

// Mock Auth API
jest.mock('./src/api/auth', () => ({
  authApi: {
    login: jest.fn()
  }
}));

// Mock Tools API
jest.mock('./src/api/tools', () => ({
  toolsApi: {
    scanPorts: jest.fn(),
    getIpInfo: jest.fn(),
    testSmtp: jest.fn()
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

// Test Query Client
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('App Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderApp = () => {
    return render(
      <QueryClientProvider client={createTestQueryClient()}>
        <App />
      </QueryClientProvider>
    );
  };

  test('triggers success toast on successful scan', async () => {
    (storage.getToken as any).mockReturnValue('valid-token');
    (toolsApi.scanPorts as any).mockResolvedValue([{ port: 80, status: 'open' }]);

    renderApp();

    await waitFor(() => {
      expect(screen.getByText('dashboard.cards.scan.title')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('dashboard.cards.scan.title'));

    await waitFor(() => {
      expect(screen.getByText('scanner.presets.common')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('scanner.presets.common'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Translated 1'));
    });
  });

  test('triggers error toast on failed smtp test', async () => {
    (storage.getToken as any).mockReturnValue('valid-token');
    (toolsApi.testSmtp as any).mockRejectedValue(new Error('Timeout'));

    renderApp();

    await waitFor(() => {
      expect(screen.getByText('dashboard.cards.smtp.title')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('dashboard.cards.smtp.title'));

    await waitFor(() => {
      expect(screen.getByText('smtp.testBtn')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('smtp.testBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('smtp.toast.error'));
    });
  });
});