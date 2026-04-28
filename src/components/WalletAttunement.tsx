import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { motion } from 'motion/react';
import { Crown, Power } from 'lucide-react';

export default function WalletAttunement() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();
  const { data: ensName } = useEnsName({ address });

  const shortenAddress = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <div className="bg-black/60 border border-purple-500/30 rounded-full px-4 py-1.5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-purple-100 font-mono text-sm tracking-tighter">
            {ensName ?? shortenAddress(address)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="p-2 rounded-full bg-red-900/20 border border-red-500/30 text-red-400 hover:bg-red-900/40 transition-all cursor-pointer"
          title="Sever Attunement"
        >
          <Power size={18} />
        </button>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' }}
      whileTap={{ scale: 0.95 }}
      onClick={() => connect({ connector: injected() })}
      className="alchemical-btn flex items-center gap-2 bg-gradient-to-r from-purple-900 to-indigo-900 border border-yellow-600/50 px-6 py-2 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20 cursor-pointer"
    >
      <Crown size={18} className="text-yellow-400" />
      Attune Soul
    </motion.button>
  );
}
