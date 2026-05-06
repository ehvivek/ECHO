'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';

export default function ResultModal() {
  const {
    gameState, isCorrect, currentSong, roundScore, speedBonus,
    streak, multiplier, revealComplete
  } = useGameStore();

  const show = gameState === 'REVEALED';
  if (!show || !currentSong) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center pb-0 sm:items-center sm:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={revealComplete}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative glass-card p-8 sm:p-10 w-full max-w-lg mx-4 sm:mx-auto mb-0 sm:mb-0"
            style={{ maxHeight: '85vh', overflowY: 'auto' }}
          >
            {/* Result Icon */}
            <div className="text-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-6xl mb-2"
              >
                {isCorrect ? '✅' : '❌'}
              </motion.div>

              {isCorrect && roundScore > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="font-mono text-2xl font-bold"
                  style={{ color: 'var(--color-correct-green)' }}
                >
                  +{roundScore} pts
                  {speedBonus > 0 && (
                    <span className="text-sm ml-2 opacity-70">
                      (⚡ {speedBonus} speed bonus)
                    </span>
                  )}
                </motion.div>
              )}

              {isCorrect && streak > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm mt-1"
                  style={{ color: '#FF91A4' }}
                >
                  🔥 {streak} streak × {multiplier}
                </motion.div>
              )}
            </div>

            {/* Song Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center space-y-3"
            >
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {currentSong.song_name}
              </h2>
              <p className="text-base" style={{ color: 'var(--text-muted)' }}>
                {currentSong.movie_name} ({currentSong.year})
                <br />
                <span className="text-sm">
                  {currentSong.artist.join(', ')}
                </span>
              </p>

              {/* Original Hindi Lyric */}
              <div
                className="mt-4 p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <p className="text-lg mb-1" style={{ color: 'var(--text-primary)', lineHeight: 1.8 }}>
                  {currentSong.original_lyric}
                </p>
                <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>
                  {currentSong.original_lyric_roman}
                </p>
              </div>

              {/* Waveform */}
              <div className="flex items-center justify-center gap-1 py-3 h-10">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span
                    key={i}
                    className="waveform-bar"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Next Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-6"
            >
              <button
                onClick={revealComplete}
                className="btn-primary"
              >
                Next Round →
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
