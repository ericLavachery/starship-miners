function checkModules(bat,batType) {
    if (batType.skills.includes('transorbital')) {
        if (bat.modules === undefined) {
            bat.modules = {};
            fillModules(bat,batType);
        } else {
            fillModules(bat,batType);
        }
    }
};

function fillModules(bat,batType) {
    // transport de troupes
    if (bat.modules.trans === undefined) {
        bat.modules.trans = 0;
    }
    // transport de ressources
    if (bat.modules.fret === undefined) {
        bat.modules.fret = 0;
    }
    // blindage renforcé, résistance globale
    if (bat.modules.prt === undefined) {
        bat.modules.prt = 0;
    }
    // stabilisateur (atterrissage tout terrains)
    if (bat.modules.stab === undefined) {
        bat.modules.stab = 0;
    }
    // moteur g2 (hySpeed/2)
    if (bat.modules.g2mo === undefined) {
        bat.modules.g2mo = 0;
    }
    // extraction
    if (bat.modules.mining === undefined) {
        bat.modules.mining = 0;
    }
    // parabole (bonus détection sur zone)
    if (bat.modules.radar === undefined) {
        bat.modules.radar = 0;
    }
    // nanotech (mecanoCost = 1)
    if (bat.modules.nano === undefined) {
        bat.modules.nano = 0;
    }
    // teleport (lander = cabine d'arrivée)
    if (bat.modules.teleport === undefined) {
        bat.modules.teleport = 0;
    }
    // canon athmosphérique (endommage les oeufs qui tombent)
    if (bat.modules.athmo === undefined) {
        bat.modules.athmo = 0;
    }
    // camouflage optique (fuzz -2)
    if (bat.modules.camopt === undefined) {
        bat.modules.camopt = 0;
    }
    // démantèlement rapide (déconstruction bld range +2)
    if (bat.modules.pli === undefined) {
        bat.modules.pli = 0;
    }
};
