'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Difficulty } from '@/types';

interface RoomMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (config: any) => void;
  onJoinRoom: (roomId: string, password?: string) => void;
}

export default function RoomMenuModal({ isOpen, onClose, onCreateRoom, onJoinRoom }: RoomMenuModalProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  
  // Create state
  const [roomName, setRoomName] = useState('');
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [timePerSong, setTimePerSong] = useState(30);
  const [numSongs, setNumSongs] = useState(5);
  const [maxPlayers, setMaxPlayers] = useState(2);

  // Join state
  const [joinCode, setJoinCode] = useState('');
  const [joinPassword, setJoinPassword] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-card relative w-full max-w-md p-6 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors text-xl z-10"
          >
            ✕
          </button>

          <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
            <button
              onClick={() => setActiveTab('create')}
              className={`text-lg font-bold transition-colors ${activeTab === 'create' ? 'text-white' : 'text-white/40'}`}
            >
              Create Room
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`text-lg font-bold transition-colors ${activeTab === 'join' ? 'text-white' : 'text-white/40'}`}
            >
              Join Room
            </button>
          </div>

          {activeTab === 'create' ? (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Room Name</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g. Chill Vibes Only"
                  className="echo-input w-full text-sm py-2 px-3"
                  maxLength={30}
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">Difficulty</label>
                <div className="flex gap-2">
                  {['easy', 'medium', 'hard'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d as Difficulty)}
                      className={`flex-1 py-1.5 rounded border text-sm transition-colors ${
                        difficulty === d ? 'bg-white/20 border-white/50 text-white' : 'bg-transparent border-white/10 text-white/50'
                      }`}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-white/70 mb-1">Time: {timePerSong}s</label>
                  <input type="range" min="15" max="60" step="15" value={timePerSong} onChange={(e) => setTimePerSong(Number(e.target.value))} className="w-full accent-white" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-white/70 mb-1">Songs: {numSongs}</label>
                  <input type="range" min="1" max="10" step="1" value={numSongs} onChange={(e) => setNumSongs(Number(e.target.value))} className="w-full accent-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">Max Players</label>
                <div className="flex gap-2">
                  {[2, 3, 4].map((p) => (
                    <button
                      key={p}
                      onClick={() => setMaxPlayers(p)}
                      className={`flex-1 py-1.5 rounded border text-sm transition-colors ${
                        maxPlayers === p ? 'bg-white/20 border-white/50 text-white' : 'bg-transparent border-white/10 text-white/50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded border border-white/10">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input type="checkbox" checked={hasPassword} onChange={(e) => setHasPassword(e.target.checked)} className="accent-white" />
                  <span className="text-sm font-bold">Password Protection</span>
                </label>
                {hasPassword && (
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Set a password..."
                    className="echo-input w-full text-sm py-1.5 px-3"
                  />
                )}
              </div>

              <button
                onClick={() => onCreateRoom({ roomName, difficulty, timePerSong, numSongs, maxPlayers, hasPassword, password })}
                disabled={hasPassword && !password}
                className="btn-primary mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Room
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5 py-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Room Code</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. X7K9A2"
                  className="echo-input text-center tracking-widest text-xl uppercase mb-4"
                  maxLength={6}
                />
                
                <label className="block text-sm text-white/70 mb-2">Password (Optional)</label>
                <input
                  type="password"
                  value={joinPassword}
                  onChange={(e) => setJoinPassword(e.target.value)}
                  placeholder="Leave blank if no password"
                  className="echo-input w-full text-center text-sm py-2 px-3"
                />
              </div>
              <button
                onClick={() => onJoinRoom(joinCode, joinPassword)}
                disabled={joinCode.length < 4}
                className="btn-primary mt-2 disabled:opacity-50"
              >
                Join Room
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
