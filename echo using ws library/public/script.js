const ws = new WebSocket('ws://localhost:8080');
const messageDiv = document.getElementById('messages');
const statusDiv = document.getElementById('current-status');

document.getElementById('send-message').addEventListener('click', () => {
    const text = document.getElementById('message-input').value;
    ws.send(
        JSON.stringify({
            text,
            timestamp: Date.now()
        })
    );
    statusDiv.innerText = "JUST SENT A MESSAGE";
})

ws.addEventListener('open', () => {
    //do something when the connection is opened
    statusDiv.innerText = "CONNECTED";
});

ws.addEventListener('close', () => {
    //do something when the connection is closed
    statusDiv.innerText = "DISCONNECTED";
});

ws.addEventListener('message', (event) => {
    //do something when a message is received from the server
    statusDiv.innerText = "JUST RECEIVED A MESSAGE";
    const div = document.createElement('div');
    div.className = "new-message";
    const json = JSON.parse(event.data);
    div.innerText = `${json.text} at ${json.timestamp}`;
    messageDiv.appendChild(div);
});