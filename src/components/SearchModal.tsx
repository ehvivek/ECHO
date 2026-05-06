'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useGameStore, Profile } from '@/store/useGameStore';
import { sounds } from '@/lib/sounds';
import ProfileModal from './ProfileModal';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { profile } = useGameStore();
  const [activeTab, setActiveTab] = useState<'search' | 'friends' | 'requests' | 'sent'>('search');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);

  // Listen for custom events to open specific tabs
  useEffect(() => {
    const handleOpenTab = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.tab) {
        setActiveTab(customEvent.detail.tab);
        // We also need to open the modal if it's not open.
        // We'll dispatch a click to the global search button to let TopNav handle the open state.
        document.getElementById('global-search-btn')?.click();
      }
    };
    window.addEventListener('open-search-modal-tab', handleOpenTab);
    return () => window.removeEventListener('open-search-modal-tab', handleOpenTab);
  }, []);

  // Reset tab when modal opens normally
  useEffect(() => {
    if (isOpen) {
      fetchFriendRequests();
    } else {
      // Small delay so animation finishes before resetting
      setTimeout(() => setActiveTab('search'), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !profile) return;
    const sub = supabase
      .channel('friend_requests_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'friend_requests' }, () => {
        fetchFriendRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, [isOpen, profile]);

  const fetchFriendRequests = async () => {
    if (!profile) return;
    const { data, error } = await supabase
      .from('friend_requests')
      .select(`
        id, status, sender_id, receiver_id,
        sender:profiles!friend_requests_sender_id_fkey(id, username, display_name, avatar_url, bio, games_played, games_won, total_points),
        receiver:profiles!friend_requests_receiver_id_fkey(id, username, display_name, avatar_url, bio, games_played, games_won, total_points)
      `)
      .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);

    if (error) {
      console.error("Error fetching friend requests:", error);
    }
    if (data) setFriendRequests(data);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || !profile) {
      setSearchResults([]);
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', `%${searchQuery}%`)
      .neq('id', profile.id)
      .limit(10);

    if (data) setSearchResults(data);
  };

  const handleAddFriend = async (targetId: string) => {
    if (!profile) return;
    const { error } = await supabase.from('friend_requests').insert({
      sender_id: profile.id,
      receiver_id: targetId,
      status: 'pending'
    });
    
    if (error) {
      alert("Failed to send request: " + error.message);
    } else {
      sounds.playMessageSent();
      fetchFriendRequests();
    }
  };

  const handleAcceptRequest = async (reqId: string) => {
    await supabase.from('friend_requests').update({ status: 'accepted' }).eq('id', reqId);
    fetchFriendRequests();
  };

  const handleCancelOrDecline = async (reqId: string) => {
    await supabase.from('friend_requests').delete().eq('id', reqId);
    fetchFriendRequests();
  };

  const getRelationshipButton = (targetUser: Profile) => {
    const req = friendRequests.find(r => 
      (r.sender_id === profile?.id && r.receiver_id === targetUser.id) ||
      (r.receiver_id === profile?.id && r.sender_id === targetUser.id)
    );

    if (!req) {
      return (
        <button onClick={(e) => { e.stopPropagation(); handleAddFriend(targetUser.id); }} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-xs transition-colors">
          + Add Friend
        </button>
      );
    }

    if (req.status === 'accepted') {
      return (
        <button onClick={(e) => { e.stopPropagation(); handleCancelOrDecline(req.id); }} className="bg-green-500/20 text-green-300 border border-green-500/50 px-3 py-1 rounded text-xs hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 group transition-colors">
          <span className="group-hover:hidden">Friends</span>
          <span className="hidden group-hover:inline">Remove</span>
        </button>
      );
    }

    if (req.sender_id === profile?.id) {
      return (
        <button onClick={(e) => { e.stopPropagation(); handleCancelOrDecline(req.id); }} className="bg-white/5 text-white/50 border border-white/10 px-3 py-1 rounded text-xs hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 group transition-colors">
          <span className="group-hover:hidden">Requested</span>
          <span className="hidden group-hover:inline">Cancel</span>
        </button>
      );
    }

    return (
      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
        <button onClick={() => handleAcceptRequest(req.id)} className="bg-blue-500/20 text-blue-300 border border-blue-500/50 px-2 py-1 rounded text-xs hover:bg-blue-500/30 transition-colors">Accept</button>
        <button onClick={() => handleCancelOrDecline(req.id)} className="bg-white/5 text-white/50 border border-white/10 px-2 py-1 rounded text-xs hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 transition-colors">Decline</button>
      </div>
    );
  };

  const incomingRequests = friendRequests.filter(r => r.receiver_id === profile?.id && r.status === 'pending');
  const outgoingRequests = friendRequests.filter(r => r.sender_id === profile?.id && r.status === 'pending');
  const friends = friendRequests.filter(r => r.status === 'accepted');

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card w-full max-w-md h-[600px] max-h-[90vh] shadow-2xl relative flex flex-col overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors text-xl z-10">✕</button>

            <div className="p-4 border-b border-white/10">
              <h2 className="text-xl font-bold mb-4">Find Friends</h2>
              
              <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value === '') setSearchResults([]); }}
                  placeholder="Search users..."
                  className="echo-input flex-1 py-2 px-3 text-sm placeholder-white/30"
                />
                <button type="submit" className="btn-primary py-2 px-4 text-sm">Search</button>
              </form>

              <div className="flex gap-4 border-b border-white/10 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveTab('search')} className={`pb-2 whitespace-nowrap font-bold transition-colors ${activeTab === 'search' ? 'text-white border-b-2 border-white' : 'text-white/40'}`}>
                  Search
                </button>
                <button onClick={() => setActiveTab('friends')} className={`pb-2 whitespace-nowrap font-bold transition-colors ${activeTab === 'friends' ? 'text-white border-b-2 border-white' : 'text-white/40'} flex gap-1 items-center`}>
                  Friends
                  {friends.length > 0 && <span className="bg-white/20 text-white text-[10px] px-1.5 rounded-full">{friends.length}</span>}
                </button>
                <button onClick={() => setActiveTab('requests')} className={`pb-2 whitespace-nowrap font-bold transition-colors ${activeTab === 'requests' ? 'text-white border-b-2 border-white' : 'text-white/40'} flex gap-1 items-center`}>
                  Requests
                  {incomingRequests.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{incomingRequests.length}</span>}
                </button>
                <button onClick={() => setActiveTab('sent')} className={`pb-2 whitespace-nowrap font-bold transition-colors ${activeTab === 'sent' ? 'text-white border-b-2 border-white' : 'text-white/40'} flex gap-1 items-center`}>
                  Sent
                  {outgoingRequests.length > 0 && <span className="bg-orange-500 text-white text-[10px] px-1.5 rounded-full">{outgoingRequests.length}</span>}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {activeTab === 'search' && (
                searchQuery ? (
                  searchResults.length > 0 ? searchResults.map(res => (
                    <div key={res.id} onClick={() => setViewingProfile(res)} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black/40 overflow-hidden flex items-center justify-center border border-white/20">
                          {res.avatar_url ? <img src={res.avatar_url} className="w-full h-full object-cover" /> : res.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{res.display_name || res.username}</p>
                          <p className="text-xs text-white/50">@{res.username}</p>
                        </div>
                      </div>
                      {getRelationshipButton(res)}
                    </div>
                  )) : <p className="text-center text-white/40 mt-4 text-sm">No users found.</p>
                ) : <p className="text-center text-white/40 mt-4 text-sm">Type a username to search.</p>
              )}

              {activeTab === 'friends' && (
                friends.length > 0 ? friends.map(f => {
                  const friendProfile = f.sender_id === profile?.id ? f.receiver : f.sender;
                  return (
                    <div key={f.id} onClick={() => setViewingProfile(friendProfile)} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black/40 overflow-hidden flex items-center justify-center border border-white/20">
                          {friendProfile.avatar_url ? <img src={friendProfile.avatar_url} className="w-full h-full object-cover" /> : friendProfile.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{friendProfile.display_name || friendProfile.username}</p>
                          <p className="text-xs text-white/50">@{friendProfile.username}</p>
                        </div>
                      </div>
                      {getRelationshipButton(friendProfile)}
                    </div>
                  );
                }) : <p className="text-center text-white/40 mt-4 text-sm">No friends yet. Start searching to add some!</p>
              )}

              {activeTab === 'requests' && (
                incomingRequests.length > 0 ? incomingRequests.map(req => (
                  <div key={req.id} onClick={() => setViewingProfile(req.sender)} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black/40 overflow-hidden flex items-center justify-center border border-white/20">
                        {req.sender.avatar_url ? <img src={req.sender.avatar_url} className="w-full h-full object-cover" /> : req.sender.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{req.sender.display_name || req.sender.username}</p>
                        <p className="text-xs text-white/50">@{req.sender.username}</p>
                      </div>
                    </div>
                    {getRelationshipButton(req.sender)}
                  </div>
                )) : <p className="text-center text-white/40 mt-4 text-sm">No pending friend requests.</p>
              )}

              {activeTab === 'sent' && (
                outgoingRequests.length > 0 ? outgoingRequests.map(req => (
                  <div key={req.id} onClick={() => setViewingProfile(req.receiver)} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black/40 overflow-hidden flex items-center justify-center border border-white/20">
                        {req.receiver.avatar_url ? <img src={req.receiver.avatar_url} className="w-full h-full object-cover" /> : req.receiver.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{req.receiver.display_name || req.receiver.username}</p>
                        <p className="text-xs text-white/50">@{req.receiver.username}</p>
                      </div>
                    </div>
                    {getRelationshipButton(req.receiver)}
                  </div>
                )) : <p className="text-center text-white/40 mt-4 text-sm">No outgoing requests.</p>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Public Profile Modal nested */}
      <ProfileModal 
        isOpen={!!viewingProfile} 
        onClose={() => setViewingProfile(null)} 
        targetProfile={viewingProfile} 
        isOwnProfile={false} 
      />
    </>
  );
}
