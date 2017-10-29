
/****************************************************************************
 * Signaling server
 ****************************************************************************/

// Connect to the signaling server
var socket = io.connect();

//define clients socket.io sessionID
socket.on('connect', function() {
    sessionId = socket.io.engine.id;
});

socket.on('ipaddr', function(ipaddr) {
    console.log('Server IP address is: ' + ipaddr);
    updateRoomURL(ipaddr);
});

socket.on('created', function(room, clientId) {
    console.log('Created room', room, '- my client ID is', clientId);
    isInitiator = true;
});

socket.on('joined', function(room, clientId) {
    console.log('This peer has joined room', room, 'with client ID', clientId);
    isInitiator = false;
    createPeerConnection(isInitiator, configuration);
});

socket.on('ready', function() {
    console.log('Socket is ready');
    createPeerConnection(isInitiator, configuration);
});

socket.on('log', function(array) {
    console.log.apply(console, array);
});

socket.on('message', function(message) {
    console.log('Client received message:', message);
    signalingMessageCallback(message);
});

// Join a room
socket.emit('create or join', room);

if (location.hostname.match(/localhost|127\.0\.0/)) {
    socket.emit('ipaddr');
}
