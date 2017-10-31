import { emit } from './signalling.js';
import { randomToken } from './util.js';

export let room = window.location.hash.substring(1);

if (room === '') {
    const randomRoom = randomToken();
    room = prompt('Please specify the room name, otherwise you will use random one: '+randomRoom, randomRoom);
}

emit('create or join', room);

if (location.hostname.match(/localhost|127\.0\.0/)) {
    emit('ipaddr');
}

window.addEventListener("beforeunload", function (e) {
   emit('disconnect');
});
