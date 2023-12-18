// const ws = new WebSocket('ws://localhost:8080');
const socket = io('ws://localhost:8080', {
    transports: ['websocket'],
});
const messageDiv = document.getElementById('messages');
const statusDiv = document.getElementById('current-status');

document.getElementById('send-message').addEventListener('click', () => {
    const text = document.getElementById('message-input').value;
    socket.emit('talk-to-server', text);
})

socket.on('talk-to-client', (message) => {
    const div = document.createElement('div');
    div.className = "new-message";
    div.innerText = message;
    messageDiv.appendChild(div);
});

// ws.addEventListener('message', (event) => {
//     //do something when a message is received from the server
//     statusDiv.innerText = "JUST RECEIVED A MESSAGE";
//     const div = document.createElement('div');
//     div.className = "new-message";
//     const json = JSON.parse(event.data);
//     div.innerText = `${json.text} at ${json.timestamp}`;
//     messageDiv.appendChild(div);
// });