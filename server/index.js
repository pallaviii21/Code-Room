require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*', // Allows all origins for local phase 1 development
        methods: ['GET', 'POST']
    }
});

// To manage code state for people joining late
const roomState = new Map(); // roomId -> { code: string }

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for join_room
    socket.on('join_room', ({ roomId }) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        
        // If there's already code in this room, send to the user immediately
        if (roomState.has(roomId)) {
            socket.emit('code_change', { code: roomState.get(roomId).code });
        }
    });

    // Listen for code changes
    socket.on('code_change', ({ roomId, code }) => {
        // Save the latest code
        roomState.set(roomId, { code });
        // Broadcast to all other clients in the exact room
        socket.to(roomId).emit('code_change', { code });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
