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
    console.log(unitTypes);
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
        socket.emit('unitTypes_Load', unitTypes);
        // let playerIndex = players.findIndex((obj => obj.pseudo == pseudo));
        // let perso = players[playerIndex];
        // if (isJSON.isJSON(perso.unitView) && isJSON.isJSON(perso.unitIdent) && isJSON.isJSON(perso.mapCarto) && isJSON.isJSON(perso.mapView) && isJSON.isJSON(perso.exploredTiles) && isJSON.isJSON(perso.enemies) && isJSON.isJSON(perso.allies) && isJSON.isJSON(perso.bldIdent) && isJSON.isJSON(perso.bldView) && isJSON.isJSON(perso.prefs)) {
        //     perso.unitView = JSON.parse(perso.unitView);
        //     perso.unitIdent = JSON.parse(perso.unitIdent);
        //     perso.mapCarto = JSON.parse(perso.mapCarto);
        //     perso.mapView = JSON.parse(perso.mapView);
        //     perso.exploredTiles = JSON.parse(perso.exploredTiles);
        //     perso.enemies = JSON.parse(perso.enemies);
        //     perso.allies = JSON.parse(perso.allies);
        //     perso.bldIdent = JSON.parse(perso.bldIdent);
        //     perso.bldView = JSON.parse(perso.bldView);
        //     perso.prefs = JSON.parse(perso.prefs);
        //     console.log('login : '+pseudo);
        // } else {
        //     console.log('re-login : '+pseudo);
        // }
        // socket.emit('persoload', perso);
        // socket.emit('terload', ter);
        // socket.emit('mapload', world);
        // socket.emit('popload', pop);
        // socket.emit('ressload', ress);
        // socket.emit('unitsCRUDload', unitTypes);
    });

    // PLAYERS PERSO CHANGE
    // socket.on('player_change', function(data) {
    //     let objIndex = players.findIndex((obj => obj.id == data.id));
    //     players.splice(objIndex, 1, data);
    // });


});

server.listen(8080);
