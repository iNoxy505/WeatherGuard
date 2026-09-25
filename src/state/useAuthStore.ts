import { create } from 'zustand';
import { databaseService } from '../services/database/DatabaseService';

export type UserRole = 'resident' | 'tourist';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  homeZoneId: string;
  homeZoneName: string;
  avatarColor: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
}

function mapDbUserToProfile(dbUser: any): UserProfile {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: (dbUser.role || 'resident') as UserRole,
    homeZoneId: dbUser.home_zone_id || 'zone_village_a_ward_3',
    homeZoneName: dbUser.home_zone_name || 'Village A (Ward 3)',
    avatarColor: dbUser.avatar_color || '#00D4FF',
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  signUp: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      await databaseService.open();
      const result = await databaseService.signUp(name, email, password);
      if (!result) {
        set({ isLoading: false, error: 'An account with this email already exists.' });
        return false;
      }

      const dbUser = await databaseService.getUserById(result.userId);
      if (!dbUser) {
        set({ isLoading: false, error: 'Account created but could not load profile.' });
        return false;
      }

      set({
        user: mapDbUserToProfile(dbUser),
        token: result.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err?.message || 'Sign up failed.' });
      return false;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await databaseService.open();
      const result = await databaseService.login(email, password);
      if (!result) {
        set({ isLoading: false, error: 'Invalid email or password.' });
        return false;
      }

      const dbUser = await databaseService.getUserById(result.userId);
      if (!dbUser) {
        set({ isLoading: false, error: 'User profile not found.' });
        return false;
      }

      set({
        user: mapDbUserToProfile(dbUser),
        token: result.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err?.message || 'Login failed.' });
      return false;
    }
  },

  logout: async () => {
    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      await databaseService.logout(currentUser.id);
    }
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  loadSession: async () => {
    set({ isLoading: true });
    try {
      await databaseService.open();
      const session = await databaseService.getActiveSession();
      if (!session) {
        set({ isLoading: false });
        return;
      }

      const dbUser = await databaseService.getUserById(session.userId);
      if (!dbUser) {
        set({ isLoading: false });
        return;
      }

      set({
        user: mapDbUserToProfile(dbUser),
        token: session.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  updateProfile: async (updates) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    await databaseService.updateUser(currentUser.id, {
      name: updates.name,
      email: updates.email,
      home_zone_id: updates.homeZoneId,
      home_zone_name: updates.homeZoneName,
      avatar_color: updates.avatarColor,
    });

    set({
      user: { ...currentUser, ...updates },
    });
  },

  clearError: () => set({ error: null }),
}));