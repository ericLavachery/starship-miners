const app = require('express')();
const server = require('http').createServer(app);
server.timeout = 10000;
const io = require('socket.io').listen(server,{cookie:false});
const ent = require('ent');
const fs = require('fs');
const express = require('express');
const isJSON = require('./public/share.js');
const rand = require('./public/share.js');
const _ = require('underscore');

// pages statiques dossier public/
app.use('/static', express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/node_modules/rpg-awesome'));

// router - ouais, on disait...
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

let unitTypes;
let unitCosts;
let zoneFiles = [];
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
            console.error(e);
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
            console.error(e);
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
            console.error(e);
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
            console.error(e);
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
            console.error(e);
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
        console.error(e);
    }
});
var terrainTypes;
fs.readFile('./data/terrainTypes.json', 'utf8', function (err, data) {
    if (err) throw err;
    try {
        terrainTypes = JSON.parse(data);
        // console.log(unitDV);
    } catch (e) {
        console.error(e);
    }
});
var resTypes;
fs.readFile('./data/resTypes.json', 'utf8', function (err, data) {
    if (err) throw err;
    try {
        resTypes = JSON.parse(data);
        // console.log(unitDV);
    } catch (e) {
        console.error(e);
    }
});
var crafting;
fs.readFile('./data/crafting.json', 'utf8', function (err, data) {
    if (err) throw err;
    try {
        crafting = JSON.parse(data);
        // console.log(unitDV);
    } catch (e) {
        console.error(e);
    }
});
var mapFilters;
fs.readFile('./data/mapFilters.json', 'utf8', function (err, data) {
    if (err) throw err;
    try {
        mapFilters = JSON.parse(data);
        // console.log(unitDV);
    } catch (e) {
        console.error(e);
    }
});
var alienUnits;
fs.readFile('./data/alienUnits.json', 'utf8', function (err, data) {
    if (err) throw err;
    try {
        alienUnits = JSON.parse(data);
        // console.log(unitDV);
    } catch (e) {
        console.error(e);
    }
});
var ammoTypes;
fs.readFile('./data/ammoTypes.json', 'utf8', function (err, data) {
    if (err) throw err;
    try {
        ammoTypes = JSON.parse(data);
        // console.log(unitDV);
    } catch (e) {
        console.error(e);
    }
});
var armorTypes;
fs.readFile('./data/armorTypes.json', 'utf8', function (err, data) {
    if (err) throw err;
    try {
        armorTypes = JSON.parse(data);
        // console.log(unitDV);
    } catch (e) {
        console.error(e);
    }
});
var gangComps;
fs.readFile('./data/gangComps.json', 'utf8', function (err, data) {
    if (err) throw err;
    try {
        gangComps = JSON.parse(data);
        // console.log(unitDV);
    } catch (e) {
        console.error(e);
    }
});
var playerInfos = {};
var bataillons = [];
var savedMap = [];
var zonePreview = [];
var savedZone = [];

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
                        console.error(e);
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
                        console.error(e);
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
                        console.error(e);
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
                        console.error(e);
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
        socket.emit('alienUnits-Load',alienUnits);
        console.log('loading aliens');
        socket.emit('aliens-Load',aliens);
        console.log('loading player infos');
        socket.emit('playerInfos-Load',playerInfos);
        console.log('loading player battalions');
        socket.emit('bataillons-Load',bataillons);
        console.log('loading units default values');
        socket.emit('unitDV-Load',unitDV);
        console.log('loading unit types');
        socket.emit('unitTypes-Load',unitTypes);
        console.log('loading unit costs');
        socket.emit('unitCosts-Load',unitCosts);
        console.log('loading ammo');
        socket.emit('ammoTypes-Load',ammoTypes);
        console.log('loading armors');
        socket.emit('armorTypes-Load',armorTypes);
        console.log('loading map filters');
        socket.emit('mapFilters-Load',mapFilters);
        console.log('loading terrain types');
        socket.emit('terrainTypes-Load',terrainTypes);
        console.log('loading resources types');
        socket.emit('resTypes-Load',resTypes);
        console.log('loading crafting');
        socket.emit('crafting-Load',crafting);
        console.log('loading comps');
        socket.emit('comps-Load',gangComps);
        if (savedMap.length >= 3500) {
            console.log('loading saved map');
        } else {
            console.log('no saved map, will generate a new one');
        }
        socket.emit('savedMap-Load',savedMap);
        listZoneFiles();
        socket.emit('zoneFiles-Load',zoneFiles);
    };

    function listZoneFiles() {
        zoneFiles = [];
        fs.readdirSync('./data/players/').forEach(file => {
            if (file.includes(socket.pseudo+'-map')) {
                let zoneNum = file.replace(socket.pseudo+'-map','');
                zoneNum = zoneNum.replace('.json','');
                zoneFiles.push(+zoneNum);
            }
        });
        console.log('Zones:');
        console.log(zoneFiles);
    };

    // Delete all saved Zones
    socket.on('reset-zones', function(rien) {
        listZoneFiles();
        console.log(zoneFiles);
        zoneFiles.forEach(function(zoneId) {
            var fileToBeRemoved = './data/players/'+socket.pseudo+'-map'+zoneId+'.json';
            console.log(fileToBeRemoved);
            fs.unlink(fileToBeRemoved, function(err) {
                if(err && err.code == 'ENOENT') {
                    console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                    console.error("Error occurred while trying to remove file");
                } else {
                    console.info("File removed");
                }
            });
            fileToBeRemoved = './data/players/'+socket.pseudo+'-bataillons'+zoneId+'.json';
            console.log(fileToBeRemoved);
            fs.unlink(fileToBeRemoved, function(err) {
                if(err && err.code == 'ENOENT') {
                    console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                    console.error("Error occurred while trying to remove file");
                } else {
                    console.info("File removed");
                }
            });
            fileToBeRemoved = './data/players/'+socket.pseudo+'-aliens'+zoneId+'.json';
            console.log(fileToBeRemoved);
            fs.unlink(fileToBeRemoved, function(err) {
                if(err && err.code == 'ENOENT') {
                    console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                    console.error("Error occurred while trying to remove file");
                } else {
                    console.info("File removed");
                }
            });
        });
    });

    // Put start mission in data/players
    socket.on('put-start-zone', function(zoneId) {
        let fileToBeMoved = './data/players/Missions/start99/'+socket.pseudo+'-map'+zoneId+'.json';
        let fileToBeCreated = './data/players/'+socket.pseudo+'-map'+zoneId+'.json';
        fs.copyFile(fileToBeMoved, fileToBeCreated, (err) => {
            if (err) throw err;
            console.log(fileToBeMoved+' was copied to '+fileToBeCreated);
        });
        fileToBeMoved = './data/players/Missions/start99/'+socket.pseudo+'-bataillons'+zoneId+'.json';
        fileToBeCreated = './data/players/'+socket.pseudo+'-bataillons'+zoneId+'.json';
        fs.copyFile(fileToBeMoved, fileToBeCreated, (err) => {
            if (err) throw err;
            console.log(fileToBeMoved+' was copied to '+fileToBeCreated);
        });
        fileToBeMoved = './data/players/Missions/start99/'+socket.pseudo+'-aliens'+zoneId+'.json';
        fileToBeCreated = './data/players/'+socket.pseudo+'-aliens'+zoneId+'.json';
        fs.copyFile(fileToBeMoved, fileToBeCreated, (err) => {
            if (err) throw err;
            console.log(fileToBeMoved+' was copied to '+fileToBeCreated);
        });
    });

    // Load zone PREVIEW
    socket.on('load-zone-preview', function(zoneId) {
        const path = './data/players/'+socket.pseudo+'-map'+zoneId+'.json';
        console.log('load zone preview');
        console.log(path);
        try {
            if (fs.existsSync(path)) {
                fs.readFile(path, 'utf8', function (err, data) {
                    if (err) throw err;
                    try {
                        zonePreview = JSON.parse(data);
                        sendPreview();
                    } catch (e) {
                        console.error(e);
                    }
                });
            } else {
                console.log('path?');
            }
        } catch(err) {
            console.error(err)
        }
    });
    function sendPreview() {
        console.log('loading zone preview');
        // console.log(zonePreview);
        socket.emit('zonePreview-Load',zonePreview);
    };

    // Load zone
    socket.on('load-saved-map', function(zoneId) {
        const path = './data/players/'+socket.pseudo+'-map'+zoneId+'.json';
        console.log(path);
        try {
            if (fs.existsSync(path)) {
                fs.readFile(path, 'utf8', function (err, data) {
                    if (err) throw err;
                    try {
                        savedMap = JSON.parse(data);
                        loadZoneBataillons(zoneId);
                    } catch (e) {
                        console.error(e);
                    }
                });
            } else {
                savedMap = [];
                console.log('path?');
                loadZoneBataillons(zoneId);
            }
        } catch(err) {
            console.error(err)
        }
    });
    function loadZoneBataillons(zoneId) {
        const path = './data/players/'+socket.pseudo+'-bataillons'+zoneId+'.json';
        try {
            if (fs.existsSync(path)) {
                fs.readFile(path, 'utf8', function (err, data) {
                    if (err) throw err;
                    try {
                        bataillons = JSON.parse(data);
                        loadZoneAliens(zoneId);
                    } catch (e) {
                        console.error(e);
                    }
                });
            } else {
                bataillons = [];
                console.log('path?');
                loadZoneAliens(zoneId);
            }
        } catch(err) {
            console.error(err)
        }
    };
    function loadZoneAliens(zoneId) {
        const path = './data/players/'+socket.pseudo+'-aliens'+zoneId+'.json';
        try {
            if (fs.existsSync(path)) {
                fs.readFile(path, 'utf8', function (err, data) {
                    if (err) throw err;
                    try {
                        aliens = JSON.parse(data);
                        sendZone();
                    } catch (e) {
                        console.error(e);
                    }
                });
            } else {
                aliens = [];
                console.log('path?');
                sendZone();
            }
        } catch(err) {
            console.error(err)
        }
    };
    function sendZone() {
        console.log('loading saved map (with bats & aliens)');
        // console.log(savedMap);
        // console.log(bataillons);
        // console.log(aliens);
        socket.emit('savedZone-Load',[savedMap,bataillons,aliens]);
    };

    // Save zone as !!!
    socket.on('save-map-as', function(zone) {
        let jsonmap = JSON.stringify(zone[0]);
        let mapname = socket.pseudo+'-map'+zone[1]+'.json';
        fs.writeFile('./data/players/'+mapname, jsonmap, 'utf8', (err) => {
            if (err) throw err;
            console.log('Map saved to '+mapname);
        });
    });

    // Save Aliens as !!!
    socket.on('save-aliens-as', function(aliens) {
        let json = JSON.stringify(aliens[0]);
        let filename = socket.pseudo+'-aliens'+aliens[1]+'.json'
        fs.writeFile('./data/players/'+filename, json, 'utf8', (err) => {
            if (err) throw err;
            console.log('Aliens saved to '+filename);
        });
    });

    // Save Bataillons as !!!
    socket.on('save-bataillons-as', function(bataillons) {
        let json = JSON.stringify(bataillons[0]);
        let filename = socket.pseudo+'-bataillons'+bataillons[1]+'.json'
        fs.writeFile('./data/players/'+filename, json, 'utf8', (err) => {
            if (err) throw err;
            console.log('Bataillons saved to '+filename);
        });
    });

    // Save zone
    socket.on('save-map', function(zone) {
        let jsonmap = JSON.stringify(zone);
        let mapname = socket.pseudo+'-currentMap.json';
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

    // Save playerInfos Log
    socket.on('save-playerLog', function(playerInfos) {
        let json = JSON.stringify(playerInfos);
        var dir = './data/players/'+socket.pseudo;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        let filename = socket.pseudo+'-playerLog-'+playerInfos.gangXP+'.json';
        fs.writeFile('./data/players/'+socket.pseudo+'/'+filename, json, 'utf8', (err) => {
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
