import React from 'react';
import { 
  Code2, 
  Heart, 
  Terminal, 
  Sparkles, 
  Layers, 
  Radio, 
  Database, 
  Cpu 
} from 'lucide-react';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const Footer = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 pt-16 pb-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1 & 2: Brand Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center p-1 overflow-hidden">
                <img 
                  src="/codeRoom-Photoroom.png" 
                  alt="Code Room" 
                  className="w-full h-full object-contain filter drop-shadow" 
                />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
                Code Room
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Open Source
                </span>
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              A real-time collaborative code editor empowering developers, students, and teams to pair-program, chat, and compile multi-language code seamlessly.
            </p>

            {/* Tech Stack Chips */}
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-3 h-3 text-blue-400" /> React 19
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400" /> Socket.io
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-cyan-400" /> Monaco Editor
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <Database className="w-3 h-3 text-amber-400" /> MongoDB
              </span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => scrollTo('features')} className="hover:text-white transition-colors cursor-pointer">
                  Features Bento
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('playground')} className="hover:text-white transition-colors cursor-pointer">
                  Compiler Playground
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('how-it-works')} className="hover:text-white transition-colors cursor-pointer">
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Supported Languages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Languages
            </h4>
            <ul className="space-y-2 text-sm text-slate-400 font-mono text-xs">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                <span>JavaScript (Node.js)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>Python 3.10</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span>C++ (GCC 12)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                <span>Java (OpenJDK 17)</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Resources & Connect */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Community
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <GithubIcon className="w-4 h-4" />
                  GitHub Repo
                </a>
              </li>
              <li>
                <button onClick={() => scrollTo('faq')} className="hover:text-white transition-colors cursor-pointer">
                  FAQ & Docs
                </button>
              </li>
              <li>
                <a href="#quick-join" className="hover:text-white transition-colors flex items-center gap-2 text-blue-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Launch Room
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Code Room. Empowering developers worldwide.</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current mx-0.5" />
            <span>for real-time pair programming.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
