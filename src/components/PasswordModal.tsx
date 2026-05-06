'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  error?: string;
}

export default function PasswordModal({ isOpen, onClose, onSubmit, error }: PasswordModalProps) {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card w-full max-w-sm p-6 shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
          
          <h2 className="text-xl font-bold mb-4 text-center">Room Password Required</h2>
          
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(password); }}>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="echo-input w-full px-4 py-2 mb-4 text-center text-lg tracking-widest"
            />
            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
            <button type="submit" disabled={!password} className="btn-primary w-full disabled:opacity-50">
              Join Room
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
