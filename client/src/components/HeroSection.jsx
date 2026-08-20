import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Play, 
  Users, 
  Terminal, 
  MessageSquare, 
  Copy, 
  Check, 
  ArrowRight, 
  Code, 
  Layers, 
  ShieldCheck,
  Cpu,
  Zap,
  Radio
} from 'lucide-react';

export const HeroSection = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isMockRunning, setIsMockRunning] = useState(false);
  const [mockOutput, setMockOutput] = useState(null);

  // Generate new UUID room
  const handleGenerateRoom = (e) => {
    e?.preventDefault();
    const newId = uuidV4();
    setRoomId(newId);
    toast.success('Generated new Room ID! Enter your name to join.');
  };

  // Join Room validation & redirect
  const handleJoinRoom = () => {
    if (!roomId.trim() || !username.trim()) {
      toast.error('Please enter both Room ID and Username');
      return;
    }
    navigate(`/editor/${roomId.trim()}`, {
      state: { username: username.trim() }
    });
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  const handleCopyId = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId);
    setIsCopied(true);
    toast.success('Room ID copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Mock code runner for the hero demo
  const handleRunMockCode = () => {
    setIsMockRunning(true);
    setMockOutput(null);
    setTimeout(() => {
      setIsMockRunning(false);
      setMockOutput({
        status: 'success',
        time: '142ms',
        memory: '14.2 MB',
        logs: [
          '⚡ Compiling algorithm in V8 isolate...',
          '✓ Algorithm: twoSum([2, 7, 11, 15], 9)',
          '✓ Result: [0, 1] (Indices of target sum)',
          '🚀 All 5/5 test assertions passed!'
        ]
      });
    }, 700);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Gradients & Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[450px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[350px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Headline & Pitch */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/70 text-xs sm:text-sm font-medium text-slate-300 shadow-xl backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Real-time Multi-User IDE</span>
            <span className="text-slate-600">•</span>
            <span className="text-blue-400 font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Instant Compilation
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Collaborate, Code & Execute in{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
              Real-Time.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            The zero-latency collaborative workspace for pair-programming, technical interviews, and university labs. Write, chat, and run code together instantly.
          </p>

          {/* Quick Value Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-2 text-sm text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>&lt; 10ms Sync Latency</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" />
              <span>4+ Languages (JS, Python, C++, Java)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Zero-Install Required</span>
            </div>
          </div>
        </div>

        {/* Action Panel & Interactive IDE Preview Grid */}
        <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Quick Join & Room Creator Card */}
          <div id="quick-join" className="lg:col-span-5 w-full">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors" />
              
              <div className="flex items-center justify-between pb-5 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Join or Create Room</h3>
                    <p className="text-xs text-slate-400">Jump right into a live coding session</p>
                  </div>
                </div>
                <button
                  onClick={handleGenerateRoom}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  New Room
                </button>
              </div>

              <div className="space-y-4 pt-6">
                {/* Room ID Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                    <span>Room ID</span>
                    {roomId && (
                      <button
                        onClick={handleCopyId}
                        className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {isCopied ? 'Copied' : 'Copy ID'}
                      </button>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      onKeyUp={handleKeyUp}
                      placeholder="e.g. 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
                      className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono transition-all"
                    />
                  </div>
                </div>

                {/* Username Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Your Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyUp={handleKeyUp}
                    placeholder="e.g. Satoshi_Dev"
                    className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-sans transition-all"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  onClick={handleJoinRoom}
                  className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <Zap className="w-4 h-4 text-blue-200" />
                  <span>Enter Code Room</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Helper Note */}
                <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>
                    No registration required. Generate a room, invite friends, and start coding in seconds.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live IDE Mockup Showcase */}
          <div className="lg:col-span-7 w-full">
            <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
              
              {/* Window Header */}
              <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Room: algorithmic-turing #live
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 text-[11px] font-mono text-slate-300 border border-slate-700/60">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    JavaScript (Node.js)
                  </div>
                  <button
                    onClick={handleRunMockCode}
                    disabled={isMockRunning}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <Play className={`w-3.5 h-3.5 ${isMockRunning ? 'animate-spin' : 'fill-current'}`} />
                    <span>{isMockRunning ? 'Running...' : 'Run Code'}</span>
                  </button>
                </div>
              </div>

              {/* Code Editor Body */}
              <div className="p-4 sm:p-6 bg-slate-950/90 font-mono text-xs sm:text-sm leading-relaxed text-slate-300 min-h-[290px] relative overflow-hidden">
                
                {/* Code Lines with multi-cursor indicators */}
                <div className="space-y-1">
                  <div className="flex">
                    <span className="w-8 text-slate-600 select-none text-right pr-4">1</span>
                    <span className="text-slate-500">// ⚡ Two Sum Solution - Collaborative Room</span>
                  </div>
                  <div className="flex">
                    <span className="w-8 text-slate-600 select-none text-right pr-4">2</span>
                    <span>
                      <span className="text-purple-400 font-semibold">function</span> <span className="text-blue-400 font-semibold">twoSum</span>(nums, target) &#123;
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-8 text-slate-600 select-none text-right pr-4">3</span>
                    <span className="pl-4">
                      <span className="text-purple-400 font-semibold">const</span> map = <span className="text-purple-400 font-semibold">new</span> <span className="text-emerald-400 font-semibold">Map</span>();
                    </span>
                  </div>
                  <div className="flex relative">
                    <span className="w-8 text-slate-600 select-none text-right pr-4">4</span>
                    <span className="pl-4">
                      <span className="text-purple-400 font-semibold">for</span> (<span className="text-purple-400 font-semibold">let</span> i = 0; i &lt; nums.length; i++) &#123;
                    </span>
                  </div>
                  <div className="flex relative">
                    <span className="w-8 text-slate-600 select-none text-right pr-4">5</span>
                    <span className="pl-8">
                      <span className="text-purple-400 font-semibold">const</span> complement = target - nums[i];
                    </span>
                    {/* Simulated live peer cursor in editor */}
                    <div className="absolute left-[380px] -top-5 hidden sm:flex items-center">
                      <div className="w-0.5 h-5 bg-blue-400 animate-pulse"></div>
                      <span className="ml-1 px-1.5 py-0.5 bg-blue-500 text-[10px] font-sans font-bold text-white rounded shadow-sm">
                        Alex
                      </span>
                    </div>
                  </div>
                  <div className="flex">
                    <span className="w-8 text-slate-600 select-none text-right pr-4">6</span>
                    <span className="pl-8">
                      <span className="text-purple-400 font-semibold">if</span> (map.has(complement)) &#123;
                    </span>
                  </div>
                  <div className="flex relative">
                    <span className="w-8 text-slate-600 select-none text-right pr-4">7</span>
                    <span className="pl-12">
                      <span className="text-purple-400 font-semibold">return</span> [map.get(complement), i];
                    </span>
                    {/* Another peer cursor */}
                    <div className="absolute right-12 -top-5 hidden md:flex items-center">
                      <div className="w-0.5 h-5 bg-purple-400 animate-pulse"></div>
                      <span className="ml-1 px-1.5 py-0.5 bg-purple-500 text-[10px] font-sans font-bold text-white rounded shadow-sm">
                        Sarah
                      </span>
                    </div>
                  </div>
                  <div className="flex">
                    <span className="w-8 text-slate-600 select-none text-right pr-4">8</span>
                    <span className="pl-8">&#125;</span>
                  </div>
                  <div className="flex">
                    <span className="w-8 text-slate-600 select-none text-right pr-4">9</span>
                    <span className="pl-8">map.set(nums[i], i);</span>
                  </div>
                  <div className="flex">
                    <span className="w-8 text-slate-600 select-none text-right pr-4">10</span>
                    <span className="pl-4">&#125;</span>
                  </div>
                  <div className="flex">
                    <span className="w-8 text-slate-600 select-none text-right pr-4">11</span>
                    <span>&#125;</span>
                  </div>
                </div>

                {/* Floating Chat Message Overlay */}
                <div className="absolute bottom-4 right-4 max-w-xs bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3 shadow-2xl backdrop-blur-md hidden sm:block">
                  <div className="flex items-center gap-2 mb-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[11px] font-bold text-slate-200">Room Chat</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-auto"></span>
                  </div>
                  <div className="space-y-1.5 text-[11px] font-sans">
                    <div className="bg-slate-800/80 p-2 rounded-lg text-slate-300">
                      <span className="font-semibold text-blue-400">Sarah:</span> Let's run test cases for negative integers! 🚀
                    </div>
                    <div className="bg-blue-900/40 p-2 rounded-lg text-blue-200 border border-blue-800/50">
                      <span className="font-semibold text-purple-300">Alex:</span> Works in O(N) time complexity. Click Run!
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulated Terminal Output Drawer */}
              {mockOutput && (
                <div className="border-t border-slate-800 bg-slate-900/95 p-4 font-mono text-xs text-slate-300 space-y-1.5 animate-in slide-in-from-bottom duration-200">
                  <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800/80">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Terminal className="w-3.5 h-3.5" /> Output Terminal (Exit Code: 0)
                    </span>
                    <span className="text-[10px]">Time: {mockOutput.time} | Mem: {mockOutput.memory}</span>
                  </div>
                  {mockOutput.logs.map((log, idx) => (
                    <div key={idx} className={log.includes('✓') || log.includes('passed') ? 'text-emerald-400' : 'text-slate-300'}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
