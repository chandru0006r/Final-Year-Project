import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  user: null,
  role: null, // 'student' | 'mentor' | 'admin' | 'investor'
  isAuthenticated: false,

  login: async ({ role = 'student', email, password, name }) => {
    // Mock auth: require email, password, and role
    if (!email || !password || !role) {
      throw new Error('Email, password, and role are required');
    }
    const derivedName = name || email.split('@')[0];
    const defaultIds = { student: 'stu-001', mentor: 'men-101', admin: 'adm-001', investor: 'inv-001' };
    const id = defaultIds[role] || 'demo-000';
    const user = {
      id,
      name: derivedName,
      email,
      role,
      college: role === 'student' ? 'ABC College' : role === 'investor' ? 'Global Investor Network' : 'Trust-Ed University',
      kycVerified: role === 'investor' ? false : undefined,
    };
    set({ user, role, isAuthenticated: true });
    return user;
  },

  completeKYC: () => {
    const { user } = get();
    if (!user) return;
    set({ user: { ...user, kycVerified: true } });
  },

  logout: () => set({ user: null, role: null, isAuthenticated: false }),
}));
