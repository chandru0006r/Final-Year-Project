import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';

export default function RegisterInvestor() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        companyName: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Register User (Role = Investor)
            await apiClient.post('/auth/register', {
                ...formData,
                role: 'investor',
            });

            // Auto-login or redirect to login (Redirecting is safer for demo flow)
            navigate('/login');
            alert('Registration successful! Please login.');

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid place-items-center bg-gray-50 dark:bg-gray-950 p-4">
            <form onSubmit={onSubmit} className="w-full max-w-sm card p-6">
                <h1 className="text-2xl font-semibold mb-2">Investor Registration</h1>
                <p className="text-sm text-gray-500 mb-6">Join trusting students & mentors.</p>

                <label className="label">Name</label>
                <input
                    type="text"
                    className="input mb-3"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                />

                <label className="label">Email</label>
                <input
                    type="email"
                    className="input mb-3"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                />

                <label className="label">Company / Organization</label>
                <input
                    type="text"
                    className="input mb-3"
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. VC Partners"
                />

                <label className="label">Password</label>
                <input
                    type="password"
                    className="input mb-6"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    required
                />

                {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded mb-3 border border-red-200">{error}</div>}

                <button className="btn-primary w-full" type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Register'}
                </button>

                <div className="mt-4 text-center">
                    <button type="button" onClick={() => navigate('/login')} className="text-sm text-gray-600 hover:underline">
                        Back to Login
                    </button>
                </div>
            </form>
        </div>
    );
}
