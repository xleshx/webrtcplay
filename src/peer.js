/****************************************************************************
 * WebRTC peer connection and data channel
 ****************************************************************************/
import { sendMessage } from './signalling.js';
import webrtc from 'webrtc-adapter';
import { showMessage } from './actions';
import { dispatchAction } from './store'
let peerConn;
let dataChannel;

const configuration = {
    'iceServers': [{
        'urls': 'stun:stun.l.google.com:19302'
    }]
};

export function signalingMessageCallback(message) {
    if (message.type === 'offer') {
        console.log('Got offer. Sending answer to peer.');
        peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {},
            logError);
        peerConn.createAnswer(onLocalSessionCreated, logError);

    } else if (message.type === 'answer') {
        console.log('Got answer.');
        peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {},
            logError);

    } else if (message.type === 'candidate') {
        peerConn.addIceCandidate(new RTCIceCandidate({
            candidate: message.candidate
        }));

    } else if (message === 'bye') {
        // TODO: cleanup RTC connection?
    }
}

export function createPeerConnection(isInitiator) {
    console.log('Creating Peer connection as initiator?', isInitiator, 'config:', configuration);
    peerConn = new RTCPeerConnection(configuration);

    // send any ice candidates to the other peer
    peerConn.onicecandidate = function(event) {
        console.log('icecandidate event:', event);
        if (event.candidate) {
            sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });
        } else {
            console.log('End of candidates.');
        }
    };

    if (isInitiator) {
        console.log('Creating Data Channel');
        dataChannel = peerConn.createDataChannel('photos');
        onDataChannelCreated(dataChannel);

        console.log('Creating an offer');
        peerConn.createOffer(onLocalSessionCreated, logError);
    } else {
        peerConn.ondatachannel = function(event) {
            console.log('ondatachannel:', event.channel);
            dataChannel = event.channel;
            onDataChannelCreated(dataChannel);
        };
    }
}

function logError(err) {
    console.log(err.toString(), err);
}

// send data
export function sendData(data) {
    console.log('Sending data: ' + data);
    dataChannel.send(data);
}

function onLocalSessionCreated(desc) {
    console.log('local session created:', desc);
    peerConn.setLocalDescription(desc, function() {
        console.log('sending local desc:', peerConn.localDescription);
        sendMessage(peerConn.localDescription);
    }, logError);
}

function onDataChannelCreated(channel) {
    console.log('onDataChannelCreated:', channel);

    channel.onopen = function() {
        console.log('CHANNEL opened!!!');
    };

    // show received data
    channel.onmessage = function (event) {
        console.log('Data received: ' + event.data);
        dispatchAction(showMessage("default peer", event.data));
        //chat.value = event.data;
    }
}
