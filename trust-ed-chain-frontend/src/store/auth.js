import { create } from 'zustand';
import { apiClient } from '../lib/apiClient';

export const useAuthStore = create((set, get) => ({
  user: null,
  role: null, // 'student' | 'mentor' | 'admin' | 'investor'
  isCheckingAuth: true, // Start true to block rendering until checked

  login: async ({ email, password, role }) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password, role });
      const user = response.data;

      localStorage.setItem('token', user.token);

      set({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        role: user.role,
        isAuthenticated: true,
        isCheckingAuth: false
      });

      return user;
    } catch (error) {
      console.error("Login Failed:", error);
      throw error;
    }
  },

  completeKYC: () => {
    const { user } = get();
    if (!user) return;
    set({ user: { ...user, kycVerified: true } });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null, role: null, isCheckingAuth: false });
      return;
    }

    try {
      // We assume apiClient automatically adds the Authorization header from localStorage if configured,
      // OR we might need to rely on the interceptor we saw earlier in apiClient.js
      const response = await apiClient.get('/auth/me');
      const user = response.data;

      set({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          kycVerified: user.kycStatus === 'VERIFIED' // Patching useful helper
        },
        role: user.role,
        isAuthenticated: true,
        isCheckingAuth: false
      });
    } catch (error) {
      console.error("Session Restore Failed:", error);
      localStorage.removeItem('token');
      set({ isAuthenticated: false, user: null, role: null, isCheckingAuth: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, role: null, isAuthenticated: false });
  },
}));
