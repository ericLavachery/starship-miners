const app = require('express')();
const server = require('http').createServer(app);
server.timeout = 10000;
const io = require('socket.io').listen(server,{cookie:false});
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

let unitTypes;
let unitCosts;
loadUnitTypes();

function loadUnitTypes() {
    fs.readFile('./data/buildings.json', 'utf8', function (err, data) {
        if (err) throw err;
        try {
            unitTypes = JSON.parse(data);
            loadTurrets();
            loadInfantryUnits();
            loadMotorisedUnits();
            loadCosts();
            // console.log(unitTypes);
        } catch (e) {
            console.error( e );
        }
    });
};
function loadTurrets() {
    fs.readFile('./data/turrets.json', 'utf8', function (err, data) {
        if (err) throw err;
        try {
            let turrets = JSON.parse(data);
            unitTypes = unitTypes.concat(turrets);
            // console.log(unitTypes);
        } catch (e) {
            console.error( e );
        }
    });
};
function loadInfantryUnits() {
    fs.readFile('./data/infantryUnits.json', 'utf8', function (err, data) {
        if (err) throw err;
        try {
            let infantryUnits = JSON.parse(data);
            unitTypes = unitTypes.concat(infantryUnits);
            // console.log(unitTypes);
        } catch (e) {
            console.error( e );
        }
    });
};
function loadMotorisedUnits() {
    fs.readFile('./data/motorisedUnits.json', 'utf8', function (err, data) {
        if (err) throw err;
        try {
            let motorisedUnits = JSON.parse(data);
            unitTypes = unitTypes.concat(motorisedUnits);
            // console.log(unitTypes);
        } catch (e) {
            console.error( e );
        }
    });
};
function loadCosts() {
    fs.readFile('./data/costs.json', 'utf8', function (err, data) {
        if (err) throw err;
        try {
            unitCosts = JSON.parse(data);
            // console.log(unitCosts);
        } catch (e) {
            console.error( e );
        }
    });
};
var unitDV;
fs.readFile('./data/defaultUnitValues.json', 'utf8', function (err, data) {
    if (err) throw err;
    try {
        unitDV = JSON.parse(data);
        // console.log(unitDV);
    } catch (e) {
        console.error( e );
    }
});
var terrainTypes;
fs.readFile('./data/terrainTypes.json', 'utf8', function (err, data) {
    if (err) throw err;
    try {
        terrainTypes = JSON.parse(data);
        // console.log(unitDV);
    } catch (e) {
        console.error( e );
    }
});
var resTypes;
fs.readFile('./data/resTypes.json', 'utf8', function (err, data) {
    if (err) throw err;
    try {
        resTypes = JSON.parse(data);
        // console.log(unitDV);
    } catch (e) {
        console.error( e );
    }
});
var mapFilters;
fs.readFile('./data/mapFilters.json', 'utf8', function (err, data) {
    if (err) throw err;
    try {
        mapFilters = JSON.parse(data);
        // console.log(unitDV);
    } catch (e) {
        console.error( e );
    }
});
var alienUnits;
fs.readFile('./data/alienUnits.json', 'utf8', function (err, data) {
    if (err) throw err;
    try {
        alienUnits = JSON.parse(data);
        // console.log(unitDV);
    } catch (e) {
        console.error( e );
    }
});
var ammoTypes;
fs.readFile('./data/ammoTypes.json', 'utf8', function (err, data) {
    if (err) throw err;
    try {
        ammoTypes = JSON.parse(data);
        // console.log(unitDV);
    } catch (e) {
        console.error( e );
    }
});
var armorTypes;
fs.readFile('./data/armorTypes.json', 'utf8', function (err, data) {
    if (err) throw err;
    try {
        armorTypes = JSON.parse(data);
        // console.log(unitDV);
    } catch (e) {
        console.error( e );
    }
});
var playerInfos = {};
var bataillons = [];
var savedMap = [];

