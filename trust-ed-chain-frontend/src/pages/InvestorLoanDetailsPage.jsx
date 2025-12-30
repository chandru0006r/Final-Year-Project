import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStudentStore } from '../store/student';
import { useAuthStore } from '../store/auth';

export default function InvestorLoanDetailsPage() {
  const { id } = useParams();
  const { loans, fetchLoan, requestViewDetails } = useStudentStore();
  const { user } = useAuthStore();

  const loan = loans.find(l => l.id === id);
  const req = (loan?.viewRequests || []).find(r => r.investorId === user?.id);
  const approved = req?.status === 'approved';

  useEffect(() => { if (!loan) fetchLoan(id); }, [loan, fetchLoan, id]);

  if (!loan) return <div className="container-responsive">Loading…</div>;

  if (!approved) {
    return (
      <div className="container-responsive space-y-6">
        <h1 className="text-2xl font-semibold">Loan Details</h1>
        <div className="card p-4">
          <div className="mb-2">Access to full details requires student approval.</div>
          <div className="flex items-center gap-2">
            <button className="btn-primary" onClick={() => requestViewDetails({ loanId: loan.id, investorId: user?.id, investorName: user?.name, investorEmail: user?.email })}>
              {req?.status === 'pending' ? 'Requested' : 'Request access'}
            </button>
            <Link className="btn-secondary" to="/investor">Back</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive space-y-6">
      <h1 className="text-2xl font-semibold">Loan Details</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="text-sm text-gray-500">Purpose</div>
          <div className="text-xl font-semibold">{loan.purpose}</div>
          <div className="mt-2 text-sm text-gray-500">College</div>
          <div className="font-medium">{loan.student?.institution?.name || 'Unknown'}</div>
          <div className="mt-2 text-sm text-gray-500">Loan ID</div>
          <div className="font-medium">{loan._id}</div>
          <div className="mt-2 text-sm text-gray-500">Amount</div>
          <div className="font-medium">₹ {loan.amount.toLocaleString()}</div>
          <div className="mt-2 text-sm text-gray-500">Interest</div>
          <div className="font-medium">{loan.interestRate}%</div>
          <div className="mt-2 text-sm text-gray-500">Trust Score</div>
          <div className="font-medium">{loan.student?.trustScore}%</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Documents</div>
          <ul className="list-disc pl-5">
            {(loan.documents || []).length === 0 && <li className="text-sm text-gray-500">No documents uploaded</li>}
            {loan.documents?.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
