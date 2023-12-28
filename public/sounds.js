function soundCheck() {
    selectMode();
    $("#conUnitList").css("display","block");
    $('#conUnitList').css("height","260px");
    $("#conAmmoList").css("display","none");
    $('#unitInfos').empty();
    $("#unitInfos").css("display","none");
    $('#tileInfos').empty();
    $("#tileInfos").css("display","none");
    $('#conUnitList').empty();
    $('#conUnitList').append('<span class="closeIcon klik cy" onclick="conOut(true)"><i class="fas fa-times-circle"></i></span>');
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<h3>Volumes</h3><br>');
    let theVol = 10;
    // volFx
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<h2>Effets</h2><br>');
    if (playerInfos.volFx > 0) {
        $('#conUnitList').append('<button type="button" title="Stopper les effets" class="boutonRouge iconButtons" onclick="soundVolume(`mute`,`volFx`)"><i class="fas fa-volume-mute"></i></button>');
    } else {
        $('#conUnitList').append('<button type="button" title="Redémarrer les effets" class="boutonVert iconButtons" onclick="soundVolume(`mute`,`volFx`)"><i class="fas fa-play"></i></button>');
    }
    $('#conUnitList').append('<button type="button" title="Diminuer le volume des effets" class="boutonGris iconButtons" onclick="soundVolume(`down`,`volFx`)"><i class="fas fa-volume-down"></i></button>');
    $('#conUnitList').append('<button type="button" title="Augmenter le volume des effets" class="boutonGris iconButtons" onclick="soundVolume(`up`,`volFx`)"><i class="fas fa-volume-up"></i></button>');
    theVol = Math.round(playerInfos.volFx*10);
    $('#conUnitList').append('<button type="button" title="Volume" class="boutonBleu iconButtons">'+theVol+'</button>');
    $('#conUnitList').append('<br>');
    // volAmb
    $('#conUnitList').append('<br>');
    $('#conUnitList').append('<h2>Ambiance</h2><br>');
    if (playerInfos.volAmb > 0) {
        $('#conUnitList').append('<button type="button" title="Stopper l\'ambiance sonore" class="boutonRouge iconButtons" onclick="soundVolume(`mute`,`volAmb`)"><i class="fas fa-volume-mute"></i></button>');
    } else {
        $('#conUnitList').append('<button type="button" title="Redémarrer l\'ambiance sonore" class="boutonVert iconButtons" onclick="soundVolume(`mute`,`volAmb`)"><i class="fas fa-play"></i></button>');
    }
    $('#conUnitList').append('<button type="button" title="Diminuer le volume de l\'ambiance sonore" class="boutonGris iconButtons" onclick="soundVolume(`down`,`volAmb`)"><i class="fas fa-volume-down"></i></button>');
    $('#conUnitList').append('<button type="button" title="Augmenter le volume de l\'ambiance sonore" class="boutonGris iconButtons" onclick="soundVolume(`up`,`volAmb`)"><i class="fas fa-volume-up"></i></button>');
    theVol = Math.round(playerInfos.volAmb*10);
    $('#conUnitList').append('<button type="button" title="Volume" class="boutonBleu iconButtons">'+theVol+'</button>');
    $('#conUnitList').append('<br>');
    // volMu
    if (!playerInfos.onShip) {
        $('#conUnitList').append('<br>');
        $('#conUnitList').append('<h2>Musique</h2><br>');
        if (playerInfos.volMu > 0) {
            $('#conUnitList').append('<button type="button" title="Stopper la musique" class="boutonRouge iconButtons" onclick="soundVolume(`mute`,`volMu`)"><i class="fas fa-volume-mute"></i></button>');
        } else {
            $('#conUnitList').append('<button type="button" title="Redémarrer la musique" class="boutonVert iconButtons" onclick="soundVolume(`mute`,`volMu`)"><i class="fas fa-play"></i></button>');
        }
        $('#conUnitList').append('<button type="button" title="Diminuer le volume de la musique" class="boutonGris iconButtons" onclick="soundVolume(`down`,`volMu`)"><i class="fas fa-volume-down"></i></button>');
        $('#conUnitList').append('<button type="button" title="Augmenter le volume de la musique" class="boutonGris iconButtons" onclick="soundVolume(`up`,`volMu`)"><i class="fas fa-volume-up"></i></button>');
        theVol = Math.round(playerInfos.volMu*10);
        $('#conUnitList').append('<button type="button" title="Volume" class="boutonBleu iconButtons">'+theVol+'</button>');
        $('#conUnitList').append('<br>');
    } else {
        // volRadio
        $('#conUnitList').append('<br>');
        $('#conUnitList').append('<h2>Radio</h2><br>');
        if (playerInfos.volRadio > 0) {
            $('#conUnitList').append('<button type="button" title="Stopper la musique" class="boutonRouge iconButtons" onclick="soundVolume(`mute`,`volRadio`)"><i class="fas fa-volume-mute"></i></button>');
        } else {
            $('#conUnitList').append('<button type="button" title="Redémarrer la musique" class="boutonVert iconButtons" onclick="soundVolume(`mute`,`volRadio`)"><i class="fas fa-play"></i></button>');
        }
        $('#conUnitList').append('<button type="button" title="Diminuer le volume de la musique" class="boutonGris iconButtons" onclick="soundVolume(`down`,`volRadio`)"><i class="fas fa-volume-down"></i></button>');
        $('#conUnitList').append('<button type="button" title="Augmenter le volume de la musique" class="boutonGris iconButtons" onclick="soundVolume(`up`,`volRadio`)"><i class="fas fa-volume-up"></i></button>');
        theVol = Math.round(playerInfos.volRadio*10);
        $('#conUnitList').append('<button type="button" title="Volume" class="boutonBleu iconButtons">'+theVol+'</button>');
        $('#conUnitList').append('<br>');
    }
    $('#conUnitList').append('<br>');
    $("#conUnitList").animate({scrollTop:0},"fast");
};

