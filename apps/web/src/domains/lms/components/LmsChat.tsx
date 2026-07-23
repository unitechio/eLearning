import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  SquarePen, 
  Phone, 
  User, 
  Smile, 
  Paperclip, 
  Send, 
  Mic, 
  FileText, 
  MoreVertical,
  CheckCheck,
  Heart,
  Flame
} from 'lucide-react';
import { cn } from '@/shared/lib';

interface ChatMessage {
  id: string;
  sender: 'partner' | 'me';
  text?: string;
  file?: {
    name: string;
    size: string;
    type: string;
  };
  time: string;
  reactions?: string[];
  isTyping?: boolean;
}

interface ChatPartner {
  id: string;
  name: string;
  username: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
  lastTime: string;
  unread?: boolean;
}

const INITIAL_PARTNERS: ChatPartner[] = [
  {
    id: "1",
    name: "Liam Carter",
    username: "@liam",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&h=100",
    online: true,
    lastMessage: "Hi Mia, just got the latest update from Alex. Quick question about the...",
    lastTime: "3min ago",
    unread: true
  },
  {
    id: "2",
    name: "Sheila Nanda",
    username: "@sheila",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100",
    online: true,
    lastMessage: "You: Absolutely, I'll review it today. Everything looks fantastic!",
    lastTime: "15min ago"
  },
  {
    id: "3",
    name: "Sophie Lane",
    username: "@sophie",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100",
    online: true,
    lastMessage: "I just re-uploaded the document. Seems like that resolved the issue...",
    lastTime: "50min ago",
    unread: true
  },
  {
    id: "4",
    name: "Jordan Lee",
    username: "@jordan",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100",
    online: false,
    lastMessage: "Hey Mia—thanks for following up on the project release. I really...",
    lastTime: "1hr ago"
  },
  {
    id: "5",
    name: "Talia Wright",
    username: "@talia",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&h=100",
    online: false,
    lastMessage: "Great news! Sam has accepted the position. I've sent him a contract...",
    lastTime: "1hr ago"
  }
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    sender: 'partner',
    text: "https://www.creativehub.com",
    time: "Thursday 11:30am"
  },
  {
    id: "m2",
    sender: 'partner',
    file: {
      name: "Project_Specs.pdf",
      size: "1.2 MB",
      type: "pdf"
    },
    time: "Thursday 11:40am"
  },
  {
    id: "m3",
    sender: 'me',
    text: "Great! Thanks, I'll review it today.",
    time: "Thursday 11:41am"
  },
  {
    id: "m4",
    sender: 'partner',
    text: "No rush—we still need to wait on Lana's design files.",
    time: "Thursday 11:44am"
  },
  {
    id: "m5",
    sender: 'partner',
    text: "Hey Olivia, could you please review the latest design draft?",
    time: "Today 2:20pm"
  },
  {
    id: "m6",
    sender: 'me',
    text: "Sure thing, I'll check it out today. They look fantastic!",
    time: "Just now",
    reactions: ["❤️", "🔥"]
  }
];

