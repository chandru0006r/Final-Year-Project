import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import SEFPage from '../pages/SEFPage.jsx';
import CommunityFundPage from '../pages/CommunityFundPage.jsx';
import CommunityChatPage from '../pages/CommunityChatPage.jsx';
import ApplyLoanPage from '../pages/ApplyLoanPage.jsx';
import InvestorLoansPage from '../pages/InvestorLoansPage.jsx';
import InvestorRequestsPage from '../pages/InvestorRequestsPage.jsx';
import InvestorLoanDetailsPage from '../pages/InvestorLoanDetailsPage.jsx';
import MentorDashboard from '../pages/MentorDashboard.jsx';
import CollegeAdminPanel from '../pages/CollegeAdminPanel.jsx';
import Profile from '../pages/Profile.jsx';
import { useAuthStore } from '../store/auth.js';
import Sidebar from '../components/layout/Sidebar.jsx';
import Topbar from '../components/layout/Topbar.jsx';

function roleHome(role) {
  if (role === 'mentor') return '/mentor';
  if (role === 'admin') return '/college-admin';
  if (role === 'investor') return '/investor';
  return '/dashboard';
}

function ProtectedLayout() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  const { isAuthenticated, role } = useAuthStore();
  const home = roleHome(role);
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to={home} replace /> : <Login />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Navigate to={home} replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sef" element={<SEFPage />} />
        <Route path="/community" element={<CommunityFundPage />} />
        <Route path="/community/:id" element={<CommunityChatPage />} />
        <Route path="/apply-loan" element={<ApplyLoanPage />} />
        <Route path="/investor" element={<InvestorLoansPage />} />
        <Route path="/investor/requests" element={<InvestorRequestsPage />} />
        <Route path="/investor/loan/:id" element={<InvestorLoanDetailsPage />} />
        <Route path="/mentor" element={<MentorDashboard />} />
        <Route path="/college-admin" element={<CollegeAdminPanel />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? home : '/login'} replace />} />
    </Routes>
  );
}
