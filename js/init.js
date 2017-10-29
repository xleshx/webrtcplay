
var roomURL = document.getElementById('url');
var sendBtn = document.getElementById('send');
var toSend = document.getElementById('dataChannelSend');
var chat = document.getElementById('chat');
var clientsList = document.getElementById('clients');

var room = window.location.hash.substring(1);
if (room === '') {
    var randomRoom = randomToken();
    room = prompt('Please specify the room name, otherwise you will use random one: '+randomRoom, randomRoom);
}

function randomToken() {
    return Math.floor((1 + Math.random()) * 1e16).toString(16).substring(1);
}
