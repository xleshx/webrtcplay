import { actionProcessor } from '../store'
import {SHOW_MESSAGE} from '../actions'

test('has default state', () => {
    expect(actionProcessor({store: "storeState"}, {type:1})).toEqual({store: "storeState"});
});

test('process incoming message action', () => {
    const result = actionProcessor({
        room: "default",
        messages: []
    }, {
        type: SHOW_MESSAGE,
        peer: "test peer 1",
        text: "Hey mate, gonna test action"

    });
    expect(result).toEqual({
        room: "default",
        messages: [{
            peer: "test peer 1",
            text: "Hey mate, gonna test action"
        }]
    });
});
