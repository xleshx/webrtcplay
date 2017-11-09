import { sendData } from './peer.js';
import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';

const roomURL = document.getElementById('url');

export const sendBtn = document.getElementById('send');
export const toSend = document.getElementById('dataChannelSend');
// export const chat = document.getElementById('chat');
export const clientsList = document.getElementById('clients');

// Attach event handlers
sendBtn.addEventListener('click', function(){
    sendData(toSend.value);
});

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = { messages: [{peer: "defPeer", text:"Helllou!"}]};
    }

    update(state){
        this.setState(state);
    }

    render() {
        let list = this.state.messages.map(function(msg){
            return <li>From: {msg.peer}, Message: {msg.text}</li>;
        });
        return  <ul>{list}</ul>;

        // (
        //     <div>
        //         <h1>From: {this.state.peer}</h1>
        //         <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        //     </div>
        // );
    }
}

let chat =ReactDOM.render(
    <Chat/>,
    document.getElementById('root')
);

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

export function updateChat(obj) {
    chat.setState({"messages": obj});
    //chat.value = JSON.stringify(obj, null, 2);
}