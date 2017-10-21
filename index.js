'use strict';

var os = require('os');
var nodeStatic = require('node-static');
var https = require('https');
const fs = require('fs');

var socketIO = require('socket.io');

var fileServer = new(nodeStatic.Server)();

var options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-crt.pem'),
  ca: fs.readFileSync('ca-crt.pem')
};

// https.createServer(options, app).listen(443);

var app = https.createServer(options, function(req, res) {
  fileServer.serve(req, res);
}).listen(4433);

var io = socketIO.listen(app);
io.sockets.on('connection', function(socket) {

  // convenience function to log server messages on the client
  function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  function updateClientsList(disconect) {
    var clients = ['Users count = ' + io.sockets.sockets.length];
    io.sockets.sockets.forEach(function(client) {
        clients.push(client.id)
    });
    if (disconect) {
        socket.broadcast.emit('update_client_list', clients);
    } else {
        socket.emit('update_client_list', clients);
    }
  }

  socket.on('message', function(message) {
    log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('done', function(message) {
    var disconect = false;
    updateClientsList(disconect);
  });

  socket.on('create or join', function(room) {
    log('Received request to create or join room ' + room);

    var numClients = io.sockets.sockets.length;
    log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 1) {
      socket.join(room);
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);
    } else {
      log('Client ID ' + socket.id + ' joined room ' + room);
      // io.sockets.in(room).emit('join', room);
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

  socket.on('bye', function(){
    socket.disconnect();
    var disconect = true;
    updateClientsList(disconect);
  });

});
