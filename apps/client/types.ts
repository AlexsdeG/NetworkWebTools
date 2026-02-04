export interface User {
  role: 'admin';
  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (password: string) => Promise<void>;
  logout: () => void;
}
