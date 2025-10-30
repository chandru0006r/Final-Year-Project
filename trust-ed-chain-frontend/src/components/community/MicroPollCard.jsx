export default function MicroPollCard({ poll }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
      <div className="font-medium">{poll.title}</div>
      <div className="text-xs text-gray-500">Amount: ₹ {poll.amount}</div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        <span className="px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">For: {poll.votesFor}</span>
        <span className="px-2 py-1 rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Against: {poll.votesAgainst}</span>
        <span className="ml-auto px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">{poll.status}</span>
      </div>
    </div>
  );
}
