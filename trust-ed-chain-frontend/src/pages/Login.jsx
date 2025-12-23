import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

const ROLES = ['student', 'mentor', 'admin', 'investor'];

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('demo@student.edu');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = await login({ role, email, password });
      // Use the ACTUAL role from the backend response, not the dropdown state
      const userRole = userData.role;
      const redirect = userRole === 'mentor' ? '/mentor' : userRole === 'admin' ? '/college-admin' : userRole === 'investor' ? '/investor' : '/dashboard';
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 dark:bg-gray-950 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm card p-6">
        <h1 className="text-2xl font-semibold mb-4">Welcome to Trust-Ed-Chain</h1>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" type="email" className="input mb-3" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="label" htmlFor="password">Password</label>
        <input id="password" type="password" className="input mb-3" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label className="label" htmlFor="role">Role</label>
        <select id="role" className="input mb-6" value={role} onChange={(e) => setRole(e.target.value)}>
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded mb-3 border border-red-200">{error}</div>}
        <button className="btn-primary w-full" type="submit">Login</button>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Don't have an account?</p>
          <div className="flex justify-center gap-4 mt-1">
            <button type="button" onClick={() => navigate('/register-investor')} className="text-blue-600 hover:underline">
              Register as Investor
            </button>
            {/* Add other registration links later if needed */}
          </div>
        </div>
      </form>
    </div>
  );
}
