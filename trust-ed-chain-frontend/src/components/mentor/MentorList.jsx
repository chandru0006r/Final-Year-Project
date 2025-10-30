import { useStudentStore } from '../../store/student';

export default function MentorList({ loans = [] }) {
  const mentorApproveLoan = useStudentStore((s) => s.mentorApproveLoan);

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      {loans.length === 0 && <div className="text-sm text-gray-500">No pending loans.</div>}
      {loans.map((l) => (
        <div key={l.id} className="py-3 flex items-center justify-between">
          <div>
            <div className="font-medium">{l.purpose}</div>
            <div className="text-xs text-gray-500">{l.id}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm">₹ {l.amount.toLocaleString()}</div>
            <button className="btn-primary" onClick={() => mentorApproveLoan(l.id)}>Approve</button>
          </div>
        </div>
      ))}
    </div>
  );
}
