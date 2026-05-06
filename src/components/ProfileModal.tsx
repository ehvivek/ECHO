'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile, useGameStore } from '@/store/useGameStore';
import { supabase } from '@/lib/supabase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfile: Profile | null;
  isOwnProfile: boolean;
}

export default function ProfileModal({ isOpen, onClose, targetProfile, isOwnProfile }: ProfileModalProps) {
  const { setProfile, user } = useGameStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ displayName: '', bio: '', username: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [friendStats, setFriendStats] = useState({ friends: 0, sent: 0, received: 0 });

  useEffect(() => {
    if (isOpen && targetProfile) {
      setEditForm({
        displayName: targetProfile.display_name || '',
        bio: targetProfile.bio || '',
        username: targetProfile.username || ''
      });
      setAvatarPreview(targetProfile.avatar_url);
      setIsEditing(false);
      setErrorMsg('');

      if (isOwnProfile) {
        fetchFriendStats();
      }
    }
  }, [isOpen, targetProfile, isOwnProfile]);

  const fetchFriendStats = async () => {
    if (!targetProfile) return;
    const { data } = await supabase
      .from('friend_requests')
      .select('*')
      .or(`sender_id.eq.${targetProfile.id},receiver_id.eq.${targetProfile.id}`);
      
    if (data) {
      setFriendStats({
        friends: data.filter(r => r.status === 'accepted').length,
        sent: data.filter(r => r.sender_id === targetProfile.id && r.status === 'pending').length,
        received: data.filter(r => r.receiver_id === targetProfile.id && r.status === 'pending').length,
      });
    }
  };


  if (!isOpen || !targetProfile) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    setErrorMsg('');

    try {
      let avatarUrl = targetProfile.avatar_url;

      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatarUrl = publicUrlData.publicUrl;
      }

      const { data: newProfile, error } = await supabase
        .from('profiles')
        .update({
          display_name: editForm.displayName.trim(),
          bio: editForm.bio.trim(),
          username: editForm.username.toLowerCase().trim(),
          avatar_url: avatarUrl
        })
        .eq('id', targetProfile.id)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') throw new Error('Username is already taken.');
        throw error;
      }

      if (isOwnProfile) {
        setProfile(newProfile as Profile);
      }
      setIsEditing(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) { isEditing ? setIsEditing(false) : onClose(); } }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={() => { isEditing ? setIsEditing(false) : onClose(); }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl"
          style={{ background: 'linear-gradient(160deg, rgba(10,8,25,0.97), rgba(20,12,40,0.94))' }}
        >
          {/* Decorative orbs */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #FF91A4, transparent 70%)', filter: 'blur(40px)' }} />

          {/* Close / Back */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { isEditing ? setIsEditing(false) : onClose(); }}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-10"
          >
            {isEditing ? '←' : '✕'}
          </motion.button>

          <div className="relative p-8">
            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Avatar */}
                  <div className="relative mb-5">
                    <div className="w-24 h-24 rounded-full p-[3px]" style={{ background: 'linear-gradient(135deg, #FF91A4, #8B5CF6, #FFB347)' }}>
                      <div className="w-full h-full rounded-full overflow-hidden bg-black/80 flex items-center justify-center">
                        {targetProfile.avatar_url ? (
                          <img src={targetProfile.avatar_url} alt={targetProfile.username} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-bold text-3xl">{targetProfile.username.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                    {isOwnProfile && (
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-[10px]" style={{ background: 'linear-gradient(135deg, #4CAF88, #2E7D5B)', border: '2px solid rgba(10,8,25,0.97)' }}>
                        ✓
                      </div>
                    )}
                  </div>

                  {/* Name & Username */}
                  <h2 className="text-2xl font-bold text-white mb-0.5">{targetProfile.display_name || targetProfile.username}</h2>
                  <p className="text-sm font-mono tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>@{targetProfile.username}</p>

                  {/* Bio */}
                  {targetProfile.bio && (
                    <p className="text-white/60 text-sm mb-6 max-w-[280px] leading-relaxed italic">&ldquo;{targetProfile.bio}&rdquo;</p>
                  )}

                  {/* Friend Stats (own profile only) */}
                  {isOwnProfile && (
                    <div className="grid grid-cols-3 gap-2 w-full mb-6">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        onClick={() => { window.dispatchEvent(new CustomEvent('open-search-modal-tab', { detail: { tab: 'friends' } })); onClose(); }}
                        className="flex flex-col items-center py-3 rounded-xl cursor-pointer transition-all"
                        style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}
                      >
                        <span className="text-[9px] uppercase tracking-wider text-blue-400/60 mb-1">Friends</span>
                        <span className="text-lg font-bold text-blue-400 font-mono">{friendStats.friends}</span>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        onClick={() => { window.dispatchEvent(new CustomEvent('open-search-modal-tab', { detail: { tab: 'sent' } })); onClose(); }}
                        className="flex flex-col items-center py-3 rounded-xl cursor-pointer transition-all"
                        style={{ background: 'rgba(255,179,71,0.06)', border: '1px solid rgba(255,179,71,0.12)' }}
                      >
                        <span className="text-[9px] uppercase tracking-wider text-amber-400/60 mb-1">Sent</span>
                        <span className="text-lg font-bold text-amber-400 font-mono">{friendStats.sent}</span>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        onClick={() => { window.dispatchEvent(new CustomEvent('open-search-modal-tab', { detail: { tab: 'requests' } })); onClose(); }}
                        className="flex flex-col items-center py-3 rounded-xl cursor-pointer transition-all"
                        style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}
                      >
                        <span className="text-[9px] uppercase tracking-wider text-red-400/60 mb-1">Received</span>
                        <span className="text-lg font-bold text-red-400 font-mono">{friendStats.received}</span>
                      </motion.div>
                    </div>
                  )}

                  {/* Actions */}
                  {isOwnProfile ? (
                    <div className="w-full flex flex-col gap-2.5">
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 6px 24px rgba(255,145,164,0.3)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setIsEditing(true)}
                        className="w-full py-3.5 rounded-2xl font-bold text-sm cursor-pointer border-0 transition-all"
                        style={{ background: 'linear-gradient(135deg, #FF91A4, #FFB347)', color: 'white' }}
                      >
                        Edit Profile
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={async () => {
                          await supabase.auth.signOut();
                          onClose();
                        }}
                        className="w-full py-3 rounded-2xl font-bold text-sm cursor-pointer transition-all"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}
                      >
                        Log Out
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => alert('Search them via the Search icon to add as friend first!')}
                      className="w-full py-3.5 rounded-2xl font-bold text-sm cursor-pointer border-0 transition-all"
                      style={{ background: 'linear-gradient(135deg, #FF91A4, #FFB347)', color: 'white' }}
                    >
                      View Friendship
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                <motion.form
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSaveProfile}
                  className="flex flex-col gap-5 mt-2"
                >
                  <h2 className="text-xl font-bold text-center gradient-text">Edit Profile</h2>
                  
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center mb-1">
                    <label className="cursor-pointer relative group">
                      <div className="w-20 h-20 rounded-full p-[2px]" style={{ background: avatarPreview ? 'linear-gradient(135deg, #FF91A4, #8B5CF6)' : 'rgba(255,255,255,0.1)' }}>
                        <div className="w-full h-full rounded-full overflow-hidden bg-black/80 flex items-center justify-center">
                          {avatarPreview ? <img src={avatarPreview} className="w-full h-full object-cover" /> : <span className="text-2xl">📷</span>}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <span className="text-white text-xs font-bold">Upload</span>
                      </div>
                      <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </label>
                    <span className="text-[10px] text-white/30 mt-2">Click to change avatar</span>
                  </div>

                  {/* Fields */}
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5 font-bold">Username</label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={e => setEditForm({...editForm, username: e.target.value.replace(/\s/g, '').toLowerCase()})}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'inherit' }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5 font-bold">Display Name</label>
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={e => setEditForm({...editForm, displayName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5 font-bold">Bio</label>
                    <textarea
                      value={editForm.bio}
                      onChange={e => setEditForm({...editForm, bio: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none h-20 resize-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'inherit' }}
                    />
                  </div>

                  {errorMsg && (
                    <div className="px-4 py-2.5 rounded-xl text-sm text-center" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                      {errorMsg}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(255,145,164,0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl font-bold text-sm cursor-pointer border-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    style={{ background: 'linear-gradient(135deg, #FF91A4, #FFB347)', color: 'white' }}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
