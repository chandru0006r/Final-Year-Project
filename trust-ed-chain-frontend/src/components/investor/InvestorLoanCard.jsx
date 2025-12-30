import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

export default function InvestorLoanCard({ loan, onFund, onRequest }) {
  const { user } = useAuthStore();
  const req = (loan.viewRequests || []).find(r => r.investorId === user?.id);
  const approved = req?.status === 'approved';
  const pending = req?.status === 'pending';

  return (
    <div className="card p-4">
      <div className="font-semibold">{loan.purpose}</div>
      <div className="text-sm text-gray-500">{loan.student?.institution?.name || 'Unknown'} • {loan._id}</div>
      <div className="mt-2 text-lg font-semibold">₹ {loan.amount.toLocaleString()}</div>
      <div className="mt-1 text-sm">Interest: {loan.interestRate}%</div>
      <div className="mt-1 text-sm">Trust: {loan.student?.trustScore}%</div>
      <div className="mt-2 text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 inline-block">{loan.status}</div>
      <div className="mt-4 flex items-center gap-2">
        <button className="btn-primary" onClick={onFund} disabled={loan.status === 'funded'}>
          {loan.status === 'funded' ? 'Funded' : 'Fund Loan'}
        </button>
        {approved ? (
          <Link className="btn-secondary" to={`/investor/loan/${loan._id}`}>View details</Link>
        ) : pending ? (
          <button className="btn-secondary" disabled>Requested</button>
        ) : (
          <button className="btn-secondary" onClick={onRequest}>Request details</button>
        )}
      </div>
    </div>
  );
}
