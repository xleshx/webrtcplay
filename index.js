'use strict';

const os = require('os');
const https = require('https');
const fs = require('fs');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('./webpack.config.js');
const compiler = webpack(config);

const socketIO = require('socket.io');

let app = require('express')();

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {colors: true}
}));

app.use(webpackHotMiddleware(compiler, {
    log: console.log
}));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

const options = {
  key: fs.readFileSync('cert/server-key.pem'),
  cert: fs.readFileSync('cert/server-crt.pem'),
  ca: fs.readFileSync('cert/ca-crt.pem')
};

let server = https.createServer(options, app).listen(4433);

var io = socketIO.listen(server);
/*
 * array of objects:
 * {
 *  id: <string>
 *  room: <string>
 * }
 */
var clients = [];

io.sockets.on('connection', function(socket) {
  // convenience function to log server messages on the client
  function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  function getClientsCountInRoom(room) {
      var clientCount = 0;
      for(var key in clients) {
          if (clients[key].room === room) {
              clientCount++;
          }
      }
      return clientCount;
  }

  socket.on('message', function(message) {
    socket.broadcast.emit('message', message);
  });


  socket.on('create or join', function(room) {
    clients.push({id: socket.id, room: room});
    var numClients = getClientsCountInRoom(room);
    console.log('connected:', numClients, clients);

    if (numClients === 1) {
      socket.join(room);
      socket.emit('created', room, socket.id);
    } else {
        socket.join(room);
        socket.emit('joined', room, socket.id);

        io.sockets.in(room).emit('ready', room);
        socket.broadcast.emit('ready', room);
    }
  });

  socket.on('ipaddr', function() {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

  socket.on('disconnect', function () {
    clients = clients.filter(function(item) {
        return item.id !== socket.id
    });

    console.log('disconnected:', clients);
    socket.disconnect(true);
  });

});
