'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { supabase } from '@/lib/supabase';
import LoginModal from './LoginModal';
import RoomMenuModal from './RoomMenuModal';
import PasswordModal from './PasswordModal';
import MatchmakingScreen from './MatchmakingScreen';
import ConfirmModal from './ConfirmModal';

async function hashPassword(password: string) {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function MultiplayerMenu() {
  const { user, profile, setRoomId } = useGameStore();
  const [currentView, setCurrentView] = useState<'menu' | 'liveRooms'>('menu');
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [liveRooms, setLiveRooms] = useState<any[]>([]);

  // Password joining state
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // 1v1 Queue state
  const [isSearching, setIsSearching] = useState(false);

  // Global error toast state
  const [errorMsg, setErrorMsg] = useState('');

  const [confirmAction, setConfirmAction] = useState<{ isOpen: boolean, message: string, onConfirm: () => void } | null>(null);

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 4000);
  };

  useEffect(() => {
    if (!user || currentView !== 'liveRooms') return;
    fetchRooms();

    const sub = supabase
      .channel('live_rooms')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => {
        fetchRooms();
      })
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, [user, currentView]);

  const fetchRooms = async () => {
    // Fetch rooms first
    const { data: roomsData, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('status', 'waiting');

    if (error) {
      console.error('Error fetching rooms:', error.message);
      showError('Failed to fetch rooms: ' + error.message);
      return;
    }

    if (roomsData && roomsData.length > 0) {
      // Fetch host profiles manually to bypass schema cache issues!
      const hostIds = roomsData.map(r => r.host_id);
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', hostIds);

      // Merge them together
      const enrichedRooms = roomsData.map(room => ({
        ...room,
        host: profilesData?.find(p => p.id === room.host_id) || { username: 'Unknown', display_name: 'Unknown Host' }
      }));
      setLiveRooms(enrichedRooms);
    } else {
      setLiveRooms([]);
    }
  };

  const handleCreateRoom = async (config: any) => {
    if (!user) return;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newRoomId = '';
    for (let i = 0; i < 6; i++) {
      newRoomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    try {
      let hashedPw = null;
      if (config.hasPassword && config.password) {
        hashedPw = await hashPassword(config.password);
      }

      const { error } = await supabase.from('rooms').insert({
        id: newRoomId,
        name: config.roomName || `${profile?.display_name || profile?.username}'s Room`,
        host_id: user.id,
        difficulty: config.difficulty,
        time_per_song: config.timePerSong,
        num_songs: config.numSongs,
        max_players: config.maxPlayers,
        status: 'waiting',
        has_password: config.hasPassword,
        password_hash: hashedPw
      });

      if (error) throw error;
      
      setRoomId(newRoomId);
      setIsRoomModalOpen(false);
    } catch (err: any) {
      console.error('Failed to create room:', err);
      showError('Failed to create room: ' + (err.message || JSON.stringify(err)));
    }
  };

  const attemptJoinRoom = async (room: any) => {
    if (room.has_password) {
      setSelectedRoom(room);
      setPasswordError('');
      setIsPasswordModalOpen(true);
    } else {
      joinRoomDirectly(room.id);
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    if (!selectedRoom) return;
    const hashed = await hashPassword(password);
    if (hashed === selectedRoom.password_hash) {
      setIsPasswordModalOpen(false);
      joinRoomDirectly(selectedRoom.id);
    } else {
      setPasswordError('Incorrect password');
    }
  };

  const joinRoomDirectly = async (roomId: string) => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('rooms').select('status').eq('id', roomId).single();
      if (error || !data || data.status !== 'waiting') {
        showError('Room is no longer available.');
        return;
      }
      setRoomId(roomId);
    } catch (err) {
      showError('Error joining room.');
    }
  };

  const handleJoinByCode = async (roomId: string, password?: string) => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('rooms').select('status, has_password, password_hash').eq('id', roomId).single();
      if (error || !data || data.status !== 'waiting') {
        showError('Room is not available or does not exist.');
        return;
      }

      if (data.has_password) {
        if (!password) {
          showError('This room requires a password.');
          return;
        }
        const hashed = await hashPassword(password);
        if (hashed !== data.password_hash) {
          showError('Incorrect password.');
          return;
        }
      }

      setRoomId(roomId);
    } catch (err) {
      showError('Error joining room.');
    }
  };

  const handleRandomMatchQueue = async () => {
    if (!profile) return;
    setIsSearching(true);
  };

  return (
    <div className="w-full max-w-5xl mt-8 px-4 relative">
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-0 left-1/2 z-[200] bg-red-900/90 text-red-100 px-6 py-3 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.6)] font-bold backdrop-blur-md border border-red-500/50 flex items-center gap-3 whitespace-nowrap"
          >
            <span className="text-xl">⚠️</span>
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!confirmAction?.isOpen}
        message={confirmAction?.message || ''}
        onConfirm={() => {
          if (confirmAction?.onConfirm) confirmAction.onConfirm();
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />

      <MatchmakingScreen isOpen={isSearching} onCancel={() => setIsSearching(false)} onMatchFound={(roomId) => setRoomId(roomId)} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <RoomMenuModal isOpen={isRoomModalOpen} onClose={() => setIsRoomModalOpen(false)} onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinByCode} />
      <PasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} onSubmit={handlePasswordSubmit} error={passwordError} />

      {!user ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card max-w-xl mx-auto p-6 text-center mt-10">
          <h2 className="text-3xl font-serif font-bold text-shadow-glow mb-4">Join the Community</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">Create an account to track your stats, add friends, and compete in live multiplayer rooms.</p>
          <button onClick={() => setIsLoginModalOpen(true)} className="btn-primary">Sign In to Play Multiplayer and unlock profile</button>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {currentView === 'menu' ? (
            <motion.div key="menu" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-center mb-8 text-shadow-glow">Multiplayer Modes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
                
                {/* Create Room Card */}
                <motion.button
                  whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(249,115,22,0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsRoomModalOpen(true)}
                  className="flex flex-col items-center p-8 rounded-2xl bg-gradient-to-br from-orange-900/80 to-pink-600/40 border border-orange-400/30 backdrop-blur-md transition-all shadow-2xl relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="text-5xl mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">🏠</span>
                  <h3 className="text-2xl font-bold text-white mb-2 text-shadow-glow">Create Room</h3>
                  <p className="text-orange-200/80 text-sm text-center">Host a custom private or public lobby with your own rules.</p>
                </motion.button>

                {/* Live Rooms Browser Card */}
                <motion.button
                  whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(59,130,246,0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('liveRooms')}
                  className="flex flex-col items-center p-8 rounded-2xl bg-gradient-to-br from-blue-900/80 to-cyan-600/40 border border-blue-400/30 backdrop-blur-md transition-all shadow-2xl relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="text-5xl mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">🌐</span>
                  <h3 className="text-2xl font-bold text-white mb-2 text-shadow-glow">Live Rooms</h3>
                  <p className="text-blue-200/80 text-sm text-center">Browse and join active public rooms waiting for players.</p>
                </motion.button>

              </div>
            </motion.div>
          ) : (
            <motion.div key="liveRooms" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-white/10 pb-6 mb-2">
                <div className="flex items-center gap-5">
                  <button onClick={() => setCurrentView('menu')} className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 hover:bg-white/10 border border-white/10 text-xl" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                    ←
                  </button>
                  <h2 className="text-4xl font-serif font-bold text-shadow-glow flex items-center gap-4 tracking-wide">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
                    </span>
                    Live Rooms Browser
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => document.getElementById('global-search-btn')?.click()} className="px-6 py-3 rounded-2xl font-semibold tracking-wide flex items-center gap-2 transition-all hover:scale-105 hover:bg-white/10 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.15)] text-white/90" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(12px)' }}>
                    🔍 Find Friends
                  </button>
                  <button onClick={() => setIsRoomModalOpen(true)} className="px-8 py-3 rounded-full font-bold tracking-wide text-white transition-all hover:scale-105 shadow-[0_8px_32px_rgba(255,145,164,0.4)]" style={{ background: 'linear-gradient(135deg, #FF91A4, #FFB347)' }}>
                    + Create Room
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {liveRooms.length === 0 ? (
                    <div className="col-span-full py-16 text-center text-white/50 bg-black/20 rounded-xl border border-white/5 border-dashed">
                      <div className="text-4xl mb-4">🏜️</div>
                      <p className="text-lg">No public rooms available right now.</p>
                      <p className="text-sm">Be the first to create one!</p>
                    </div>
                  ) : (
                    liveRooms.map((room) => (
                      <motion.div key={room.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card-subtle p-5 flex flex-col justify-between border border-white/10 hover:border-white/30 transition-colors group">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-lg truncate pr-2" title={room.name || `Room ${room.id}`}>{room.name || `Room ${room.id}`}</h3>
                            {room.has_password && <span className="text-white/50 bg-black/40 p-1.5 rounded" title="Password Protected">🔒</span>}
                          </div>
                          
                          <div className="flex items-center gap-2 mb-4 bg-black/20 p-2 rounded">
                            <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden">
                              {room.host?.avatar_url ? <img src={room.host.avatar_url} className="w-full h-full object-cover" /> : <span className="w-full h-full flex items-center justify-center font-bold text-xs">{room.host?.username?.[0].toUpperCase() || '?'}</span>}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-white/50">Host</span>
                              <span className="text-sm font-medium">@{room.host?.username || 'unknown'}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                            <div className="bg-white/5 p-2 rounded border border-white/5">
                              <p className="text-white/40 mb-1">Diff</p>
                              <p className="font-bold capitalize text-blue-200">{room.difficulty}</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded border border-white/5">
                              <p className="text-white/40 mb-1">Songs</p>
                              <p className="font-bold">{room.num_songs}</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded border border-white/5">
                              <p className="text-white/40 mb-1">Time</p>
                              <p className="font-bold">{room.time_per_song}s</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="text-sm bg-black/40 px-3 py-1.5 rounded flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Max {room.max_players} Players
                          </div>
                          {room.host_id === user?.id ? (
                            <button onClick={(e) => {
                              e.stopPropagation();
                              setConfirmAction({
                                isOpen: true,
                                message: 'Are you sure you want to delete this room?',
                                onConfirm: async () => {
                                  await supabase.from('rooms').delete().eq('id', room.id);
                                  fetchRooms();
                                }
                              });
                            }} className="bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/40 px-4 py-1.5 rounded font-bold transition-colors">Delete</button>
                          ) : (
                            <button onClick={() => attemptJoinRoom(room)} className="bg-white text-black hover:bg-gray-200 px-4 py-1.5 rounded font-bold transition-colors shadow-lg">Join</button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
