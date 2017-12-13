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
        this.onSubmitMessage = this.onSubmitMessage.bind(this);

        this.state = {
            chatMessages: [
                {peer: "defPeer", text:"Helllou!", datetime: new Date()},
            ],
            message: '',
        };
    }

    onSubmitMessage(message) {
        var messages = this.state.chatMessages.slice();
        messages.push({peer:"test", text: message, datetime: new Date()});
        this.setState({chatMessages: messages, message: ''});
    }

    render() {
        return (
            <div>
                <ChatMessageInput message={this.state.message} onSubmitMessage={this.onSubmitMessage} />
                <ChatMessagesList messages={this.state.chatMessages}/>
            </div>
        )
    }
}

class ChatMessagesList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let list = this.props.messages.map(function(msg) {
            return <li>{msg.datetime.toLocaleString()} - (From: {msg.peer}): {msg.text} </li>;
        });

        return <ul>{list}</ul>;
    }
}

class ChatMessageInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {message: props.message, isDisabled: props.message.length == 0};
    }

    handleChange(e) {
        let state = {message: e.target.value, isDisabled: false};
        if (e.target.value.length == 0) {
            state.isDisabled = true;
        }
        this.setState(state);
    }

    handleSubmit(e) {
        if (this.state.message.length > 0) {
            this.props.onSubmitMessage(this.state.message);
            this.setState({message: '', isDisabled: true});
        }
    }

    render() {
        const message = this.state.message;
        const sendDisabled = this.state.isDisabled;
        return (
            <fieldset>
                <legend>Enter message to send to chat:</legend>
                <input value={message} onChange={this.handleChange} />
                <button onClick={this.handleSubmit} disabled={sendDisabled}>Send mesage</button>
            </fieldset>
        )
    }
}

let chat = ReactDOM.render(
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
