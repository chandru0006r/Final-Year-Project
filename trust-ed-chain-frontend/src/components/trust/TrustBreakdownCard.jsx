export default function TrustBreakdownCard({ breakdown = {} }) {
  const entries = [
    { key: 'academics', label: 'Academics' },
    { key: 'repayments', label: 'Repayments' },
    { key: 'mentorRating', label: 'Mentor Rating' },
  ];
  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-3">Trust Breakdown</h3>
      <div className="space-y-3">
        {entries.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <div>{label}</div>
            <div className="w-40 h-2 bg-gray-200 dark:bg-gray-800 rounded">
              <div className="h-2 rounded bg-primary-600" style={{ width: `${breakdown[key] ?? 0}%` }} />
            </div>
            <div className="w-10 text-right text-sm">{breakdown[key] ?? 0}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
