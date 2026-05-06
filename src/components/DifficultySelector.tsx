'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { DIFFICULTY_CONFIG, Difficulty } from '@/types';

export default function DifficultySelector() {
  const { setDifficulty, startGame } = useGameStore();

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  const handleSelect = (d: Difficulty) => {
    setDifficulty(d);
    setTimeout(() => {
      useGameStore.getState().startGame();
    }, 50);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
      {difficulties.map((d, i) => {
        const config = DIFFICULTY_CONFIG[d];
        return (
          <motion.button
            key={d}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(255,150,180,0.25)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(d)}
            className="glass-card-subtle p-6 cursor-pointer text-center group flex flex-col items-center"
          >
            <div className="text-4xl mb-4 text-shadow-glow">{config.emoji}</div>
            <h3 className="text-xl font-bold mb-2 text-shadow-glow tracking-wide" style={{ color: 'var(--text-primary)' }}>
              {config.label}
            </h3>
            <p className="text-base mb-4 text-shadow-glow leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {config.description}
            </p>
            <div className="flex gap-4 text-sm font-medium text-shadow-glow mt-auto justify-center" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1">
                ⏱ {config.time}s
              </span>
              <span className="flex items-center gap-1">
                ⭐ {config.basePoints} pts
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
