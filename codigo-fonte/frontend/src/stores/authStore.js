import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/authService';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      loginAttempts: 0,
      lastLoginAttempt: null,

      // Actions
      login: async credentials => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);
          const { user, token } = response;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            loginAttempts: 0,
            lastLoginAttempt: null,
          });

          return { success: true, user };
        } catch (error) {
          const attempts = get().loginAttempts + 1;
          set({
            isLoading: false,
            loginAttempts: attempts,
            lastLoginAttempt: Date.now(),
          });
          throw error;
        }
      },

      register: async userData => {
        set({ isLoading: true });
        try {
          await authService.register(userData);
          set({ isLoading: false });
          return { success: true, message: 'Registration successful' };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      forgotPassword: async email => {
        set({ isLoading: true });
        try {
          await authService.forgotPassword(email);
          set({ isLoading: false });
          return { success: true, message: 'Password reset email sent' };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // Optionally call logout endpoint to invalidate token on server
          await authService.logout(get().token);
        } catch (error) {
          // Log error but don't prevent logout
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            loginAttempts: 0,
            lastLoginAttempt: null,
          });
        }
      },

      // TODO: sem refresh token por enquanto
      // refreshToken: async () => {
      //   const { refreshToken: currentRefreshToken } = get();
      //   if (!currentRefreshToken) {
      //     throw new Error('No refresh token available');
      //   }

      //   try {
      //     const response = await authService.refreshToken(currentRefreshToken);
      //     const { token, refreshToken: newRefreshToken } = response;

      //     set({
      //       token,
      //       refreshToken: newRefreshToken,
      //     });

      //     return token;
      //   } catch (error) {
      //     // If refresh fails, logout user
      //     get().logout();
      //     throw error;
      //   }
      // },

      // Check if user is rate limited
      isRateLimited: () => {
        const { loginAttempts, lastLoginAttempt } = get();
        const now = Date.now();
        const timeSinceLastAttempt = now - (lastLoginAttempt || 0);
        const cooldownPeriod = 15 * 60 * 1000; // 15 minutes

        return (
          loginAttempts >= (import.meta.env.VITE_MAX_LOGIN_ATTEMPTS || 5) &&
          timeSinceLastAttempt < cooldownPeriod
        );
      },

      // Get remaining cooldown time
      getCooldownTime: () => {
        const { lastLoginAttempt } = get();
        if (!lastLoginAttempt) return 0;

        const now = Date.now();
        const timeSinceLastAttempt = now - lastLoginAttempt;
        const cooldownPeriod = 15 * 60 * 1000; // 15 minutes

        return Math.max(0, cooldownPeriod - timeSinceLastAttempt);
      },

      // Initialize auth state from stored token
      initialize: async () => {
        const { token } = get();
        if (token) {
          try {
            // Verify token is still valid
            const user = await authService.getCurrentUser(token);
            set({
              user,
              isAuthenticated: true,
            });
          } catch (error) {
            console.log(error);
            // Token is invalid, clear auth state
            get().logout();
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        loginAttempts: state.loginAttempts,
        lastLoginAttempt: state.lastLoginAttempt,
      }),
    },
  ),
);

export { useAuthStore };
