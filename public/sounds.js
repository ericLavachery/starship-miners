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

function eggSound() {
    var sound = new Howl({
        src: ['/static/sounds/fx/egg-fall.mp3'],
        volume: playerInfos.volFx
    });
    sound.play();
};

function clicSound() {
    // playMove(false);
    clicSnd = new Howl({
        src: ['/static/sounds/fx/clic.mp3'],
        volume: 0.3
    });
    clicSnd.play();
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
        console.log(weapon);
        var sound = new Howl({
            src: ['/static/sounds/'+soundDir+'/'+weapon.sound+'.mp3'],
            volume: playerInfos.volFx,
            onload: function() {
                soundDuration = sound.duration();
                soundDuration = Math.round(800*soundDuration)-500;
                if (soundDuration < 100) {
                    soundDuration = 100;
                }
                console.log('soundDuration='+soundDuration);
            },
        });
        sound.play();
        console.log(sound);
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
        var sound = new Howl({
            src: ['/static/sounds/fx/'+spawnSound+'.mp3'],
            volume: playerInfos.volFx
        });
        setTimeout(function (){
            sound.play();
        }, 8000); // How long do you want the delay to be (in milliseconds)?
    }
};

function playMusic(piste,interrupt) {
    let track = [_.sample(musicTracks)];
    if (piste != 'any') {
        track = piste;
    }
    if (!theMusic.playing() || interrupt) {
        theMusic = new Howl({
            src: ['/static/sounds/music/'+track+'.mp3'],
            preload: true,
            volume: playerInfos.volMu
        });
        theMusic.play();
        console.log('PLAYING: '+track);
    } else {
        console.log('ALREADY PLAYING');
    }
};

function playRoom(piste,interrupt) {
    let track = 'rain';
    if (piste != 'any') {
        track = piste;
    }
    let roomVol = playerInfos.volFx+0.4;
    if (roomVol > 1) {
        roomVol = 1;
    }
    if (roomVol < 0.1) {
        roomVol = 0.1;
    }
    roomVol = roomVol.toFixedNumber(1);
    console.log('roomVol='+roomVol);
    if (!theRoom.playing() || interrupt) {
        theRoom.stop();
        theRoom = new Howl({
            src: ['/static/sounds/rooms/'+track+'.mp3'],
            preload: true,
            volume: roomVol,
            loop: true
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
    let moveVol = playerInfos.volFx+0.1;
    if (moveVol > 1) {moveVol = 1;}
    if (moveVol < 0.1) {moveVol = 0.1;}
    moveVol = moveVol.toFixedNumber(1);
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
                    volume: moveVol,
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
    let roomVol = playerInfos.volFx-0.4;
    if (roomVol > 1) {
        roomVol = 1;
    }
    if (roomVol < 0.1) {
        roomVol = 0.1;
    }
    roomVol = roomVol.toFixedNumber(1);
    console.log('roomVol='+roomVol);
    if (stop) {
        theWork.stop();
    } else {
        if (!theWork.playing()) {
            theWork.stop();
            theWork = new Howl({
                src: ['/static/sounds/rooms/'+track+'.mp3'],
                preload: true,
                volume: roomVol,
                loop: true
            });
            theWork.play();
            console.log('ROOM: '+track);
        } else {
            console.log('ALREADY A ROOM');
        }
    }
};
