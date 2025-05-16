import type { User } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionData {
  user: User;
  token: string;
}

export interface SessionState {
  session: SessionData | null;
  setSession: (session: SessionData | null) => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
    }),
    {
      name: 'session-storage', 
      partialize: (state) => ({ session: state.session }), 
    }
  )
);
