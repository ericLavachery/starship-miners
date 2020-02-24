const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
const fs = require('fs');
const db = require('./modules/dbconnect.js');
const express = require('express');
const isJSON = require('./public/share.js');
const rand = require('./public/share.js');
const _ = require('underscore');

// charge la carte au démarage du serveur
db.con.connect(function(error) {
    if (error) throw error;
    let sql = "SELECT * FROM world";
    db.con.query(sql, function (error, result) {
        if (error) throw error;
        // RowDataPacket to JSON (is this the right way? - but it works...)
        world = JSON.parse(JSON.stringify(result));
        console.log('world loaded');
    });
    sql = "SELECT * FROM bataillons";
    db.con.query(sql, function (error, result) {
        if (error) throw error;
        pop = JSON.parse(JSON.stringify(result));
        console.log('pop loaded');
    });
    sql = "SELECT * FROM terrains";
    db.con.query(sql, function (error, result) {
        if (error) throw error;
        ter = JSON.parse(JSON.stringify(result));
        console.log('ter loaded');
    });
    sql = "SELECT * FROM players";
    db.con.query(sql, function (error, result) {
        if (error) throw error;
        players = JSON.parse(JSON.stringify(result));
        console.log('players loaded');
    });
    sql = "SELECT * FROM unites";
    db.con.query(sql, function (error, result) {
        if (error) throw error;
        unitTypes = JSON.parse(JSON.stringify(result));
        console.log('unitTypes loaded');
    });
    sql = "SELECT * FROM ressources";
    db.con.query(sql, function (error, result) {
        if (error) throw error;
        ress = JSON.parse(JSON.stringify(result));
        console.log('resources loaded');
    });
});

// pages statiques dossier public/
app.use('/static', express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/node_modules/rpg-awesome'));
// app.use('/static', express.static(__dirname + '/node_modules/rpg-awesome/fonts'));

// router - ouais, on disait...
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {
    // On LOGIN send tables
    socket.on('newcli', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        let playerIndex = players.findIndex((obj => obj.pseudo == pseudo));
        let perso = players[playerIndex];
        if (isJSON.isJSON(perso.unitView) && isJSON.isJSON(perso.unitIdent) && isJSON.isJSON(perso.mapCarto) && isJSON.isJSON(perso.mapView) && isJSON.isJSON(perso.exploredTiles) && isJSON.isJSON(perso.enemies) && isJSON.isJSON(perso.allies) && isJSON.isJSON(perso.bldIdent) && isJSON.isJSON(perso.bldView) && isJSON.isJSON(perso.prefs)) {
            perso.unitView = JSON.parse(perso.unitView);
            perso.unitIdent = JSON.parse(perso.unitIdent);
            perso.mapCarto = JSON.parse(perso.mapCarto);
            perso.mapView = JSON.parse(perso.mapView);
            perso.exploredTiles = JSON.parse(perso.exploredTiles);
            perso.enemies = JSON.parse(perso.enemies);
            perso.allies = JSON.parse(perso.allies);
            perso.bldIdent = JSON.parse(perso.bldIdent);
            perso.bldView = JSON.parse(perso.bldView);
            perso.prefs = JSON.parse(perso.prefs);
            console.log('login : '+pseudo);
        } else {
            console.log('re-login : '+pseudo);
        }
        socket.emit('persoload', perso);
        let myTracks = _.filter(tracks, function(track) {
            return (track.player === pseudo);
        });
        socket.emit('terload', ter);
        socket.emit('mapload', world);
        socket.emit('popload', pop);
        socket.emit('ressload', ress);
        socket.emit('unitsCRUDload', unitTypes);
        // socket.emit('unitsimgload', unitsImg);
    });

    // PLAYERS PERSO CHANGE
    socket.on('player_change', function(data) {
        // change pop
        let objIndex = players.findIndex((obj => obj.id == data.id));
        players.splice(objIndex, 1, data);
        // change db
        let bldView = JSON.stringify(data.bldView);
        let bldIdent = JSON.stringify(data.bldIdent);
        let unitView = JSON.stringify(data.unitView);
        let unitIdent = JSON.stringify(data.unitIdent);
        let mapCarto = JSON.stringify(data.mapCarto);
        let mapView = JSON.stringify(data.mapView);
        let exploredTiles = JSON.stringify(data.exploredTiles);
        let prefs = JSON.stringify(data.prefs);
        let sql = "UPDATE players SET prefs = '"+prefs+"', bldView = '"+bldView+"', bldIdent = '"+bldIdent+"', unitView = '"+unitView+"', unitIdent = '"+unitIdent+"', mapView = '"+mapView+"', mapCarto = '"+mapCarto+"', exploredTiles = '"+exploredTiles+"' WHERE id = "+data.id;
        db.con.query(sql, function (error, result) {
            if (error) throw error;
            // console.log(result);
            // console.log('perso updated');
        });
    });


});

server.listen(8080);
