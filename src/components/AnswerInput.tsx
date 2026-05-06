'use client';

import { useRef, useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { validateAnswer } from '@/lib/validation';

export default function AnswerInput() {
  const {
    gameState, userAnswer, setUserAnswer, submitAnswer,
    setValidationResult, currentSong, skipRound
  } = useGameStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const isPlaying = gameState === 'PLAYING';
  const isSubmitted = gameState === 'SUBMITTED';

  const handleSubmit = useCallback(async () => {
    if (!isPlaying || !currentSong) return;
    if (!userAnswer.trim()) return;

    submitAnswer();

    // Run validation
    const result = await validateAnswer(userAnswer, currentSong);
    setValidationResult(result.correct);
  }, [isPlaying, currentSong, userAnswer, submitAnswer, setValidationResult]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isPlaying) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;left:${x}px;top:${y}px;
      width:0;height:0;border-radius:50%;
      background:rgba(255,255,255,0.3);
      transform:translate(-50%,-50%);
      animation:ripple-expand 0.6s ease-out forwards;
      pointer-events:none;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  if (gameState === 'IDLE') return null;

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <style jsx>{`
        @keyframes ripple-expand {
          to { width: 300px; height: 300px; opacity: 0; }
        }
      `}</style>

      <div className="flex flex-col gap-4">
        <input
          ref={inputRef}
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Name the song..."
          disabled={!isPlaying}
          className="echo-input text-center"
          autoComplete="off"
          autoFocus
        />

        <div className="flex gap-3 justify-center items-center">
          <button
            ref={btnRef}
            onClick={(e) => { handleRipple(e); handleSubmit(); }}
            disabled={!isPlaying || !userAnswer.trim()}
            className="btn-primary relative"
          >
            {isSubmitted ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Checking...
              </span>
            ) : (
              'Submit'
            )}
          </button>

          {isPlaying && (
            <button
              onClick={skipRound}
              className="btn-secondary"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
