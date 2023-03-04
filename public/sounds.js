function soundVolume(vol,source) {
    if (source === 'music') {
        console.log('music');
        if (vol === 'mute') {
            console.log('mute');
            if (playerInfos.volMu === 0) {
                theMusic.mute(false);
                playerInfos.volMu = 0.4;
            } else {
                theMusic.mute(true);
                playerInfos.volMu = 0;
            }
        } else {
            if (vol === 'down') {
                console.log('down');
                playerInfos.volMu = playerInfos.volMu-0.1;
                if (playerInfos.volMu < 0) {
                    playerInfos.volMu = 0;
                }
            } else if (vol === 'up') {
                console.log('up');
                playerInfos.volMu = playerInfos.volMu+0.1;
                if (playerInfos.volMu > 1) {
                    playerInfos.volMu = 1;
                }
            }
        }
        console.log(playerInfos.volMu);
    } else if (source === 'fx') {
        console.log('fx');
        if (vol === 'mute') {
            console.log('mute');
            if (playerInfos.volFx === 0) {
                playerInfos.volFx = 0.6;
            } else {
                playerInfos.volFx = 0;
            }
        } else {
            if (vol === 'down') {
                console.log('down');
                playerInfos.volFx = playerInfos.volFx-0.1;
                if (playerInfos.volFx < 0) {
                    playerInfos.volFx = 0;
                }
            } else if (vol === 'up') {
                console.log('up');
                playerInfos.volFx = playerInfos.volFx+0.1;
                if (playerInfos.volFx > 1) {
                    playerInfos.volFx = 1;
                }
            }
        }
        console.log(playerInfos.volFx);
    }
    playerInfos.volFx = playerInfos.volFx.toFixedNumber(1);
    playerInfos.volMu = playerInfos.volMu.toFixedNumber(1);
    commandes();
};

function checkMyVol(theVol,isMusic) {
    if (isMusic) {
        if (playerInfos.volMu === 0) {
            theVol = 0;
        } else {
            if (theVol < 0.1) {theVol = 0.1;}
            if (theVol > 1) {theVol = 1;}
        }
    } else {
        if (playerInfos.volFx === 0) {
            theVol = 0;
        } else {
            if (theVol < 0.1) {theVol = 0.1;}
            if (theVol > 1) {theVol = 1;}
        }
    }
    theVol = theVol.toFixedNumber(1);
    return theVol;
};

function playSound(theSound,theVol,multi) {
    if (multi === undefined) {
        multi = true;
    }
    let myVol = checkMyVol(playerInfos.volFx+theVol,false);
    if (!clicSnd.playing() || multi) {
        clicSnd = new Howl({
            src: ['/static/sounds/fx/'+theSound+'.mp3'],
            volume: myVol
        });
        clicSnd.play();
    }
};

function eggSound() {
    let myVol = checkMyVol(playerInfos.volFx,false);
    var sound = new Howl({
        src: ['/static/sounds/fx/egg-fall.mp3'],
        volume: myVol
    });
    sound.play();
};

function clicSound(num) {
    let myVol = checkMyVol(playerInfos.volFx-0.2,false);
    let clicNum = rand.rand(0,7);
    let theSound = 'clic'+clicNum;
    if (num != undefined) {
        if (isNaN(num)) {
            theSound = num;
        } else {
            theSound = 'clic'+num;
        }
    }
    clicSnd = new Howl({
        src: ['/static/sounds/fx/'+theSound+'.mp3'],
        volume: myVol
    });
    clicSnd.play();
};

function warnSound(theSound) {
    let myVol = checkMyVol(playerInfos.volFx+0.2,false);
    if (theSound === 'takeoff') {
        myVol = checkMyVol(playerInfos.volFx+0.1,false);
    }
    if (theSound === 'meteor') {
        myVol = checkMyVol(playerInfos.volFx+0.4,false);
    }
    clicSnd = new Howl({
        src: ['/static/sounds/fx/'+theSound+'.mp3'],
        volume: myVol
    });
    clicSnd.play();
};

