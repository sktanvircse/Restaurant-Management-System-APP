import { create } from 'zustand';
import { storageSave, storageRemove } from './storage';

export type AuthState = {
  email: string;
  password: string;
  isAuthenticated: boolean;
};

type AuthStore = AuthState & {
  hydrate: (state: AuthState) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const KEY_AUTH = '@@rm/auth';

export const useAuthStore = create<AuthStore>((set, get) => ({
  email: '',
  password: '',
  isAuthenticated: false,

  hydrate: (state) => {
    set({
      email: state.email,
      password: state.password,
      isAuthenticated: state.isAuthenticated
    });
  },

  login: async (email: string, password: string) => {
    try {
      if (password.length < 4 || password.length > 6) return false;
      
      const newState = {
        email,
        password,
        isAuthenticated: true
      };

      set(newState);
      await storageSave(KEY_AUTH, newState);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  },

  logout: async () => {
    try {
      set({
        email: '',
        password: '',
        isAuthenticated: false
      });
      await storageRemove(KEY_AUTH);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },
}));