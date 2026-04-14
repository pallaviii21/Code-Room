import { io } from 'socket.io-client';

export const socketInit = () => {
    // For Phase 1 we point to the backend server explicitly on localhost:5000
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
    };
    return io('http://127.0.0.1:5000', options);
};
