'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useGameStore, Profile } from '@/store/useGameStore';
import { sounds } from '@/lib/sounds';

interface ChatBoxProps {
  otherUser: Profile;
  onBack: () => void;
}

export default function ChatBox({ otherUser, onBack }: ChatBoxProps) {
  const { profile } = useGameStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile) return;

    // Fetch message history
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${profile.id},receiver_id.eq.${otherUser.id}),and(sender_id.eq.${otherUser.id},receiver_id.eq.${profile.id})`)
        .order('created_at', { ascending: true });

      if (data) setMessages(data);
      scrollToBottom();
      
      // Mark unread messages as seen
      const unreadIds = data?.filter(m => m.receiver_id === profile.id && !m.seen).map(m => m.id) || [];
      if (unreadIds.length > 0) {
        await supabase.from('messages').update({ seen: true }).in('id', unreadIds);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat_${Math.min(profile.id.localeCompare(otherUser.id) ? 1 : -1, 0)}_${profile.id}_${otherUser.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${profile.id}`
      }, (payload) => {
        if (payload.new.sender_id === otherUser.id) {
          setMessages(prev => [...prev, payload.new]);
          supabase.from('messages').update({ seen: true }).eq('id', payload.new.id);
          scrollToBottom();
          sounds.playMessageReceived();
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=eq.${profile.id}`
      }, (payload) => {
        // Update seen status locally
        setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new : m));
      })
      .subscribe();

    // Setup Presence for Online Status
    const presenceChannel = supabase.channel('global_presence', {
      config: { presence: { key: profile.id } }
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        setIsOnline(Object.keys(state).includes(otherUser.id));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ user_id: profile.id });
        }
      });

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(presenceChannel);
    };
  }, [profile, otherUser.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 100);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !profile) return;

    const msg = inputText.trim();
    setInputText('');

    // Optimistic UI update
    const tempMsg = {
      id: Math.random().toString(),
      sender_id: profile.id,
      receiver_id: otherUser.id,
      content: msg,
      seen: false,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
    scrollToBottom();
    sounds.playMessageSent();

    await supabase.from('messages').insert({
      sender_id: profile.id,
      receiver_id: otherUser.id,
      content: msg,
      seen: false
    });
  };

  // Group messages by date
  const groupByDate = (msgs: any[]) => {
    const groups: { date: string; messages: any[] }[] = [];
    let lastDate = '';
    msgs.forEach(msg => {
      const d = new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (d !== lastDate) {
        groups.push({ date: d, messages: [msg] });
        lastDate = d;
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });
    return groups;
  };

  const grouped = groupByDate(messages);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/6" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer border-0"
          style={{ background: 'transparent' }}
        >
          ←
        </motion.button>

        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(255,145,164,0.3))' }}>
            {otherUser.avatar_url ? (
              <img src={otherUser.avatar_url} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-sm">{otherUser.username[0].toUpperCase()}</span>
            )}
          </div>
          {/* Online indicator */}
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
            style={{
              background: isOnline ? '#4CAF88' : '#6b7280',
              borderColor: 'rgba(10,8,25,0.97)',
              boxShadow: isOnline ? '0 0 8px rgba(76,175,136,0.5)' : 'none',
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-white truncate">{otherUser.display_name || otherUser.username}</h3>
          <p className="text-[11px] font-mono" style={{ color: isOnline ? '#4CAF88' : 'rgba(255,255,255,0.3)' }}>
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-4xl mb-3 opacity-20">👋</span>
            <p className="text-white/20 text-sm">Say hello!</p>
          </div>
        )}

        {grouped.map(group => (
          <div key={group.date} className="flex flex-col gap-1">
            {/* Date Separator */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.2)' }}>{group.date}</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {group.messages.map((msg, idx) => {
              const isMe = msg.sender_id === profile?.id;
              const isLast = idx === group.messages.length - 1 || group.messages[idx + 1]?.sender_id !== msg.sender_id;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex flex-col max-w-[78%] ${isMe ? 'self-end items-end' : 'self-start items-start'} ${isLast ? 'mb-2' : 'mb-0.5'}`}
                >
                  <div
                    className="px-4 py-2.5 text-sm leading-relaxed"
                    style={{
                      background: isMe
                        ? 'linear-gradient(135deg, rgba(139,92,246,0.7), rgba(99,60,200,0.6))'
                        : 'rgba(255,255,255,0.06)',
                      color: isMe ? 'white' : 'rgba(255,255,255,0.85)',
                      borderRadius: isMe
                        ? (isLast ? '18px 18px 6px 18px' : '18px 18px 18px 18px')
                        : (isLast ? '18px 18px 18px 6px' : '18px 18px 18px 18px'),
                      border: isMe ? 'none' : '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    {msg.content}
                  </div>
                  {isLast && (
                    <div className="flex items-center gap-1.5 mt-1 px-1">
                      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && (
                        <span className="text-[10px]" style={{ color: msg.seen ? '#4CAF88' : 'rgba(255,255,255,0.2)' }}>
                          {msg.seen ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="px-4 py-3 border-t border-white/6 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 py-2.5 px-4 rounded-2xl text-sm outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'white',
            fontFamily: 'inherit',
          }}
        />
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          type="submit"
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-0 transition-all disabled:opacity-25 disabled:cursor-not-allowed"
          style={{
            background: inputText.trim() ? 'linear-gradient(135deg, #8B5CF6, #6D28D9)' : 'rgba(255,255,255,0.06)',
          }}
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </motion.button>
      </form>
    </div>
  );
}
