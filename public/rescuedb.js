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
    newRescue.bat = ["Mineurs",1,3]; // dé (1 à 3) de ces bataillons
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.res = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.orb = [1,1]; // 1 à 3 Transorb (Moteur Orbital)
    newRescue.comp = [1,300]; // +1 compétence et +300 en recherche
    newRescue.map = -1; // id de la zone dévérouillée (-1 si pas de map)
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    return sauvetages;
};
