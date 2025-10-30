import { useAuthStore } from '../../store/auth';
import ThemeToggle from './ThemeToggle';
import { Link } from 'react-router-dom';

export default function Topbar() {
  const { user, role, logout } = useAuthStore();
  return (
    <header className="sticky top-0 z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="container-responsive flex items-center h-16">
        <div className="md:hidden">
          <Link to="/dashboard" className="font-semibold">Trust-Ed-Chain</Link>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden sm:block text-sm text-gray-600 dark:text-gray-300">{role?.toUpperCase()}</div>
          <div className="flex items-center gap-2">
            <div className="text-sm">{user?.name}</div>
            <button onClick={logout} className="btn-secondary text-sm">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
}
