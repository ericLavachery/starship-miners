function makeRescueDB() {
    let sauvetages = [];
    let newRescue = {};
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif (ne pas mettre de "" dans le texte)
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12) citoyens
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10) criminels
    newRescue.bat = ["Mineurs",1,3,0]; // dé (1 à 3) de ces bataillons
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 15
    newRescue.bat3 = ["Mineurs",0,1,0];
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 3 Transorb (Moteur Orbital)
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,300,"vsp"]; // +1 compétence et +300 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage (10%)
    newRescue.map = -1; // id de la zone dévérouillée (-1 si pas de map)
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    return sauvetages;
};
