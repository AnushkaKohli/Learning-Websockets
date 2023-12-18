//EXPRESS BLOCK
const express = require('express');
const app = express();

app.use(express.static('./public'));

app.listen(3000, () => {
    console.log("HTTP Server listening on port 3000");
});

//WEBSOCKET BLOCK
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });
console.log("WebSocket Server listening on port 8080")
  
wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  ws.on('message', function message(data) {
    //do something when a message is received from the client
    console.log('received: %s', data);
    setTimeout(() => {
        ws.send(
            JSON.stringify({
                text: `You said: ${JSON.parse(data).text}`,
                timestamp: Date.now()
            })
           );
    }, 1000)
  });
});