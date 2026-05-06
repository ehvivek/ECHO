'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import SakuraCanvas from '@/components/SakuraCanvas';
import CherryBlossomBranch from '@/components/CherryBlossomBranch';
import DifficultySelector from '@/components/DifficultySelector';
import HowToPlay from '@/components/HowToPlay';
import ScoreDisplay from '@/components/ScoreDisplay';
import Timer from '@/components/Timer';
import LyricDisplay from '@/components/LyricDisplay';
import AnswerInput from '@/components/AnswerInput';
import ResultModal from '@/components/ResultModal';
import AudioPlayer from '@/components/AudioPlayer';
import MultiplayerMenu from '@/components/MultiplayerMenu';
import Lobby from '@/components/Lobby';
import MultiplayerGame from '@/components/MultiplayerGame';

export default function Home() {
  const { gameState, resetGame, isCorrect, roomId, isMultiplayerGameStarted } = useGameStore();
  const [petalEvent, setPetalEvent] = useState<'correct' | 'wrong' | 'slow' | null>(null);

  const isIdle = gameState === 'IDLE';
  const isActive = gameState !== 'IDLE';

  // Trigger petal events based on game state
  const prevStateRef = useGameStore;

  // Watch for REVEALED state to trigger petal burst
  const currentIsCorrect = useGameStore(s => s.isCorrect);
  const currentState = useGameStore(s => s.gameState);

  // Use effect-like pattern via subscription
  useState(() => {
    useGameStore.subscribe((state, prevState) => {
      if (state.gameState === 'REVEALED' && prevState.gameState !== 'REVEALED') {
        setPetalEvent(state.isCorrect ? 'correct' : 'wrong');
      }
      if (state.gameState === 'LOADING_NEXT' && prevState.gameState !== 'LOADING_NEXT') {
        setPetalEvent('slow');
      }
      if (state.gameState === 'PLAYING' && prevState.gameState !== 'PLAYING') {
        setPetalEvent(null);
      }
    });
  });

  const handleBurstHandled = useCallback(() => {
    // Don't clear 'slow' — let it persist during LOADING_NEXT
    if (petalEvent !== 'slow') {
      setTimeout(() => setPetalEvent(null), 600);
    }
  }, [petalEvent]);

  return (
    <>
      {/* Background layers */}
      <CherryBlossomBranch />
      <SakuraCanvas eventBurst={petalEvent} onBurstHandled={handleBurstHandled} />

      {/* Floating clouds */}
      <div className="cloud" style={{ top: '10%', animationDelay: '0s' }}>
        <svg width="200" height="80" viewBox="0 0 200 80" fill="white">
          <ellipse cx="80" cy="50" rx="70" ry="25" />
          <ellipse cx="120" cy="40" rx="50" ry="20" />
          <ellipse cx="60" cy="40" rx="40" ry="18" />
        </svg>
      </div>
      <div className="cloud" style={{ top: '30%', animationDelay: '40s' }}>
        <svg width="160" height="60" viewBox="0 0 160 60" fill="white">
          <ellipse cx="60" cy="35" rx="55" ry="20" />
          <ellipse cx="100" cy="30" rx="40" ry="15" />
        </svg>
      </div>

      {/* Main content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {isIdle ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center w-full max-w-2xl px-4"
            >
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl font-serif font-bold mb-3 gradient-text text-shadow-glow text-center"
              >
                EchoLyrics
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-xl sm:text-2xl text-shadow-glow text-center mb-10"
                style={{ color: 'var(--text-muted)' }}
              >
                Guess the song. Feel the memory.
              </motion.p>

              {/* Difficulty cards */}
              {!roomId && <DifficultySelector />}

              {/* Multiplayer Menu */}
              {!roomId && <MultiplayerMenu />}

              {/* Multiplayer Game / Lobby */}
              {roomId && isMultiplayerGameStarted && <MultiplayerGame />}
              {roomId && !isMultiplayerGameStarted && <Lobby />}

              {/* How to play */}
              {!roomId && <HowToPlay />}
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center w-full max-w-[680px] px-4"
            >
              {/* Back button */}
              <div className="w-full flex justify-start mb-6">
                <button
                  onClick={resetGame}
                  className="text-base sm:text-lg font-medium transition-opacity hover:opacity-100 opacity-90 text-shadow-glow"
                  style={{ color: 'var(--text-primary)' }}
                >
                  ← Back to Home
                </button>
              </div>

              {/* Score bar */}
              <ScoreDisplay />

              {/* Game card */}
              <div className="glass-card p-8 sm:p-12 w-full relative">
                {/* Timer — top right */}
                <div className="absolute -top-4 -right-4 sm:top-4 sm:right-4">
                  <Timer />
                </div>

                {/* Lyric */}
                <div className="mt-8 sm:mt-4">
                  <LyricDisplay />
                </div>

                {/* Input */}
                <AnswerInput />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result modal overlay */}
        <ResultModal />

        {/* Hidden audio player */}
        <AudioPlayer />
      </main>
    </>
  );
}
