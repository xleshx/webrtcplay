
// Attach event handlers
sendBtn.addEventListener('click', sendData);

// Create a random room if not already present in the URL.
var isInitiator;

/**
 * Updates URL on the page so that users can copy&paste it to their peers.
 */
function updateRoomURL(ipaddr) {
    var url;
    if (!ipaddr) {
        url = location.href;
    } else {
        url = location.protocol + '//' + ipaddr + ':4433/#' + room;
    }
    roomURL.innerHTML = url;
}