function soundAllStop() {
    theMusic.stop();
    theRadio.stop();
    theRoom.stop();
    playerInfos.volMu = 0;
    playerInfos.volAmb = 0;
    playerInfos.volRadio = 0;
    playerInfos.volFx = 0;
    soundCheck();
    commandes();
};

function soundAllGo() {
    playerInfos.volMu = 0.4;
    playerInfos.volRadio = 0.4;
    playerInfos.volAmb = 0.4;
    playerInfos.volFx = 0.4;
    if (playerInfos.onShip) {
        playRadio('any',false);
    } else {
        playMusic('any',false);
    }
    theRoom.play();
    soundCheck();
    commandes();
};

function soundMute(source,mute) {
    if (source === 'volMu') {
        if (mute) {
            theMusic.stop();
        } else {
            playMusic('any',false);
        }
    } else if (source === 'volRadio') {
        if (mute) {
            theRadio.stop();
        } else {
            playRadio('any',false);
        }
    } else if (source === 'volAmb') {
        if (mute) {
            theRoom.stop();
        } else {
            theRoom.play();
        }
    }
};

function soundFade(source,down) {
    let volAdj = 0.1;
    if (down) {volAdj = -0.1;}
    let newVol = playerInfos[source]+volAdj;
    if (newVol < 0.1) {newVol = 0.1;}
    if (source === 'volRadio') {
        theRadio.fade(playerInfos[source],newVol,500);
    } else if (source === 'volMu') {
        theMusic.fade(playerInfos[source],newVol,500);
    } else if (source === 'volAmb') {
        theRoom.fade(playerInfos[source],newVol,500);
    }
};

