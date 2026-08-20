import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Users, 
  Sparkles, 
  Menu, 
  X, 
  ArrowRight,
  Zap
} from 'lucide-react';

const GithubIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const Navbar = ({ onOpenJoinModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5">
        <nav className="glass-panel rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl border border-white/10">
          
          {/* Logo & Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300" />
              <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center p-1 overflow-hidden">
                <img 
                  src="/codeRoom-Photoroom.png" 
                  alt="Code Room" 
                  className="w-full h-full object-contain filter drop-shadow" 
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                Code Room
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  v2.0
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium -mt-1 tracking-wide hidden sm:block">
                Real-time Collaborative IDE
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <button 
              onClick={() => scrollToSection('features')}
              className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('playground')}
              className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              Interactive Demo
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </div>

          {/* Right Action CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors border border-transparent hover:border-slate-700"
              title="View on GitHub"
            >
              <GithubIcon className="w-5 h-5" />
            </a>

            <button
              onClick={() => scrollToSection('quick-join')}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden rounded-xl font-medium group cursor-pointer"
            >
              <span className="w-full h-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 group-hover:from-blue-600 group-hover:to-purple-700 absolute"></span>
              <span className="relative px-4 py-2 transition-all ease-out bg-slate-900 rounded-[10px] group-hover:bg-opacity-0 text-white text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" />
                <span>Launch Room</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 glass-panel rounded-2xl border border-white/10 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            <button 
              onClick={() => scrollToSection('features')}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800/70 rounded-lg"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('playground')}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800/70 rounded-lg flex items-center gap-2"
            >
              <Terminal className="w-4 h-4 text-blue-400" />
              Interactive Demo
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800/70 rounded-lg"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800/70 rounded-lg"
            >
              FAQ
            </button>
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => scrollToSection('quick-join')}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
              >
                <Zap className="w-4 h-4" />
                Launch Instant Room
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
