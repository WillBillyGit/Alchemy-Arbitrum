import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi'; 
import { parseEther, formatEther, formatUnits } from 'viem';
import { motion } from 'motion/react';
import { ShieldCheck, Database, Droplets, Zap } from 'lucide-react';
import { VAULT_ABI } from '../constants/abis';
import { CONTRACT_ADDRESSES } from '../constants/addresses';
import { RitualMessage } from './RitualLog';

interface AetherVaultProps {
  onLog: (msg: RitualMessage) => void;
}

export default function AetherVault({ onLog }: AetherVaultProps) {
  const { address } = useAccount();
  const [manifestAmount, setManifestAmount] = useState('');
  const [dissolveAmount, setDissolveAmount] = useState('');
  
  const { writeContractAsync: writeVault } = useWriteContract();

  // Read Vault Data
  const { data: userBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.VAULT,
    abi: VAULT_ABI,
    functionName: 'essenceBalance',
    args: [address as `0x${string}`],
    query: { enabled: !!address }
  });

  const { data: ownerAddress } = useReadContract({
    address: CONTRACT_ADDRESSES.VAULT,
    abi: VAULT_ABI,
    functionName: 'owner',
  });

  const { data: accumulatedTribute, refetch: refetchTribute } = useReadContract({
    address: CONTRACT_ADDRESSES.VAULT,
    abi: VAULT_ABI,
    functionName: 'accumulatedTribute',
  });

  const [isLoading, setIsLoading] = useState(false);

  const isOwner = address?.toLowerCase() === ownerAddress?.toLowerCase();

  const handleAction = async (type: 'manifest' | 'dissolve' | 'claim') => {
    if (!address) return;
    setIsLoading(true);
    const logId = Math.random().toString(36).slice(2);

    try {
      if (type === 'manifest') {
        onLog({ id: logId, text: 'The initiate must give blood-oath to the circle...', type: 'info' });
        await writeVault({
          address: CONTRACT_ADDRESSES.VAULT,
          abi: VAULT_ABI,
          functionName: 'manifest',
          value: parseEther(manifestAmount)
        });
        onLog({ id: logId + '-s', text: 'Essence Manifested in the Sanctum.', type: 'success' });
      } else if (type === 'dissolve') {
        onLog({ id: logId, text: 'Drawing back the ethereal veil...', type: 'info' });
        await writeVault({
          address: CONTRACT_ADDRESSES.VAULT,
          abi: VAULT_ABI,
          functionName: 'dissolve',
          args: [parseEther(dissolveAmount)]
        });
        onLog({ id: logId + '-s', text: 'Essence Dissolved into Liquid Gold.', type: 'success' });
      } else if (type === 'claim') {
        onLog({ id: logId, text: 'Gathering the alchemical tithes...', type: 'info' });
        await writeVault({
          address: CONTRACT_ADDRESSES.VAULT,
          abi: VAULT_ABI,
          functionName: 'claimTributes',
        });
        onLog({ id: logId + '-s', text: 'Tributes Claimed by the High Alchemist.', type: 'success' });
      }
      refetchBalance();
      refetchTribute();
    } catch (error: any) {
      onLog({ id: logId + '-e', text: `Ritual Interrupted: ${error.shortMessage || 'Sanctum Refusal.'}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="stone-panel ritual-glow flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-[#d4af38] uppercase tracking-wider font-serif">Aether Vault</h2>
        <span className="text-[10px] text-gray-500 font-mono">{CONTRACT_ADDRESSES.VAULT.slice(0, 6)}...{CONTRACT_ADDRESSES.VAULT.slice(-4)}</span>
      </div>

      <div className="bg-black/30 border gold-border p-6 rounded-lg mb-8 text-center">
        <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">Manifested Essence Balance</p>
        <p className="text-4xl font-bold text-white">
          {userBalance ? Number(formatUnits(userBalance as bigint, 18)).toFixed(6) : '0.000000'}{' '}
          <span className="text-lg text-[#6d28d9]">ETH</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Manifest Ritual */}
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-gray-400 mb-2">Manifest (Deposit)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={manifestAmount}
              onChange={(e) => setManifestAmount(e.target.value)}
              placeholder="Amount to Bind"
              className="flex-grow bg-black/40 border gold-border p-3 rounded font-mono text-sm text-white focus:outline-none placeholder:text-gray-800"
            />
            <button
              disabled={isLoading || !address}
              onClick={() => handleAction('manifest')}
              className="alchemical-btn whitespace-nowrap !py-2"
            >
              Manifest
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mt-1 italic">A 2% tribute will be claimed by the sanctum.</p>
        </div>

        {/* Dissolve Ritual */}
        <div className="pt-4 border-t border-white/5">
          <label className="block text-[11px] uppercase tracking-widest text-gray-400 mb-2">Dissolve (Withdraw)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={dissolveAmount}
              onChange={(e) => setDissolveAmount(e.target.value)}
              placeholder="Amount to Release"
              className="flex-grow bg-black/40 border gold-border p-3 rounded font-mono text-sm text-white focus:outline-none placeholder:text-gray-800"
            />
            <button
              disabled={isLoading || !address}
              onClick={() => handleAction('dissolve')}
              className="alchemical-btn whitespace-nowrap !py-2"
            >
              Dissolve
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mt-1 italic">Release essence back to the physical plane.</p>
        </div>
      </div>

      {isOwner && (
        <div className="mt-auto pt-6">
          <div className="flex justify-between items-end p-4 border gold-border bg-[#d4af3710] rounded">
            <div>
              <p className="text-[10px] uppercase text-[#d4af37] font-bold">Accumulated Tribute</p>
              <p className="text-xl font-bold text-white">
                {accumulatedTribute ? formatEther(accumulatedTribute as bigint) : '0'} ETH
              </p>
            </div>
            <button
              onClick={() => handleAction('claim')}
              className="text-[10px] font-bold text-[#d4af37] border-b border-[#d4af37] hover:text-white transition-colors cursor-pointer uppercase"
            >
              Claim Tributes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
