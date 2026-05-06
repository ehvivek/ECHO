'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { supabase } from '@/lib/supabase';

interface MatchmakingScreenProps {
  isOpen: boolean;
  onCancel: () => void;
  onMatchFound: (roomId: string) => void;
}

export default function MatchmakingScreen({ isOpen, onCancel, onMatchFound }: MatchmakingScreenProps) {
  const { user } = useGameStore();
  const [timer, setTimer] = useState(0);
  const [statusText, setStatusText] = useState('Searching for opponent...');

  useEffect(() => {
    if (!isOpen || !user) return;

    let interval = setInterval(() => {
      setTimer(t => {
        if (t >= 30) {
          handleTimeout();
          return t;
        }
        return t + 1;
      });
    }, 1000);

    startMatchmaking();

    const sub = supabase
      .channel(`queue_${user.id}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'matchmaking_queue',
        filter: `player_id=eq.${user.id}`
      }, (payload) => {
        if (payload.new.status === 'matched' && payload.new.assigned_room_id) {
          setStatusText('Match Found! Joining...');
          setTimeout(() => {
            onMatchFound(payload.new.assigned_room_id);
          }, 1500);
        }
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(sub);
      leaveQueue();
      setTimer(0);
    };
  }, [isOpen, user]);

  const leaveQueue = async () => {
    if (!user) return;
    await supabase.from('matchmaking_queue').delete().eq('player_id', user.id);
  };

  const handleTimeout = async () => {
    setStatusText('No players found. Try again.');
    await leaveQueue();
    setTimeout(() => {
      onCancel();
    }, 2000);
  };

  const startMatchmaking = async () => {
    if (!user) return;
    
    // 1. Try to find someone already searching
    const { data: waitingPlayers } = await supabase
      .from('matchmaking_queue')
      .select('player_id')
      .eq('status', 'searching')
      .neq('player_id', user.id)
      .limit(1);

    if (waitingPlayers && waitingPlayers.length > 0) {
      // MATCH FOUND! We are the second player.
      setStatusText('Match Found! Creating Lobby...');
      const opponentId = waitingPlayers[0].player_id;

      // Create a 1v1 Room
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let newRoomId = '';
      for (let i = 0; i < 6; i++) {
        newRoomId += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      await supabase.from('rooms').insert({
        id: newRoomId,
        name: '1v1 Match',
        host_id: user.id,
        difficulty: 'medium',
        time_per_song: 30,
        num_songs: 5,
        max_players: 2,
        status: 'waiting'
      });

      // Notify the opponent by updating their queue row
      await supabase.from('matchmaking_queue')
        .update({ status: 'matched', assigned_room_id: newRoomId })
        .eq('player_id', opponentId);

      // Join the room ourselves
      setTimeout(() => {
        onMatchFound(newRoomId);
      }, 1000);

    } else {
      // 2. No one is searching, insert ourselves into the queue
      await supabase.from('matchmaking_queue').upsert({
        player_id: user.id,
        status: 'searching',
        assigned_room_id: null
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex flex-col items-center justify-center"
        >
          {/* Radar Animation */}
          <div className="relative w-48 h-48 flex items-center justify-center mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/30"></div>
            <motion.div
              animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-purple-500/40"
            />
            <motion.div
              animate={{ scale: [1, 2], opacity: [0.8, 0] }}
              transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-purple-500/40"
            />
            <div className="z-10 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.8)] text-2xl">
              🎲
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 text-shadow-glow">{statusText}</h2>
          
          {statusText === 'Searching for opponent...' && (
            <p className="text-purple-300 font-mono text-xl mb-8">00:{(30 - timer).toString().padStart(2, '0')}</p>
          )}

          <button
            onClick={() => { leaveQueue(); onCancel(); }}
            className="text-white/50 hover:text-white border border-white/20 hover:border-white/50 px-6 py-2 rounded-full transition-colors"
          >
            Cancel Matchmaking
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
