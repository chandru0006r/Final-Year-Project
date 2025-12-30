import { create } from 'zustand';
import api from '../lib/apiClient';

export const useStudentStore = create((set, get) => ({
  student: null,
  students: [],
  loans: [],
  communities: [],
  investorRequests: [],
  studentRequests: [],
  loading: false,
  error: null,

  fetchStudent: async (studentId = 'stu-001') => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/student/${studentId}`);
      set({ student: res.data, loading: false });
    } catch (e) {
      set({ error: e?.response?.data?.message || e.message, loading: false });
    }
  },

  fetchStudents: async (mentorId) => {
    try {
      const res = await api.get(`/student${mentorId ? `?mentorId=${mentorId}` : ''}`);
      set({ students: res.data });
    } catch (e) { /* ignore */ }
  },

  adminAssignMentor: async (studentId, mentorId) => {
    const res = await api.post('/admin/assign-mentor', { studentId, mentorId });
    set({ students: get().students.map(s => s.id === studentId ? res.data : s) });
    if (get().student?.id === studentId) set({ student: res.data });
    return res.data;
  },

  mentorVerifyKYC: async (studentId, verified = true) => {
    const res = await api.post('/mentor/verify-kyc', { studentId, verified });
    set({ students: get().students.map(s => s.id === studentId ? res.data : s) });
    if (get().student?.id === studentId) set({ student: res.data });
    return res.data;
  },

  mentorAddRemark: async (studentId, text) => {
    const res = await api.post('/mentor/remark', { studentId, text });
    const updated = get().students.map(s => s.id === studentId ? { ...s, mentorRemarks: [...(s.mentorRemarks || []), res.data] } : s);
    set({ students: updated });
    return res.data;
  },

  fetchLoans: async () => {
    try {
      const res = await api.get('/loans');
      set({ loans: res.data });
    } catch (e) {
      // ignore for demo
    }
  },

  fetchLoan: async (loanId) => {
    const res = await api.get(`/loans/${loanId}`);
    const loans = get().loans;
    const updated = loans.some(l => l.id === loanId) ? loans.map(l => l.id === loanId ? res.data : l) : [res.data, ...loans];
    set({ loans: updated });
    return res.data;
  },

  fetchInvestorRequests: async (investorId) => {
    const res = await api.get(`/investor/requests?investorId=${investorId}`);
    set({ investorRequests: res.data });
    return res.data;
  },

  fetchStudentRequests: async (studentId) => {
    const res = await api.get(`/student/requests?studentId=${studentId}`);
    set({ studentRequests: res.data });
    return res.data;
  },

  requestViewDetails: async ({ loanId, investorId, investorName, investorEmail }) => {
    const res = await api.post('/investor/request-view', { loanId, investorId, investorName, investorEmail });
    set({ loans: get().loans.map(l => l.id === loanId ? res.data : l) });
    return res.data;
  },

  approveViewRequest: async ({ loanId, investorId }) => {
    const res = await api.post('/student/approve-view', { loanId, investorId });
    set({ loans: get().loans.map(l => l.id === loanId ? res.data : l) });
    set({ studentRequests: get().studentRequests.map(r => r.loanId === loanId && r.investorId === investorId ? { ...r, status: 'approved' } : r) });
    set({ investorRequests: get().investorRequests.map(r => r.loanId === loanId && r.investorId === investorId ? { ...r, status: 'approved' } : r) });
    return res.data;
  },

  fetchCommunities: async () => {
    try {
      const res = await api.get('/communities');
      set({ communities: res.data });
    } catch (e) {
      // ignore for demo
    }
  },

  withdrawSEF: async (amount) => {
    const { student } = get();
    const res = await api.post('/sef/withdraw', { studentId: student.id, amount });
    set({ student: { ...student, sefBalance: res.data.balance } });
    return res.data;
  },

  applyLoan: async (payload) => {
    const res = await api.post('/loans/apply', payload);
    set({ loans: [res.data, ...get().loans] });
    return res.data;
  },

  mentorApproveLoan: async (loanId) => {
    const res = await api.post('/loans/mentor-approve', { loanId });
    set({ loans: get().loans.map(l => l._id === loanId ? res.data : l) });
    return res.data;
  },

  adminApproveLoan: async (loanId) => {
    const res = await api.post('/loans/admin-approve', { loanId });
    set({ loans: get().loans.map(l => l._id === loanId ? res.data : l) });
    return res.data;
  },

  fundLoan: async (loanId) => {
    const res = await api.post('/loans/fund', { loanId });
    set({ loans: get().loans.map(l => l._id === loanId ? res.data : l) });
    return res.data;
  },

  createCommunity: async (payload) => {
    const res = await api.post('/communities/create', payload);
    set({ communities: [res.data, ...get().communities] });
    return res.data;
  },

  joinCommunity: async (communityId, studentId) => {
    const res = await api.post('/communities/join', { communityId, studentId });
    set({ communities: get().communities.map(c => c.id === communityId ? res.data : c) });
    return res.data;
  },

  addMemberToCommunity: async (communityId, memberId) => {
    const res = await api.post('/communities/add-member', { communityId, memberId });
    set({ communities: get().communities.map(c => c.id === communityId ? res.data : c) });
    return res.data;
  },

  leaveCommunity: async (communityId, studentId) => {
    const res = await api.post('/communities/leave', { communityId, studentId });
    set({ communities: get().communities.map(c => c.id === communityId ? res.data : c) });
    return res.data;
  },

  sendCommunityMessage: async (communityId, text, studentId) => {
    const res = await api.post('/communities/message', { communityId, text, studentId });
    set({ communities: get().communities.map(c => c.id === communityId ? { ...c, posts: [...c.posts, res.data] } : c) });
    return res.data;
  },

  adminUpdateSEF: async ({ studentId, sefBalance, sefWithdrawalLimit }) => {
    const res = await api.post('/admin/sef/update', { studentId, sefBalance, sefWithdrawalLimit });
    set({ students: get().students.map(s => s.id === studentId ? res.data : s) });
    if (get().student?.id === studentId) {
      set({ student: res.data });
    }
    return res.data;
  },

  createPoll: async (payload) => {
    const res = await api.post('/communities/poll', payload);
    set({ communities: get().communities.map(c => c.id === payload.communityId ? { ...c, posts: [res.data, ...c.posts] } : c) });
    return res.data;
  },
}));
