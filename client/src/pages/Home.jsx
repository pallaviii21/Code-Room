import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID & username are required');
            return;
        }
        // Redirect to Editor Page
        navigate(`/editor/${roomId}`, {
            state: { username },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 text-slate-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/50">
                <div className="text-center space-y-2 flex flex-col items-center">
                    <img className="h-24 w-auto mb-2 drop-shadow-md" src="/codeRoom-Photoroom.png" alt="Code Room Logo" />
                    <h1 className="text-3xl font-bold tracking-tight text-white">Code Room</h1>
                    <p className="text-slate-400">Real-time collaborative code editor</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Room ID</label>
                        <input
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            onKeyUp={handleInputEnter}
                            placeholder="ROOM ID"
                            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyUp={handleInputEnter}
                            placeholder="USERNAME"
                            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                    </div>

                    <button
                        onClick={joinRoom}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/30"
                    >
                        Join Room
                    </button>
                    
                    <div className="text-center text-sm text-slate-400">
                        If you don't have an invite then create &nbsp;
                        <a
                            onClick={createNewRoom}
                            href="#"
                            className="text-blue-500 hover:text-blue-400 font-medium hover:underline transition-colors border-b border-transparent"
                        >
                            new room
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
