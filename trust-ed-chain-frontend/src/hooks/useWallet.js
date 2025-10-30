import { useState } from 'react';

function randomAddress() {
  const hex = [...crypto.getRandomValues(new Uint8Array(20))].map(b => b.toString(16).padStart(2, '0')).join('');
  return `0x${hex}`;
}

export function useWallet() {
  const [address, setAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const connect = async () => {
    setConnecting(true);
    try {
      // Mock connection delay
      await new Promise((r) => setTimeout(r, 500));
      setAddress(randomAddress());
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => setAddress(null);

  return { address, connecting, connect, disconnect };
}
