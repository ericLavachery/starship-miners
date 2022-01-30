function makeRescueDB() {
    let sauvetages = [];
    let newRescue = {};
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12)
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10)
    newRescue.bat = ["Mineurs",1,3]; // dé 1 à 3 de ces bataillons
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas de végétaux)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas de végétaux)
    newRescue.res = [3,7]; // 3x ressources de ruines (à 100%) à mapDiff 7
    newRescue.map = 2; // id de la zone dévérouillée (-1 si pas de map)
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    return sauvetages;
};
