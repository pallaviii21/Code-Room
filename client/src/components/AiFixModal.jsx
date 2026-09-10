import React, { useState } from 'react';
import { Wrench, Check, Copy, X, AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const AiFixModal = ({ isOpen, onClose, onApplyFix, aiData, originalCode, language, theme = 'dark' }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !aiData) return null;

    const isDark = theme === 'dark';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(aiData.fixedCode || '');
            setCopied(true);
            toast.success('Fixed code copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy code');
        }
    };

    const handleApply = () => {
        if (!aiData.fixedCode) return;
        onApplyFix(aiData.fixedCode);
        toast.success('Auto-fix applied and synced with room');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border transition-colors ${
                isDark 
                    ? 'bg-slate-900 border-slate-700/80 text-slate-100' 
                    : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
            }`}>
                {/* Header */}
                <div className={`px-6 py-4 border-b flex items-center justify-between ${
                    isDark 
                        ? 'bg-slate-800/80 border-slate-700/80' 
                        : 'bg-slate-50 border-slate-200'
                }`}>
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                            <Wrench className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className={`text-base font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Error Diagnostics & Auto-Fix
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                                    isDark ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-100 text-indigo-700'
                                }`}>
                                    {language}
                                </span>
                            </h2>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Automated root cause analysis and patch
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-1.5 rounded-lg transition ${
                            isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                        }`}
                        title="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Body */}
                <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar text-sm">
                    {/* API Key Missing Alert */}
                    {aiData.needsApiKey && (
                        <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                            isDark 
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' 
                                : 'bg-amber-50 border-amber-300 text-amber-900'
                        }`}>
                            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold mb-1">Gemini API Key Required</p>
                                <p>
                                    To generate live error fixes, add your key in <code className={`px-1.5 py-0.5 rounded font-mono ${isDark ? 'bg-slate-800 text-amber-300' : 'bg-amber-100 text-amber-900'}`}>server/.env</code>:
                                </p>
                                <pre className={`mt-2 p-2 rounded text-[11px] font-mono border select-all ${
                                    isDark ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-slate-100 border-slate-200 text-slate-900'
                                }`}>
                                    GEMINI_API_KEY=your_key_here
                                </pre>
                                <p className="mt-2 text-slate-500">
                                    Get a free key (no credit card needed) at{' '}
                                    <a
                                        href="https://aistudio.google.com/app/apikey"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                                    >
                                        Google AI Studio &rarr;
                                    </a>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Explanation */}
                    <div className={`rounded-xl p-4 border ${
                        isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                    }`}>
                        <div className={`text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                            <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" />
                            Root Cause Diagnosis
                        </div>
                        <p className={`leading-relaxed text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                            {aiData.explanation || 'No detailed explanation available.'}
                        </p>
                    </div>

                    {/* Changes List */}
                    {aiData.changes && aiData.changes.length > 0 && (
                        <div className={`rounded-xl p-4 border ${
                            isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                        }`}>
                            <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                                isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                                Changes Applied
                            </div>
                            <ul className="space-y-1.5 text-xs">
                                {aiData.changes.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <ArrowRight className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Code Diff Preview */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-semibold uppercase tracking-wider ${
                                isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                                Proposed Code Patch
                            </span>
                            <button
                                onClick={handleCopy}
                                className={`text-xs flex items-center gap-1 transition px-2.5 py-1 rounded-md border ${
                                    isDark 
                                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700' 
                                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                }`}
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copied ? 'Copied' : 'Copy Code'}</span>
                            </button>
                        </div>
                        <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 font-mono text-xs overflow-x-auto max-h-56 custom-scrollbar text-emerald-400">
                            <pre>{aiData.fixedCode || '// No code output'}</pre>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className={`px-6 py-3.5 border-t flex items-center justify-end gap-3 ${
                    isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-slate-50 border-slate-200'
                }`}>
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                            isDark 
                                ? 'text-slate-400 hover:text-white hover:bg-slate-700/60' 
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                        }`}
                    >
                        Dismiss
                    </button>
                    <button
                        onClick={handleApply}
                        disabled={aiData.needsApiKey || !aiData.fixedCode}
                        className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white shadow-md shadow-indigo-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Apply Fix to Room</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiFixModal;
