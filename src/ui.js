import { sendData } from './peer.js'

import './style.css';

const roomURL = document.getElementById('url');

export const sendBtn = document.getElementById('send');
export const toSend = document.getElementById('dataChannelSend');
export const chat = document.getElementById('chat');
export const clientsList = document.getElementById('clients');

// Attach event handlers
sendBtn.addEventListener('click', function(){
    sendData(toSend.value);
});

/**
 * Updates URL on the page so that users can copy&paste it to their peers.
 */
export function updateRoomURL(ipaddr) {
    let url;
    if (!ipaddr) {
        url = location.href;
    } else {
        url = location.protocol + '//' + ipaddr + ':4433/#';// + room;
    }
    roomURL.innerHTML = url;
}

