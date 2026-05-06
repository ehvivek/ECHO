'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { supabase } from '@/lib/supabase';
import { sounds } from '@/lib/sounds';
import ProfileModal from './ProfileModal';
import InboxModal from './InboxModal';
import SearchModal from './SearchModal';

export default function TopNav() {
  const { user, profile } = useGameStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [pendingFriendRequestsCount, setPendingFriendRequestsCount] = useState(0);

  useEffect(() => {
    if (!profile) return;

    const fetchCounts = async () => {
      const { count: msgCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', profile.id)
        .eq('seen', false);
        
      const { count: msgReqCount } = await supabase
        .from('message_requests')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', profile.id)
        .eq('status', 'pending');

      const { count: friendReqCount } = await supabase
        .from('friend_requests')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', profile.id)
        .eq('status', 'pending');

      setUnreadMessagesCount((msgCount || 0) + (msgReqCount || 0));
      setPendingFriendRequestsCount(friendReqCount || 0);
    };

    fetchCounts();

    const sub1 = supabase
      .channel('global_friend_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'friend_requests', filter: `receiver_id=eq.${profile.id}` }, () => {
        sounds.playNotification();
        fetchCounts();
      })
      .subscribe();

    const sub2 = supabase
      .channel('global_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${profile.id}` }, () => {
        sounds.playNotification();
        fetchCounts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'message_requests', filter: `receiver_id=eq.${profile.id}` }, () => {
        fetchCounts();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages', filter: `receiver_id=eq.${profile.id}` }, () => {
        fetchCounts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sub1);
      supabase.removeChannel(sub2);
    };
  }, [profile]);

  // Don't show if not logged in or hasn't completed onboarding
  if (!user || !profile) return null;

  return (
    <>
      <div className="fixed top-6 left-6 z-40 flex items-center gap-4">
        {/* Profile Icon */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsProfileOpen(true)}
          className="relative group"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-white/50 transition-colors bg-black/40 flex items-center justify-center shadow-lg">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-lg">
                {profile.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </motion.button>

        {/* Search Icon */}
        <motion.button
          id="global-search-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setIsSearchOpen(true); setPendingFriendRequestsCount(0); }}
          className="w-12 h-12 rounded-full border border-white/10 bg-black/40 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors shadow-lg relative"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {pendingFriendRequestsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-black/80 shadow-lg">
              {pendingFriendRequestsCount > 99 ? '99+' : pendingFriendRequestsCount}
            </span>
          )}
        </motion.button>

        {/* Message Icon */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setIsInboxOpen(true); setUnreadMessagesCount(0); }}
          className="w-12 h-12 rounded-full border border-white/10 bg-black/40 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors shadow-lg relative"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-black/80 shadow-lg">
              {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
            </span>
          )}
        </motion.button>
      </div>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        targetProfile={profile} 
        isOwnProfile={true} 
      />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <InboxModal isOpen={isInboxOpen} onClose={() => setIsInboxOpen(false)} />
    </>
  );
}
