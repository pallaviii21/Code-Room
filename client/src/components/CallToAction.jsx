import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Users, Code } from 'lucide-react';

export const CallToAction = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const handleQuickCreate = () => {
    const id = uuidV4();
    if (!username.trim()) {
      toast('Please enter a username to start your room', { icon: '✍️' });
      setRoomId(id);
      return;
    }
    navigate(`/editor/${id}`, {
      state: { username: username.trim() }
    });
  };

  const handleJoin = () => {
    if (!roomId.trim() || !username.trim()) {
      toast.error('Both Room ID and Username are required');
      return;
    }
    navigate(`/editor/${roomId.trim()}`, {
      state: { username: username.trim() }
    });
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Dynamic Glow and Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-panel rounded-3xl p-8 sm:p-14 border border-blue-500/30 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-semibold text-blue-300">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Ready in 5 seconds</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Start Coding Collaboratively Today
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
              Jump into a live room with colleagues or classmates and experience frictionless real-time pair programming.
            </p>

            {/* Quick action bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full sm:w-auto flex-1 px-4 py-3.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-sans"
              />
              <button
                onClick={handleQuickCreate}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 text-sm shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Instant Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-400">
              <span>✓ 100% Free & Open Source</span>
              <span>✓ No Credit Card</span>
              <span>✓ Instant Cloud Compiler</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CallToAction;
