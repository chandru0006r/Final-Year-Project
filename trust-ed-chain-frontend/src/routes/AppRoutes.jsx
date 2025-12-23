import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import RegisterInvestor from '../pages/RegisterInvestor.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import SEFPage from '../pages/SEFPage.jsx';
import CommunityFundPage from '../pages/CommunityFundPage.jsx';
import CommunityChatPage from '../pages/CommunityChatPage.jsx';
import ApplyLoanPage from '../pages/ApplyLoanPage.jsx';
import InvestorLoansPage from '../pages/InvestorLoansPage.jsx';
import InvestorRequestsPage from '../pages/InvestorRequestsPage.jsx';
import InvestorLoanDetailsPage from '../pages/InvestorLoanDetailsPage.jsx';
import MentorDashboard from '../pages/MentorDashboard.jsx';
// Replaced CollegeAdminPanel with InstitutionDashboard
import InstitutionDashboard from '../pages/InstitutionDashboard.jsx';
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
  const { isAuthenticated, user, role } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const isInvestor = role === 'investor';
  const isKycVerified = user?.kycVerified === true || user?.kycStatus === 'VERIFIED';

  if (isInvestor && !isKycVerified && location.pathname !== '/profile') {
    return <Navigate to="/profile" replace />;
  }

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

const RoleGuard = ({ allowedRoles, children }) => {
  const { user, role } = useAuthStore();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={roleHome(role)} replace />;
  }

  return children ? children : <Outlet />;
};

export default function AppRoutes() {
  const { isAuthenticated, role } = useAuthStore();
  const home = roleHome(role);
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to={home} replace /> : <Login />} />
      <Route path="/register-investor" element={<RegisterInvestor />} />

      <Route element={<ProtectedLayout />}>
        {/* Shared Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/community" element={<CommunityFundPage />} />
        <Route path="/community/:id" element={<CommunityChatPage />} />

        {/* Student Routes */}
        <Route element={<RoleGuard allowedRoles={['student']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sef" element={<SEFPage />} />
          <Route path="/apply-loan" element={<ApplyLoanPage />} />
        </Route>

        {/* Investor Routes */}
        <Route element={<RoleGuard allowedRoles={['investor']} />}>
          <Route path="/investor" element={<InvestorLoansPage />} />
          <Route path="/investor/requests" element={<InvestorRequestsPage />} />
          <Route path="/investor/loan/:id" element={<InvestorLoanDetailsPage />} />
        </Route>

        {/* Mentor Routes */}
        <Route element={<RoleGuard allowedRoles={['mentor']} />}>
          <Route path="/mentor" element={<MentorDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<RoleGuard allowedRoles={['admin']} />}>
          <Route path="/college-admin" element={<Navigate to="/college-admin/network" replace />} />
          <Route path="/college-admin/network" element={<InstitutionDashboard defaultTab="mentors" />} />
          <Route path="/college-admin/approvals" element={<InstitutionDashboard defaultTab="loans" />} />
        </Route>

        {/* Fallback for root path inside protected layout */}
        <Route path="/" element={<Navigate to={home} replace />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? home : '/login'} replace />} />
    </Routes>
  );
}
