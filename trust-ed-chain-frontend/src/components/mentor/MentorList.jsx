import { useStudentStore } from '../../store/student';

import { useState } from 'react';

export default function MentorList({ loans = [] }) {
  const mentorApproveLoan = useStudentStore((s) => s.mentorApproveLoan);
  const [processingId, setProcessingId] = useState(null);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
        await mentorApproveLoan(id);
    } catch (error) {
        console.error("Approval failed", error);
        alert("Failed to approve loan. Please try again.");
    } finally {
        setProcessingId(null);
    }
  };

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      {loans.length === 0 && <div className="text-sm text-gray-500">No pending loans.</div>}
      {loans.map((l) => (
        <div key={l._id} className="py-3 flex items-center justify-between">
          <div>
            <div className="font-medium">{l.purpose}</div>
            <div className="text-xs text-gray-500">{l._id} • Reg: {l.student?.registerNumber || '-'}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm">₹ {l.amount.toLocaleString()}</div>
            <button 
                className="btn-primary" 
                onClick={() => handleApprove(l._id)}
                disabled={processingId === l._id}
            >
                {processingId === l._id ? 'Approving...' : 'Approve'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