function okSound(roger) {
    let okFile;
    let randNum;
    if (selectedBat.ok != undefined && selectedBat.ok != '') {
        okFile = selectedBat.ok;
    } else {
        okFile = 'ok';
        randNum = rand.rand(1,28);
        if (selectedBatType.skills.includes('dog')) {
            if (selectedBatType.name === 'Pets' || selectedBatType.name === 'Meatballs') {
                okFile = 'dok';
                randNum = 5;
            } else {
                okFile = 'dok';
                randNum = 2;
            }
        } else if (selectedBatType.skills.includes('robot')) {
            if (hasEquip(selectedBat,['g2ai'])) {
                if (selectedBatType.name === 'Thunderbots' || selectedBatType.name === 'T-Skeltons') {
                    okFile = 'rok';
                    randNum = 2;
                } else {
                    okFile = 'rok';
                    randNum = 1;
                }
            } else {
                okFile = 'beep';
                randNum = rand.rand(1,3);
            }
        } else if (selectedBatType.crew === 0) {
            okFile = 'bip';
            randNum = '';
        }
        okFile = okFile+randNum;
        selectedBat.ok = okFile;
    }
    if (selectedBat.an === undefined) {
        selectedBat.an = true;
    } else {
        if (selectedBat.an) {
            selectedBat.an = false;
        } else if (rand.rand(1,5) === 1) {
            selectedBat.an = true;
        }
    }
    selectedBatArrayUpdate();
    let myVol = checkMyVol(playerInfos.volFx-0.3,false);
    if (selectedBat.an || !okFile.includes('ok') || roger) {
        okSnd = new Howl({
            src: ['/static/sounds/moves/'+okFile+'.mp3'],
            volume: myVol
        });
    } else {
        // let nbr = rand.rand(1,5);
        let nbr = 4;
        okSnd = new Howl({
            src: ['/static/sounds/moves/radio'+nbr+'.mp3'],
            volume: myVol
        });
    }
    okSnd.play();
};

function playOK(bat) {
    let myVol = checkMyVol(playerInfos.volFx-0.3,false);
    okSnd = new Howl({
        src: ['/static/sounds/moves/'+bat.ok+'.mp3'],
        volume: myVol
    });
    okSnd.play();
};

function shotSound(weapon,bat) {
    // playMove(false);
    let soundDir;
    if (bat.team === 'aliens') {
        soundDir = 'aliens';
    } else {
        soundDir = 'humans';
    }
    if (!isFFW) {
        // console.log(weapon);
        var sound = new Howl({
            src: ['/static/sounds/'+soundDir+'/'+weapon.sound+'.mp3'],
            volume: playerInfos.volFx,
            onload: function() {
                soundDuration = sound.duration();
                soundDuration = Math.round(800*soundDuration)-500;
                if (soundDuration < 100) {
                    soundDuration = 100;
                }
                // console.log('soundDuration='+soundDuration);
            },
        });
        sound.play();
        // console.log(sound);
    }
};

