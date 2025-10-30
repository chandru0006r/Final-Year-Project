export default function RepaymentTimeline({ repayments = [] }) {
  if (!repayments.length) return <div className="text-sm text-gray-500">No repayments yet.</div>;
  return (
    <ol className="relative border-s border-gray-200 dark:border-gray-800">
      {repayments.map((r) => (
        <li key={`${r.date}-${r.amount}`} className="mb-6 ms-4">
          <div className="absolute w-3 h-3 bg-primary-600 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900" />
          <time className="mb-1 text-sm text-gray-500">{new Date(r.date).toLocaleDateString()}</time>
          <div className="text-base font-medium">Paid ₹ {r.amount.toLocaleString()}</div>
        </li>
      ))}
    </ol>
  );
}
