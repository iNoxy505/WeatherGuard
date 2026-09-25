import { create } from 'zustand';
import { databaseService } from '../services/database/DatabaseService';

interface ThemeStoreState {
  isDark: boolean;
  toggleTheme: () => void;
  loadTheme: (userId: string) => Promise<void>;
}

export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  isDark: true,

  toggleTheme: () => {
    const next = !get().isDark;
    set({ isDark: next });
  },

  loadTheme: async (userId: string) => {
    try {
      const settings = await databaseService.getSettings(userId);
      if (settings) {
        set({ isDark: settings.dark_mode === 1 });
      }
    } catch {
      // Keep default dark mode
    }
  },
}));
