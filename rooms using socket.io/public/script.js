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

document.getElementById('toggle-room-1').addEventListener('click', () => {
    socket.emit('toggleRoom', "Room1");
});

document.getElementById('toggle-room-2').addEventListener('click', () => {
    socket.emit('toggleRoom', "Room2");
});
