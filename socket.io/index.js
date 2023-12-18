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
//const wss = new WebSocketServer({ port: 8080 });
// console.log("WebSocket Server listening on port 8080")

// When we want to send message from one party to another, we need to use the emit method
// When we want to receive message from one party to another, we need to use the on handler
// io.on('connection', (socket) => {
//     console.log('a user connected');
//     // hello-world is the name of the event and the data is the payload
//     socket.emit("hello-world", {data: "Happy new year!"})
// });

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
})

