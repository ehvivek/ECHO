'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm p-6 bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] text-center flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-3xl mb-4 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
              ⚠️
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 text-shadow-glow">Confirm Action</h3>
            <p className="text-white/70 mb-8">{message}</p>

            <div className="flex gap-4 w-full">
              <button
                onClick={onCancel}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-colors shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
