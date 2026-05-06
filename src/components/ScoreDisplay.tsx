'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { useState, useEffect } from 'react';

export default function ScoreDisplay() {
  const { gameState, score, streak, multiplier, round, roundScore, isCorrect } = useGameStore();
  const [showFloat, setShowFloat] = useState(false);
  const [floatValue, setFloatValue] = useState(0);

  useEffect(() => {
    if (gameState === 'REVEALED' && isCorrect && roundScore > 0) {
      setFloatValue(roundScore);
      setShowFloat(true);
      const t = setTimeout(() => setShowFloat(false), 1200);
      return () => clearTimeout(t);
    }
  }, [gameState, isCorrect, roundScore]);

  if (gameState === 'IDLE') return null;

  return (
    <div className="w-full flex items-center justify-between px-2 mb-6">
      {/* Score */}
      <div className="relative">
        <div className="flex flex-col items-start">
          <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Score
          </span>
          <span className="font-mono text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {score}
          </span>
        </div>
        <AnimatePresence>
          {showFloat && (
            <motion.span
              key={`float-${round}-${floatValue}`}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute -top-2 left-12 font-mono text-lg font-bold"
              style={{ color: 'var(--color-correct-green)' }}
            >
              +{floatValue}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Streak */}
      <div className="flex flex-col items-center">
        <AnimatePresence mode="wait">
          {streak > 0 && (
            <motion.div
              key={`streak-${streak}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.4, 1], opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold"
              style={{
                background: 'linear-gradient(135deg, rgba(255,145,164,0.3), rgba(255,179,71,0.3))',
                border: '1px solid rgba(255,145,164,0.4)',
              }}
            >
              🔥 {streak}
              {multiplier > 1 && (
                <span className="text-xs ml-1" style={{ color: '#FF91A4' }}>
                  ×{multiplier}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {streak === 0 && (
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            No streak
          </span>
        )}
      </div>

      {/* Round */}
      <div className="flex flex-col items-end">
        <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Round
        </span>
        <span className="font-mono text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {round}
        </span>
      </div>
    </div>
  );
}
