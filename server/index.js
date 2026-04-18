require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const Room = require('./models/Room');
const CodeSnapshot = require('./models/CodeSnapshot');

// Connect to MongoDB
connectDB();

const app = express();
const allowedOrigin = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : '*';
app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());

app.post('/api/execute', (req, res) => {
    const { language, files } = req.body;
    let sourceCode = files && files.length > 0 ? files[0].content : '';
    
    const tempDir = path.join(__dirname, 'temp_exe');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }
    
    const fileId = "test_run_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    
    let ext = '';
    let runCommand = '';
    
    if (language === 'javascript') {
        ext = '.js';
        runCommand = `node ${fileId}${ext}`;
    } else if (language === 'python') {
        ext = '.py';
        runCommand = `python ${fileId}${ext}`;
    } else if (language === 'cpp') {
        ext = '.cpp';
        runCommand = `g++ ${fileId}${ext} -o ${fileId}.exe && ${fileId}.exe`;
    } else if (language === 'java') {
        ext = '.java';
        runCommand = `javac Main.java && java Main`;
    } else {
        return res.status(400).json({ message: `Local execution for ${language} is not supported locally.` });
    }
    
    let targetFileName = fileId + ext;
    let cwd = tempDir;
    
    if (language === 'java') {
        cwd = path.join(tempDir, fileId);
        fs.mkdirSync(cwd);
        targetFileName = 'Main.java';
    }
    
    const filePath = path.join(cwd, targetFileName);
    fs.writeFileSync(filePath, sourceCode);
    
    exec(runCommand, { cwd, timeout: 10000 }, (error, stdout, stderr) => {
        if (language === 'java') {
            fs.rmSync(cwd, { recursive: true, force: true });
        } else {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            if (language === 'cpp' && fs.existsSync(path.join(cwd, `${fileId}.exe`))) {
                fs.unlinkSync(path.join(cwd, `${fileId}.exe`));
            }
        }
        
        let output = stdout || stderr || '';
        if (error && !stderr) {
            output = error.message;
        }
        
        res.json({
            run: {
                stdout: stdout || '',
                stderr: stderr || '',
                output: output,
                code: error ? (error.code || 1) : 0
            }
        });
    });
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
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
    socket.on('join_room', async ({ roomId, username }) => {
        userSocketMap.set(socket.id, { username, roomId });
        socket.join(roomId);
        console.log(`User ${username} (${socket.id}) joined room ${roomId}`);
        
        // Ensure Room exists in DB
        try {
            await Room.updateOne({ roomId }, { $setOnInsert: { roomId } }, { upsert: true });
        } catch (err) {
            console.error('Error creating room in DB', err);
        }

        const clients = getAllConnectedClients(roomId);
        
        // Notify others that a user joined
        socket.to(roomId).emit('user_joined', { username, socketId: socket.id });
        // Send updated user list to everyone in the room
        io.to(roomId).emit('user_list', { clients });

        // Load code from Database or Memory
        try {
            const snapshot = await CodeSnapshot.findOne({ roomId });
            if (snapshot) {
                // Pre-fill memory state
                roomState.set(roomId, { code: snapshot.code });
                socket.emit('code_change', { code: snapshot.code });
            } else if (roomState.has(roomId)) {
                // Fallback to memory if DB doesn't have it but memory does
                socket.emit('code_change', { code: roomState.get(roomId).code });
            }
        } catch (err) {
            console.error('Error fetching snapshot', err);
        }
    });

    // Listen for code changes
    socket.on('code_change', async ({ roomId, code }) => {
        // Save the latest code in memory
        roomState.set(roomId, { code });
        // Broadcast to all other clients in the exact room
        socket.to(roomId).emit('code_change', { code });

        // Update Database asynchronously
        try {
            await CodeSnapshot.updateOne(
                { roomId },
                { code, updatedAt: Date.now() },
                { upsert: true }
            );
        } catch (err) {
            console.error('Error updating code snapshot in DB', err);
        }
    });

    // Listen for chat messages
    socket.on('send_message', ({ roomId, message, username }) => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        // Broadcast the message to all clients in the room (including sender if we want, or use io.to to include everyone)
        io.to(roomId).emit('receive_message', { 
            message, 
            username, 
            timestamp,
            socketId: socket.id
        });
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
