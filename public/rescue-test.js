function makeRescueDB() {
    let sauvetages = [];
    let newRescue = {};
    // ---------------------------------------------------------------------
    newRescue.name = "Sondes en perdition";
    newRescue.txt = "Votre navette de secours à découvert des sondes qui dérivent dans l'espace";
    newRescue.nav = true;
    newRescue.rarity = 50;
    newRescue.bat = ["Sonde",2,9];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Débris";
    newRescue.txt = "Votre navette de secours à découvert des débris qui dérivent dans l'espace";
    newRescue.nav = true;
    newRescue.rarity = 90;
    newRescue.res = [5,1];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nuage de débris";
    newRescue.txt = "Votre navette de secours à découvert un nuage de débris qui dérivent dans l'espace";
    newRescue.nav = true;
    newRescue.rarity = 70;
    newRescue.res = [10,1];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Containers spatiaux";
    newRescue.txt = "Votre navette de secours à découvert des containers spatiaux qui dérivent dans l'espace";
    newRescue.nav = true;
    newRescue.rarity = 50;
    newRescue.res = [10,5];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Cybercontainer";
    newRescue.txt = "Votre navette de secours à découvert un cybercontainer spatial qui dérivent dans l'espace.";
    newRescue.nav = true;
    newRescue.rarity = 15;
    newRescue.bat = ["Droïdes",1,4];
	newRescue.bat = ["T-Skelton",0,1];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Cybercontainers endommagés";
    newRescue.txt = "Votre navette de secours à découvert des containers spatiaux endomagés qui dérivent dans l'espace.";
    newRescue.nav = true;
    newRescue.rarity = 20;
    newRescue.demUnit = ["Droïdes","Droïdes","Droïdes","T-Skelton"];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Caissons pénitentiaires";
    newRescue.txt = "Votre navette de secours à détecté une balise de secours. Il s'agit de caissons pénitentiaires qui dérivent dans l'espace.";
    newRescue.nav = true;
    newRescue.rarity = 30;
    newRescue.crim = [10,3,10];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Caissons de survie";
    newRescue.txt = "Votre navette de secours à détecté une balise de secours. Il s'agit de caissons de survie qui dérivent dans l'espace.";
    newRescue.nav = true;
    newRescue.rarity = 35;
    newRescue.cit = [10,3,10];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Caissons de survie pour VIP";
    newRescue.txt = "Votre navette de secours à détecté une balise de secours. Il s'agit de caissons de survie pour VIP qui dérivent dans l'espace.";
    newRescue.nav = true;
    newRescue.rarity = 10;
    // +1 compétence
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Navette de colons";
    newRescue.txt = "Une navette de colons à débarqué sur votre station."
    newRescue.nav = false;
    newRescue.rarity = 40;
    newRescue.cit = [5,1,12];
    newRescue.crim = [1,3,10];
    newRescue.demUnit = ["sonde"];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Épave partielle de station ";
    newRescue.txt = "Votre navette de secours à découvert un morceau de station orbitale dans l'espace";
    newRescue.nav = true;
    newRescue.rarity = 10;
    newRescue.cit = [10,1,10];
    newRescue.crim = [3,3,10];
    newRescue.res = [30,5];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Épave de bloc médical";
    newRescue.txt = "Votre navette de secours à découvert un morceau de station orbitale dans l'espace. Elle a détecté un appel à l'aide provenant du bloc médical qui semble intact";
    newRescue.nav = true;
    newRescue.rarity = 5;
    newRescue.cit = [10,1,10];
    newRescue.bat = ["Infirmiers",1,3];
    newRescue.demUnit = ["Hôpital","Laboratoire","infirmerie"];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Épave de bloc pénitenciaire";
    newRescue.txt = "Votre navette de secours à découvert un morceau de station orbitale dans l'espace. Le bloc pénitenciaire semble intact";
    newRescue.nav = true;
    newRescue.rarity = 5;
    newRescue.crim = [3,20,100];
    newRescue.demUnit = ["Cantine","Prison","Camp de rééducation","Salle de sport"];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Épave de bloc de loisir";
    newRescue.txt = "Votre navette de secours à découvert un morceau de station orbitale dans l'espace. Elle a détecté un appel à l'aide provenant du bloc de loisir qui semble intact";
    newRescue.nav = true;
    newRescue.rarity = 5;
    newRescue.cit = [3,20,100];
    newRescue.demUnit = ["Jardin","Bar","Appartement","Salle de jeux"];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Épave de bloc industriel";
    newRescue.txt = "Votre navette de secours à découvert un morceau de station orbitale dans l'espace. Elle a détecté un appel à l'aide provenant du bloc de industriel qui semble intact"
    newRescue.nav = true;
    newRescue.rarity = 7;
    newRescue.cit = [5,1,12];
    newRescue.bat = ["Mineurs",1,3];
	newRescue.bat = ["Sapeurs",1,3];
    newRescue.demUnit = ["Usine","Chaîne de montage","Atelier"];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Épave de bloc de militaire";
    newRescue.txt = "Votre navette de secours à découvert un morceau de station orbitale dans l'espace. Elle a détecté un appel à l'aide provenant du bloc de militaire qui semble intact";
    newRescue.nav = true;
    newRescue.rarity = 4 ;
    newRescue.cit = [10,5,20];
    newRescue.demUnit = ["Usine d'armement","Arsenal","Armurerie"];
    newRescue.demEquip = ["sci-log"];
    newRescue.map = 2;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Épave de bloc de communication";
    newRescue.txt = "Votre navette de secours à découvert un morceau de station orbitale dans l'espace. Elle a détecté un appel à l'aide provenant du bloc de communication qui semble intact"; //
    newRescue.nav = true;
    newRescue.rarity = 5;
    newRescue.cit = [5,1,12];
    newRescue.demUnit = ["Poste radio","Passerelle","Centre de communication"];
    newRescue.map = 1;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Astéroïde minier abandonné";
    newRescue.txt = "Votre sonde à détecté un astéroïde minier abandonné. Votre navette de secours à peut être trouvé quelque chose sur place ";
    newRescue.nav = true;
    newRescue.rarity = 20;
	newRescue.bat = ["Taupes",1,3];
	newRescue.bat = ["Drilltruck",0,1];
    newRescue.demUnit = ["mine","mine","mine","derrick","derrick","dortoir"];
    newRescue.demEquip = ["sci-ext"];
    newRescue.res = [3,5];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Astéroïde minier  ";
    newRescue.txt = "Votre équipage à capté un appel de détresse venant d'un astéroïde minier.Votre navette de secours à peut être trouvé quelqu'un sur place";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.bat = ["Mineurs",1,5];
	newRescue.bat = ["Drilltruck",0,1];
    newRescue.demUnit = ["mine","mine","mine","derrick","derrick","dortoir"];
    newRescue.res = [3,5];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Cimetière d'épaves";
    newRescue.txt = "Vos instruments ont enregistré une collision entre deux vaisseaux. Il y à peut être des gens à sauver et sans doute des choses à récupérer";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12];
    newRescue.crim = [5,1,12];
    newRescue.res = [35,7];
	newRescue.orb = [1,1];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Colonie humaine abandonnée";
    newRescue.txt = " L'une de vos sonde à détecté une grosse concentration urbaine. Il va falloir préparer une expédition pour en savoir plus";
    newRescue.nav = false;
    newRescue.rarity = 0;
    newRescue.map = 3;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Colonie humaine en péril";
    newRescue.txt = "Votre équipage à reçu un S.O.S. venant d'une colonnie. Il va falloir rapidement préparer une expédition de sauvetage.";
    newRescue.nav = false;
    newRescue.rarity = 0;
    newRescue.map = 4;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Vaisseau 'Minotaure' en perdition";
    newRescue.txt = "Votre équipage à capté un appel de détresse venant d'un vaisseau 'Minotaure'en perdition. Votre navette de secours à peut être trouvé quelqu'un sur place";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.bat = ["Mineurs",1,3];
	newRescue.bat = ["Sapeurs",1,3];
    newRescue.bat = ["Minautore",1,1]; // Endomagé
    newRescue.res = [3,7];
    newRescue.map = 3;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Œuf alien en perdition";
    newRescue.txt = "Votre navette de sauvetage à repéché un oeuf alien en perdition dans l'espace. Nos chercheurs devraient pouvoir en apprendre quelque chose";
    newRescue.nav = true;
    newRescue.rarity = 0;
    // +1 connaissance alien
	// +10d100 ressources alien
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Cocon alien en perdition";
    newRescue.txt = "Votre navette de sauvetage à repéché un cocon alien en perdition dans l'espace. Nos chercheurs devraient pouvoir en apprendre quelque chose";
    newRescue.nav = true;
    newRescue.rarity = 0;
    // +1 connaissance alien
	// +10d100 ressources alien rare
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Navette scientifique";
    newRescue.txt = "Une navette bricollée à réussi à rejoindre la station. Il à fallut du génie pour réussir un coup pareil.";
    newRescue.nav = false;
    newRescue.rarity = 0;
    newRescue.bat = ["Chercheurs",1,3];
    newRescue.map = -1;
	// +x en recherches
	// +1 En vsp
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Abordage";
    newRescue.txt = "Des membres d'un autre gang ont réusssi à s'introduire dans la station. Ils n'ont pas réussi à prendre le contrôle mais on fait beaucoup de dégâts.";
    newRescue.nav = false
    newRescue.rarity = 0;
    newRescue.crim = [7,3,10];
    newRescue.map = 2;
	// dégâts et victimes
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Réfugiés";
    newRescue.txt = "Une capsule de sauvetage et des containers spaciaux remplis de réfugiés se sont amarrés à la station";
    newRescue.nav = false;
    newRescue.rarity = 60;
    newRescue.cit = [10,1,12];
    newRescue.crim = [3,1,10];
    // % de chance d'avoir une épidémie
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12];
    newRescue.crim = [7,3,10];
    newRescue.bat = ["Mineurs",1,3];
    newRescue.demUnit = ["Usine","Laboratoire"]; // (pas de végétaux)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"];
    newRescue.res = [3,7];
    newRescue.map = -1;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12];
    newRescue.crim = [7,3,10];
    newRescue.bat = ["Mineurs",1,3];
    newRescue.demUnit = ["Usine","Laboratoire"]; // (pas de végétaux)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"];
    newRescue.res = [3,7];
    newRescue.map = -1;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12];
    newRescue.crim = [7,3,10];
    newRescue.bat = ["Mineurs",1,3];
    newRescue.demUnit = ["Usine","Laboratoire"]; // (pas de végétaux)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"];
    newRescue.res = [3,7];
    newRescue.map = -1;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12];
    newRescue.crim = [7,3,10];
    newRescue.bat = ["Mineurs",1,3];
    newRescue.demUnit = ["Usine","Laboratoire"]; // (pas de végétaux)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"];
    newRescue.res = [3,7];
    newRescue.map = -1;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12];
    newRescue.crim = [7,3,10];
    newRescue.bat = ["Mineurs",1,3];
    newRescue.demUnit = ["Usine","Laboratoire"]; // (pas de végétaux)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"];
    newRescue.res = [3,7];
    newRescue.map = -1;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12];
    newRescue.crim = [7,3,10];
    newRescue.bat = ["Mineurs",1,3];
    newRescue.demUnit = ["Usine","Laboratoire"]; // (pas de végétaux)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"];
    newRescue.res = [3,7];
    newRescue.map = -1;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12];
    newRescue.crim = [7,3,10];
    newRescue.bat = ["Mineurs",1,3];
    newRescue.demUnit = ["Usine","Laboratoire"]; // (pas de végétaux)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"];
    newRescue.res = [3,7];
    newRescue.map = -1;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12];
    newRescue.crim = [7,3,10];
    newRescue.bat = ["Mineurs",1,3];
    newRescue.demUnit = ["Usine","Laboratoire"]; // (pas de végétaux)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"];
    newRescue.res = [3,7];
    newRescue.map = -1;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12];
    newRescue.crim = [7,3,10];
    newRescue.bat = ["Mineurs",1,3];
    newRescue.demUnit = ["Usine","Laboratoire"]; // (pas de végétaux)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"];
    newRescue.res = [3,7];
    newRescue.map = -1;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12];
    newRescue.crim = [7,3,10];
    newRescue.bat = ["Mineurs",1,3];
    newRescue.demUnit = ["Usine","Laboratoire"]; // (pas de végétaux)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"];
    newRescue.res = [3,7];
    newRescue.map = -1;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12];
    newRescue.crim = [7,3,10];
    newRescue.bat = ["Mineurs",1,3];
    newRescue.demUnit = ["Usine","Laboratoire"]; // (pas de végétaux)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"];
    newRescue.res = [3,7];
    newRescue.map = -1;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12];
    newRescue.crim = [7,3,10];
    newRescue.bat = ["Mineurs",1,3];
    newRescue.demUnit = ["Usine","Laboratoire"]; // (pas de végétaux)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"];
    newRescue.res = [3,7];
    newRescue.map = -1;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12];
    newRescue.crim = [7,3,10];
    newRescue.bat = ["Mineurs",1,3];
    newRescue.demUnit = ["Usine","Laboratoire"]; // (pas de végétaux)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"];
    newRescue.res = [3,7];
    newRescue.map = -1;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    return sauvetages;
};
