function soundVolume(vol,source) {
    if (source === 'music') {
        console.log('music');
        if (vol === 'mute') {
            console.log('mute');
            if (musicVolume === 0) {
                theMusic.mute(false);
                musicVolume = 0.4;
            } else {
                theMusic.mute(true);
                musicVolume = 0;
            }
        } else {
            if (vol === 'down') {
                console.log('down');
                musicVolume = musicVolume-0.1;
                if (musicVolume < 0) {
                    musicVolume = 0;
                }
            } else if (vol === 'up') {
                console.log('up');
                musicVolume = musicVolume+0.1;
                if (musicVolume > 1) {
                    musicVolume = 1;
                }
            }
        }
        console.log(musicVolume);
    } else if (source === 'fx') {
        console.log('fx');
        if (vol === 'mute') {
            console.log('mute');
            if (musicVolume === 0) {
                fxVolume = 0.6;
            } else {
                theMusic.mute(true);
                fxVolume = 0;
            }
        } else {
            if (vol === 'down') {
                console.log('down');
                fxVolume = fxVolume-0.1;
                if (fxVolume < 0) {
                    fxVolume = 0;
                }
            } else if (vol === 'up') {
                console.log('up');
                fxVolume = fxVolume+0.1;
                if (fxVolume > 1) {
                    fxVolume = 1;
                }
            }
        }
        console.log(fxVolume);
    }
    commandes();
};

function eggSound() {
    var sound = new Howl({
        src: ['/static/sounds/smartsound_CINEMATIC_IMPACT_Eruption_01b.mp3'],
        volume: fxVolume
    });
    sound.play();
};

function shotSound(weapon) {
    if (!isFFW) {
        console.log(weapon);
        var sound = new Howl({
            src: ['/static/sounds/'+weapon.sound+'.mp3'],
            volume: fxVolume
        });
        sound.play();
        console.log(sound);
    }
};

function deathSound() {
    if (!isFFW) {
        var sound = new Howl({
            src: ['/static/sounds/zapsplat_explosion_fireball_43738.mp3'],
            volume: fxVolume
        });
        sound.play();
    }
};

function alienSounds() {
    var sound = new Howl({
        src: ['/static/sounds/little_robot_sound_factory_Ambience_AlienHive_00.mp3'],
        volume: fxVolume
    });
    sound.play();
};

function playMusic(piste,interrupt) {
    let track = [_.sample(musicTracks)];
    if (piste != 'any') {
        track = piste;
    }
    if (!theMusic.playing() || interrupt) {
        theMusic = new Howl({
            src: ['/static/sounds/music/'+track+'.mp3'],
            volume: musicVolume
        });
        theMusic.play();
        console.log('PLAYING: '+track);
    } else {
        console.log('ALREADY PLAYING');
    }
};
