export const storage = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem('token');
    } catch (e) {
      console.warn('LocalStorage access denied or restricted', e);
      return null;
    }
  },
  setToken: (token: string): void => {
    try {
      localStorage.setItem('token', token);
    } catch (e) {
      console.warn('LocalStorage access denied or restricted', e);
    }
  },
  removeToken: (): void => {
    try {
      localStorage.removeItem('token');
    } catch (e) {
      console.warn('LocalStorage access denied or restricted', e);
    }
  }
};