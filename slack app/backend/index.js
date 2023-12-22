//EXPRESS BLOCK
const express = require('express');
const app = express();

app.use("/", (req, res) => {
    res.send("Server is up and running");
});

app.listen(3000, () => {
    console.log("HTTP Server listening on port 3000");
});

//WEBSOCKET BLOCK
const { Server } = require('socket.io');
const { createServer } = require('http');
const appWebSocket = express();
const server = createServer(appWebSocket);
server.listen(3001, () => {
    console.log("WebSocket Server listening on port 3001");
})
const io = new Server(server, {
    transports: ['websocket'],
    cors: {
        origin: 'https://slack-app-client.vercel.app/',
        methods: ['GET', 'POST']
    }
});

const roomIdToMessageMapping = {};

io.on('connection', (socket) => {
    socket.on('sendMessage' , (message) => {
        const roomId = message.roomId;
        const finalMessage = {
            ...message,
            messageId: Math.random().toString(36)
        }
        roomIdToMessageMapping[roomId] = roomIdToMessageMapping[roomId] || [];
        roomIdToMessageMapping[roomId].push(finalMessage);
        io.to(roomId).emit('roomMessage', finalMessage)
    })

    socket.on('sendTypingIndicator', (message) => {
        const { roomId } = message;
        io.to(roomId).emit('userTyping', message);
    })

    socket.on('joinRoomExclusively', (roomId) => {
        if(roomId >= 1 && roomId <= 50){
            //ok
        } else {
            socket.emit('error-from-server', 'Invalid room ID');
            return;
        }

        socket.rooms.forEach((roomIdIAmCurrentlyIn) => {
            socket.leave(roomIdIAmCurrentlyIn);
        });

        socket.join(roomId);
        const messages = roomIdToMessageMapping[roomId] || [];
        for(const message of messages){
            socket.emit('roomMessage', message);
        }
    });
})

