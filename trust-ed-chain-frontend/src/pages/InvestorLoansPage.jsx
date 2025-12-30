import { useEffect, useMemo, useState } from 'react';
import { useStudentStore } from '../store/student';
import { useAuthStore } from '../store/auth';
import InvestorLoanCard from '../components/investor/InvestorLoanCard.jsx';
import FundLoanModal from '../components/investor/FundLoanModal.jsx';
import ConnectWalletButton from '../components/web3/ConnectWalletButton.jsx';

export default function InvestorLoansPage() {
  const { loans, fetchLoans, requestViewDetails } = useStudentStore();
  const { user } = useAuthStore();
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [filters, setFilters] = useState({ college: 'all', minAmount: 0, maxAmount: 100000, minInterest: 0, maxInterest: 30, minTrust: 0, status: 'all' });

  useEffect(() => { fetchLoans(); }, [fetchLoans]);

  const colleges = useMemo(() => Array.from(new Set(loans.map(l => l.college).filter(Boolean))), [loans]);

  const filtered = useMemo(() => loans.filter(l => {
    if (filters.status !== 'all' && l.status !== filters.status) return false;
    if (filters.college !== 'all' && l.college !== filters.college) return false;
    if (l.amount < filters.minAmount || l.amount > filters.maxAmount) return false;
    if ((l.interestRate ?? 0) < filters.minInterest || (l.interestRate ?? 0) > filters.maxInterest) return false;
    if ((l.student?.trustScore ?? 0) < filters.minTrust) return false;
    return l.status !== 'repaid';
  }), [loans, filters]);

  const onRequest = (loanId) => requestViewDetails({ loanId, investorId: user?.id, investorName: user?.name, investorEmail: user?.email });

  return (
    <div className="container-responsive space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Investor Loan Opportunities</h1>
        <ConnectWalletButton />
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Filters</h3>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="label">College</label>
            <select className="input" value={filters.college} onChange={(e) => setFilters({ ...filters, college: e.target.value })}>
              <option value="all">All</option>
              {colleges.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Amount Min</label>
            <input type="number" className="input" value={filters.minAmount} onChange={(e) => setFilters({ ...filters, minAmount: Number(e.target.value) })} />
          </div>
          <div>
            <label className="label">Amount Max</label>
            <input type="number" className="input" value={filters.maxAmount} onChange={(e) => setFilters({ ...filters, maxAmount: Number(e.target.value) })} />
          </div>
          <div>
            <label className="label">Interest Min %</label>
            <input type="number" className="input" value={filters.minInterest} onChange={(e) => setFilters({ ...filters, minInterest: Number(e.target.value) })} />
          </div>
          <div>
            <label className="label">Interest Max %</label>
            <input type="number" className="input" value={filters.maxInterest} onChange={(e) => setFilters({ ...filters, maxInterest: Number(e.target.value) })} />
          </div>
          <div>
            <label className="label">Min Trust</label>
            <input type="number" className="input" value={filters.minTrust} onChange={(e) => setFilters({ ...filters, minTrust: Number(e.target.value) })} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((l) => (
          <InvestorLoanCard key={l.id} loan={l} onFund={() => setSelectedLoan(l)} onRequest={() => onRequest(l.id)} />
        ))}
      </div>

      <FundLoanModal loan={selectedLoan} open={!!selectedLoan} onClose={() => setSelectedLoan(null)} />
    </div>
  );
}
