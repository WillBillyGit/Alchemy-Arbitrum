import { useState, useMemo } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { motion } from 'motion/react';
import { Sparkles, FlaskConical, ArrowDown } from 'lucide-react';
import { PURIFIER_ABI, ERC20_ABI } from '../constants/abis';
import { CONTRACT_ADDRESSES } from '../constants/addresses';
import { RitualMessage } from './RitualLog';

interface AethericPurifierProps {
  onLog: (msg: RitualMessage) => void;
}

export default function AethericPurifier({ onLog }: AethericPurifierProps) {
  const { address } = useAccount();
  const [reagentAddress, setReagentAddress] = useState('');
  const [amount, setAmount] = useState('');
  
  const { writeContractAsync: writePurifier } = useWriteContract();
  const { writeContractAsync: writeERC20 } = useWriteContract();

  // Read Token Info
  const { data: decimals } = useReadContract({
    address: reagentAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: { enabled: /^0x[a-fA-F0-9]{40}$/.test(reagentAddress) }
  });

  const { data: symbol } = useReadContract({
    address: reagentAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: { enabled: /^0x[a-fA-F0-9]{40}$/.test(reagentAddress) }
  });

  const [isPending, setIsPending] = useState(false);

  const handleDistill = async () => {
    if (!address || !reagentAddress || !amount || !decimals) return;
    
    setIsPending(true);
    const parsedAmount = parseUnits(amount, decimals as number);
    const logId = Math.random().toString(36).slice(2);

    try {
      onLog({ id: logId + '-start', text: 'The initiate must give blood-oath to the circle...', type: 'info' });
      
      // 1. Approve
      onLog({ id: logId + '-approve', text: `Sanctifying Reagents (${symbol})...`, type: 'info' });
      const approveTx = await writeERC20({
        address: reagentAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.PURIFIER, parsedAmount],
      });
      onLog({ id: logId + '-approve-sent', text: 'Seal requested from the ledger...', type: 'warning' });
      
      // 2. Transmute
      onLog({ id: logId + '-purify', text: 'Igniting the Transmutation Circle...', type: 'info' });
      const purifyTx = await writePurifier({
        address: CONTRACT_ADDRESSES.PURIFIER,
        abi: PURIFIER_ABI,
        functionName: 'purifyReagent',
        args: [
          parsedAmount,
          0n, // Min Essence (Slippage handling)
          [reagentAddress as `0x${string}`, CONTRACT_ADDRESSES.WETH],
          BigInt(Math.floor(Date.now() / 1000) + 3600), // Expiry
        ],
      });

      onLog({ id: logId + '-confirming', text: 'Distilling Reagents into Pure Essence...', type: 'warning' });
      onLog({ id: logId + '-success', text: 'Alchemy Complete! The Essence has manifested.', type: 'success' });
      
    } catch (error: any) {
      console.error(error);
      onLog({ id: logId + '-error', text: `Ritual Interrupted: ${error.shortMessage || 'The circle has fractured.'}`, type: 'error' });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="stone-panel ritual-glow flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-[#d4af38] uppercase tracking-wider font-serif">Aetheric Purifier</h2>
        <span className="text-[10px] text-gray-500 font-mono">{CONTRACT_ADDRESSES.PURIFIER.slice(0, 6)}...{CONTRACT_ADDRESSES.PURIFIER.slice(-4)}</span>
      </div>

      <div className="space-y-6 flex-grow">
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-gray-400 mb-2">Reagent Coordinates (ERC20)</label>
          <input
            type="text"
            value={reagentAddress}
            onChange={(e) => setReagentAddress(e.target.value)}
            placeholder="0x..."
            className="w-full bg-black/40 border gold-border p-3 rounded font-mono text-sm text-white focus:outline-none focus:border-[#6d28d9] transition-all placeholder:text-gray-800"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-widest text-gray-400 mb-2">Offering Amount</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-black/40 border gold-border p-3 rounded font-mono text-sm text-white focus:outline-none transition-all placeholder:text-gray-800"
            />
            <span className="absolute right-3 top-3 text-[10px] text-[#d4af37] font-bold uppercase">{symbol || 'REAGENT'}</span>
          </div>
        </div>

        <div className="pt-4">
           <label className="block text-[11px] uppercase tracking-widest text-gray-400 mb-2">Estimated Yield</label>
           <div className="bg-black/30 border gold-border border-dashed p-4 rounded text-center text-sm font-mono text-[#a78bfa]">
             {isPending ? 'Distilling Essence...' : 'Awaiting planetary alignment...'}
           </div>
        </div>
      </div>

      <button
        disabled={isPending || !address}
        onClick={handleDistill}
        className="alchemical-btn w-full mt-8 py-4 text-lg"
      >
        {isPending ? 'Distilling...' : 'Begin Distillation'}
      </button>
    </div>
  );
}