function reloadSound(weap) {
    if (weap.sound.includes('sniper') || weap.sound.includes('antichar')) {
        playSound('sniperload',0,true);
    } else if (weap.sound.includes('laser_fusil')) {
        playSound('mag',0,true);
    } else if (weap.sound.includes('magnum')) {
        playSound('cock',0,true);
    } else if (weap.sound.includes('rainbow')) {
        playSound('greload',0,true);
    } else if (weap.sound.includes('calibre_hunt') || weap.sound.includes('calibre_x2')) {
        playSound('basicreload',0,true);
    } else if (weap.sound.includes('fpneu')) {
        playSound('hmg',0,true);
    } else if (weap.sound.includes('calibre_heavy') || weap.sound.includes('tromblon')) {
        playSound('spreload',0,true);
    } else if (weap.sound.includes('pistol_x') || weap.sound.includes('revolver') || weap.sound.includes('uzi')) {
        playSound('berretta9',0,true);
    } else if (weap.sound.includes('dynamite') || weap.sound.includes('molotov')) {
        playSound('lighter',0,true);
    } else if (weap.sound.includes('flamme')) {
        playSound('lfstart',0,true);
    } else if (weap.sound.includes('flumme')) {
        playSound('ltstart',0,true);
    } else if (weap.sound.includes('calibre_sa')) {
        playSound('ar7',0,true);
    } else if (weap.sound.includes('kalach')) {
        playSound('ak47',0,true);
    } else if (weap.sound.includes('shotgun') || weap.sound === 'fmag') {
        playSound('lever',0,true);
    } else if (weap.sound.includes('calibre_pierce')) {
        playSound('shotload',0,true);
    } else if (weap.sound.includes('carabine')) {
        playSound('winchester',0,true);
    } else if (weap.sound.includes('mit_')) {
        playSound('mgreload',0,true);
    } else if (weap.sound.includes('bfg') || weap.sound.includes('plas') || weap.sound.includes('raygun')) {
        playSound('plasload',0,true);
    } else if (weap.sound.includes('blister') || weap.sound.includes('nailgun')) {
        playSound('sciload',0,true);
    } else if (weap.sound.includes('laser_minicanon')) {
        playSound('laserload',0,true);
    } else if (weap.sound.includes('laser_canon')) {
        playSound('laserloadbig',0,true);
    } else if (weap.sound.includes('balista') || weap.sound.includes('catapult')) {
        playSound('bendingbig',0,true);
    } else if (weap.sound.includes('bow')) {
        playSound('bending',0,true);
    } else if (weap.sound.includes('belier') || weap.sound.includes('harvest')) {
        if (weap.power >= 18) {
            playSound('motroarbig',0,true);
        } else {
            playSound('motroar',0,true);
        }
    } else if (weap.sound.includes('growl')) {
        // none
    } else if (weap.sound.includes('dog_attack')) {
        // none
    } else if (weap.isMelee) {
        playSound('sdraw',0,true);
    } else if (weap.sound.includes('auto')) {
        playSound('hydrolight',-1,true);
    } else if (weap.sound.includes('canon_')) {
        playSound('hydro',-1,true);
    } else if (weap.sound.includes('xxxxxx')) {
        playSound('allteams',0,true);
    } else if (weap.sound.includes('bomb') || weap.sound.includes('miss') || weap.sound.includes('obusier')) {
        playSound('getready',0,true);
    } else {
        playSound('wready',0,true);
    }
};

function deathSound(bat) {
    let batType = getBatType(bat);
    let soundDir;
    if (bat.team === 'aliens') {
        soundDir = 'aliens';
    } else {
        soundDir = 'humans';
    }
    if (!isFFW) {
        var sound = new Howl({
            src: ['/static/sounds/'+soundDir+'/death/'+batType.deathFx+'.mp3'],
            volume: playerInfos.volFx
        });
        sound.play();
    }
};

function alienSounds(num) {
    let alienVol = playerInfos.volFx;
    if (alienVol > 1) {alienVol = 1;}
    if (alienVol < 0.1) {alienVol = 0.1;}
    alienVol = alienVol.toFixedNumber(1);
    var sound = new Howl({
        src: ['/static/sounds/fx/alien-hive'+num+'.mp3'],
        volume: alienVol
    });
    sound.play();
};

function fxSound(sound) {
    let alienVol = playerInfos.volFx;
    if (alienVol > 1) {alienVol = 1;}
    if (alienVol < 0.1) {alienVol = 0.1;}
    alienVol = alienVol.toFixedNumber(1);
    var sound = new Howl({
        src: ['/static/sounds/fx/'+sound+'.mp3'],
        volume: alienVol
    });
    sound.play();
};

function checkSpawnType(alienType) {
    if (alienType.fxPriority >= 1) {
        let typeOK = false;
        if (Object.keys(spawnType).length >= 1) {
            if (alienTypesList.includes(spawnType.name)) {
                if (!alienTypesList.includes(alienType.name)) {
                    spawnType = alienType;
                    typeOK = true;
                }
            } else {
                if (alienTypesList.includes(alienType.name)) {
                    typeOK = true;
                }
            }
        } else {
            spawnType = alienType;
            typeOK = true;
        }
        if (!typeOK) {
            if (alienType.fxPriority > spawnType.fxPriority) {
                spawnType = alienType;
            }
        }
        console.log('XWXWXWXWXWXWX : '+spawnType.name);
        console.log(spawnType);
    } else {
        console.log('XWXWXWXWXWXWX : no SOUND');
    }
};

function spawnSound() {
    if (Object.keys(spawnType).length >= 1) {
        let spawnSound = spawnType.spawnFx;
        let myVol = checkMyVol(playerInfos.volFx-0.1,false);
        var sound = new Howl({
            src: ['/static/sounds/fx/'+spawnSound+'.mp3'],
            volume: myVol
        });
        setTimeout(function (){
            sound.play();
        }, 6000); // How long do you want the delay to be (in milliseconds)?
    }
};

