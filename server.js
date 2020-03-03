const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
const fs = require('fs');
const express = require('express');
const isJSON = require('./public/share.js');
const rand = require('./public/share.js');
const _ = require('underscore');

// pages statiques dossier public/
app.use('/static', express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/node_modules/rpg-awesome'));
// app.use('/static', express.static(__dirname + '/node_modules/rpg-awesome/fonts'));

// router - ouais, on disait...
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var unitTypes;
fs.readFile('militaryUnits.json', 'utf8', function (err, data) {
  if (err) throw err;
  try {
    unitTypes = JSON.parse(data);
    // console.log(unitTypes);
  } catch (e) {
    console.error( e );
  }
});
fs.readFile('defaultUnitValues.json', 'utf8', function (err, data) {
  if (err) throw err;
  try {
    unitDV = JSON.parse(data);
    // console.log(unitDV);
  } catch (e) {
    console.error( e );
  }
});

io.sockets.on('connection', function (socket, pseudo) {
    // On LOGIN send tables
    socket.on('newcli', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        console.log('login : '+pseudo);
        socket.emit('unitDV_Load', unitDV);
        socket.emit('unitTypes_Load', unitTypes);
    });
});

server.listen(8080);
