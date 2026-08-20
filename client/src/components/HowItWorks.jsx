import React from 'react';
import { 
  Sparkles, 
  Share2, 
  Play, 
  ArrowRight, 
  UserPlus, 
  Code2, 
  Terminal 
} from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Generate a Room',
    subtitle: 'Instant 1-Click Setup',
    description: 'Create a unique, persistent session ID with zero signup required. Pick your display name and enter your private workspace.',
    icon: Sparkles,
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'group-hover:border-blue-500/50'
  },
  {
    step: '02',
    title: 'Share the Invite',
    subtitle: 'Collaborate with Anyone',
    description: 'Copy your Room ID or direct invite URL. Send it over Slack, Discord, Google Meet, or email for instant peer access.',
    icon: Share2,
    color: 'from-purple-500 to-pink-600',
    borderColor: 'group-hover:border-purple-500/50'
  },
  {
    step: '03',
    title: 'Code & Compile',
    subtitle: 'Zero Latency Live Sync',
    description: 'Edit simultaneously with VS Code Monaco power, communicate via in-room live chat, and run your code on cloud sandboxes.',
    icon: Terminal,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'group-hover:border-emerald-500/50'
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
            <span>Simple 3-Step Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Get started in{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              under 10 seconds
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            No software installation. No account setup hurdles. Just straight code collaboration.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className={`glass-panel rounded-3xl p-8 border border-white/10 transition-all duration-300 relative group hover:-translate-y-1.5 ${item.borderColor}`}
              >
                {/* Step Number Top Badge */}
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-xl shadow-blue-500/10`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="font-mono text-4xl font-extrabold text-slate-700/80 group-hover:text-slate-500 transition-colors">
                    {item.step}
                  </span>
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
                  {item.subtitle}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                {/* Bottom line accent */}
                <div className="mt-8 pt-4 border-t border-slate-800 flex items-center text-xs text-slate-500 group-hover:text-slate-300 transition-colors font-medium">
                  <span>Fast & Secure Connection</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto group-hover:translate-x-1 transition-transform text-blue-400" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
