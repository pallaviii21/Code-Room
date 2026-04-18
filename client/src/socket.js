import { io } from 'socket.io-client';

export const socketInit = () => {
    // For Phase 1 we point to the backend server explicitly on localhost:5000
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
    };
    const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000').replace(/\/$/, '');
    return io(BACKEND_URL, options);
};
