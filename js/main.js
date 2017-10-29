'use strict';

/****************************************************************************
 * Initial setup
 ****************************************************************************/

var configuration = {
    'iceServers': [{
        'urls': 'stun:stun.l.google.com:19302'
    }]
};

/**
 * Send message to signaling server
 */
function sendMessage(message) {
    console.log('Client sending message: ', message);
    socket.emit('message', message);
}


function logError(err) {
    console.log(err.toString(), err);
}

window.addEventListener("beforeunload", function (e) {
    socket.emit('disconnect');
});
