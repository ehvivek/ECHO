export interface Song {
  id: string;
  song_name: string;
  movie_name: string;
  year: number;
  artist: string[];
  original_lyric: string;           // Hindi (Devanagari)
  original_lyric_roman: string;     // Romanized Hindi
  english_reinterpretation: string; // Poetic, emotional — NOT literal translation
  difficulty: Difficulty;
  aliases: string[];                // Common ways people refer to this song
  audio_url: string;
  lyric_start_ms: number;
  lyric_end_ms: number;
  hint?: string;                    // Optional: shown after 50% of timer elapsed
  for_room_only?: boolean;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameState = 'IDLE' | 'PLAYING' | 'SUBMITTED' | 'REVEALED' | 'LOADING_NEXT';

export interface DifficultyConfig {
  time: number;       // seconds
  basePoints: number;
  maxSpeedBonus: number;
  label: string;
  emoji: string;
  description: string;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    time: 15,
    basePoints: 10,
    maxSpeedBonus: 5,
    label: 'Easy',
    emoji: '✦',
    description: 'Iconic songs everyone knows',
  },
  medium: {
    time: 30,
    basePoints: 20,
    maxSpeedBonus: 10,
    label: 'Medium',
    emoji: '✦✦',
    description: 'Popular melodies from the golden era',
  },
  hard: {
    time: 45,
    basePoints: 40,
    maxSpeedBonus: 20,
    label: 'Hard',
    emoji: '✦✦✦',
    description: 'Deep cuts and poetic gems',
  },
};

export interface ValidationResult {
  correct: boolean;
  confidence: number;
  reason: string;
}

export interface PetalParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  color: string;
  swayOffset: number;
  swayAmplitude: number;
}
