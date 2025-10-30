import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App.jsx';
import { useAuthStore } from '../store/auth.js';
import TrustScoreChart from '../components/trust/TrustScoreChart.jsx';
import WithdrawModal from '../components/sef/WithdrawModal.jsx';

function renderApp() {
  return render(<App />);
}

describe('Trust-Ed-Chain UI', () => {
  beforeEach(() => {
    // Reset auth store
    useAuthStore.setState({ user: null, role: null, isAuthenticated: false });
  });

  it('renders login and navigates after mock login', () => {
    renderApp();
    expect(screen.getByText(/Welcome to Trust-Ed-Chain/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'demo@student.edu' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'student' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    // Dashboard heading should appear
    expect(screen.getByRole('heading', { name: /Dashboard/i })).toBeInTheDocument();
  });

  it('renders trust score chart', () => {
    render(<TrustScoreChart score={72} />);
    expect(screen.getByText('72%')).toBeInTheDocument();
  });

  it('validates withdraw amount against limit', async () => {
    render(<WithdrawModal open={true} onClose={() => {}} limit={1000} balance={5000} />);
    fireEvent.change(screen.getByPlaceholderText(/e.g., 500/i), { target: { value: '1500' } });
    fireEvent.click(screen.getByRole('button', { name: /Withdraw/i }));
    expect(await screen.findByText(/Max ₹1000/)).toBeInTheDocument();
  });
});
