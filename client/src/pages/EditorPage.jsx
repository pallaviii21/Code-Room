import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { socketInit } from '../socket';
import { executeCode } from '../api/piston';

const EditorPage = () => {
    const socketRef = useRef(null);
    const editorRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [code, setCode] = useState('// Write your code here...');
    const [clients, setClients] = useState([]);
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState(null);
    const [isExecuting, setIsExecuting] = useState(false);
    
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
                    setCode(newCode); // Update state directly
                }
            });

            socketRef.current.on('user_joined', ({ username }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room`);
                }
            });

            socketRef.current.on('user_left', ({ username }) => {
                toast(`${username} left the room`, { icon: '👋' });
            });

            socketRef.current.on('user_list', ({ clients }) => {
                setClients(clients);
            });

            socketRef.current.on('receive_message', (messageData) => {
                setMessages((prev) => [...prev, messageData]);
            });
        };
        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off('code_change');
                socketRef.current.off('user_joined');
                socketRef.current.off('user_left');
                socketRef.current.off('user_list');
                socketRef.current.off('receive_message');
            }
        };
    }, []);

    // Auto-scroll chat to bottom
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleEditorChange = (value, event) => {
        setCode(value);
        
        // Broadcast the change to others.
        // We ensure we emit only the new text to the server.
        // Because setCode updates the state, the editor value changes automatically,
        // and its own change triggers again only if a USERS types.
        socketRef.current.emit('code_change', {
            roomId,
            code: value,
        });
    };

    const handleSendMessage = () => {
        if (!currentMessage.trim() || !socketRef.current) return;
        
        socketRef.current.emit('send_message', {
            roomId,
            message: currentMessage.trim(),
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
        setOutput({ status: 'running', message: 'Executing...' });
        
        try {
            const result = await executeCode(language, code);
            setOutput({
                status: 'success',
                message: result.output || 'Code executed successfully with no output.',
                stderr: result.stderr,
                code: result.code // exit code
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

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex h-screen bg-slate-900 text-slate-100 flex-col">
            <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <img className="h-8 w-auto drop-shadow-sm" src="/codeRoom-Photoroom.png" alt="Code Room Logo" />
                        <h1 className="text-xl font-bold text-white">Code Room</h1>
                    </div>
                    <span className="px-3 py-1 bg-slate-700 rounded-full text-xs font-semibold text-slate-300">
                        Room: {roomId}
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                     <span className="text-sm text-slate-400">Logged in as <strong className="text-white">{location.state.username}</strong></span>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col flex-shrink-0 z-10 shadow-lg">
                    <div className="p-4 flex-1 overflow-hidden flex flex-col">
                        {/* Users Section */}
                        <div className="flex flex-col h-1/3 min-h-0 border-b border-slate-700 pb-4 mb-4">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Connected Users</h3>
                            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                                {clients.map((client) => (
                                    <div key={client.socketId} className="flex items-center space-x-3 bg-slate-700/50 p-2 rounded-lg hover:bg-slate-700 transition duration-200">
                                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-white text-xs uppercase select-none shadow-md">
                                            {client.username.substring(0, 2)}
                                        </div>
                                        <span className="text-sm font-medium text-slate-200 truncate pr-2">
                                            {client.username} {client.username === location.state?.username && <span className="text-slate-400 font-normal italic">(You)</span>}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chat Section */}
                        <div className="flex flex-col flex-1 min-h-0 relative">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex justify-between items-center">
                                <span>Room Chat</span>
                            </h3>
                            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1 rounded-lg mb-3" ref={chatContainerRef}>
                                {messages.length === 0 ? (
                                    <div className="text-xs text-slate-500 italic text-center mt-4">No messages yet. Say hello!</div>
                                ) : (
                                    messages.map((msg, idx) => (
                                        <div key={idx} className={`flex flex-col ${msg.socketId === socketRef.current?.id ? 'items-end' : 'items-start'}`}>
                                            <div className="flex items-baseline space-x-2">
                                                <span className="text-[10px] font-semibold text-slate-400">{msg.username}</span>
                                                <span className="text-[9px] text-slate-500">{msg.timestamp}</span>
                                            </div>
                                            <div className={`mt-0.5 py-1.5 px-3 rounded-lg text-sm max-w-[90%] break-words shadow-sm ${msg.socketId === socketRef.current?.id ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                                                {msg.message}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="relative mt-auto flex-shrink-0">
                                <input 
                                    type="text" 
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type a message..."
                                    className="w-full bg-slate-900 text-sm text-slate-200 rounded-lg pl-3 pr-10 py-2 outline-none border border-slate-600 focus:border-indigo-500 transition-colors shadow-inner"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!currentMessage.trim()}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-500 hover:text-indigo-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                                    title="Send"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Controls Footer */}
                    <div className="p-4 flex flex-col space-y-4 bg-slate-800/90 border-t border-slate-700">
                        <div className="flex flex-col space-y-1">
                            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Language</label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-slate-900 text-slate-200 rounded-lg pl-3 pr-8 py-2.5 text-sm appearance-none outline-none border border-slate-600 focus:border-indigo-500 transition-colors cursor-pointer shadow-inner"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="cpp">C / C++</option>
                                    <option value="java">Java</option>
                                    <option value="html">HTML</option>
                                    <option value="css">CSS</option>
                                    <option value="typescript">TypeScript</option>
                                    <option value="rust">Rust</option>
                                    <option value="go">Go</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>
                        </div>

                        <button 
                            className={`w-full py-2.5 rounded-lg text-sm transition-all font-semibold flex items-center justify-center space-x-2 shadow-sm ${
                                isExecuting 
                                ? 'bg-emerald-600/50 cursor-not-allowed text-stone-200' 
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                            onClick={handleRunCode}
                            disabled={isExecuting}
                        >
                            {isExecuting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Running...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Run Code</span>
                                </>
                            )}
                        </button>
                        
                        <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-slate-700">
                            <button 
                                className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-lg text-sm transition-all font-medium flex items-center justify-center space-x-2 shadow-sm"
                                onClick={async () => {
                                    try {
                                        await navigator.clipboard.writeText(roomId);
                                        toast.success('Room ID copied to clipboard!');
                                    } catch (err) {
                                        toast.error('Failed to copy Room ID');
                                    }
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span>Copy Room ID</span>
                            </button>
                            <button 
                                className="w-full bg-rose-600/90 hover:bg-rose-600 text-white py-2.5 rounded-lg text-sm transition-all font-medium flex items-center justify-center space-x-2 shadow-sm"
                                onClick={() => {
                                    reactNavigator('/');
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Leave Room</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Editor & Output Container */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Monaco Editor */}
                    <div className="flex-1 overflow-hidden">
                        <Editor
                            height="100%"
                            width="100%"
                            theme="vs-dark"
                            language={language}
                            value={code}
                            onChange={handleEditorChange}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 16,
                                wordWrap: 'on',
                                padding: { top: 20 },
                                fontFamily: "'Fira Code', 'JetBrains Mono', 'Courier New', monospace",
                                cursorSmoothCaretAnimation: "on",
                                smoothScrolling: true,
                            }}
                        />
                    </div>

                    {/* Output Terminal */}
                    <div className={`h-[30%] bg-slate-900 border-t border-slate-700 flex flex-col transition-all duration-300 z-10 ${!output ? 'hidden' : 'flex'}`}>
                        <div className="h-10 bg-slate-800 flex items-center justify-between px-4 border-b border-slate-700 select-none">
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M4 15V9a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
                                </svg>
                                Output Terminal
                            </span>
                            <button 
                                onClick={() => setOutput(null)} 
                                className="text-slate-400 hover:text-white transition"
                                title="Close Panel"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto font-mono text-sm bg-[#1e1e1e]">
                            {output?.status === 'running' && (
                                <div className="text-slate-400 animate-pulse">{output.message}</div>
                            )}
                            {output?.status === 'success' && (
                                <pre className={`whitespace-pre-wrap flex-1 ${output.code !== 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {output.message}
                                </pre>
                            )}
                            {output?.status === 'error' && (
                                <pre className="whitespace-pre-wrap text-rose-500 font-semibold flex-1">
                                    {output.message}
                                </pre>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorPage;
