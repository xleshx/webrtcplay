const path = require('path');

module.exports = {
    entry: {
        app: './src/index.js',
        signalling: './src/signalling.js',
        peer: './src/peer.js',
        ui: './src/ui.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
