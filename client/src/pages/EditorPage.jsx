import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { socketInit } from '../socket';

const EditorPage = () => {
    const socketRef = useRef(null);
    const editorRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [code, setCode] = useState('// Write your code here...');
    const [clients, setClients] = useState([]);
    const [language, setLanguage] = useState('javascript');

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
        };
        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off('code_change');
                socketRef.current.off('user_joined');
                socketRef.current.off('user_left');
                socketRef.current.off('user_list');
            }
        };
    }, []);

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

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex h-screen bg-slate-900 text-slate-100 flex-col">
            <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-white">Code Room</h1>
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
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Connected Users</h3>
                        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                            {clients.map((client) => (
                                <div key={client.socketId} className="flex items-center space-x-3 bg-slate-700/50 p-2 rounded-lg hover:bg-slate-700 transition duration-200">
                                    <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-white uppercase select-none shadow-md">
                                        {client.username.substring(0, 2)}
                                    </div>
                                    <span className="text-sm font-medium text-slate-200 truncate pr-2">
                                        {client.username} {client.username === location.state?.username && <span className="text-slate-400 font-normal italic">(You)</span>}
                                    </span>
                                </div>
                            ))}
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
                        
                        <div className="flex flex-col space-y-2">
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

                {/* Editor Container */}
                <div className="flex-1 overflow-hidden relative">
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
            </div>
        </div>
    );
};

export default EditorPage;
