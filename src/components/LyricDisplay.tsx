'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';

export default function LyricDisplay() {
  const { currentSong, gameState, hintUsed, useHint, score } = useGameStore();

  if (!currentSong || gameState === 'IDLE') return null;

  return (
    <div className="w-full text-center mb-8">
      <motion.p
        key={currentSong.id}
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="font-serif text-2xl md:text-3xl lg:text-4xl italic leading-relaxed tracking-wide px-4"
        style={{
          color: 'var(--text-primary)',
          letterSpacing: '0.02em',
          lineHeight: 1.6,
        }}
      >
        &ldquo;{currentSong.english_reinterpretation}&rdquo;
      </motion.p>

      {/* Hint section */}
      {gameState === 'PLAYING' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          {hintUsed ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm italic px-4 py-2 rounded-full inline-block"
              style={{
                color: 'var(--text-muted)',
                background: 'rgba(255,255,255,0.15)',
              }}
            >
              🎬 Movie: {currentSong.movie_name}
            </motion.p>
          ) : (
            <button
              onClick={useHint}
              disabled={score < 2}
              className={`btn-secondary text-sm transition-all duration-300 ${
                score < 2 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
              style={{ fontSize: '13px' }}
              title={score < 2 ? "You need at least 2 points to use a hint!" : "Reveal the movie name"}
            >
              💡 Reveal Movie (-2 pts)
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
