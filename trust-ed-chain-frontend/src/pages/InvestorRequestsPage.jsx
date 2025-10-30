import { useEffect } from 'react';
import { useStudentStore } from '../store/student';
import { useAuthStore } from '../store/auth';

export default function InvestorRequestsPage() {
  const { user } = useAuthStore();
  const { investorRequests, fetchInvestorRequests } = useStudentStore();

  useEffect(() => { if (user?.id) fetchInvestorRequests(user.id); }, [user?.id, fetchInvestorRequests]);

  return (
    <div className="container-responsive space-y-6">
      <h1 className="text-2xl font-semibold">My View Requests</h1>
      <div className="card p-4">
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {investorRequests.length === 0 && <div className="text-sm text-gray-500">No requests yet.</div>}
          {investorRequests.map((r) => (
            <div key={`${r.loanId}-${r.investorId}`} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{r.purpose}</div>
                <div className="text-xs text-gray-500">{r.college} • {r.loanId}</div>
              </div>
              <div className="text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">{r.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
