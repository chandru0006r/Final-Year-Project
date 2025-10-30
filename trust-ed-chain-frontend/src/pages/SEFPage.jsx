import { useEffect, useState } from 'react';
import { useStudentStore } from '../store/student';
import WithdrawModal from '../components/sef/WithdrawModal.jsx';
import RepaymentTimeline from '../components/sef/RepaymentTimeline.jsx';

export default function SEFPage() {
  const { student, fetchStudent } = useStudentStore();
  const [open, setOpen] = useState(false);
  useEffect(() => { fetchStudent('stu-001'); }, [fetchStudent]);

  return (
    <div className="container-responsive space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Student Emergency Fund</h1>
        <button className="btn-primary" onClick={() => setOpen(true)}>Withdraw</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-sm text-gray-500">Balance</div>
          <div className="text-2xl font-semibold mt-1">₹ {student?.sefBalance?.toLocaleString() ?? '—'}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Semester Limit</div>
          <div className="text-2xl font-semibold mt-1">₹ {student?.sefWithdrawalLimit?.toLocaleString() ?? '—'}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">KYC Verified</div>
          <div className="text-2xl font-semibold mt-1">{student?.kycVerified ? 'Yes' : 'No'}</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Repayment Timeline</h3>
        <RepaymentTimeline repayments={student?.sefRepayments ?? []} />
      </div>

      <WithdrawModal open={open} onClose={() => setOpen(false)} limit={student?.sefWithdrawalLimit ?? 0} balance={student?.sefBalance ?? 0} />
    </div>
  );
}
