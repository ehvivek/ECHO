import { create } from 'zustand';
import { GameState, Difficulty, Song, DIFFICULTY_CONFIG } from '@/types';
import { getRandomSong } from '@/data/songs';
import { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  games_played: number;
  games_won: number;
  total_points: number;
}

interface GameStore {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  requiresOnboarding: boolean;
  setAuth: (user: User | null, session: Session | null, profile: Profile | null, requiresOnboarding?: boolean) => void;
  setProfile: (profile: Profile | null) => void;
  setRequiresOnboarding: (req: boolean) => void;

  roomId: string | null;
  setRoomId: (id: string | null) => void;

  isMultiplayerGameStarted: boolean;
  setMultiplayerGameStarted: (started: boolean) => void;

  multiplayerRound: number;
  setMultiplayerRound: (round: number) => void;

  multiplayerPlayedSongIds: string[];
  setMultiplayerPlayedSongIds: (ids: string[]) => void;

  gameState: GameState;
  difficulty: Difficulty;
  currentSong: Song | null;
  userAnswer: string;
  isCorrect: boolean | null;
  score: number;
  streak: number;
  multiplier: number;
  roundScore: number;
  speedBonus: number;
  round: number;
  timeRemaining: number;
  totalTime: number;
  playedSongIds: Set<string>;
  hintUsed: boolean;
  hintVisible: boolean;
  setDifficulty: (d: Difficulty) => void;
  startGame: () => void;
  setUserAnswer: (answer: string) => void;
  submitAnswer: () => void;
  setValidationResult: (correct: boolean) => void;
  revealComplete: () => void;
  nextRound: () => void;
  skipRound: () => void;
  useHint: () => void;
  tick: (timeRemaining: number) => void;
  timeout: () => void;
  resetGame: () => void;
}

function getMultiplier(streak: number): number {
  if (streak >= 5) return 1.5;
  if (streak >= 3) return 1.2;
  return 1.0;
}

