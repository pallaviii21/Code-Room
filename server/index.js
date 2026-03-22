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
const userSocketMap = new Map(); // socket.id -> { username, roomId }

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap.get(socketId)?.username || 'Anonymous',
        };
    });
}

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for join_room
    socket.on('join_room', ({ roomId, username }) => {
        userSocketMap.set(socket.id, { username, roomId });
        socket.join(roomId);
        console.log(`User ${username} (${socket.id}) joined room ${roomId}`);
        
        const clients = getAllConnectedClients(roomId);
        
        // Notify others that a user joined
        socket.to(roomId).emit('user_joined', { username, socketId: socket.id });
        // Send updated user list to everyone in the room
        io.to(roomId).emit('user_list', { clients });

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

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        const user = userSocketMap.get(socket.id);
        
        rooms.forEach((roomId) => {
            if (roomId !== socket.id && user) {
                // Determine clients list after this user leaves
                const clients = getAllConnectedClients(roomId).filter(
                    (client) => client.socketId !== socket.id
                );
                
                // Notify room that user left
                socket.to(roomId).emit('user_left', {
                    socketId: socket.id,
                    username: user.username,
                });
                
                // Update room with new client list
                socket.to(roomId).emit('user_list', { clients });
            }
        });
        
        userSocketMap.delete(socket.id);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
