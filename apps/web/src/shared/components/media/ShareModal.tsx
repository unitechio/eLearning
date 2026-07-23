import React, { useState } from 'react';
import { 
  X, 
  Link2, 
  ChevronDown, 
  Copy, 
  Check, 
  Users 
} from 'lucide-react';
import { cn } from '@/shared/lib';

interface UserAccess {
  name: string;
  email: string;
  avatar: string;
  role: 'Owner' | 'Editor' | 'Viewer';
}

interface ShareModalProps {
  title: string;
  subtitle: string;
  onClose: () => void;
}

const INITIAL_USERS: UserAccess[] = [
  {
    name: "Ben Beckman",
    email: "benbeckman@email.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=60&h=60",
    role: "Owner"
  },
  {
    name: "Sabrina Brown",
    email: "sabrina@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=60&h=60",
    role: "Editor"
  },
  {
    name: "Sydney Sweeney",
    email: "sweeney@email.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=60&h=60",
    role: "Viewer"
  },
  {
    name: "Jason McGregor",
    email: "jason@email.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=60&h=60",
    role: "Viewer"
  }
];

export function ShareModal({ title, subtitle, onClose }: ShareModalProps) {
  const [emailInput, setEmailInput] = useState('');
  const [users, setUsers] = useState<UserAccess[]>(INITIAL_USERS);
  const [generalAccess, setGeneralAccess] = useState<'Viewer' | 'Editor' | 'Commenter'>('Viewer');
  const [copied, setCopied] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const name = emailInput.split('@')[0];
    const newUser: UserAccess = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: emailInput,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=60&h=60`,
      role: 'Viewer'
    };
    setUsers(prev => [...prev, newUser]);
    setEmailInput('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRoleChange = (idx: number, newRole: 'Editor' | 'Viewer') => {
    setUsers(prev => prev.map((u, i) => i === idx ? { ...u, role: newRole } : u));
    setActiveDropdown(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <article 
        className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative flex flex-col gap-5 text-slate-800 dark:text-slate-100 font-sans"
        role="dialog"
        aria-modal="true"
        aria-label="Share options"
      >
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl transition"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <header className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">{subtitle}</p>
        </header>

        {/* Invite input form */}
        <section aria-label="Invite people" className="space-y-2">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Invite people</h3>
          <form onSubmit={handleInvite} className="flex gap-2">
            <input 
              type="email"
              placeholder="Enter email...."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <button 
              type="submit"
              className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 transition shrink-0"
            >
              Invite
            </button>
          </form>
        </section>

        {/* General Access */}
        <section aria-label="General access" className="space-y-3">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">General access</h3>
          
          <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-900">
            <div className="flex items-center gap-3">
              <figure className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-500 flex items-center justify-center shrink-0" aria-hidden="true">
                <Link2 className="h-4.5 w-4.5" />
              </figure>
              <div>
                <h4 className="text-xs font-black text-slate-800 dark:text-white">Link Access</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Anyone with the link can access this meeting</p>
              </div>
            </div>

            {/* General Role dropdown */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === -1 ? null : -1)}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
              >
                <span>{generalAccess}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {activeDropdown === -1 && (
                <div className="absolute right-0 mt-2 z-10 w-24 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg p-1 text-[11px] font-bold">
                  {(['Viewer', 'Editor'] as const).map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => { setGeneralAccess(role); setActiveDropdown(null); }}
                      className="w-full text-left px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Who has access list */}
        <section aria-label="Who has access" className="space-y-2 flex-1 max-h-48 overflow-y-auto pr-1">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">Who has access</h3>
          
          <div className="space-y-3">
            {users.map((user, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <figure className="h-9 w-9 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 shrink-0">
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  </figure>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white leading-none">{user.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-none">{user.email}</p>
                  </div>
                </div>

                {/* Role badge / dropdown */}
                <div className="relative shrink-0">
                  {user.role === 'Owner' ? (
                    <span className="text-[10px] font-bold text-slate-400">Owner</span>
                  ) : (
                    <>
                      <button 
                        type="button"
                        onClick={() => setActiveDropdown(activeDropdown === idx ? null : idx)}
                        className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
                      >
                        <span>{user.role}</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      {activeDropdown === idx && (
                        <div className="absolute right-0 mt-2 z-10 w-24 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg p-1 text-[11px] font-bold">
                          {(['Viewer', 'Editor'] as const).map(role => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => handleRoleChange(idx, role)}
                              className="w-full text-left px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300"
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer actions */}
        <footer className="border-t border-slate-100 dark:border-slate-900 pt-4 flex items-center justify-between gap-4">
          <button 
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied' : 'Copy link'}</span>
          </button>
          
          <button 
            type="button"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs px-6 py-3 rounded-2xl transition"
          >
            Done
          </button>
        </footer>
      </article>
    </div>
  );
}
