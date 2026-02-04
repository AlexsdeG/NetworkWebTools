import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';
import { storage } from '../utils/storage';
import { authApi } from '../api/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedToken = storage.getToken();
      if (storedToken) {
        // In a real app, we might verify this token with the backend here
        setUser({ role: 'admin', token: storedToken });
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (password: string) => {
    try {
      const response = await authApi.login(password);
      storage.setToken(response.token);
      setUser({ role: 'admin', token: response.token });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    storage.removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};