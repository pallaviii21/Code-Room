import React from 'react';
import { 
  Zap, 
  Terminal, 
  MessageSquare, 
  Code2, 
  Database, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Laptop, 
  Users, 
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const FeaturesBento = () => {
  return (
    <section id="features" className="py-20 md:py-28 relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engineered for Seamless Pairing</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Everything you need for{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              live collaborative coding
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Built from the ground up for zero latency, rock-solid compilation, and frictionless team programming.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
          
          {/* Card 1: Real-time Socket.io Sync (Large span: 7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-blue-500/40 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/15 rounded-full blur-2xl group-hover:bg-blue-500/25 transition-colors" />
            
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 shadow-inner">
              <Zap className="w-6 h-6" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Lightning-Fast WebSocket Synchronization
            </h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-6">
              Powered by high-throughput Socket.io pipelines. Keystrokes, code formatting, and cursor shifts propagate instantly across all connected participants with sub-10ms delivery.
            </p>

            {/* Visual element inside card */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>socket.emit('code_change', &#123; roomId, payload &#125;)</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                0ms Latency
              </span>
            </div>
          </div>

          {/* Card 2: Multi-Language Live Execution (5 cols) */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-purple-500/40 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/15 rounded-full blur-2xl group-hover:bg-purple-500/25 transition-colors" />
            
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 shadow-inner">
              <Terminal className="w-6 h-6" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Cloud Multi-Language Runner
            </h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-6">
              Compile & execute algorithms directly in the browser across JavaScript, Python, C++, and Java with real-time standard output and error telemetry.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-yellow-300 font-medium">
                JavaScript (ES6+)
              </span>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-blue-300 font-medium">
                Python 3.10
              </span>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-sky-400 font-medium">
                C++ (GCC 12)
              </span>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-orange-400 font-medium">
                Java (OpenJDK 17)
              </span>
            </div>
          </div>

          {/* Card 3: Monaco Editor Engine (4 cols) */}
          <div className="lg:col-span-4 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Monaco Editor Engine
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Equipped with the exact engine powering Microsoft VS Code. Enjoy rich syntax trees, bracket colorization, auto-indent, search, and familiar keybindings.
            </p>
          </div>

          {/* Card 4: In-Room Live Chat & Notifications (4 cols) */}
          <div className="lg:col-span-4 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-emerald-500/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Live Room Chat & Presence
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Communicate in real time with integrated chat tabs, user avatar badges, and toast notifications when developers join or leave the session.
            </p>
          </div>

          {/* Card 5: MongoDB Room Persistence (4 cols) */}
          <div className="lg:col-span-4 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-amber-500/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Persistent Room Vault
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Never lose your code. Room sessions are continuously cached and stored in MongoDB so late-joining peers receive the latest synchronized buffer seamlessly.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FeaturesBento;
