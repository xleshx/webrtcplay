import { createStore } from 'redux'
import { SHOW_MESSAGE } from './actions'
import { updateChat} from './ui'

const initialStoreState = {
    "room": "default",
    "messages": []
};

function toMessage(action) {
    return {
        peer: action.peer,
        text: action.text
    }
}

export const actionProcessor = function(state = initialStoreState, action){
    switch (action.type){
        case SHOW_MESSAGE:
            const newMessages = state.messages.map(msg => Object.assign({}, msg));
            newMessages.push(toMessage(action));
            return Object.assign({}, state, {messages: newMessages});
        default:
            return state
    }
};

let store = createStore(actionProcessor);
console.log(store.getState());

const unsubscribe = store.subscribe(() =>
    console.log(store.getState())
);

export function dispatchAction(action) {
    store.dispatch(action);
}

export function subscribe(action){
    store.subscribe(action)
}

function selectMessages(state) {
    return state.messages
}

store.subscribe(() => updateChat(selectMessages(store.getState())))
