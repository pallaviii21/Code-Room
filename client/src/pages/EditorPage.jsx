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
        };
        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off('code_change');
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

            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    width="100%"
                    theme="vs-dark"
                    defaultLanguage="javascript"
                    value={code}
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 16,
                        wordWrap: 'on',
                        padding: { top: 16 }
                    }}
                />
            </div>
        </div>
    );
};

export default EditorPage;
