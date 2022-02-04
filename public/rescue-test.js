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
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 0 à 15
    newRescue.bat3 = ["Mineurs",0,1,30]; // si soins +que 25: 15 à 30
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 1 Transorb (Moteur Orbital)
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,3000,"vsp"]; // +1 compétence et +3000 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage etc... (10%)
    newRescue.map = 1; // id de la zone dévérouillée
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Sondes en perdition";
    newRescue.txt = "Votre navette de secours à découvert des sondes qui dérivent dans l'espace";
    newRescue.nav = true;
    newRescue.rarity = 50;
    newRescue.demUnit = ["Sonde","Sonde","Impacteur","Impacteur","Impacteur"];
    newRescue.bat = ["Sonde",0,3,0];
    newRescue.bat2 = ["Impacteur",0,5,0];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Débris";
    newRescue.txt = "Votre navette de secours à découvert des débris qui dérivent dans l'espace";
    newRescue.nav = true;
    newRescue.rarity = 90;
    newRescue.scrap = [50,200];
    newRescue.resBase = [4,1,100];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nuage de débris";
    newRescue.txt = "Votre navette de secours à découvert un nuage de débris qui dérivent dans l'espace";
    newRescue.nav = true;
    newRescue.rarity = 70;
    newRescue.scrap = [300,600];
    newRescue.resBase = [15,1,100];
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
    newRescue.txt = "Votre navette de secours à découvert un cybercontainer spatial qui dérive dans l'espace.";
    newRescue.nav = true;
    newRescue.rarity = 15;
    newRescue.bat = ["Donkys",1,2,15];
    newRescue.bat2 = ["Droïdes",1,3,15];
	newRescue.bat3 = ["T-Skeltons",0,1,20];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Cybercontainers endommagés";
    newRescue.txt = "Votre navette de secours à découvert des containers spatiaux endomagés qui dérivent dans l'espace.";
    newRescue.nav = true;
    newRescue.rarity = 20;
    newRescue.demUnit = ["Donkys","Droïdes","Gunbots","T-Skeltons"];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Caissons pénitentiaires";
    newRescue.txt = "Votre navette de secours à détecté une balise de secours. Il s'agit de caissons pénitentiaires qui dérivent dans l'espace.";
    newRescue.nav = true;
    newRescue.rarity = 30;
    newRescue.demEquip = ["sci-log"]; // ressources par démantèlement de ces équipements
    newRescue.crim = [5,2,32];
    newRescue.event = ["Epidémie",10]; // Epidémie (10%)
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Caissons de survie";
    newRescue.txt = "Votre navette de secours à détecté une balise de secours. Il s'agit de caissons de survie qui dérivent dans l'espace.";
    newRescue.nav = true;
    newRescue.rarity = 35;
    newRescue.demEquip = ["sci-log"]; // ressources par démantèlement de ces équipements
    newRescue.demUnit = ["Cabines"];
    newRescue.cit = [7,2,32];
    newRescue.event = ["Epidémie",3]; // Epidémie (3%)
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Caissons de survie pour VIP";
    newRescue.txt = "Votre navette de secours à détecté une balise de secours. Il s'agit de caissons de survie pour VIP qui dérivent dans l'espace.";
    newRescue.nav = true;
    newRescue.rarity = 10;
    newRescue.demEquip = ["sci-log"]; // ressources par démantèlement de ces équipements
    newRescue.demUnit = ["Appartements"];
    newRescue.cit = [3,2,12];
    newRescue.comp = [true,0,""]; // +1 compétence
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Navette de colons";
    newRescue.txt = "Une navette de colons à débarqué sur votre station."
    newRescue.nav = false;
    newRescue.rarity = 40;
    newRescue.demUnit = ["Navette de secours"];
    newRescue.cit = [3,4,20];
    newRescue.crim = [1,0,8];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Épave partielle de station ";
    newRescue.txt = "Votre navette de secours à découvert un morceau de station orbitale dans l'espace";
    newRescue.nav = true;
    newRescue.rarity = 10;
    newRescue.cit = [10,2,32];
    newRescue.crim = [1,2,32];
    newRescue.res = [30,5];
    newRescue.demUnit = ["Structure","Structure","Structure","Structure","Structure","Structure","Isolation","Isolation","Isolation","Isolation"];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Épave de bloc médical";
    newRescue.txt = "Votre navette de secours à découvert un morceau de station orbitale dans l'espace. Elle a détecté un appel à l'aide provenant du bloc médical qui semble intact";
    newRescue.nav = true;
    newRescue.rarity = 5;
    newRescue.cit = [6,2,18];
    newRescue.bat = ["Infirmiers",1,3,9];
    newRescue.demUnit = ["Hôpital","Laboratoire","Cabines"];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Épave de bloc pénitenciaire";
    newRescue.txt = "Votre navette de secours à découvert un morceau de station orbitale dans l'espace. Le bloc pénitenciaire semble intact.";
    newRescue.nav = true;
    newRescue.rarity = 5;
    newRescue.crim = [10,2,34];
    newRescue.demUnit = ["Cantine","Prisons","Prisons","Camp de rééducation","Salle de contrôle"];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Épave de bloc de loisir";
    newRescue.txt = "Votre navette de secours à découvert un morceau de station orbitale dans l'espace. Elle a détecté un appel à l'aide provenant du bloc de loisir qui semble intact.";
    newRescue.nav = true;
    newRescue.rarity = 5;
    newRescue.cit = [5,2,46];
    newRescue.demUnit = ["Jardin","Bar","Appartements","Salle de jeux"];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Épave de bloc industriel";
    newRescue.txt = "Votre navette de secours à découvert un morceau de station orbitale dans l'espace. Elle a détecté un appel à l'aide provenant du bloc de industriel qui semble intact."
    newRescue.nav = true;
    newRescue.rarity = 7;
    newRescue.cit = [5,2,46];
    newRescue.bat = ["Mineurs",0,1,15];
    newRescue.bat2 = ["Mineurs",0,1,15];
	newRescue.bat3 = ["Sapeurs",0,1,15];
    newRescue.demUnit = ["Usine","Centre de tri"];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Épave de bloc de militaire";
    newRescue.txt = "Votre navette de secours à découvert un morceau de station orbitale dans l'espace. Elle a détecté un appel à l'aide provenant du bloc de militaire qui semble intact.";
    newRescue.nav = true;
    newRescue.rarity = 4 ;
    newRescue.cit = [5,2,46];
    newRescue.bat = ["Obusiers",0,1,35];
    newRescue.demUnit = ["Usine d'armement","Obusiers","Squash"];
    newRescue.demEquip = ["sci-log"];
    newRescue.map = 2;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Épave de bloc de communication";
    newRescue.txt = "Votre navette de secours à découvert un morceau de station orbitale dans l'espace. Elle a détecté un appel à l'aide provenant du bloc de communication qui semble intact.";
    newRescue.nav = true;
    newRescue.rarity = 5;
    newRescue.cit = [3,2,46];
    newRescue.demUnit = ["Vidéotéléphonie","Centre de com"];
    newRescue.map = 1;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Astéroïde minier abandonné";
    newRescue.txt = "Votre sonde à détecté un astéroïde minier abandonné. Votre navette de secours à peut être trouvé quelque chose sur place";
    newRescue.nav = true;
    newRescue.rarity = 20;
	newRescue.bat = ["Taupes",0,2,20];
	newRescue.bat2 = ["Drilltruck",0,1,20];
    newRescue.demUnit = ["Mine","Mine","Mine","Derrick","Derrick","Dortoirs"];
    newRescue.demEquip = ["sci-ext"];
    newRescue.res = [3,5];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Astéroïde minier";
    newRescue.txt = "Votre équipage à capté un appel de détresse venant d'un astéroïde minier. Votre navette de secours à peut être trouvé quelqu'un sur place";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.bat = ["Mineurs",1,2,15];
    newRescue.bat2 = ["Mineurs",0,3,15];
	newRescue.bat3 = ["Drilltruck",0,1,15];
    newRescue.demUnit = ["Mine","Mine","Mine","Derrick","Derrick","Dortoirs"];
    newRescue.demEquip = ["sci-ext"];
    newRescue.res = [5,5];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Cimetière d'épaves";
    newRescue.txt = "Vos instruments ont enregistré une collision entre deux vaisseaux. Il y à peut être des gens à sauver et sans doute des choses à récupérer";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.cit = [1,0,60];
    newRescue.crim = [1,0,20];
    newRescue.res = [35,7];
    newRescue.scrap = [150,300];
    newRescue.demUnit = ["Trolley","Navette de secours"];
	newRescue.orb = [1,1];
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Colonie humaine abandonnée";
    newRescue.txt = " L'une de vos sonde à détecté une grosse concentration urbaine. Il va falloir préparer une expédition pour en savoir plus.";
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
    newRescue.name = "Vaisseau Minotaure en perdition";
    newRescue.txt = "Votre équipage à capté un appel de détresse venant d'un vaisseau Minotaure en perdition. Votre navette de secours à peut être trouvé quelqu'un sur place.";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.bat = ["Mineurs",1,3,15];
	newRescue.bat2 = ["Sapeurs",0,3,15];
    newRescue.bat3 = ["Minautore",1,1,30]; // Endomagé
    newRescue.res = [3,7];
    newRescue.map = 3;
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Œuf alien en perdition";
    newRescue.txt = "Votre navette de sauvetage à repéché un oeuf alien en perdition dans l'espace. Nos chercheurs devraient pouvoir en apprendre quelque chose.";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.resAlien = [10,1,100,false]; // 10 dés (1 à 100) ressources alien (true = rare)
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Cocon alien en perdition";
    newRescue.txt = "Votre navette de sauvetage à repéché un cocon alien en perdition dans l'espace. Nos chercheurs devraient pouvoir en apprendre quelque chose.";
    newRescue.nav = true;
    newRescue.rarity = 0;
    newRescue.comp = [false,0,"ca"]; // +1 connaissance alien
    newRescue.resAlien = [10,1,50,true]; // 7 dés (1 à 50) ressources alien (true = rare)
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Navette scientifique";
    newRescue.txt = "Une navette bricollée à réussi à rejoindre la station. Il à fallut du génie pour réussir un coup pareil.";
    newRescue.nav = false;
    newRescue.rarity = 0;
    newRescue.demEquip = ["sci-vsp"]; // ressources par démantèlement de ces équipements
    newRescue.scrap = [300,400];
    newRescue.bat = ["Chercheurs",1,1,0];
    newRescue.comp = [false,3000,"vsp"]; // +3000 recherche et +1 vsp
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Abordage";
    newRescue.txt = "Des membres d'un autre gang ont réusssi à s'introduire dans la station. Ils n'ont pas réussi à prendre le contrôle mais on fait beaucoup de dégâts.";
    newRescue.nav = false
    newRescue.rarity = 0;
    newRescue.demEquip = ["sci-vsp"]; // ressources par démantèlement de ces équipements
    newRescue.crim = [7,2,10];
    newRescue.map = 2;
    newRescue.event = ["Abordage",100]; // Abordage (100%)
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Réfugiés";
    newRescue.txt = "Une capsule de sauvetage et des containers spaciaux remplis de réfugiés se sont amarrés à la station.";
    newRescue.nav = false;
    newRescue.rarity = 60;
    newRescue.demEquip = ["sci-vsp"]; // ressources par démantèlement de ces équipements
    newRescue.cit = [10,1,12];
    newRescue.crim = [3,1,10];
    newRescue.event = ["Epidémie",5]; // Epidémie (5%)
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif (ne pas mettre de "" dans le texte)
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12) citoyens
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10) criminels
    newRescue.bat = ["Mineurs",1,3,0]; // dé (1 à 3) de ces bataillons
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 0 à 15
    newRescue.bat3 = ["Mineurs",0,1,30]; // si soins +que 25: 15 à 30
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 1 Transorb (Moteur Orbital)
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,3000,"vsp"]; // +1 compétence et +3000 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage etc... (10%)
    newRescue.map = 1; // id de la zone dévérouillée
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif (ne pas mettre de "" dans le texte)
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12) citoyens
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10) criminels
    newRescue.bat = ["Mineurs",1,3,0]; // dé (1 à 3) de ces bataillons
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 0 à 15
    newRescue.bat3 = ["Mineurs",0,1,30]; // si soins +que 25: 15 à 30
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 1 Transorb (Moteur Orbital)
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,3000,"vsp"]; // +1 compétence et +3000 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage etc... (10%)
    newRescue.map = 1; // id de la zone dévérouillée
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif (ne pas mettre de "" dans le texte)
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12) citoyens
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10) criminels
    newRescue.bat = ["Mineurs",1,3,0]; // dé (1 à 3) de ces bataillons
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 0 à 15
    newRescue.bat3 = ["Mineurs",0,1,30]; // si soins +que 25: 15 à 30
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 1 Transorb (Moteur Orbital)
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,3000,"vsp"]; // +1 compétence et +3000 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage etc... (10%)
    newRescue.map = 1; // id de la zone dévérouillée
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif (ne pas mettre de "" dans le texte)
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12) citoyens
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10) criminels
    newRescue.bat = ["Mineurs",1,3,0]; // dé (1 à 3) de ces bataillons
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 0 à 15
    newRescue.bat3 = ["Mineurs",0,1,30]; // si soins +que 25: 15 à 30
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 1 Transorb (Moteur Orbital)
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,3000,"vsp"]; // +1 compétence et +3000 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage etc... (10%)
    newRescue.map = 1; // id de la zone dévérouillée
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif (ne pas mettre de "" dans le texte)
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12) citoyens
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10) criminels
    newRescue.bat = ["Mineurs",1,3,0]; // dé (1 à 3) de ces bataillons
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 0 à 15
    newRescue.bat3 = ["Mineurs",0,1,30]; // si soins +que 25: 15 à 30
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 1 Transorb (Moteur Orbital)
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,3000,"vsp"]; // +1 compétence et +3000 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage etc... (10%)
    newRescue.map = 1; // id de la zone dévérouillée
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif (ne pas mettre de "" dans le texte)
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12) citoyens
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10) criminels
    newRescue.bat = ["Mineurs",1,3,0]; // dé (1 à 3) de ces bataillons
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 0 à 15
    newRescue.bat3 = ["Mineurs",0,1,30]; // si soins +que 25: 15 à 30
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 1 Transorb (Moteur Orbital)
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,3000,"vsp"]; // +1 compétence et +3000 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage etc... (10%)
    newRescue.map = 1; // id de la zone dévérouillée
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif (ne pas mettre de "" dans le texte)
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12) citoyens
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10) criminels
    newRescue.bat = ["Mineurs",1,3,0]; // dé (1 à 3) de ces bataillons
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 0 à 15
    newRescue.bat3 = ["Mineurs",0,1,30]; // si soins +que 25: 15 à 30
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 1 Transorb (Moteur Orbital)
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,3000,"vsp"]; // +1 compétence et +3000 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage etc... (10%)
    newRescue.map = 1; // id de la zone dévérouillée
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif (ne pas mettre de "" dans le texte)
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12) citoyens
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10) criminels
    newRescue.bat = ["Mineurs",1,3,0]; // dé (1 à 3) de ces bataillons
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 0 à 15
    newRescue.bat3 = ["Mineurs",0,1,30]; // si soins +que 25: 15 à 30
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 1 Transorb (Moteur Orbital)
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,3000,"vsp"]; // +1 compétence et +3000 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage etc... (10%)
    newRescue.map = 1; // id de la zone dévérouillée
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif (ne pas mettre de "" dans le texte)
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12) citoyens
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10) criminels
    newRescue.bat = ["Mineurs",1,3,0]; // dé (1 à 3) de ces bataillons
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 0 à 15
    newRescue.bat3 = ["Mineurs",0,1,30]; // si soins +que 25: 15 à 30
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 1 Transorb (Moteur Orbital)
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,3000,"vsp"]; // +1 compétence et +3000 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage etc... (10%)
    newRescue.map = 1; // id de la zone dévérouillée
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif (ne pas mettre de "" dans le texte)
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12) citoyens
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10) criminels
    newRescue.bat = ["Mineurs",1,3,0]; // dé (1 à 3) de ces bataillons
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 0 à 15
    newRescue.bat3 = ["Mineurs",0,1,30]; // si soins +que 25: 15 à 30
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 1 Transorb (Moteur Orbital)
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,3000,"vsp"]; // +1 compétence et +3000 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage etc... (10%)
    newRescue.map = 1; // id de la zone dévérouillée
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif (ne pas mettre de "" dans le texte)
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12) citoyens
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10) criminels
    newRescue.bat = ["Mineurs",1,3,0]; // dé (1 à 3) de ces bataillons
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 0 à 15
    newRescue.bat3 = ["Mineurs",0,1,30]; // si soins +que 25: 15 à 30
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 1 Transorb (Moteur Orbital)
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,3000,"vsp"]; // +1 compétence et +3000 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage etc... (10%)
    newRescue.map = 1; // id de la zone dévérouillée
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif (ne pas mettre de "" dans le texte)
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12) citoyens
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10) criminels
    newRescue.bat = ["Mineurs",1,3,0]; // dé (1 à 3) de ces bataillons
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 0 à 15
    newRescue.bat3 = ["Mineurs",0,1,30]; // si soins +que 25: 15 à 30
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 1 Transorb (Moteur Orbital)
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,3000,"vsp"]; // +1 compétence et +3000 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage etc... (10%)
    newRescue.map = 1; // id de la zone dévérouillée
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif (ne pas mettre de "" dans le texte)
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12) citoyens
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10) criminels
    newRescue.bat = ["Mineurs",1,3,0]; // dé (1 à 3) de ces bataillons
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 0 à 15
    newRescue.bat3 = ["Mineurs",0,1,30]; // si soins +que 25: 15 à 30
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 1 Transorb (Moteur Orbital)
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,3000,"vsp"]; // +1 compétence et +3000 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage etc... (10%)
    newRescue.map = 1; // id de la zone dévérouillée
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif (ne pas mettre de "" dans le texte)
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12) citoyens
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10) criminels
    newRescue.bat = ["Mineurs",1,3,0]; // dé (1 à 3) de ces bataillons
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 0 à 15
    newRescue.bat3 = ["Mineurs",0,1,30]; // si soins +que 25: 15 à 30
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 1 Transorb (Moteur Orbital)
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,3000,"vsp"]; // +1 compétence et +3000 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage etc... (10%)
    newRescue.map = 1; // id de la zone dévérouillée
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif (ne pas mettre de "" dans le texte)
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12) citoyens
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10) criminels
    newRescue.bat = ["Mineurs",1,3,0]; // dé (1 à 3) de ces bataillons
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 0 à 15
    newRescue.bat3 = ["Mineurs",0,1,30]; // si soins +que 25: 15 à 30
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 1 Transorb (Moteur Orbital)
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,3000,"vsp"]; // +1 compétence et +3000 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage etc... (10%)
    newRescue.map = 1; // id de la zone dévérouillée
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    newRescue.name = "Nom";
    newRescue.txt = "Textetextetextetextetexte"; // Texte explicatif (ne pas mettre de "" dans le texte)
    newRescue.nav = true; // Avec la navette ou arrivé à la Station (true ou false)
    newRescue.rarity = 0;
    newRescue.cit = [5,1,12]; // 5 dés (1 à 12) citoyens
    newRescue.crim = [7,3,10]; // 7 dés (3 à 10) criminels
    newRescue.bat = ["Mineurs",1,3,0]; // dé (1 à 3) de ces bataillons
    newRescue.bat2 = ["Mineurs",0,2,15]; // soins = 0 à 15
    newRescue.bat3 = ["Mineurs",0,1,30]; // si soins +que 25: 15 à 30
    newRescue.demUnit = ["Usine","Laboratoire"]; // ressources par démantèlement de ces unités (pas de citoyens) (pas les végétaux de camouflage) + leur production (x40)
    newRescue.demEquip = ["sci-log","sci-vsp","sci-pyro"]; // ressources par démantèlement de ces équipements (pas les végétaux de camouflage)
    newRescue.orb = [1,1]; // 1 à 1 Transorb (Moteur Orbital)
    newRescue.scrap = [150,400]; // (150 à 400) scrap
    newRescue.resRuin = [3,7]; // 3x ressources de ruines à mapDiff 7
    newRescue.resBase = [5,1,100]; // 5 dés (1 à 100) ressources de base
    newRescue.resAlien = [5,1,100,true]; // 5 dés (1 à 100) ressources alien (true = rare)
    newRescue.comp = [true,3000,"vsp"]; // +1 compétence et +3000 en recherche et +1 vsp
    newRescue.event = ["Epidémie",10]; // Epidémie, Abordage etc... (10%)
    newRescue.map = 1; // id de la zone dévérouillée
    sauvetages.push(newRescue);
    // ---------------------------------------------------------------------
    return sauvetages;
};
