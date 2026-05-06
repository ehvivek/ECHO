'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';

export default function AudioPlayer() {
  const { gameState, currentSong, revealComplete, nextRound } = useGameStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number>(0);
  const hasPlayedRef = useRef(false);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(fadeRafRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0;
    }
    hasPlayedRef.current = false;
  }, []);

  // Preload during PLAYING
  useEffect(() => {
    if (gameState === 'PLAYING' && currentSong?.audio_url) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = currentSong.audio_url;
      audioRef.current.preload = 'auto';
      audioRef.current.load();
    }
  }, [gameState, currentSong]);

  // Play on REVEALED
  useEffect(() => {
    if (gameState !== 'REVEALED' || !currentSong || hasPlayedRef.current) return;

    const audio = audioRef.current;
    if (!audio || !currentSong.audio_url) {
      // No audio — auto-advance after 4 seconds
      const t = setTimeout(() => {
        revealComplete();
      }, 4000);
      return () => clearTimeout(t);
    }

    hasPlayedRef.current = true;
    const startSec = currentSong.lyric_start_ms / 1000;
    const endSec = currentSong.lyric_end_ms / 1000;
    const fadeOutStart = endSec - 2;

    audio.currentTime = startSec;
    audio.volume = 0;

    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Audio play failed (no user gesture on mobile)
        setTimeout(() => {
          revealComplete();
        }, 4000);
      });
    }

    // Fade in over 1 second
    const fadeInStart = performance.now();
    const fadeIn = (now: number) => {
      const elapsed = (now - fadeInStart) / 1000;
      if (elapsed < 1) {
        audio.volume = Math.max(0, Math.min(1, elapsed));
        fadeRafRef.current = requestAnimationFrame(fadeIn);
      } else {
        audio.volume = 1;
        // Schedule fade out
        scheduleFadeOut();
      }
    };
    fadeRafRef.current = requestAnimationFrame(fadeIn);

    const scheduleFadeOut = () => {
      const checkFadeOut = () => {
        if (!audio || audio.paused) return;
        if (audio.currentTime >= fadeOutStart) {
          // Begin fade out
          const fadeOutBegin = performance.now();
          const fadeOut = (now: number) => {
            const elapsed = (now - fadeOutBegin) / 1000;
            if (elapsed < 2) {
              audio.volume = Math.max(0, Math.min(1, 1 - elapsed / 2));
              fadeRafRef.current = requestAnimationFrame(fadeOut);
            } else {
              audio.volume = 0;
              audio.pause();
              revealComplete();
            }
          };
          fadeRafRef.current = requestAnimationFrame(fadeOut);
        } else if (audio.currentTime >= endSec) {
          audio.pause();
          revealComplete();
        } else {
          fadeRafRef.current = requestAnimationFrame(checkFadeOut);
        }
      };
      fadeRafRef.current = requestAnimationFrame(checkFadeOut);
    };

    return () => cleanup();
  }, [gameState, currentSong, revealComplete, nextRound, cleanup]);

  // Cleanup on state changes away from REVEALED
  useEffect(() => {
    if (gameState !== 'REVEALED' && gameState !== 'LOADING_NEXT') {
      cleanup();
    }
  }, [gameState, cleanup]);

  return null; // Hidden audio — no visual element
}
