'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useGameStore, Profile } from '@/store/useGameStore';
import ChatBox from './ChatBox';

interface InboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InboxModal({ isOpen, onClose }: InboxModalProps) {
  const { user, profile } = useGameStore();
  const [activeTab, setActiveTab] = useState<'messages' | 'requests'>('messages');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  
  const [activeChat, setActiveChat] = useState<Profile | null>(null);

  useEffect(() => {
    if (!isOpen || !profile) return;

    fetchData();

    const sub = supabase
      .channel('inbox_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'message_requests' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, [isOpen, profile]);

  const fetchData = async () => {
    if (!profile) return;

    // Fetch accepted conversations
    const { data: convData } = await supabase
      .from('message_requests')
      .select(`
        id, status, sender_id, receiver_id,
        sender:profiles!message_requests_sender_id_fkey(id, username, display_name, avatar_url),
        receiver:profiles!message_requests_receiver_id_fkey(id, username, display_name, avatar_url)
      `)
      .eq('status', 'accepted')
      .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);

    if (convData) setConversations(convData);

    // Fetch pending requests TO me
    const { data: reqData } = await supabase
      .from('message_requests')
      .select(`
        id, status, sender_id, receiver_id,
        sender:profiles!message_requests_sender_id_fkey(id, username, display_name, avatar_url)
      `)
      .eq('status', 'pending')
      .eq('receiver_id', profile.id);

    if (reqData) setRequests(reqData);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', `%${searchQuery}%`)
      .neq('id', profile?.id)
      .limit(5);

    if (data) setSearchResults(data);
  };

  const handleAcceptRequest = async (reqId: string) => {
    await supabase.from('message_requests').update({ status: 'accepted' }).eq('id', reqId);
    fetchData();
  };

  const handleDeclineRequest = async (reqId: string) => {
    await supabase.from('message_requests').delete().eq('id', reqId);
    fetchData();
  };

  const openChatWith = async (otherUser: Profile) => {
    const { data } = await supabase
      .from('message_requests')
      .select('*')
      .or(`and(sender_id.eq.${profile?.id},receiver_id.eq.${otherUser.id}),and(sender_id.eq.${otherUser.id},receiver_id.eq.${profile?.id})`)
      .single();

    if (!data) {
      const { data: friendData } = await supabase
        .from('friend_requests')
        .select('status')
        .or(`and(sender_id.eq.${profile?.id},receiver_id.eq.${otherUser.id}),and(sender_id.eq.${otherUser.id},receiver_id.eq.${profile?.id})`)
        .eq('status', 'accepted')
        .single();

      await supabase.from('message_requests').insert({
        sender_id: profile?.id,
        receiver_id: otherUser.id,
        status: friendData ? 'accepted' : 'pending'
      });
    }

    setActiveChat(otherUser);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'messages' as const, label: 'Chats', count: conversations.length },
    { id: 'requests' as const, label: 'Requests', count: requests.length },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md h-[600px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden rounded-3xl border border-white/10"
          style={{ background: 'linear-gradient(180deg, rgba(10,8,25,0.97), rgba(15,10,30,0.95))' }}
        >
          {/* Decorative orb */}
          <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)', filter: 'blur(40px)' }} />

          {activeChat ? (
            <ChatBox 
              otherUser={activeChat} 
              onBack={() => setActiveChat(null)} 
            />
          ) : (
            <>
              {/* Close */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-10"
              >
                ✕
              </motion.button>

              {/* Header */}
              <div className="relative px-6 pt-6 pb-4 border-b border-white/6" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#8B5CF6', boxShadow: '0 0 10px rgba(139,92,246,0.6)' }} />
                  <h2 className="text-lg font-bold text-white tracking-wide">Messages</h2>
                </div>
                
                {/* Search */}
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search @username..."
                      className="w-full py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontFamily: 'inherit' }}
                    />
                  </div>
                </form>

                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all"
                      style={{
                        background: activeTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                        color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.35)',
                      }}
                    >
                      {tab.label}
                      {tab.id === 'requests' && requests.length > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
                          {requests.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                <AnimatePresence mode="wait">
                  {searchQuery ? (
                    <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {searchResults.length > 0 ? searchResults.map((res, i) => (
                        <motion.div
                          key={res.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => { setSearchQuery(''); openChatWith(res); }}
                          className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all mb-2"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(255,145,164,0.3))' }}>
                            {res.avatar_url ? <img src={res.avatar_url} className="w-full h-full object-cover" /> : <span className="font-bold text-sm">{res.username[0].toUpperCase()}</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-white truncate">{res.display_name || res.username}</p>
                            <p className="text-[11px] text-white/35 font-mono">@{res.username}</p>
                          </div>
                          <svg className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.div>
                      )) : <p className="text-center text-white/30 mt-8 text-sm">No users found.</p>}
                    </motion.div>
                  ) : activeTab === 'messages' ? (
                    <motion.div key="chats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {conversations.length > 0 ? conversations.map((conv, i) => {
                        const otherUser = conv.sender_id === profile?.id ? conv.receiver : conv.sender;
                        return (
                          <motion.div
                            key={conv.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => openChatWith(otherUser)}
                            className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all mb-2 group"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                          >
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(255,145,164,0.2))' }}>
                                {otherUser.avatar_url ? <img src={otherUser.avatar_url} className="w-full h-full object-cover" /> : <span className="font-bold">{otherUser.username[0].toUpperCase()}</span>}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-white truncate">{otherUser.display_name || otherUser.username}</p>
                              <p className="text-[11px] text-white/30">Tap to chat</p>
                            </div>
                            <svg className="w-4 h-4 text-white/15 group-hover:text-white/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.div>
                        );
                      }) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-12">
                          <span className="text-4xl mb-4 opacity-30">💬</span>
                          <p className="text-white/30 text-sm text-center">No active chats yet.</p>
                          <p className="text-white/20 text-xs text-center mt-1">Search for a username to start!</p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {requests.length > 0 ? requests.map((req, i) => (
                        <motion.div
                          key={req.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between p-3.5 rounded-xl mb-2"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(255,145,164,0.2))' }}>
                              {req.sender.avatar_url ? <img src={req.sender.avatar_url} className="w-full h-full object-cover" /> : <span className="font-bold text-sm">{req.sender.username[0].toUpperCase()}</span>}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-white truncate">@{req.sender.username}</p>
                              <p className="text-[10px] text-white/30">Wants to message you</p>
                            </div>
                          </div>
                          <div className="flex gap-1.5 flex-shrink-0 ml-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAcceptRequest(req.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border-0"
                              style={{ background: 'rgba(76,175,136,0.15)', color: '#4CAF88' }}
                            >
                              Accept
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeclineRequest(req.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border-0"
                              style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}
                            >
                              Decline
                            </motion.button>
                          </div>
                        </motion.div>
                      )) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-12">
                          <span className="text-4xl mb-4 opacity-30">📭</span>
                          <p className="text-white/30 text-sm">No pending requests.</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
