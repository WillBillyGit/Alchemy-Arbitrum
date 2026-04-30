/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Gem, ScrollText } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

import WalletAttunement from './components/WalletAttunement';
import AethericPurifier from './components/AethericPurifier';
import AetherVault from './components/AetherVault';
import RitualLog, { RitualMessage } from './components/RitualLog';

const queryClient = new QueryClient();

const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
const rpcUrl = alchemyKey 
  ? `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}` 
  : undefined;

const config = createConfig({
  chains: [arbitrum],
  transports: {
    [arbitrum.id]: http(rpcUrl),
  },
});

export default function App() {
  const [messages, setMessages] = useState<RitualMessage[]>([]);

  const addLog = (msg: RitualMessage) => {
    setMessages((prev) => [...prev, msg].slice(-20)); // Keep last 20
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex flex-col relative bg-[#0d0d0f] border-8 border-[#1a1a1c]">
          {/* Sacred Geometry Background */}
          <svg className="geometry-bg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#d4af37" fill="none" strokeWidth="0.5" />
            <polygon points="50,5 95,80 5,80" stroke="#d4af37" fill="none" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="20" stroke="#d4af37" fill="none" strokeWidth="0.5" />
          </svg>

          {/* Header */}
          <header className="relative z-10 flex justify-between items-center px-10 py-4 border-b border-[#d4af3733] bg-[#1a122199] backdrop-blur-md">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-pink-500/20 blur-xl rounded-full animate-pulse"></div>
                <img 
                  src="https://github.com/WillBillyGit/Alchemy-Arbitrum/blob/main/wizard_sweeping_potion_labels.jpg"
                  alt="High Alchemist" 
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full border-2 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.4)] relative z-10"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-[0.2em] text-[#d4af37] uppercase font-serif">Alchemical Sanctum</h1>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#db2777] font-bold">Resonating with Arbitrum One</p>
              </div>
            </div>
            <WalletAttunement />
          </header>

          {/* Main Content */}
          <main className="relative z-10 w-full max-w-7xl mx-auto p-10 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <AethericPurifier onLog={addLog} />
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AetherVault onLog={addLog} />
              </motion.section>
            </div>

            {/* Bottom Log */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <RitualLog messages={messages} />
            </motion.div>
          </main>

          {/* Footer */}
          <footer className="relative z-10 w-full px-10 py-4 flex justify-between items-center border-t border-[#d4af3733] bg-[#1a1221] text-[10px] uppercase tracking-widest text-pink-300/40 font-bold">
            <span>Leyline: Arbitrum One (42161)</span>
            <div className="flex items-center gap-4">
               <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div> Circle Stable</span>
               <span>Cycle: Waxing Gibbous</span>
            </div>
            <span>Manifested by Ancient Arts</span>
          </footer>
        </div>
        <Analytics />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