import { persist } from 'zustand/middleware';

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
  user: null,
  session: null,
  profile: null,
  requiresOnboarding: false,
  setAuth: (user, session, profile, requiresOnboarding = false) => set({ user, session, profile, requiresOnboarding }),
  setProfile: (profile) => set({ profile }),
  setRequiresOnboarding: (req) => set({ requiresOnboarding: req }),

  roomId: null,
  setRoomId: (id) => set({ roomId: id, isMultiplayerGameStarted: false }),

  isMultiplayerGameStarted: false,
  setMultiplayerGameStarted: (started) => set({ isMultiplayerGameStarted: started }),

  multiplayerRound: 0,
  setMultiplayerRound: (round) => set({ multiplayerRound: round }),

  multiplayerPlayedSongIds: [],
  setMultiplayerPlayedSongIds: (ids) => set({ multiplayerPlayedSongIds: ids }),

  gameState: 'IDLE',
  difficulty: 'easy',
  currentSong: null,
  userAnswer: '',
  isCorrect: null,
  score: 0,
  streak: 0,
  multiplier: 1.0,
  roundScore: 0,
  speedBonus: 0,
  round: 0,
  timeRemaining: 0,
  totalTime: 0,
  playedSongIds: new Set(),
  hintUsed: false,
  hintVisible: false,

  setDifficulty: (d) => {
    if (get().gameState !== 'IDLE') return;
    set({ difficulty: d });
  },

  startGame: () => {
    const state = get();
    if (state.gameState !== 'IDLE') return;
    const config = DIFFICULTY_CONFIG[state.difficulty];
    const song = getRandomSong(state.difficulty, state.playedSongIds);
    if (!song) return;
    const newPlayed = new Set(state.playedSongIds);
    newPlayed.add(song.id);
    set({
      gameState: 'PLAYING',
      currentSong: song,
      userAnswer: '',
      isCorrect: null,
      roundScore: 0,
      speedBonus: 0,
      round: 1,
      timeRemaining: config.time,
      totalTime: config.time,
      playedSongIds: newPlayed,
      hintUsed: false,
      hintVisible: false,
    });
  },

  setUserAnswer: (answer) => {
    if (get().gameState !== 'PLAYING') return;
    set({ userAnswer: answer });
  },

  submitAnswer: () => {
    if (get().gameState !== 'PLAYING') return;
    set({ gameState: 'SUBMITTED' });
  },

  setValidationResult: (correct) => {
    const state = get();
    if (state.gameState !== 'SUBMITTED') return;
    const config = DIFFICULTY_CONFIG[state.difficulty];
    const newStreak = correct ? state.streak + 1 : 0;
    const newMultiplier = getMultiplier(newStreak);
    let speedBonus = 0;
    let roundScore = 0;
    if (correct) {
      speedBonus = Math.floor((state.timeRemaining / state.totalTime) * config.maxSpeedBonus);
      roundScore = Math.floor((config.basePoints + speedBonus) * newMultiplier);
    }
    set({
      gameState: 'REVEALED',
      isCorrect: correct,
      streak: newStreak,
      multiplier: newMultiplier,
      speedBonus,
      roundScore,
      score: state.score + roundScore,
    });
  },

  revealComplete: () => {
    if (get().gameState !== 'REVEALED') return;
    set({ gameState: 'LOADING_NEXT' });
    setTimeout(() => {
      if (get().gameState === 'LOADING_NEXT') {
        get().nextRound();
      }
    }, 500);
  },

  nextRound: () => {
    const state = get();
    if (state.gameState !== 'LOADING_NEXT') return;
    const config = DIFFICULTY_CONFIG[state.difficulty];
    let song = getRandomSong(state.difficulty, state.playedSongIds);
    let newPlayed = new Set(state.playedSongIds);
    if (!song) {
      song = getRandomSong(state.difficulty, new Set());
      newPlayed = new Set();
    }
    if (!song) return;
    newPlayed.add(song.id);
    set({
      gameState: 'PLAYING',
      currentSong: song,
      userAnswer: '',
      isCorrect: null,
      roundScore: 0,
      speedBonus: 0,
      round: state.round + 1,
      timeRemaining: config.time,
      totalTime: config.time,
      playedSongIds: newPlayed,
      hintUsed: false,
      hintVisible: false,
    });
  },

  skipRound: () => {
    const state = get();
    if (state.gameState !== 'PLAYING') return;
    set({
      gameState: 'REVEALED',
      isCorrect: false,
      streak: 0,
      multiplier: 1.0,
      roundScore: 0,
      speedBonus: 0,
      score: state.score,
      userAnswer: '',
    });
  },

  useHint: () => {
    const state = get();
    if (state.gameState !== 'PLAYING' || state.hintUsed || state.score < 2) return;
    set({ hintUsed: true, hintVisible: true, score: state.score - 2 });
  },

  tick: (timeRemaining) => {
    const state = get();
    if (state.gameState !== 'PLAYING') return;
    set({
      timeRemaining: Math.max(0, timeRemaining),
      hintVisible: state.hintUsed || (timeRemaining <= state.totalTime * 0.5),
    });
  },

  timeout: () => {
    const state = get();
    if (state.gameState !== 'PLAYING') return;
    set({ gameState: 'SUBMITTED', timeRemaining: 0, userAnswer: '' });
    setTimeout(() => {
      if (get().gameState === 'SUBMITTED') {
        get().setValidationResult(false);
      }
    }, 300);
  },

  resetGame: () => {
    set((state) => ({
      gameState: 'IDLE', difficulty: 'easy', currentSong: null,
      userAnswer: '', isCorrect: null, score: 0, streak: 0,
      multiplier: 1.0, roundScore: 0, speedBonus: 0, round: 0,
      timeRemaining: 0, totalTime: 0, playedSongIds: state.playedSongIds,
      hintUsed: false, hintVisible: false,
    }));
  },
}), {
  name: 'echolyrics-store',
  partialize: (state) => ({
    roomId: state.roomId,
    isMultiplayerGameStarted: state.isMultiplayerGameStarted,
    round: state.round,
    multiplayerRound: state.multiplayerRound,
    multiplayerPlayedSongIds: state.multiplayerPlayedSongIds,
  }),
}));
