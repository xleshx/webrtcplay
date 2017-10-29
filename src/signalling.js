
/****************************************************************************
 * Signaling server
 ****************************************************************************/

import io from 'socket.io-client';

import { updateRoomURL, clientsList } from './ui.js'
import { createPeerConnection, signalingMessageCallback } from './peer.js'

export let isInitiator;

// Connect to the signaling server
let socket = io.connect();

//define clients socket.io sessionID
socket.on('connect', function() {
    let sessionId = socket.io.engine.id;
});

socket.on('ipaddr', function(ipaddr) {
    console.log('Server IP address is: ' + ipaddr);
    // updateRoomURL(ipaddr);
});

socket.on('created', function(room, clientId) {
    console.log('Created room', room, '- my client ID is', clientId);
    isInitiator = true;
});

socket.on('joined', function(room, clientId) {
    console.log('This peer has joined room', room, 'with client ID', clientId);
    isInitiator = false;
    createPeerConnection(isInitiator);
});

socket.on('ready', function() {
    console.log('Socket is ready');
    createPeerConnection(isInitiator);
    socket.emit('done');
});

socket.on('log', function(array) {
    console.log.apply(console, array);
});

socket.on('message', function(message) {
    console.log('Client received message:', message);
    signalingMessageCallback(message);
});

socket.on('full', function(room) {
    alert('Room ' + room + ' is full. We will create a new room for you.');
    window.location.hash = '';
    window.location.reload();
});

socket.on('update_client_list', function(clients) {
    console.log('update_client_list:', clients);
    clientsList.value = clients;
});

export function emit(msg, obj) {
    socket.emit(msg, obj);
}

/**
 * Send message to signaling server
 */
export function sendMessage(message) {
    console.log('Client sending message: ', message);
    emit('message', message);
}