function soundVolume(vol,source,quiet) {
    console.log(source);
    if (vol === 'mute') {
        console.log('mute');
        if (playerInfos[source] === 0) {
            playerInfos[source] = 0.4;
            soundMute(source,false);
        } else {
            soundMute(source,true);
            playerInfos[source] = 0;
        }
    } else {
        if (vol === 'down') {
            console.log('down');
            soundFade(source,true);
            playerInfos[source] = playerInfos[source]-0.1;
            if (playerInfos[source] < 0.1) {
                playerInfos[source] = 0.1;
            }
        } else if (vol === 'up') {
            console.log('up');
            soundFade(source,false);
            playerInfos[source] = playerInfos[source]+0.1;
            if (playerInfos[source] > 1) {
                playerInfos[source] = 1;
            }
        }
    }
    console.log(playerInfos[source]);
    playerInfos.volFx = playerInfos.volFx.toFixedNumber(1);
    playerInfos.volMu = playerInfos.volMu.toFixedNumber(1);
    playerInfos.volRadio = playerInfos.volRadio.toFixedNumber(1);
    playerInfos.volAmb = playerInfos.volAmb.toFixedNumber(1);
    if (!quiet) {
        soundCheck();
    }
};

function checkMyVol(theVol,source) {
    if (playerInfos[source] === 0) {
        theVol = 0;
    } else {
        if (theVol < 0.1) {theVol = 0.1;}
        if (theVol > 1) {theVol = 1;}
    }
    theVol = theVol.toFixedNumber(1);
    return theVol;
};

function playSound(theSound,theVol,multi) {
    if (multi === undefined) {
        multi = true;
    }
    let myVol = checkMyVol(playerInfos.volFx+theVol,'volFx');
    if (!clicSnd.playing() || multi) {
        clicSnd = new Howl({
            src: ['/static/sounds/fx/'+theSound+'.mp3'],
            volume: myVol
        });
        clicSnd.play();
    }
};

function eggSound() {
    let myVol = checkMyVol(playerInfos.volFx,'volFx');
    var sound = new Howl({
        src: ['/static/sounds/fx/egg-fall.mp3'],
        volume: myVol
    });
    sound.play();
};

