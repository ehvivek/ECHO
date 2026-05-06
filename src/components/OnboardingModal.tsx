'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useGameStore, Profile } from '@/store/useGameStore';

export default function OnboardingModal() {
  const { user, requiresOnboarding, setAuth } = useGameStore();
  
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!requiresOnboarding || !user) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    if (!username.trim() || username.includes(' ')) {
      setErrorMsg('Username is required and cannot contain spaces.');
      setIsLoading(false);
      return;
    }

    try {
      let avatarUrl = null;

      // 1. Upload Avatar if selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);
          
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        avatarUrl = publicUrlData.publicUrl;
      }

      // 2. Insert Profile
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: username.toLowerCase().trim(),
          display_name: displayName.trim() || username.trim(),
          bio: bio.trim(),
          avatar_url: avatarUrl
        })
        .select()
        .single();

      if (profileError) {
        if (profileError.code === '23505') { // Unique constraint violation
          throw new Error('That username is already taken!');
        }
        throw profileError;
      }

      // 3. Update Store
      const session = (await supabase.auth.getSession()).data.session;
      setAuth(user, session, newProfile as Profile, false);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to create profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-card w-full max-w-md p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-serif font-bold text-shadow-glow text-white">
              Welcome to EchoLyrics!
            </h2>
            <p className="text-white/60 mt-2">
              Let's set up your profile before you start playing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <label className="cursor-pointer relative group">
                <div className={`w-24 h-24 rounded-full border-2 overflow-hidden flex items-center justify-center transition-colors ${avatarPreview ? 'border-pink-300' : 'border-white/20 hover:border-white/50 bg-white/5'}`}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">📷</span>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold">Upload</span>
                </div>
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
              <span className="text-xs text-white/40 mt-2">Optional</span>
            </div>

            {/* Username Input */}
            <div>
              <label className="block text-sm font-bold text-white/80 mb-1">
                Username <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-bold">@</span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
                  className="echo-input w-full pl-8 py-2 text-white placeholder-white/20 lowercase"
                  placeholder="coolgamer99"
                  maxLength={20}
                />
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-bold text-white/80 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="echo-input w-full px-3 py-2 text-white placeholder-white/20"
                placeholder="Optional (defaults to username)"
                maxLength={30}
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-bold text-white/80 mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="echo-input w-full px-3 py-2 text-white placeholder-white/20 resize-none h-20"
                placeholder="A short description about yourself..."
                maxLength={150}
              />
            </div>

            {errorMsg && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded text-sm text-center">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary mt-2 w-full flex justify-center items-center h-12"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Save Profile'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
