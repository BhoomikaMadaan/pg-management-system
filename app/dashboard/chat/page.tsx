"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { Send, Search, Phone, Video, MoreVertical, CheckCheck, MessageSquareWarning, Building2 } from "lucide-react";

export default function ChatPage() {
  const { currentUser, messages, sendMessage, users, markRead } = useStore();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const isOwner = currentUser?.role === "owner";

  // If owner, show list of tenants. If tenant, show owner.
  const chatList = isOwner 
    ? users.filter(u => u.role === "tenant")
    : users.filter(u => u.role === "owner");

  useEffect(() => {
    if (!activeChatId && chatList.length > 0) setActiveChatId(chatList[0].id);
  }, [chatList, activeChatId]);

  useEffect(() => {
    if (activeChatId) markRead(activeChatId);
  }, [activeChatId, markRead, messages]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, activeChatId]);

  const activeUser = users.find(u => u.id === activeChatId);
  
  const currentChatMessages = messages.filter(m => 
    (m.fromId === currentUser?.id && m.toId === activeChatId) ||
    (m.fromId === activeChatId && m.toId === currentUser?.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;
    sendMessage(activeChatId, inputText);
    setInputText("");
  };

  if (!currentUser) return null;

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Sidebar - Chat List */}
      <div className="w-80 md:w-96 flex-shrink-0 border-r border-white/[0.05] flex flex-col bg-white/[0.01]">
        <div className="p-6 border-b border-white/[0.05]">
          <h1 className="text-2xl font-black text-white mb-4 tracking-tight">Messages</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[--muted]" />
            <input 
              placeholder="Search conversations..." 
              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chatList.length === 0 ? (
            <div className="p-6 text-center text-[--muted] text-sm font-medium">No contacts found.</div>
          ) : (
            chatList.map(user => {
              const lastMsg = messages.filter(m => (m.fromId === user.id && m.toId === currentUser.id) || (m.fromId === currentUser.id && m.toId === user.id)).pop();
              const unreadCount = messages.filter(m => m.fromId === user.id && m.toId === currentUser.id && !m.read).length;
              const isActive = activeChatId === user.id;
              
              return (
                <div key={user.id} onClick={() => setActiveChatId(user.id)}
                  className={`p-5 flex items-center gap-4 cursor-pointer transition-all relative ${isActive ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"}`}>
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />}
                  
                  <div className="relative">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black text-sm">
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#050508] rounded-full" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className={`font-bold text-sm truncate ${isActive ? "text-white" : "text-[--foreground]"}`}>{user.name}</p>
                      {lastMsg && <span className="text-[10px] text-[--muted] shrink-0 font-bold tracking-widest uppercase">{new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                    </div>
                    <p className={`text-xs truncate font-medium ${unreadCount > 0 ? "text-white" : "text-[--muted]"}`}>
                      {lastMsg ? lastMsg.text : "Say hello!"}
                    </p>
                  </div>
                  
                  {unreadCount > 0 && (
                    <div className="h-5 min-w-[20px] px-1.5 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-purple-500/30">
                      {unreadCount}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-[#050508]">
        {!activeChatId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent pointer-events-none" />
            <div className="h-24 w-24 rounded-[32px] bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-6 z-10">
              <MessageSquareWarning className="w-10 h-10 text-purple-400/50" />
            </div>
            <h2 className="text-2xl font-black text-white z-10">Your Messages</h2>
            <p className="text-[--muted] font-medium max-w-sm mt-2 z-10">Select a conversation from the sidebar to view chat history.</p>
          </div>
        ) : (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

            {/* Chat Header */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-white/[0.05] backdrop-blur-md z-10 bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-purple-500/20">
                  {activeUser?.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-white text-base leading-tight">{activeUser?.name}</p>
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mt-0.5">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {[Phone, Video, MoreVertical].map((Icon, i) => (
                  <button key={i} className="p-2.5 rounded-xl text-[--muted] hover:text-white hover:bg-white/[0.05] transition-all">
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 z-10">
              {currentChatMessages.map((msg, i) => {
                const isMe = msg.fromId === currentUser.id;
                
                return (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] md:max-w-[60%] flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                      {/* Avatar next to bubble (optional, skipping for me to keep clean) */}
                      {!isMe && (
                        <div className="h-8 w-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[10px] font-black text-purple-400 flex-shrink-0 mt-auto">
                          {activeUser?.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      
                      <div className={`px-5 py-3.5 rounded-[24px] text-sm font-medium relative ${
                        isMe 
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-sm shadow-lg shadow-purple-500/20" 
                          : "bg-white/[0.04] border border-white/[0.05] text-white rounded-bl-sm"
                      }`}>
                        <p className="leading-relaxed">{msg.text}</p>
                        <div className={`flex items-center gap-1 mt-2 justify-end ${isMe ? "text-white/60" : "text-[--muted]"}`}>
                          <span className="text-[9px] font-black uppercase tracking-widest">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMe && <CheckCheck className="w-3 h-3 ml-0.5" />}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="p-5 border-t border-white/[0.05] bg-[#050508] z-10">
              <form onSubmit={handleSend} className="relative flex items-center gap-3 max-w-4xl mx-auto">
                <input 
                  value={inputText} onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.1] rounded-[20px] px-6 py-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                />
                <button type="submit" disabled={!inputText.trim()}
                  className="absolute right-2 p-3 rounded-[16px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-purple-500/20">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
