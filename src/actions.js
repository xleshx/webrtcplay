export const SHOW_MESSAGE = 'SHOW_MESSAGE';

export function showMessage(peer, text) {
    return {
        type: SHOW_MESSAGE,
        peer: peer,
        text: text
    }
}

