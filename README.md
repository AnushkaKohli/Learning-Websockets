# Socket.io

### emit 

When we want to **send** message from one party to another, we need to use the emit method

### on

When we want to **receive** message from one party to another, we need to use the on handler

### Example:

```socket.emit("hello-world", {data: "Happy new year!"})```  

socket.emit takes the **event name** as the first argument and the **payload or data** as the second argument.  

### Broadcasting

To broacast to all clients except the sender  

```socket.broadcast.emit('talk-to-client', `Someone else said: ${message}`);```  

To broadcast to all clients including the sender  

```io.emit('talk-to-client', `Someone else said: ${message}`);```

### Emit With Acknowledgement

You can add a callback as the last argument of the ```emit()```, and this callback will be called once the other side acknowledges the event.  

*Server Side*

```
io.on('connection', (socket) => {
    socket.on('talk-to-server', async (message, callback) => {
        // CLIENT HAS RECEIVED AND PROCESSED THE MESSAGE SUCCESSFULLY
        await io.emitWithAck('talk-to-client', `Someone else said: ${message}`);
        callback("I (server) did the work.")
    });
})
```

*Client Side*

```
socket.on('talk-to-client', (message, callback) => {
    const div = document.createElement('div');
    div.className = "new-message";
    div.innerText = message;
    messageDiv.appendChild(div);
    callback("I (client) did the work.");
});

document.getElementById('send-message').addEventListener('click', async () => {
    // SERVER HAS RECEIVED AND PROCESSED THE MESSAGE SUCCESSFULLY
    const text = document.getElementById('message-input').value;
    await socket.emitWithAck('talk-to-server', text);
})
```

### Rooms

A *room* is an arbitrary channel that sockets can join and leave. It can be used to broadcast events to a subset of clients.

1. You can call ```join``` to subscribe the socket to a given channel:

```
io.on("connection", (socket) => {
  socket.join("some room");
});
```
2. You can then use ```to``` or ```in``` (they are the same) when broadcasting or emitting:

```io.to("some room").emit("some event");```

3. Or exclude a room:

```io.except("some room").emit("some event");```

4. You can also emit to several rooms at the same time:

```io.to("room1").to("room2").to("room3").emit("some event");```

5. You can leave a room:

```socket.leave(roomName);```