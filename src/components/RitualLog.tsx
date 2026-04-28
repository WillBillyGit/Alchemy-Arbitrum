import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useRef } from 'react';

export type RitualMessage = {
  id: string;
  text: string;
  type: 'info' | 'success' | 'error' | 'warning';
};

interface RitualLogProps {
  messages: RitualMessage[];
}

export default function RitualLog({ messages }: RitualLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="mt-6 border border-purple-900/30 bg-black/40 backdrop-blur-sm rounded-lg p-4 font-mono text-xs overflow-hidden h-40 flex flex-col scale-95 origin-center">
      <div className="text-[10px] uppercase tracking-[0.3em] text-[#6d28d9] mb-2 border-b border-purple-900/20 pb-1 font-bold">
        Ritual Observation Log
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                pl-3 border-l-[1px] 
                ${msg.type === 'info' ? 'border-purple-800 text-[#a78bfa]' : ''}
                ${msg.type === 'success' ? 'border-green-800 text-green-300' : ''}
                ${msg.type === 'error' ? 'border-red-800 text-red-300' : ''}
                ${msg.type === 'warning' ? 'border-[#d4af37] text-[#d4af37]' : ''}
              `}
            >
              <span className="opacity-40 mr-2 text-[9px]">&gt;</span>
              {msg.text}
            </motion.div>
          ))}
        </AnimatePresence>
        {messages.length === 0 && (
          <div className="text-gray-800 italic text-center py-6 tracking-widest uppercase text-[10px]">
            The Leylines are Silent
          </div>
        )}
      </div>
    </div>
  );
}
