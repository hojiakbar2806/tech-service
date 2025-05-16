import type { User } from '@/types/user';
import {create} from 'zustand';

export interface SessionState {
    user: User | null;
    token: string | null;
    setToken: (token: string|null) => void;
    setUser: (user: User|null) => void;
    clearSession: () => void;
}


export const useSession = create<SessionState>((set) => ({
  user: null,
  token: null,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  clearSession: () => set({ user: null, token: null }),
}));
