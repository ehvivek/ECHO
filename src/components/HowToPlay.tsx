'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HowToPlay() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-center text-sm py-2 cursor-pointer transition-colors text-shadow-glow"
        style={{ color: 'var(--text-primary)' }}
      >
        {open ? '▾' : '▸'} How to Play
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className="glass-card-subtle p-4 text-sm space-y-2 mt-2"
              style={{ color: 'var(--text-primary)' }}
            >
              <p>bruhh… it’s literally that easy to play. what made you click on “how to play” 🤣</p>
              <p>awww still confused ? no worries 😭 just ask me ~ yeah, the creator’s right here , contact me</p>
              <div className="flex gap-4 mt-4 mb-2 justify-center">
                <a 
                  href="https://www.linkedin.com/in/vivekk52/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[var(--primary)] transition-colors group"
                  title="LinkedIn"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                
                <a 
                  href="mailto:ehv1v3k@gmail.com" 
                  className="hover:text-[var(--primary)] transition-colors group"
                  title="Email Me"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 group-hover:scale-110 transition-transform">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