io.sockets.on('connection', function (socket, pseudo) {
    // On LOGIN send tables
    socket.on('newcli', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        console.log('login : '+pseudo);
        const path = './data/players/'+pseudo+'-playerInfos.json'
        try {
            if (fs.existsSync(path)) {
                fs.readFile(path, 'utf8', function (err, data) {
                    if (err) throw err;
                    try {
                        playerInfos = JSON.parse(data);
                        // console.log(playerInfos);
                        loadMap();
                    } catch (e) {
                        console.error( e );
                    }
                });
            } else {
                loadMap();
            }
        } catch(err) {
            console.error(err)
        }
    });

    function loadMap() {
        const path = './data/players/'+socket.pseudo+'-currentMap.json'
        try {
            if (fs.existsSync(path)) {
                fs.readFile(path, 'utf8', function (err, data) {
                    if (err) throw err;
                    try {
                        savedMap = JSON.parse(data);
                        // console.log(savedMap);
                        loadBataillons();
                    } catch (e) {
                        console.error( e );
                    }
                });
            } else {
                loadBataillons();
            }
        } catch(err) {
            console.error(err)
        }
    };

    function loadBataillons() {
        const path = './data/players/'+socket.pseudo+'-bataillons.json'
        try {
            if (fs.existsSync(path)) {
                fs.readFile(path, 'utf8', function (err, data) {
                    if (err) throw err;
                    try {
                        bataillons = JSON.parse(data);
                        // console.log(bataillons);
                        loadAliens();
                    } catch (e) {
                        console.error( e );
                    }
                });
            } else {
                loadAliens();
            }
        } catch(err) {
            console.error(err)
        }
    };

    function loadAliens() {
        const path = './data/players/'+socket.pseudo+'-aliens.json'
        try {
            if (fs.existsSync(path)) {
                fs.readFile(path, 'utf8', function (err, data) {
                    if (err) throw err;
                    try {
                        aliens = JSON.parse(data);
                        // console.log(aliens);
                        sendAll();
                    } catch (e) {
                        console.error( e );
                    }
                });
            } else {
                sendAll();
            }
        } catch(err) {
            console.error(err)
        }
    };

    function sendAll() {
        console.log('loading alien unit types');
        socket.emit('alienUnits-Load', alienUnits);
        console.log('loading aliens');
        socket.emit('aliens-Load', aliens);
        console.log('loading player infos');
        socket.emit('playerInfos-Load', playerInfos);
        console.log('loading player battalions');
        socket.emit('bataillons-Load', bataillons);
        console.log('loading units default values');
        socket.emit('unitDV-Load', unitDV);
        console.log('loading unit types');
        socket.emit('unitTypes-Load', unitTypes);
        console.log('loading unit costs');
        socket.emit('unitCosts-Load', unitCosts);
        console.log('loading ammo');
        socket.emit('ammoTypes-Load', ammoTypes);
        console.log('loading armors');
        socket.emit('armorTypes-Load', armorTypes);
        console.log('loading map filters');
        socket.emit('mapFilters-Load', mapFilters);
        console.log('loading terrain types');
        socket.emit('terrainTypes-Load', terrainTypes);
        console.log('loading resources types');
        socket.emit('resTypes-Load', resTypes);
        if (savedMap.length >= 3500) {
            console.log('loading saved map');
        } else {
            console.log('no saved map, will generate a new one');
        }
        socket.emit('savedMap-Load', savedMap);
    };

    // Save zone
    socket.on('save-map', function(zone) {
        let jsonmap = JSON.stringify(zone);
        let mapname = socket.pseudo+'-currentMap.json'
        fs.writeFile('./data/players/'+mapname, jsonmap, 'utf8', (err) => {
            if (err) throw err;
            console.log('Map saved to '+mapname);
        });
    });

    // Save Bataillons
    socket.on('save-bataillons', function(bataillons) {
        let json = JSON.stringify(bataillons);
        let filename = socket.pseudo+'-bataillons.json'
        fs.writeFile('./data/players/'+filename, json, 'utf8', (err) => {
            if (err) throw err;
            console.log('Bataillons saved to '+filename);
        });
    });

    // Save Aliens
    socket.on('save-aliens', function(aliens) {
        let json = JSON.stringify(aliens);
        let filename = socket.pseudo+'-aliens.json'
        fs.writeFile('./data/players/'+filename, json, 'utf8', (err) => {
            if (err) throw err;
            console.log('Aliens saved to '+filename);
        });
    });

    // Save playerInfos
    socket.on('save-playerInfos', function(playerInfos) {
        let json = JSON.stringify(playerInfos);
        let filename = socket.pseudo+'-playerInfos.json'
        fs.writeFile('./data/players/'+filename, json, 'utf8', (err) => {
            if (err) throw err;
            console.log('Player infos saved to '+filename+' on turn '+playerInfos.mapTurn);
        });
    });

    // Save TEST
    socket.on('testcon', function(test) {
        if (socket.pseudo == undefined) {
            let pseutest = socket.pseudo;
            console.log('UNDEFINED PLAYER');
            socket.emit('testcon-failed',pseutest);
        }
    });
});

server.listen(8080);
