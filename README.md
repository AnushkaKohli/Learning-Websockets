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