function playMusic(piste,interrupt) {
    // let track = [_.sample(musicTracks)];
    if (playerInfos.statMu || !playerInfos.onShip) {
        let myVol = checkMyVol(playerInfos.volMu+0.3,true);
        if (!theMusic.playing() || interrupt) {
            let track = 'amb_trucsympa';
            if (!playerInfos.onShip) {
                if (trackNum > musicTracks.length-1) {
                    trackNum = 0;
                }
                track = musicTracks[trackNum];
                trackNum = trackNum+1;
                if (trackNum > musicTracks.length-1) {
                    trackNum = 0;
                }
            } else {
                if (trackNum > stationTracks.length-1) {
                    trackNum = 0;
                }
                track = stationTracks[trackNum];
                trackNum = trackNum+1;
                if (trackNum > stationTracks.length-1) {
                    trackNum = 0;
                }
            }
            if (piste != 'any') {
                track = piste;
            }
            // theMusic.stop();
            theMusic.fade(myVol,0.0,3000);
            theMusic = new Howl({
                src: ['/static/sounds/music/'+track+'.mp3'],
                preload: true,
                volume: myVol
            });
            theMusic.play();
            // console.log('PLAYING: '+track);
        } else {
            // console.log('ALREADY PLAYING');
        }
    }
};

function playBackMusic() {
    theBack = new Howl({
        src: ['/static/sounds/music/joao-janz_sha04.mp3'],
        preload: true,
        volume: playerInfos.volMu
    });
    theBack.play();
    console.log('PLAYING: '+track);
};

function playRoom(piste,interrupt,onloop) {
    let track = 'rain';
    if (piste != 'any') {
        track = piste;
    }
    let myVol = checkMyVol(playerInfos.volFx-0.1,false);
    if (!theRoom.playing() || interrupt) {
        theRoom.stop();
        theRoom = new Howl({
            src: ['/static/sounds/rooms/'+track+'.mp3'],
            preload: true,
            volume: myVol,
            loop: onloop
        });
        theRoom.play();
        console.log('ROOM: '+track);
    } else {
        console.log('ALREADY A ROOM');
    }
};

function playMove(play) {
    let isLoop = true;
    let track = 'none';
    let myVol = checkMyVol(playerInfos.volFx+0.1,false);
    if (!play) {
        theMove.stop();
        // theMove.fade(moveVol,0,2000);
    } else {
        if (selectedBatType.mvSnd != undefined) {
            track = selectedBatType.mvSnd;
            if (track.includes('steps-')) {
                isLoop = false;
            }
        } else {
            if (selectedBatType.skills.includes('jetpack') || selectedBat.eq === 'e-jetpack') {
                track = 'jetpack';
                isLoop = false;
            } else if (selectedBatType.skills.includes('moto')) {
                track = 'moto';
                isLoop = false;
            } else if (selectedBatType.cat === 'infantry' && !selectedBatType.skills.includes('robot') && !selectedBatType.skills.includes('fly')) {
                // en fonction du terrain?
                track = 'steps-gravel';
                isLoop = false;
            }
        }
        if (track != 'none') {
            if (!theMove.playing()) {
                theMove.stop();
                theMove = new Howl({
                    src: ['/static/sounds/moves/'+track+'.mp3'],
                    preload: true,
                    volume: myVol,
                    loop: isLoop
                });
                theMove.play();
                console.log('MOVE: '+track);
            } else {
                console.log('ALREADY MOVING');
            }
        }
    }
};

function playFx(piste,stop) {
    let track = 'work';
    if (piste != 'any') {
        track = piste;
    }
    let myVol = checkMyVol(playerInfos.volFx-0.4,false);
    if (stop) {
        theWork.stop();
    } else {
        if (!theWork.playing()) {
            theWork.stop();
            theWork = new Howl({
                src: ['/static/sounds/rooms/'+track+'.mp3'],
                preload: true,
                volume: myVol,
                loop: true
            });
            theWork.play();
            console.log('ROOM: '+track);
        } else {
            console.log('ALREADY A ROOM');
        }
    }
};
