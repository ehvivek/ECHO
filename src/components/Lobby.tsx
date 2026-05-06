'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { supabase } from '@/lib/supabase';
import ConfirmModal from './ConfirmModal';

interface Player {
  id: string;
  email: string;
  isHost: boolean;
}

export default function Lobby() {
  const { user, roomId, setRoomId } = useGameStore();
  const [players, setPlayers] = useState<Player[]>([]);
  const [roomConfig, setRoomConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ isOpen: boolean, message: string, onConfirm: () => void } | null>(null);

  useEffect(() => {
    if (!roomId || !user) return;

    // Fetch room config
    supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          alert('Room error');
          setRoomId(null);
          return;
        }
        setRoomConfig(data);
        setLoading(false);
      });

    // Set up presence
    const roomChannel = supabase.channel(`room:${roomId}`, {
      config: { presence: { key: user.id } },
    });

    roomChannel
      .on('presence', { event: 'sync' }, () => {
        const state = roomChannel.presenceState();
        const connectedPlayers = Object.keys(state).map((presenceId) => {
          const pData = state[presenceId][0] as any;
          return {
            id: pData.user_id,
            email: pData.email,
            isHost: pData.user_id === roomConfig?.host_id,
          };
        });
        setPlayers(connectedPlayers);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await roomChannel.track({
            user_id: user.id,
            email: user.email,
          });
        }
      });

    roomChannel.on('broadcast', { event: 'start_game' }, () => {
      useGameStore.getState().setMultiplayerGameStarted(true);
    });

    return () => {
      supabase.removeChannel(roomChannel);
    };
  }, [roomId, user, roomConfig?.host_id, setRoomId]);

  const handleCopyCode = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading || !roomConfig) {
    return (
      <div className="w-full max-w-xl mx-auto mt-20 flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-t-transparent border-white/40 animate-spin" />
        <p className="text-white/60 text-lg animate-pulse">Loading Lobby...</p>
      </div>
    );
  }

  const isHost = user?.id === roomConfig.host_id;

  const handleStartGame = () => {
    if (!isHost) return;
    supabase.channel(`room:${roomId}`).send({
      type: 'broadcast',
      event: 'start_game',
      payload: {},
    });
    supabase.from('rooms').update({ status: 'playing' }).eq('id', roomId).then();
    useGameStore.getState().setMultiplayerGameStarted(true);
  };

  const handleLeave = () => {
    setRoomId(null);
  };

  const handleDeleteRoom = async () => {
    if (!isHost) return;
    setConfirmAction({
      isOpen: true,
      message: 'Are you sure you want to delete this room?',
      onConfirm: async () => {
        await supabase.from('rooms').delete().eq('id', roomId);
        setRoomId(null);
      }
    });
  };

  const diffLabel: Record<string, { color: string; bg: string }> = {
    easy: { color: '#4CAF88', bg: 'rgba(76,175,136,0.12)' },
    medium: { color: '#FFB347', bg: 'rgba(255,179,71,0.12)' },
    hard: { color: '#E85555', bg: 'rgba(232,85,85,0.12)' },
  };
  const diff = diffLabel[roomConfig.difficulty] || diffLabel.medium;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto mt-10 relative"
    >
      <ConfirmModal
        isOpen={!!confirmAction?.isOpen}
        message={confirmAction?.message || ''}
        onConfirm={() => {
          if (confirmAction?.onConfirm) confirmAction.onConfirm();
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />

      <div className="relative overflow-hidden rounded-3xl border border-white/10" style={{ background: 'linear-gradient(160deg, rgba(10,8,25,0.95), rgba(20,12,40,0.9))' }}>
        {/* Decorative orbs */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #FF91A4, transparent 70%)', filter: 'blur(30px)' }} />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #FFB347, transparent 70%)', filter: 'blur(30px)' }} />

        <div className="relative p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold gradient-text mb-1">Lobby</h2>
              <p className="text-white/40 text-sm">Waiting for players to join...</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] mb-2">Room Code</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCopyCode}
                className="px-5 py-2.5 rounded-xl font-mono text-xl tracking-[0.2em] cursor-pointer border transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderColor: copied ? 'rgba(76,175,136,0.5)' : 'rgba(255,255,255,0.12)',
                  color: copied ? '#4CAF88' : 'white',
                }}
              >
                {copied ? '✓ Copied' : roomId}
              </motion.button>
            </div>
          </div>

          {/* Config Pills */}
          <div className="flex gap-3 mb-8">
            <div className="flex-1 flex flex-col items-center py-3 rounded-xl" style={{ background: diff.bg, border: `1px solid ${diff.color}20` }}>
              <span className="text-[10px] uppercase tracking-wider mb-1" style={{ color: `${diff.color}99` }}>Difficulty</span>
              <span className="text-base font-bold capitalize" style={{ color: diff.color }}>{roomConfig.difficulty}</span>
            </div>
            <div className="flex-1 flex flex-col items-center py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Songs</span>
              <span className="text-base font-bold text-white">{roomConfig.num_songs}</span>
            </div>
            <div className="flex-1 flex flex-col items-center py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Timer</span>
              <span className="text-base font-bold text-white">{roomConfig.time_per_song}s</span>
            </div>
          </div>

          {/* Players Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white/60">
                Players
              </h3>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                {players.length}/{roomConfig.max_players}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <AnimatePresence>
                {players.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex justify-between items-center px-4 py-3.5 rounded-xl border transition-colors"
                    style={{
                      background: p.isHost ? 'rgba(255,179,71,0.06)' : 'rgba(255,255,255,0.04)',
                      borderColor: p.isHost ? 'rgba(255,179,71,0.15)' : 'rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #FF91A4, #FFB347)' }}>
                        {p.email.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-sm text-white/90">{p.email.split('@')[0]}</span>
                    </div>
                    {p.isHost && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,179,71,0.15)', color: '#FFB347' }}>
                        Host
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {Array.from({ length: roomConfig.max_players - players.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex items-center px-4 py-3.5 rounded-xl border border-dashed"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.015)' }}
                >
                  <div className="w-9 h-9 rounded-full mr-3" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  <span className="text-sm italic text-white/20">Waiting...</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isHost ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDeleteRoom}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm cursor-pointer border transition-all"
                style={{ background: 'rgba(232,85,85,0.08)', borderColor: 'rgba(232,85,85,0.2)', color: '#E85555' }}
              >
                Delete Room
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLeave}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm cursor-pointer border transition-all"
                style={{ background: 'rgba(255,179,71,0.08)', borderColor: 'rgba(255,179,71,0.2)', color: '#FFB347' }}
              >
                Leave Room
              </motion.button>
            )}

            {isHost ? (
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(255,145,164,0.4)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStartGame}
                disabled={players.length < 2}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm cursor-pointer border-0 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                style={{ background: 'linear-gradient(135deg, #FF91A4, #FFB347)', color: 'white' }}
              >
                Start Game
              </motion.button>
            ) : (
              <div className="flex-1 py-3.5 rounded-xl font-bold text-sm text-center border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }}>
                Waiting for Host...
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
