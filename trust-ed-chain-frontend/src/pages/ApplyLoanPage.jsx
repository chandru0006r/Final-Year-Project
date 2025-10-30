import LoanApplicationForm from '../components/investor/LoanApplicationForm.jsx';

export default function ApplyLoanPage() {
  return (
    <div className="container-responsive space-y-6">
      <h1 className="text-2xl font-semibold">Apply for Investor-backed Loan</h1>
      <LoanApplicationForm />
    </div>
  );
}