export function LmsChat() {
  const [partners, setPartners] = useState<ChatPartner[]>(INITIAL_PARTNERS);
  const [activePartner, setActivePartner] = useState<ChatPartner>(INITIAL_PARTNERS[1]);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'me',
      text: inputVal,
      time: "Just now"
    };
    setMessages(prev => [...prev, newMsg]);
    setInputVal('');

    // Simulate partner response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        sender: 'partner',
        isTyping: true,
        time: "Just now"
      }]);
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.filter(m => !m.isTyping).concat({
        id: crypto.randomUUID(),
        sender: 'partner',
        text: "I am checking it out now!",
        time: "Just now"
      }));
    }, 2500);
  };

  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <article className="flex h-[75vh] w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl text-slate-800 dark:text-slate-100 font-sans">
      {/* 1. Left Partner Sidebar */}
      <aside className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 bg-white dark:bg-slate-950">
        {/* Sidebar Header */}
        <header className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-900">
          <section className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-900 dark:text-white">Chatting</h2>
            <span className="bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-black text-[10px] px-2 py-0.5 rounded-full">
              12
            </span>
          </section>
          <button type="button" aria-label="Compose chat" className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-slate-500 transition">
            <SquarePen className="h-4.5 w-4.5" />
          </button>
        </header>

        {/* Search */}
        <section className="p-3">
          <label className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search Chats"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold placeholder:text-slate-450 focus:outline-none focus:border-red-300"
            />
          </label>
        </section>

        {/* Partner list */}
        <nav aria-label="Chats list" className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredPartners.map(partner => (
            <button
              key={partner.id}
              onClick={() => setActivePartner(partner)}
              className={cn(
                "w-full text-left p-3 rounded-2xl flex items-start gap-3 transition-all relative border border-transparent",
                activePartner.id === partner.id 
                  ? "bg-slate-50 dark:bg-slate-900 border-slate-150 dark:border-slate-850" 
                  : "hover:bg-slate-50/55 dark:hover:bg-slate-900/50"
              )}
            >
              <figure className="relative shrink-0">
                <img src={partner.avatar} alt={partner.name} className="h-10 w-10 rounded-full object-cover" />
                {partner.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
                )}
              </figure>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{partner.name}</h4>
                  <span className="text-[9px] text-slate-400">{partner.lastTime}</span>
                </div>
                <p className="text-[10px] text-slate-450 truncate">{partner.lastMessage}</p>
              </div>

              {partner.unread && (
                <span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. Main Chat Panel */}
      <section className="flex-1 flex flex-col bg-white dark:bg-slate-950" aria-label="Active chat conversation">
        {/* Chat Header */}
        <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <figure className="relative shrink-0">
              <img src={activePartner.avatar} alt={activePartner.name} className="h-10 w-10 rounded-full object-cover" />
              {activePartner.online && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
              )}
            </figure>
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white leading-none">{activePartner.name}</h3>
              <span className="text-[10px] text-slate-400 mt-1 block leading-none">{activePartner.username}</span>
            </div>
          </div>

          <nav className="flex items-center gap-2" aria-label="Chat options">
            <button 
              type="button"
              className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-850 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300 transition"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call {activePartner.name.split(' ')[0]}</span>
            </button>
            <button 
              type="button"
              className="bg-slate-900 dark:bg-white hover:bg-slate-850 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-[11px] px-4 py-2 rounded-xl transition"
            >
              See Profile
            </button>
          </nav>
        </header>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/30">
          {messages.map((msg, idx) => {
            const isMe = msg.sender === 'me';
            return (
              <div 
                key={msg.id}
                className={cn(
                  "flex flex-col gap-1 max-w-[70%]",
                  isMe ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                {/* Time Indicator */}
                <span className="text-[9px] text-slate-400 font-semibold px-2">{msg.time}</span>

                {/* Bubble content */}
                <div 
                  className={cn(
                    "p-3 rounded-2xl relative group",
                    isMe 
                      ? "bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 text-slate-850 dark:text-slate-200 shadow-sm" 
                      : "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300"
                  )}
                >
                  {/* Reaction icons */}
                  {msg.reactions && (
                    <div className="absolute -bottom-2 -left-2 flex gap-0.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full px-1 py-0.5 shadow-sm">
                      {msg.reactions.map((r, i) => <span key={i} className="text-[10px]">{r}</span>)}
                    </div>
                  )}

                  {msg.isTyping ? (
                    <div className="flex items-center gap-1.5 py-1 px-2">
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" />
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  ) : msg.file ? (
                    <div className="flex items-center gap-3">
                      <figure className="h-10 w-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center shrink-0" aria-hidden="true">
                        <FileText className="h-5 w-5" />
                      </figure>
                      <div>
                        <h5 className="text-xs font-bold text-slate-850 dark:text-white leading-none">{msg.file.name}</h5>
                        <p className="text-[10px] text-slate-400 mt-1 leading-none">{msg.file.size}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-medium leading-relaxed break-words">{msg.text}</p>
                  )}
                </div>

                {/* Read Receipt */}
                {isMe && idx === messages.length - 1 && (
                  <span className="flex items-center gap-1 text-[9px] text-slate-400 mt-0.5 px-2">
                    <CheckCheck className="h-3 w-3 text-emerald-500" />
                  </span>
                )}
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <footer className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2">
            <button type="button" aria-label="Add reaction/emoji" className="p-1 text-slate-450 hover:text-slate-700 transition">
              <Smile className="h-5 w-5" />
            </button>
            <button type="button" aria-label="Attach file" className="p-1 text-slate-450 hover:text-slate-700 transition">
              <Paperclip className="h-5 w-5" />
            </button>

            <input 
              type="text"
              placeholder="Type a message"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              className="flex-1 bg-transparent border-0 text-xs font-semibold focus:outline-none focus:ring-0 text-slate-900 dark:text-white px-2 placeholder:text-slate-400"
            />

            <button type="button" aria-label="Voice input" className="p-1 text-slate-450 hover:text-slate-700 transition">
              <Mic className="h-5 w-5" />
            </button>

            <button 
              type="button" 
              onClick={handleSend}
              className="p-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl transition hover:scale-105 shrink-0"
              aria-label="Send message"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </footer>
      </section>
    </article>
  );
}
