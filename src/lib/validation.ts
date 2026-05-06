import Fuse from 'fuse.js';
import { Song, ValidationResult } from '@/types';

export function fuzzyValidate(userInput: string, song: Song): ValidationResult {
  const trimmed = userInput.trim().toLowerCase();
  if (!trimmed || trimmed.length < 2) {
    return { correct: false, confidence: 0, reason: 'Empty or too short' };
  }

  const candidates = [
    song.song_name,
    song.movie_name,
    ...song.aliases,
  ].map(s => ({ name: s }));

  const fuse = new Fuse(candidates, {
    keys: ['name'],
    threshold: 0.45,
    includeScore: true,
    isCaseSensitive: false,
    minMatchCharLength: 2,
  });

  const results = fuse.search(trimmed);

  if (results.length === 0) {
    return { correct: false, confidence: 0, reason: 'No match found' };
  }

  const bestScore = results[0].score ?? 1;
  const confidence = 1 - bestScore;

  if (confidence > 0.6) {
    return { correct: true, confidence, reason: `Matched: ${results[0].item.name}` };
  }

  if (confidence > 0.3) {
    return { correct: false, confidence, reason: 'Ambiguous — needs AI validation' };
  }

  return { correct: false, confidence, reason: 'No confident match' };
}

export async function aiValidate(
  userInput: string,
  song: Song
): Promise<ValidationResult> {
  try {
    const response = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userInput,
        songName: song.song_name,
        movieName: song.movie_name,
        aliases: song.aliases,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data as ValidationResult;
  } catch {
    // Fallback to fuzzy result
    return fuzzyValidate(userInput, song);
  }
}

export async function validateAnswer(
  userInput: string,
  song: Song
): Promise<ValidationResult> {
  const fuzzyResult = fuzzyValidate(userInput, song);

  // Layer 1: High confidence fuzzy match — skip API
  if (fuzzyResult.confidence > 0.6) {
    return { correct: true, confidence: fuzzyResult.confidence, reason: fuzzyResult.reason };
  }

  // Layer 1: Clearly wrong — skip API
  if (fuzzyResult.confidence < 0.2) {
    return { correct: false, confidence: fuzzyResult.confidence, reason: fuzzyResult.reason };
  }

  // Layer 2: Ambiguous — ask AI
  try {
    return await aiValidate(userInput, song);
  } catch {
    // If AI fails, use fuzzy result with generous threshold
    return {
      correct: fuzzyResult.confidence > 0.35,
      confidence: fuzzyResult.confidence,
      reason: 'AI unavailable, used fuzzy match fallback',
    };
  }
}
