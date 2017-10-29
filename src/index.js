import { emit } from './signalling.js';

export let room = window.location.hash.substring(1);

if (room === '') {
    const randomRoom = randomToken();
    room = prompt('Please specify the room name, otherwise you will use random one: '+randomRoom, randomRoom);
}

function randomToken() {
    return Math.floor((1 + Math.random()) * 1e16).toString(16).substring(1);
}

emit('create or join', room);

if (location.hostname.match(/localhost|127\.0\.0/)) {
    emit('ipaddr');
}

window.addEventListener("beforeunload", function (e) {
   emit('disconnect');
});
