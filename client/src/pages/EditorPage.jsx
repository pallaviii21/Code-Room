import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { 
    Play, 
    Wrench, 
    Bot, 
    Send, 
    Copy, 
    LogOut, 
    Sun, 
    Moon, 
    PanelLeftClose, 
    PanelLeftOpen, 
    MessageSquare, 
    Users, 
    Maximize2, 
    Minimize2, 
    X, 
    Minus, 
    HelpCircle, 
    Zap, 
    CheckCircle2, 
    Bug, 
    Trash2,
    Terminal as TerminalIcon,
    ChevronDown
} from 'lucide-react';
import { socketInit } from '../socket';
import { executeCode } from '../api/piston';
import { requestAiFix } from '../api/ai';
import AiFixModal from '../components/AiFixModal';

const EditorPage = () => {
    const socketRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    
    // Theme state (persisted)
    const [theme, setTheme] = useState(() => localStorage.getItem('code_room_theme') || 'dark');
    const isDark = theme === 'dark';

    const toggleTheme = () => {
        const next = isDark ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('code_room_theme', next);
    };

    // Editor & Room state
    const [code, setCode] = useState('// Write your code here...');
    const [clients, setClients] = useState([]);
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState(null);
    const [isExecuting, setIsExecuting] = useState(false);

    // Sidebar adjustable layout state
    const [sidebarWidth, setSidebarWidth] = useState(320);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'users'

    // Terminal adjustable layout state
    const [terminalHeight, setTerminalHeight] = useState(240);
    const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
    const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
    
    // AI Fix state
    const [isAiDiagnosing, setIsAiDiagnosing] = useState(false);
    const [aiFixData, setAiFixData] = useState(null);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    // Chat state
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const chatContainerRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            socketRef.current = socketInit();

            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            // Emit join room
            socketRef.current.emit('join_room', {
                roomId,
                username: location.state?.username,
            });

            // Listening for code change
            socketRef.current.on('code_change', ({ code: newCode }) => {
                if (newCode !== null) {
                    setCode(newCode);
                }
            });

            // Listening for language change
            socketRef.current.on('language_change', ({ language: newLang }) => {
                if (newLang) {
                    setLanguage(newLang);
                    toast(`Language switched to ${newLang}`);
                }
            });

            socketRef.current.on('user_joined', ({ username }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined`);
                }
            });

            socketRef.current.on('user_left', ({ username }) => {
                toast(`${username} left`);
            });

            socketRef.current.on('user_list', ({ clients }) => {
                setClients(clients);
            });

            socketRef.current.on('receive_message', (messageData) => {
                setMessages((prev) => [...prev, messageData]);
            });

            socketRef.current.on('ai_message_update', (updatedMsg) => {
                setMessages((prev) =>
                    prev.map((msg) => (msg.id === updatedMsg.id ? updatedMsg : msg))
                );
            });
        };
        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off('code_change');
                socketRef.current.off('language_change');
                socketRef.current.off('user_joined');
                socketRef.current.off('user_left');
                socketRef.current.off('user_list');
                socketRef.current.off('receive_message');
                socketRef.current.off('ai_message_update');
            }
        };
    }, []);

    // Auto-scroll chat to bottom
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, activeTab]);

    const handleEditorChange = (value) => {
        setCode(value);
        socketRef.current?.emit('code_change', {
            roomId,
            code: value,
            language
        });
    };

    const handleSendMessage = (msgToSend) => {
        const text = (typeof msgToSend === 'string' ? msgToSend : currentMessage).trim();
        if (!text || !socketRef.current) return;
        
        socketRef.current.emit('send_message', {
            roomId,
            message: text,
            username: location.state?.username,
        });
        
        setCurrentMessage('');
    };

    const handleRunCode = async () => {
        if (!code || code.trim() === '') {
            toast.error('Code cannot be empty!');
            return;
        }
        
        setIsExecuting(true);
        setIsTerminalMinimized(false);
        setOutput({ status: 'running', message: 'Compiling & Executing...' });
        
        try {
            const result = await executeCode(language, code);
            setOutput({
                status: 'success',
                message: result.output || 'Code executed successfully with no output.',
                stderr: result.stderr,
                code: result.code
            });
            if (result.stderr && result.code !== 0) {
                toast.error('Execution finished with errors.');
            } else {
                toast.success('Execution completed!');
            }
        } catch (error) {
            setOutput({
                status: 'error',
                message: error.message || 'An unexpected error occurred during execution.',
            });
            toast.error('Execution failed.');
        } finally {
            setIsExecuting(false);
        }
    };

    // Phase 1: AI Diagnostics
    const handleAiDiagnose = async () => {
        if (!code) {
            toast.error('No code available to diagnose.');
            return;
        }

        const errorContent = output?.stderr || output?.message || 'Error occurred during execution.';
        setIsAiDiagnosing(true);
        try {
            const data = await requestAiFix(language, code, errorContent);
            setAiFixData(data);
            setIsAiModalOpen(true);
        } catch (err) {
            console.error(err);
            toast.error('Failed to communicate with AI debugger service.');
        } finally {
            setIsAiDiagnosing(false);
        }
    };

    const handleApplyFix = (fixedCode) => {
        setCode(fixedCode);
        socketRef.current?.emit('code_change', {
            roomId,
            code: fixedCode,
            language
        });
    };

    // Drag to resize sidebar width
    const startSidebarResize = (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = sidebarWidth;

        const onMouseMove = (moveEvent) => {
            const delta = moveEvent.clientX - startX;
            const newWidth = Math.max(240, Math.min(540, startWidth + delta));
            setSidebarWidth(newWidth);
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    // Drag to resize terminal height
    const startTerminalResize = (e) => {
        e.preventDefault();
        const startY = e.clientY;
        const startHeight = terminalHeight;

        const onMouseMove = (moveEvent) => {
            const delta = startY - moveEvent.clientY;
            const newHeight = Math.max(120, Math.min(window.innerHeight * 0.75, startHeight + delta));
            setTerminalHeight(newHeight);
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    const hasError = output && (
        output.status === 'error' || 
        (output.code !== undefined && output.code !== 0) || 
        (output.stderr && output.stderr.trim() !== '')
    );

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className={`flex h-screen flex-col select-none transition-colors duration-200 ${
            isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'
        }`}>
            {/* Top Navigation Bar */}
            <header className={`h-14 border-b flex items-center justify-between px-4 sm:px-6 z-20 transition-colors ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
                <div className="flex items-center space-x-3">
                    {/* Toggle Sidebar Collapse */}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className={`p-1.5 rounded-lg transition ${
                            isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                        title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                    </button>

                    <div className="flex items-center space-x-2">
                        <img className="h-7 w-auto drop-shadow-sm" src="/codeRoom-Photoroom.png" alt="Code Room" />
                        <span className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Code Room
                        </span>
                    </div>

                    <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${
                        isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Room: {roomId.slice(0, 8)}...</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-medium ${
                            isDark 
                                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                                : 'bg-slate-100 border-slate-300 text-indigo-600 hover:bg-slate-200'
                        }`}
                        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        <span className="hidden md:inline">{isDark ? "Light Mode" : "Dark Mode"}</span>
                    </button>

                    {/* Copy Room ID Button */}
                    <button
                        onClick={async () => {
                            try {
                                await navigator.clipboard.writeText(roomId);
                                toast.success('Room ID copied');
                            } catch {
                                toast.error('Failed to copy');
                            }
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition flex items-center gap-1.5 ${
                            isDark 
                                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white' 
                                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                        }`}
                        title="Copy Room ID"
                    >
                        <Copy className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Copy ID</span>
                    </button>

                    {/* Leave Room Button */}
                    <button
                        onClick={() => reactNavigator('/')}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition flex items-center gap-1.5 ${
                            isDark 
                                ? 'bg-rose-950/40 border-rose-800/60 text-rose-300 hover:bg-rose-900/60' 
                                : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                        }`}
                        title="Leave Room"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Leave</span>
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Resizable Sidebar */}
                {!isSidebarCollapsed && (
                    <aside 
                        style={{ width: `${sidebarWidth}px` }} 
                        className={`flex flex-col flex-shrink-0 z-10 border-r relative transition-colors ${
                            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                        }`}
                    >
                        {/* Tab Switcher: Chat vs Users */}
                        <div className={`h-11 border-b flex items-center px-3 justify-between ${
                            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
                        }`}>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => setActiveTab('chat')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                                        activeTab === 'chat'
                                            ? isDark ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-indigo-600 shadow-xs border border-slate-200 font-semibold'
                                            : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>Chat</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                                        activeTab === 'users'
                                            ? isDark ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-indigo-600 shadow-xs border border-slate-200 font-semibold'
                                            : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    <Users className="w-3.5 h-3.5" />
                                    <span>Users ({clients.length})</span>
                                </button>
                            </div>
                        </div>

                        {/* Sidebar Body */}
                        <div className="flex-1 flex flex-col min-h-0 p-3 overflow-hidden">
                            {/* TAB 1: CHAT */}
                            {activeTab === 'chat' && (
                                <div className="flex-1 flex flex-col min-h-0">
                                    {/* Messages list */}
                                    <div 
                                        className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1 mb-2 select-text" 
                                        ref={chatContainerRef}
                                    >
                                        {messages.length === 0 ? (
                                            <div className={`text-xs italic text-center mt-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                No messages yet. Say hello or tag <span className="text-indigo-500 font-mono">@ai</span>!
                                            </div>
                                        ) : (
                                            messages.map((msg, idx) => {
                                                const isCurrentUser = msg.socketId === socketRef.current?.id;
                                                
                                                // AI Bot message style
                                                if (msg.isAi) {
                                                    return (
                                                        <div key={msg.id || idx} className="flex flex-col items-start w-full animate-in fade-in duration-150">
                                                            <div className="flex items-center space-x-1.5 mb-1">
                                                                <div className="w-4 h-4 rounded-md bg-indigo-600 flex items-center justify-center text-[10px] text-white">
                                                                    <Bot className="w-2.5 h-2.5" />
                                                                </div>
                                                                <span className="text-[11px] font-semibold text-indigo-500">{msg.username}</span>
                                                                <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{msg.timestamp}</span>
                                                            </div>
                                                            <div className={`py-2 px-3 rounded-xl text-xs leading-relaxed max-w-[95%] border shadow-xs rounded-tl-none ${
                                                                isDark 
                                                                    ? 'bg-slate-950 border-indigo-500/30 text-slate-200' 
                                                                    : 'bg-indigo-50/70 border-indigo-200 text-slate-800'
                                                            }`}>
                                                                {msg.isThinking ? (
                                                                    <div className="flex items-center space-x-1.5 py-0.5 text-indigo-500">
                                                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                                                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                                                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                                                                        <span className={`text-[11px] ml-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>CodeBot is thinking...</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="whitespace-pre-wrap font-sans">
                                                                        {msg.message}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                }

                                                // Human messages
                                                return (
                                                    <div key={msg.id || idx} className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                                                        <div className="flex items-baseline space-x-1.5 mb-0.5">
                                                            <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{msg.username}</span>
                                                            <span className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{msg.timestamp}</span>
                                                        </div>
                                                        <div className={`py-1.5 px-3 rounded-xl text-xs max-w-[90%] break-words shadow-xs ${
                                                            isCurrentUser 
                                                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                                                : isDark ? 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/60' : 'bg-slate-200 text-slate-800 rounded-bl-none'
                                                        }`}>
                                                            {msg.message}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    {/* AI Contextual Prompt Chips (Clean icons, no star emoji) */}
                                    <div className="flex items-center gap-1 mb-2 overflow-x-auto custom-scrollbar pb-1 text-[11px]">
                                        <span className={`text-[10px] font-semibold uppercase tracking-wider flex-shrink-0 mr-0.5 ${
                                            isDark ? 'text-slate-500' : 'text-slate-400'
                                        }`}>
                                            Ask AI:
                                        </span>
                                        {[
                                            { label: 'Explain', text: '@ai explain what this code does', icon: HelpCircle },
                                            { label: 'Optimize', text: '@ai optimize time & space complexity', icon: Zap },
                                            { label: 'Tests', text: '@ai generate unit test cases', icon: CheckCircle2 },
                                            { label: 'Bugs', text: '@ai find potential bugs or edge cases', icon: Bug },
                                        ].map((chip, i) => {
                                            const ChipIcon = chip.icon;
                                            return (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => setCurrentMessage(chip.text)}
                                                    className={`flex-shrink-0 px-2 py-0.5 rounded-lg border flex items-center gap-1 transition cursor-pointer text-[11px] ${
                                                        isDark 
                                                            ? 'bg-slate-800/80 border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white' 
                                                            : 'bg-slate-100 border-slate-300 hover:border-indigo-400 text-slate-700 hover:text-indigo-700'
                                                    }`}
                                                >
                                                    <ChipIcon className="w-3 h-3 text-indigo-500" />
                                                    <span>{chip.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Chat Input */}
                                    <div className="relative mt-auto flex-shrink-0">
                                        <input 
                                            type="text" 
                                            value={currentMessage}
                                            onChange={(e) => setCurrentMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Message or @ai query..."
                                            className={`w-full text-xs rounded-xl pl-3 pr-10 py-2.5 outline-none border transition ${
                                                isDark 
                                                    ? 'bg-slate-950 border-slate-700 focus:border-indigo-500 text-slate-100 placeholder-slate-500' 
                                                    : 'bg-slate-50 border-slate-300 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder-slate-400'
                                            }`}
                                        />
                                        <button 
                                            onClick={() => handleSendMessage()}
                                            disabled={!currentMessage.trim()}
                                            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-indigo-500 hover:text-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                            title="Send"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: USERS */}
                            {activeTab === 'users' && (
                                <div className="flex-1 flex flex-col space-y-2 overflow-y-auto custom-scrollbar">
                                    <span className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${
                                        isDark ? 'text-slate-400' : 'text-slate-500'
                                    }`}>
                                        Online in this room ({clients.length})
                                    </span>
                                    {clients.map((client) => (
                                        <div 
                                            key={client.socketId} 
                                            className={`flex items-center space-x-3 p-2 rounded-xl border transition ${
                                                isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                                            }`}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs uppercase shadow-sm">
                                                {client.username.substring(0, 2)}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className={`text-xs font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                                    {client.username}
                                                </span>
                                                <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    {client.username === location.state?.username ? 'You (Active)' : 'Collaborator'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Controls Bottom Panel */}
                        <div className={`p-3 border-t space-y-2.5 ${
                            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                            {/* Language selector */}
                            <div className="flex items-center justify-between gap-2">
                                <label className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Language:
                                </label>
                                <div className="relative flex-1">
                                    <select 
                                        className={`w-full rounded-lg pl-2.5 pr-7 py-1.5 text-xs appearance-none outline-none border cursor-pointer transition ${
                                            isDark 
                                                ? 'bg-slate-950 text-slate-200 border-slate-700 focus:border-indigo-500' 
                                                : 'bg-white text-slate-800 border-slate-300 focus:border-indigo-600'
                                        }`}
                                        value={language}
                                        onChange={(e) => {
                                            const newLang = e.target.value;
                                            setLanguage(newLang);
                                            socketRef.current?.emit('language_change', { roomId, language: newLang });
                                        }}
                                    >
                                        <option value="javascript">JavaScript (Node.js)</option>
                                        <option value="python">Python 3.10</option>
                                        <option value="cpp">C++ (GCC)</option>
                                        <option value="java">Java (OpenJDK)</option>
                                        <option value="typescript">TypeScript</option>
                                        <option value="rust">Rust</option>
                                        <option value="go">Go</option>
                                    </select>
                                    <ChevronDown className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
                                        isDark ? 'text-slate-400' : 'text-slate-500'
                                    }`} />
                                </div>
                            </div>

                            {/* Run Code Button */}
                            <button 
                                className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-sm active:scale-98 ${
                                    isExecuting 
                                        ? 'bg-emerald-600/50 cursor-not-allowed text-white' 
                                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                                }`}
                                onClick={handleRunCode}
                                disabled={isExecuting}
                            >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
                            </button>
                        </div>

                        {/* Drag handle on right edge of sidebar */}
                        <div
                            onMouseDown={startSidebarResize}
                            className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-indigo-500 transition-colors z-20"
                            title="Drag to resize sidebar"
                        />
                    </aside>
                )}

                {/* Editor & Terminal Area */}
                <main className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Monaco Editor Container */}
                    <div className="flex-1 overflow-hidden relative">
                        <Editor
                            height="100%"
                            width="100%"
                            theme={isDark ? 'vs-dark' : 'light'}
                            language={language}
                            value={code}
                            onChange={handleEditorChange}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 15,
                                wordWrap: 'on',
                                padding: { top: 16 },
                                fontFamily: "'Fira Code', 'JetBrains Mono', 'Courier New', monospace",
                                cursorSmoothCaretAnimation: "on",
                                smoothScrolling: true,
                            }}
                        />
                    </div>

                    {/* Adjustable Output Terminal */}
                    {output && !isTerminalMinimized && (
                        <section 
                            style={{ 
                                height: isTerminalMaximized ? '85%' : `${terminalHeight}px` 
                            }} 
                            className={`flex flex-col border-t transition-all z-20 relative select-text ${
                                isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-md'
                            }`}
                        >
                            {/* Drag handle on top border of terminal */}
                            {!isTerminalMaximized && (
                                <div
                                    onMouseDown={startTerminalResize}
                                    className="absolute top-0 left-0 right-0 h-1.5 cursor-row-resize hover:bg-indigo-500 transition-colors z-30"
                                    title="Drag to resize terminal height"
                                />
                            )}

                            {/* Terminal Header */}
                            <div className={`h-9 flex items-center justify-between px-4 border-b select-none ${
                                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <span className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                                        isDark ? 'text-slate-300' : 'text-slate-700'
                                    }`}>
                                        <TerminalIcon className="w-3.5 h-3.5 text-indigo-500" />
                                        Terminal Output
                                    </span>

                                    {/* AI Fix button (semantic icon, no star emoji) */}
                                    {hasError && (
                                        <button
                                            onClick={handleAiDiagnose}
                                            disabled={isAiDiagnosing}
                                            className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition disabled:opacity-50 cursor-pointer active:scale-95"
                                            title="Diagnose & auto-fix this error with AI"
                                        >
                                            <Wrench className={`w-3 h-3 ${isAiDiagnosing ? 'animate-spin' : ''}`} />
                                            <span>{isAiDiagnosing ? 'Diagnosing...' : 'Auto-Fix with AI'}</span>
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center space-x-1">
                                    {/* Clear terminal */}
                                    <button
                                        onClick={() => setOutput(null)}
                                        className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition`}
                                        title="Clear Output"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    {/* Maximize / Restore */}
                                    <button
                                        onClick={() => setIsTerminalMaximized(!isTerminalMaximized)}
                                        className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition`}
                                        title={isTerminalMaximized ? "Restore Height" : "Maximize Terminal"}
                                    >
                                        {isTerminalMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                                    </button>
                                    {/* Minimize */}
                                    <button
                                        onClick={() => setIsTerminalMinimized(true)}
                                        className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition`}
                                        title="Minimize Terminal"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    {/* Close */}
                                    <button
                                        onClick={() => setOutput(null)}
                                        className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition`}
                                        title="Close Terminal"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Terminal Output Content */}
                            <div className={`flex-1 p-4 overflow-y-auto font-mono text-xs ${
                                isDark ? 'bg-[#0d1117] text-slate-200' : 'bg-slate-900 text-slate-100'
                            }`}>
                                {output?.status === 'running' && (
                                    <div className="text-slate-400 animate-pulse">{output.message}</div>
                                )}
                                {output?.status === 'success' && (
                                    <pre className={`whitespace-pre-wrap flex-1 ${output.code !== 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {output.message}
                                    </pre>
                                )}
                                {output?.status === 'error' && (
                                    <pre className="whitespace-pre-wrap text-rose-400 font-semibold flex-1">
                                        {output.message}
                                    </pre>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Minimized Terminal Bar */}
                    {output && isTerminalMinimized && (
                        <div className={`h-8 border-t flex items-center justify-between px-4 z-20 ${
                            isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-200 border-slate-300 text-slate-700'
                        }`}>
                            <span className="text-xs font-semibold flex items-center gap-1.5">
                                <TerminalIcon className="w-3.5 h-3.5 text-indigo-500" />
                                Terminal (Minimized)
                            </span>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setIsTerminalMinimized(false)}
                                    className="text-xs text-indigo-500 hover:underline font-medium"
                                >
                                    Restore
                                </button>
                                <button
                                    onClick={() => setOutput(null)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* AI Fix Modal */}
            <AiFixModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                onApplyFix={handleApplyFix}
                aiData={aiFixData}
                originalCode={code}
                language={language}
                theme={theme}
            />
        </div>
    );
};

export default EditorPage;
