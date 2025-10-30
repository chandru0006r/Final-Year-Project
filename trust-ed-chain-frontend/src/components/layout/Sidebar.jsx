import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

const ROLE_NAV = {
  student: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/sef', label: 'SEF' },
    { to: '/community', label: 'Community Fund' },
    { to: '/apply-loan', label: 'Apply for Investor-backed Loan' },
    { to: '/profile', label: 'Profile' },
  ],
  mentor: [
    { to: '/mentor', label: 'Mentor' },
    { to: '/profile', label: 'Profile' },
  ],
  admin: [
    { to: '/college-admin', label: 'College Admin' },
    { to: '/profile', label: 'Profile' },
  ],
  investor: [
    { to: '/investor', label: 'Investor' },
    { to: '/investor/requests', label: 'View Requests' },
    { to: '/profile', label: 'Profile' },
  ],
};

export default function Sidebar() {
  const role = useAuthStore((s) => s.role) || 'student';
  const items = ROLE_NAV[role] || ROLE_NAV.student;
  return (
    <aside className="hidden md:flex md:flex-col w-64 p-4 gap-2 border-r border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
      <div className="text-xl font-semibold mb-2">Trust-Ed-Chain</div>
      <nav className="flex-1 space-y-1">
        {items.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="text-xs text-gray-500">v0.1.0</div>
    </aside>
  );
}
