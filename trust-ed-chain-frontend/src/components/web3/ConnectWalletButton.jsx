import { useWallet } from '../../hooks/useWallet';

export default function ConnectWalletButton() {
  const { address, connecting, connect, disconnect } = useWallet();
  if (address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{address.slice(0,6)}…{address.slice(-4)}</span>
        <button onClick={disconnect} className="btn-secondary text-sm">Disconnect</button>
      </div>
    );
  }
  return (
    <button onClick={connect} className="btn-primary" disabled={connecting}>
      {connecting ? 'Connecting…' : 'Connect Wallet'}
    </button>
  );
}
