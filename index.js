'use strict';

const os = require('os');
const https = require('https');
const fs = require('fs');

const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpack = require('webpack');
const wpConfig = require('./webpack.config.js');
const compiler = webpack(wpConfig);

const socketIO = require('socket.io');

const app = require('express')();
const util = require('./utils.js');

const SSL_PORT = 8443;

app.use(webpackDevMiddleware(compiler, {
    publicPath: wpConfig.output.publicPath,
    stats: {colors: true}
}));

app.use(webpackHotMiddleware(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
}));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

const options = {
  key: fs.readFileSync('cert/server-key.pem'),
  cert: fs.readFileSync('cert/server-crt.pem'),
  ca: fs.readFileSync('cert/ca-crt.pem')
};

let server = https.createServer(options, app).listen(SSL_PORT);
console.log('server is up on https://%s:%s', util.getServerIps(), SSL_PORT);

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
      const ifaces = os.networkInterfaces();
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