function clicSound(num) {
    let myVol = checkMyVol(playerInfos.volFx-0.2,'volFx');
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
    let myVol = checkMyVol(playerInfos.volFx+0.2,'volFx');
    if (theSound === 'takeoff') {
        myVol = checkMyVol(playerInfos.volFx+0.1,'volFx');
    }
    if (theSound === 'meteor') {
        myVol = checkMyVol(playerInfos.volFx+0.4,'volFx');
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
    let myVol = checkMyVol(playerInfos.volFx-0.3,'volFx');
    if (selectedBat.an || !okFile.includes('ok') || roger) {
        okSnd = new Howl({
            src: ['/static/sounds/moves/'+okFile+'.mp3'],
            volume: myVol
        });
        okSnd.play();
    } else {
        playOKBip('radio4');
        // let nbr = rand.rand(1,5);
        // let nbr = 4;
        // okSnd = new Howl({
        //     src: ['/static/sounds/moves/radio'+nbr+'.mp3'],
        //     volume: myVol
        // });
    }
};

function playOKBip(theBip) {
    let myVol = checkMyVol(playerInfos.volFx-0.3,'volFx');
    let bipSnd = new Howl({
        src: ['/static/sounds/moves/'+theBip+'.mp3'],
        volume: myVol
    });
    bipSnd.play();
}

function playOK(bat) {
    let myVol = checkMyVol(playerInfos.volFx-0.3,'volFx');
    okSnd = new Howl({
        src: ['/static/sounds/moves/'+bat.ok+'.mp3'],
        volume: myVol
    });
    okSnd.play();
};

function shotSound(weapon,bat) {
    playMove(false);
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
    if (weap.sound.includes('antichar')) {
        playSound('sniperload',0,true);
    } else if (weap.sound.includes('sniper')) {
        playSound('sniper',0,true);
    } else if (weap.sound.includes('laser_fusil') || weap.sound.includes('laser_rev')) {
        playSound('mag',0,true);
    } else if (weap.sound.includes('magnum')) {
        playSound('cock',0,true);
    } else if (weap.sound.includes('rainbow')) {
        playSound('greload',0,true);
    } else if (weap.sound.includes('calibre_hunt') || weap.sound.includes('calibre_x2')) {
        playSound('winchester',0,true);
    } else if (weap.sound.includes('fpneu')) {
        playSound('hmg',0,true);
    } else if (weap.sound.includes('calibre_heavy') || weap.sound.includes('tromblon')) {
        playSound('spreload',0,true);
    } else if (weap.sound.includes('pistol_x') || weap.sound.includes('revolver') || weap.sound.includes('uzi')) {
        playSound('berretta9',-1,true);
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
    } else if (weap.sound.includes('shotgun')) {
        playSound('rikrik',0,true);
    } else if (weap.sound === 'fmag') {
        playSound('lever',0,true);
    } else if (weap.sound.includes('calibre_pierce')) {
        playSound('shotload',0,true);
    } else if (weap.sound.includes('carabine')) {
        playSound('carab',0,true);
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
    } else if (weap.sound.includes('bomb')) {
        playSound('hydro',0,true);
    } else if (weap.sound.includes('miss')) {
        playSound('allteams',0,true);
    } else if (weap.sound.includes('obusier')) {
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
        let myVol = checkMyVol(playerInfos.volFx-0.1,'volFx');
        var sound = new Howl({
            src: ['/static/sounds/fx/'+spawnSound+'.mp3'],
            volume: myVol
        });
        setTimeout(function (){
            sound.play();
        }, 6000); // How long do you want the delay to be (in milliseconds)?
    }
};

function alienTheme(interrupt) {
    let thresh = 22+(playerInfos.sondeDanger*3);
    if (alienThreat >= thresh) {
        playMusic('aftermath',interrupt);
    }
};

function playMusic(piste,interrupt) {
    // let track = [_.sample(musicTracks)];
    if (playerInfos.statMu || !playerInfos.onShip) {
        let myVol = checkMyVol(playerInfos.volMu+0.3,'volMu');
        if (!theMusic.playing() || interrupt) {
            let track = 'amb_trucsympa';
            if (trackNum > musicTracks.length-1) {
                trackNum = 0;
            }
            track = musicTracks[trackNum];
            if (aliens.length < 100) {
                if (track === 'amb_ambiant3') {
                    track = 'amb_ambiant1';
                }
                if (track === 'amb_ambiant4') {
                    track = 'amb_ambiant2';
                }
            } else if (aliens.length >= 150) {
                if (track === 'amb_ambiant1') {
                    track = 'amb_ambiant3';
                }
                if (track === 'amb_ambiant2') {
                    track = 'amb_ambiant4';
                }
            }
            trackNum = trackNum+1;
            if (trackNum > musicTracks.length-1) {
                trackNum = 0;
            }
            if (piste != 'any') {
                track = piste;
            }
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

function playRadio(piste,interrupt) {
    // let track = [_.sample(musicTracks)];
    if (playerInfos.statMu || !playerInfos.onShip) {
        let myVol = checkMyVol(playerInfos.volRadio+0.3,'volRadio');
        if (!theRadio.playing() || interrupt) {
            let track = 'amb_trucsympa';
            if (trackNum > stationTracks.length-1) {
                trackNum = 0;
            }
            track = stationTracks[trackNum];
            trackNum = trackNum+1;
            if (trackNum > stationTracks.length-1) {
                trackNum = 0;
            }
            if (piste != 'any') {
                track = piste;
            }
            theRadio.fade(myVol,0.0,3000);
            theRadio = new Howl({
                src: ['/static/sounds/music/'+track+'.mp3'],
                preload: true,
                volume: myVol
            });
            theRadio.play();
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
    if (track != 'soute' && track != 'station') {
        track = 'control';
    }
    let myVol = checkMyVol(playerInfos.volAmb-0.1,'volAmb');
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
    let myVol = checkMyVol(playerInfos.volFx-0.2,'volFx');
    if (!play) {
        // theMove.fade(myVol,0,200);
        if (theMove.playing()) {
            playOKBip('radio3');
        }
        theMove.stop();
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
    let myVol = checkMyVol(playerInfos.volFx-0.4,'volFx');
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
