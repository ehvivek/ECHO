'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';

export default function Timer() {
  const { gameState, totalTime, tick, timeout } = useGameStore();
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const hasTimedOut = useRef(false);

  const size = 120;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const timeRemaining = useGameStore(s => s.timeRemaining);
  const progress = totalTime > 0 ? timeRemaining / totalTime : 1;
  const dashOffset = circumference * (1 - progress);

  // Color based on progress
  const getColor = useCallback(() => {
    if (timeRemaining <= 5) return '#FF2400';
    if (progress <= 0.5) return '#FF8C00';
    return '#FF69B4';
  }, [timeRemaining, progress]);

  // Start timer on PLAYING state
  useEffect(() => {
    if (gameState !== 'PLAYING') {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    hasTimedOut.current = false;
    startTimeRef.current = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      const remaining = Math.max(0, totalTime - elapsed);
      tick(remaining);

      if (remaining <= 0 && !hasTimedOut.current) {
        hasTimedOut.current = true;
        timeout();
        return;
      }

      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafRef.current);
  }, [gameState, totalTime, tick, timeout]);

  if (gameState === 'IDLE') return null;

  const isDanger = timeRemaining <= 5 && gameState === 'PLAYING';
  const displayTime = Math.ceil(timeRemaining);

  return (
    <div className={`relative flex items-center justify-center ${isDanger ? 'timer-danger' : ''}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke 0.3s ease',
            filter: isDanger ? 'drop-shadow(0 0 8px #FF2400)' : 'none',
          }}
        />
      </svg>
      <span
        className="absolute font-mono text-2xl font-bold"
        style={{
          color: getColor(),
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {displayTime}
      </span>
    </div>
  );
}
