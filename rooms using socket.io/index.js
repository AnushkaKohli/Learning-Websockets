//EXPRESS BLOCK
const express = require('express');
const app = express();

app.use(express.static('./public'));

app.listen(3000, () => {
    console.log("HTTP Server listening on port 3000");
});

//WEBSOCKET BLOCK
const { Server } = require('socket.io');
const { createServer } = require('node:http');
const appWebSocket = express();
const server = createServer(appWebSocket);
server.listen(8080, () => {
    console.log("WebSocket Server listening on port 8080");
})
const io = new Server(server, {
    transports: ['websocket'],
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    socket.on('talk-to-server', (message) => {
        console.log("Got a message from client", message);
        socket.emit('talk-to-client', `You said: ${message}`);

        //BROADCASTING
        //To broacast to all clients except the sender
        // socket.broadcast.emit('talk-to-client', `Someone else said: ${message}`);
        //To broadcast to all clients including the sender
        // io.emit('talk-to-client', `Someone else said: ${message}`);
    });

    socket.on('toggleRoom', (roomName) => {
        if(roomName !== "Room1" && roomName !== "Room2") {
            socket.emit("You are requesting a wrong room");
            return
        }
        //`socket.rooms.has(roomName)` is checking if the socket is currently in the specified room (`roomName`). It returns `true` if the socket is in the room, and `false` otherwise.
        if(socket.rooms.has(roomName))
            socket.leave(roomName);
        else
            socket.join(roomName);
        
    });

    setInterval(() => {
        console.log("Broadcasting...")
        io.to("Room1").emit(new Date().toString());
        io.to("Room2").emit(Math.floor(Math.random() * 100));
    }, 1000);
})

