'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { supabase } from '@/lib/supabase';
import { songs } from '@/data/songs';
import { validateAnswer } from '@/lib/validation';
import { Song } from '@/types';

// Fetch room song by ID from server (avoids bundling 9MB data to client)
async function fetchRoomSongById(id: string): Promise<Song | null> {
  try {
    const res = await fetch(`/api/room-songs?action=find&id=${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

// Fetch random room song from server
async function fetchRandomRoomSong(difficulty: string, excludeIds: string[]): Promise<Song | null> {
  try {
    const exclude = excludeIds.join(',');
    const res = await fetch(`/api/room-songs?action=random&difficulty=${encodeURIComponent(difficulty)}&exclude=${encodeURIComponent(exclude)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  isCorrect: boolean;
}

export default function MultiplayerGame() {
  const { user, roomId, setRoomId, setMultiplayerGameStarted, multiplayerRound, setMultiplayerRound, multiplayerPlayedSongIds, setMultiplayerPlayedSongIds } = useGameStore();
  const [roomConfig, setRoomConfig] = useState<any>(null);
  const [isHost, setIsHost] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(-1);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [roundWinner, setRoundWinner] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [round, setRound] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [refreshDetected, setRefreshDetected] = useState(false);
  
  const channelRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRefreshAdvance = useRef(false);

  // Ref to hold latest state for sync requests
  const gameStateRef = useRef<any>(null);
  useEffect(() => {
    gameStateRef.current = {
      isHost,
      currentSong,
      round,
      endTime,
      scores,
      roundWinner,
      isGameOver
    };
  }, [isHost, currentSong, round, endTime, scores, roundWinner, isGameOver]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Timer progress for ring animation
  const timerProgress = useMemo(() => {
    if (!roomConfig || !roomConfig.time_per_song || timeRemaining < 0) return 1;
    return Math.max(0, timeRemaining / roomConfig.time_per_song);
  }, [timeRemaining, roomConfig]);

  useEffect(() => {
    if (!roomId || !user) return;

    // Load config
    supabase.from('rooms').select('*').eq('id', roomId).single().then(({ data, error }) => {
      if (error || !data) {
        console.error('Failed to load room config:', error);
        alert('Room not found or no longer active.');
        useGameStore.getState().setMultiplayerGameStarted(false);
        setRoomId(null);
        return;
      }
      if (data) {
        console.log('Room config loaded:', data);
        setRoomConfig(data);
        setIsHost(data.host_id === user.id);
        if (round === 0) setTimeRemaining(-1);
      }
    });

    const channel = supabase.channel(`room:${roomId}`);
    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'new_song' }, async ({ payload }) => {
        // Try local songs first, then fetch from API for room songs
        let song: Song | undefined | null = songs.find(s => s.id === payload.songId);
        if (!song) {
          song = await fetchRoomSongById(payload.songId);
        }
        if (song) {
          setCurrentSong(song);
          setRound(payload.round);
          setMultiplayerRound(payload.round);
          setRoundWinner(null);
          const receivedEndTime = payload.endTime || (Date.now() + payload.time * 1000);
          // Only set endTime if it's in the future (prevents stale timers after refresh)
          if (receivedEndTime > Date.now() + 500) {
            setEndTime(receivedEndTime);
          } else {
            setEndTime(Date.now() + payload.time * 1000);
          }
          setRefreshDetected(false);
        }
      })
      .on('broadcast', { event: 'chat_message' }, ({ payload }) => {
        setMessages(prev => [...prev, payload]);
      })
      .on('broadcast', { event: 'round_won' }, ({ payload }) => {
        setRoundWinner(payload.winnerEmail);
        setScores(prev => ({
          ...prev,
          [payload.winnerId]: (prev[payload.winnerId] || 0) + 10
        }));
        setEndTime(null);
        setTimeRemaining(0);
      })
      .on('broadcast', { event: 'game_over' }, () => {
        setIsGameOver(true);
        setEndTime(null);
      })
      .on('broadcast', { event: 'player_refreshed' }, ({ payload }) => {
        // System message when someone refreshes
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          sender: 'System',
          text: `${payload.email?.split('@')[0] || 'A player'} reconnected — syncing state`,
          isCorrect: false
        }]);
      })
      .on('broadcast', { event: 'request_sync' }, ({ payload }) => {
        const state = gameStateRef.current;
        if (state?.isHost && state?.round > 0) {
          channel.send({
            type: 'broadcast',
            event: 'sync_state',
            payload: {
              targetUserId: payload.userId,
              currentSong: state.currentSong,
              round: state.round,
              endTime: state.endTime,
              scores: state.scores,
              roundWinner: state.roundWinner,
              isGameOver: state.isGameOver
            }
          });
        }
      })
      .on('broadcast', { event: 'sync_state' }, ({ payload }) => {
        if (payload.targetUserId === user?.id) {
          if (payload.currentSong) setCurrentSong(payload.currentSong);
          if (payload.round) {
            setRound(payload.round);
            setMultiplayerRound(payload.round);
          }
          if (payload.endTime) setEndTime(payload.endTime);
          if (payload.scores) setScores(payload.scores);
          if (payload.roundWinner !== undefined) setRoundWinner(payload.roundWinner);
          if (payload.isGameOver) setIsGameOver(payload.isGameOver);
          setRefreshDetected(false);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED' && user?.id) {
          channel.send({
            type: 'broadcast',
            event: 'request_sync',
            payload: { userId: user.id }
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, user?.id]);

  // Detect refresh: if we had a multiplayerRound persisted > 0, we just refreshed
  useEffect(() => {
    if (!roomConfig || !user || hasTriggeredRefreshAdvance.current) return;
    
    // Only trigger this if we haven't received sync state yet, and we know we're reconnecting
    if (multiplayerRound > 0 && round === 0) {
      setRefreshDetected(true);
      hasTriggeredRefreshAdvance.current = true;
      
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'player_refreshed',
          payload: { email: user.email, previousRound: multiplayerRound }
        });
      }

      // Host only: if host refreshes, they might need to force start next round if they lost the current song state
      // But we give them a chance to receive sync from... wait, host IS the source of truth.
      // So host just advances.
      if (isHost) {
        const nextRound = multiplayerRound + 1;
        setTimeout(() => startNextRound(nextRound), 2500);
      }
    }
  }, [roomConfig, user, isHost, multiplayerRound, round]);

  // Robust Timer Engine — uses absolute endTime to stay in sync
  useEffect(() => {
    if (!endTime) {
      // No active timer, reset to sentinel
      setTimeRemaining(-1);
      return;
    }
    
    const updateTimer = () => {
      const diffMs = endTime - Date.now();
      const remaining = Math.max(0, Math.floor(diffMs / 1000));
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        window.clearInterval(interval);
      }
    };
    
    updateTimer();
    const interval = window.setInterval(updateTimer, 250);
    
    return () => window.clearInterval(interval);
  }, [endTime]);

  // Host only: start first round
  useEffect(() => {
    let t: any;
    if (isHost && roomConfig && round === 0 && !refreshDetected) {
      t = setTimeout(() => startNextRound(1), 2000);
    }
    return () => { if (t) clearTimeout(t); };
  }, [isHost, roomConfig, round, refreshDetected]);

  // Host only: handle timeout (no winner)
  useEffect(() => {
    let t: any;
    // timeRemaining must be exactly 0 (not -1 sentinel) AND we must be in an active round
    if (isHost && timeRemaining === 0 && round > 0 && !roundWinner && currentSong && !isGameOver) {
      t = setTimeout(() => startNextRound(round + 1), 3000);
    }
    return () => { if (t) clearTimeout(t); };
  }, [timeRemaining, isHost, roundWinner, currentSong, isGameOver, round]);

  // Host only: handle round win transition
  useEffect(() => {
    let t: any;
    if (isHost && roundWinner && !isGameOver) {
      t = setTimeout(() => startNextRound(round + 1), 4000);
    }
    return () => { if (t) clearTimeout(t); };
  }, [isHost, roundWinner, isGameOver, round]);

  const startNextRound = async (nextRound: number) => {
    if (!roomConfig || !channelRef.current) return;
    
    if (nextRound > roomConfig.num_songs) {
      channelRef.current.send({ type: 'broadcast', event: 'game_over', payload: {} });
      setIsGameOver(true);
      return;
    }

    const song = await fetchRandomRoomSong(roomConfig.difficulty, multiplayerPlayedSongIds);
    if (song) {
      setMultiplayerPlayedSongIds([...multiplayerPlayedSongIds, song.id]);
      const newEndTime = Date.now() + roomConfig.time_per_song * 1000;
      const payload = { songId: song.id, round: nextRound, time: roomConfig.time_per_song, endTime: newEndTime };
      channelRef.current.send({
        type: 'broadcast',
        event: 'new_song',
        payload
      });

      setCurrentSong(song);
      setRound(nextRound);
      setMultiplayerRound(nextRound);
      setRoundWinner(null);
      setEndTime(newEndTime);
      setRefreshDetected(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !user) return;

    const guess = chatInput.trim();
    setChatInput('');

    let isCorrect = false;
    let displayText = guess;

    if (currentSong && timeRemaining > 0 && !roundWinner) {
      const result = await validateAnswer(guess, currentSong);
      if (result.correct) {
        isCorrect = true;
        displayText = '⭐⭐⭐ GUESSED IT! ⭐⭐⭐';
      }
    }
    
    const msg = {
      id: Math.random().toString(),
      sender: user.email || 'Unknown',
      text: displayText,
      isCorrect: isCorrect
    };

    channelRef.current.send({
      type: 'broadcast',
      event: 'chat_message',
      payload: msg
    });
    setMessages(prev => [...prev, msg]);

    if (isCorrect) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'round_won',
        payload: { winnerId: user.id, winnerEmail: user.email }
      });
      setRoundWinner(user.email || 'Unknown');
      setScores(prev => ({
        ...prev,
        [user.id]: (prev[user.id] || 0) + 10
      }));
      setEndTime(null);
    }
  };

  if (!roomConfig) {
    return (
      <div className="w-full max-w-xl mx-auto mt-16 flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-t-transparent border-white/40 animate-spin" />
        <p className="text-white/60 text-lg animate-pulse">Connecting to room...</p>
        <button 
          onClick={() => {
            useGameStore.getState().setMultiplayerGameStarted(false);
            setRoomId(null);
            setMultiplayerRound(0);
          }}
          className="mt-8 px-6 py-2.5 rounded-xl text-sm font-bold border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all cursor-pointer"
        >
          Cancel & Return Home
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // GAME OVER SCREEN — Premium
  // ═══════════════════════════════════════════
  if (isGameOver) {
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const medals = ['🥇', '🥈', '🥉'];
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl mx-auto mt-12 text-center"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10" style={{ background: 'linear-gradient(145deg, rgba(15,10,30,0.95), rgba(30,15,50,0.9))' }}>
          {/* Decorative glow */}
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #FFB347 0%, transparent 70%)' }} />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #FF91A4 0%, transparent 70%)' }} />
          
          <div className="relative p-10">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <span className="text-6xl block mb-4">🏆</span>
              <h2 className="text-4xl font-serif font-bold mb-2 gradient-text">Game Over!</h2>
              <p className="text-white/50 text-sm mb-8 uppercase tracking-[0.3em]">Final Standings</p>
            </motion.div>

            <div className="flex flex-col gap-3 mb-10">
              {sortedScores.length > 0 ? sortedScores.map(([id, score], idx) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.15 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/10 backdrop-blur-sm"
                  style={{
                    background: idx === 0
                      ? 'linear-gradient(135deg, rgba(255,179,71,0.15), rgba(255,145,164,0.1))'
                      : 'rgba(255,255,255,0.05)',
                    borderColor: idx === 0 ? 'rgba(255,179,71,0.3)' : undefined
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl w-8">{medals[idx] || `#${idx + 1}`}</span>
                    <span className="font-medium text-white/90">Player {idx + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold font-mono" style={{ color: idx === 0 ? '#FFB347' : 'white' }}>{score}</span>
                    <span className="text-white/40 text-xs">pts</span>
                  </div>
                </motion.div>
              )) : (
                <p className="text-white/40 py-8">No points scored!</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(255,145,164,0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setMultiplayerGameStarted(false); setRoomId(null); setMultiplayerRound(0); }}
              className="w-full py-4 rounded-2xl font-bold text-lg border-0 cursor-pointer transition-all"
              style={{ background: 'linear-gradient(135deg, #FF91A4, #FFB347)' }}
            >
              Return to Menu
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ═══════════════════════════════════════════
  // Timer ring SVG
  // ═══════════════════════════════════════════
  const timerColor = (timeRemaining >= 0 && timeRemaining <= 5) ? '#FF2400' : (timeRemaining > 5 && timeRemaining <= 10) ? '#FF8C00' : '#4CAF88';
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference * (1 - timerProgress);

  const handleLeaveGame = async () => {
    if (!confirm('Are you sure you want to leave the game?')) return;
    if (isHost && roomId) {
      await supabase.from('rooms').delete().eq('id', roomId);
      channelRef.current?.send({ type: 'broadcast', event: 'game_over', payload: {} });
    }
    setMultiplayerGameStarted(false);
    setRoomId(null);
    setMultiplayerRound(0);
  };

  // ═══════════════════════════════════════════
  // MAIN GAME UI
  // ═══════════════════════════════════════════
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col mt-6">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between mb-5 px-2">
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLeaveGame}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border"
          style={{
            color: '#ff6b6b',
            background: 'rgba(255,107,107,0.08)',
            borderColor: 'rgba(255,107,107,0.2)',
          }}
        >
          <span className="text-lg">←</span> Leave Game
        </motion.button>

        {/* Scoreboard mini */}
        <div className="flex items-center gap-3">
          {Object.entries(scores).map(([id, score]) => (
            <div key={id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-white/50">P</span>
              <span className="text-yellow-300 font-mono">{score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* ═══ GAME AREA ═══ */}
        <div className="flex-1 relative overflow-hidden rounded-3xl border border-white/10" style={{ background: 'linear-gradient(160deg, rgba(10,8,25,0.92), rgba(20,12,40,0.88))', minHeight: '440px' }}>
          {/* Ambient glow orbs */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #FF91A4 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #FFB347 0%, transparent 70%)', filter: 'blur(40px)' }} />

          <div className="relative p-8 flex flex-col items-center justify-center h-full">
            {/* Round + Timer Header */}
            <div className="w-full flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-[0.2em]" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Round {round}/{roomConfig.num_songs}
                </div>
                {refreshDetected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: 'rgba(255,179,71,0.15)', color: '#FFB347', border: '1px solid rgba(255,179,71,0.3)' }}
                  >
                    ↻ Reconnected
                  </motion.div>
                )}
              </div>

              {/* Timer Ring */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="absolute inset-0 -rotate-90" width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                  <circle
                    cx="40" cy="40" r="36"
                    fill="none"
                    stroke={timerColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 0.3s linear, stroke 0.5s ease' }}
                  />
                </svg>
                <span
                  className={`text-2xl font-bold font-mono z-10 ${(timeRemaining >= 0 && timeRemaining <= 5) ? 'timer-danger' : ''}`}
                  style={{ color: timerColor, textShadow: `0 0 12px ${timerColor}40` }}
                >
                  {timeRemaining < 0 ? (roomConfig?.time_per_song || 0) : timeRemaining}
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex items-center justify-center w-full">
              <AnimatePresence mode="wait">
                {refreshDetected && !currentSong ? (
                  <motion.div key="reconnecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <div className="w-10 h-10 rounded-full border-2 border-t-transparent border-amber-400/60 animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-amber-300 mb-2">Reconnecting...</h2>
                    <p className="text-white/40 text-sm">Syncing game state...</p>
                  </motion.div>
                ) : roundWinner ? (
                  <motion.div key="winner" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <motion.div
                      animate={{ rotate: [0, -5, 5, -5, 0] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-5xl mb-4"
                    >
                      🎉
                    </motion.div>
                    <h2 className="text-2xl font-bold mb-3" style={{ color: '#4CAF88' }}>
                      {roundWinner.split('@')[0]} guessed it!
                    </h2>
                    <p className="text-xl font-serif italic text-white/90">
                      {currentSong?.song_name}
                    </p>
                    <p className="text-white/40 mt-2 text-sm">
                      from <span className="text-white/60">{currentSong?.movie_name}</span>
                    </p>
                  </motion.div>
                ) : timeRemaining === 0 && currentSong ? (
                  <motion.div key="timeout" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <span className="text-5xl block mb-4">⏰</span>
                    <h2 className="text-2xl font-bold mb-3" style={{ color: '#E85555' }}>Time&apos;s Up!</h2>
                    <p className="text-xl font-serif italic text-white/90">
                      {currentSong.song_name}
                    </p>
                    <p className="text-white/40 mt-2 text-sm">
                      from <span className="text-white/60">{currentSong.movie_name}</span>
                    </p>
                  </motion.div>
                ) : currentSong ? (
                  <motion.div key={currentSong.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center w-full px-4">
                    <div className="mb-4 opacity-30 text-3xl">&ldquo;</div>
                    <p className="font-serif text-2xl sm:text-3xl italic leading-relaxed tracking-wide text-shadow-glow" style={{ color: 'var(--text-primary)' }}>
                      {currentSong.english_reinterpretation}
                    </p>
                    <div className="mt-4 opacity-30 text-3xl">&rdquo;</div>
                  </motion.div>
                ) : (
                  <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <div className="flex items-center gap-2 mb-3">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: 'linear-gradient(135deg, #FF91A4, #FFB347)' }}
                        />
                      ))}
                    </div>
                    <p className="text-lg text-white/50">Get ready...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ═══ CHAT AREA ═══ */}
        <div className="w-full md:w-80 flex flex-col rounded-3xl overflow-hidden border border-white/10" style={{ background: 'linear-gradient(180deg, rgba(10,8,25,0.95), rgba(15,10,30,0.92))', height: '500px' }}>
          {/* Chat Header */}
          <div className="px-5 py-4 flex items-center gap-3 border-b border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4CAF88', boxShadow: '0 0 8px rgba(76,175,136,0.6)' }} />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">Live Chat</span>
            <span className="ml-auto text-[10px] text-white/30 font-mono">{messages.length} msgs</span>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-white/20 text-sm italic">No messages yet...</p>
              </div>
            )}
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`text-sm px-3 py-2 rounded-xl ${
                  msg.isCorrect
                    ? 'font-bold border'
                    : msg.sender === 'System'
                    ? 'italic'
                    : ''
                }`}
                style={{
                  background: msg.isCorrect
                    ? 'rgba(76,175,136,0.15)'
                    : msg.sender === 'System'
                    ? 'rgba(255,179,71,0.08)'
                    : 'rgba(255,255,255,0.04)',
                  borderColor: msg.isCorrect ? 'rgba(76,175,136,0.3)' : 'transparent',
                  color: msg.isCorrect
                    ? '#6EEEA8'
                    : msg.sender === 'System'
                    ? '#FFB347'
                    : 'rgba(255,255,255,0.8)',
                }}
              >
                <span className="opacity-50 mr-1.5 text-xs">{msg.sender.split('@')[0]}:</span>
                {msg.text}
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/8 flex gap-2" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your guess..."
              className="flex-1 text-sm py-2.5 px-4 rounded-xl border-0 outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'white',
                fontFamily: 'inherit',
              }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!chatInput.trim()}
              className="px-5 py-2.5 rounded-xl text-sm font-bold border-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              style={{
                background: chatInput.trim() ? 'linear-gradient(135deg, #FF91A4, #FFB347)' : 'rgba(255,255,255,0.06)',
                color: 'white',
              }}
            >
              Send
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
