//script MZ
//ajout d'un bouton "don de PX" dans les PM

// test de la page et lancement de la fonction

function isPage(url) {
  return 0 <= window.location.href.indexOf(url);
}

if (isPage("MH_Play/Play_vue2.php")) {
  console.log("debut reorg");
  main()
}

function main() {
  addConfigTable();
  var config = getConfig();
  if (!(config.activeReorgChecked)) { return; }


  if (typeof MZ_cVueJSON === 'undefined') {
    console.log('MZ_cVueJSON undefined');   // à enlever
    setTimeout(main, 10);   // retry dans 10ms
    return;
  }
  MZ_cVueJSON.registerCallbackMZ(goReorg);

}

function goReorg() {
  var insertReorgDiv = document.getElementById("insertReorgDiv");
  insertReorgDiv = insertReorgDiv ?? document.createElement('div');
  insertReorgDiv.id = 'insertReorgDiv';
  insertReorgDiv.innerHTML = "";
  origine = getPositionTrolls();
  let vueBrute = getVueBrute();
  let vueTriee = vueBrute.sort(triVueBrute);
  addVueReorg(vueTriee);
}

function getVueBrute() {
  const infoTroll = getPositionTrolls();
  let sectionsArray = {
    "oMonstres": ["reorgMonstresChecked", "distanceReorgMonstres"],
    "oTrolls": ["reorgTrollsChecked", "distanceReorgTrolls"],
    "oTresors": ["reorgTresorsChecked", "distanceReorgTresors"],
    "oChampignons": ["reorgChampignonsChecked", "distanceReorgChampignons"],
    "oLieux": ["reorgLieuxChecked", "distanceReorgLieux"],
    "oCenotaphes": ["reorgCenotaphesChecked", "distanceReorgCenotaphes"]
  };

  const vueArrayBrute = [];
  var config = getConfig();

  for (const [section, configSection] of Object.entries(sectionsArray)) {
    console.log(configSection[0], config[configSection[0]]);
    if (config[configSection[0]] == "true") {
      listeOjects = MZ_cVueJSON[section].MH_json;
      if (!(listeOjects === undefined)) {
        listeOjects.forEach(objet => {
          if (calculeDistance(objet.value, infoTroll) <= config[configSection[1]]) {
            vueArrayBrute.push(objet.value);
          }
        });
      }
    }
  };

  return vueArrayBrute;
}

function getPositionTrolls() {
  positionTroll = { "x": localStorage.getItem(numTroll + ".position.X"), "y": localStorage.getItem(numTroll + ".position.Y"), "n": localStorage.getItem(numTroll + ".position.N") };
  return positionTroll;
}

function calculeDistance(objet1, origine) {
  distance = Math.max(Math.abs(origine.x - objet1.x), Math.abs(origine.y - objet1.y), Math.abs(origine.n - objet1.n));
  return distance;
}

function getColonnes(vueReorg) {
  var nbColonnes = 0;
  var nomColonnes = [];
  vueReorg.forEach(objet => {
    if (Object.keys(objet).length > nbColonnes) {
      nbColonnes = Object.keys(objet).length;
    }
  })

  columnsHeadersList = Array.from(document.getElementsByClassName("footable-header"));
  columnsHeadersList.forEach(headerList => {
    Array.from(headerList.cells).forEach(function (columnTd, indexTd) {
      if (nomColonnes.indexOf(columnTd.outerText) < 0) { nomColonnes.splice(indexTd + 1, 0, columnTd.outerText) }
    });
  });
  return [nbColonnes, nomColonnes];
}

function triVueBrute(objet1, objet2) {
  const origine = getPositionTrolls();
  let objectTypes = ["monstres", "trolls", "tresors", "champignons", "lieux", "cenotaphes"];
  if (calculeDistance(objet1, origine) < calculeDistance(objet2, origine)) { return -1; }
  if (calculeDistance(objet1, origine) > calculeDistance(objet2, origine)) { return 1; }
  if (objet1.x < objet1.x ) { return -1; }
  if (objet1.x > objet2.x ) { return 1; }
  if (objet1.y < objet1.y ) { return -1; }
  if (objet1.y > objet2.y ) { return 1; }
  if (objet1.n < objet1.n ) { return -1; }
  if (objet1.n > objet2.n ) { return 1; }
  if (objectTypes.indexOf(objet1.type) < objectTypes.indexOf(objet2.type)) { return -1; }
  if (objectTypes.indexOf(objet1.type) > objectTypes.indexOf(objet2.type)) { return 1; }
  if (objet1.id < objet2.id) { return -1; }
  if (objet1.id > objet2.id) { return 1; }
  return 0;
}

function getConfig() {
  var config = {
    activeReorgChecked: (localStorage.getItem(numTroll + ".activeReorgChecked") ?? true),
    reorgMonstresChecked: (localStorage.getItem(numTroll + ".reorgMonstresChecked") ?? true),
    reorgTrollsChecked: (localStorage.getItem(numTroll + ".reorgTrollsChecked") ?? true),
    reorgTresorsChecked: (localStorage.getItem(numTroll + ".reorgTresorsChecked") ?? true),
    reorgChampignonsChecked: (localStorage.getItem(numTroll + ".reorgChampignonsChecked") ?? true),
    reorgLieuxChecked: (localStorage.getItem(numTroll + ".reorgLieuxChecked") ?? true),
    reorgCenotaphesChecked: (localStorage.getItem(numTroll + ".reorgCenotaphesChecked") ?? true),
    distanceReorgMonstres: (localStorage.getItem(numTroll + ".distanceReorgMonstres") ?? 5),
    distanceReorgTrolls: (localStorage.getItem(numTroll + ".distanceReorgTrolls") ?? 5),
    distanceReorgTresors: (localStorage.getItem(numTroll + ".distanceReorgTresors") ?? 5),
    distanceReorgChampignons: (localStorage.getItem(numTroll + ".distanceReorgChampignons") ?? 5),
    distanceReorgLieux: (localStorage.getItem(numTroll + ".distanceReorgLieux") ?? 5),
    distanceReorgCenotaphes: (localStorage.getItem(numTroll + ".distanceReorgCenotaphes") ?? 5)
  }
  return config;
}

function setConfig(config) {
  for (const [key, value] of Object.entries(config)) {
    localStorage.setItem(numTroll + "." + key, value);
  };
}

function updateConfig() {
  var config = {
    activeReorgChecked: document.getElementById("reorgApply").checked,
    reorgMonstresChecked: document.getElementById("reorgApplyMonstres").checked,
    reorgTrollsChecked: document.getElementById("reorgApplyTrolls").checked,
    reorgTresorsChecked: document.getElementById("reorgApplyTresors").checked,
    reorgChampignonsChecked: document.getElementById("reorgApplyChampignons").checked,
    reorgLieuxChecked: document.getElementById("reorgApplyLieux").checked,
    reorgCenotaphesChecked: document.getElementById("reorgApplyCenotaphes").checked,
    distanceReorgMonstres: document.getElementById("reorgApplyMonstresLength").value,
    distanceReorgTrolls: document.getElementById("reorgApplyTrollsLength").value,
    distanceReorgTresors: document.getElementById("reorgApplyTresorsLength").value,
    distanceReorgChampignons: document.getElementById("reorgApplyChampignonsLength").value,
    distanceReorgLieux: document.getElementById("reorgApplyLieuxLength").value,
    distanceReorgCenotaphes: document.getElementById("reorgApplyCenotaphesLength").value
  }
  setConfig(config);
  goReorg();
}

function addConfigTable() {
  var config = getConfig();
  console.log(config);

  var entryPoint = document.getElementById("infoTab");
  var insertDiv = document.createElement('div');
  insertDiv.id = 'configTableDiv';

  var reorgConfigTable = document.createElement('table');
  var reorgConfigTr = document.createElement('tr');
  reorgConfigTr.class = 'mh_tdpage';
  // activation ou non de la reorg
  var reorgApplyTd = document.createElement('td');
  reorgApplyTd.style = "display: table-cell;";

  var reorgApplyLabel = document.createElement('label');
  reorgApplyLabel.textContent = 'Activer la reorg';
  reorgApplyTd.append(reorgApplyLabel);

  var reorgApplyCheckBox = document.createElement('input');
  reorgApplyCheckBox.type = 'checkbox';
  reorgApplyCheckBox.id = 'reorgApply';
  reorgApplyCheckBox.name = 'reorgApply';
  reorgApplyCheckBox.value = 'reorgApply';
  reorgApplyCheckBox.checked = (config["activeReorgChecked"] == "true");
  reorgApplyTd.append(reorgApplyCheckBox);

  reorgConfigTr.append(reorgApplyTd);

  // distance et activation ou non de la reorg aux monstres
  var reorgApplyMonstresTd = document.createElement('td');

  var reorgApplyMonstresLabel = document.createElement('label');
  reorgApplyMonstresLabel.textContent = 'Monstres';
  reorgApplyMonstresTd.append(reorgApplyMonstresLabel);

  var reorgApplyMonstresCheckBox = document.createElement('input');
  reorgApplyMonstresCheckBox.type = 'checkbox';
  reorgApplyMonstresCheckBox.id = 'reorgApplyMonstres';
  reorgApplyMonstresCheckBox.name = 'reorgApplyMonstres';
  reorgApplyMonstresCheckBox.value = 'reorgApplyMonstres';
  reorgApplyMonstresCheckBox.checked = (config["reorgMonstresChecked"] == "true");
  reorgApplyMonstresTd.append(reorgApplyMonstresCheckBox);

  var reorgApplyMonstresLength = document.createElement('input');
  reorgApplyMonstresLength.type = 'text';
  reorgApplyMonstresLength.id = 'reorgApplyMonstresLength';
  reorgApplyMonstresLength.name = 'reorgApplyMonstresLength';
  reorgApplyMonstresLength.size = 3;
  reorgApplyMonstresLength.length = 3;
  reorgApplyMonstresLength.value = isNaN(config["distanceReorgMonstres"]) ? 5 : config["distanceReorgMonstres"];
  reorgApplyMonstresTd.append(reorgApplyMonstresLength);

  reorgConfigTr.append(reorgApplyMonstresTd);

  // distance et activation ou non de la reorg aux trolls 
  var reorgApplyTrollsTd = document.createElement('td');

  var reorgApplyTrollsLabel = document.createElement('label');
  reorgApplyTrollsLabel.textContent = 'Trolls';
  reorgApplyTrollsTd.append(reorgApplyTrollsLabel);

  var reorgApplyTrollsCheckBox = document.createElement('input');
  reorgApplyTrollsCheckBox.type = 'checkbox';
  reorgApplyTrollsCheckBox.id = 'reorgApplyTrolls';
  reorgApplyTrollsCheckBox.name = 'reorgApplyTrolls';
  reorgApplyTrollsCheckBox.value = 'reorgApplyTrolls';
  reorgApplyTrollsCheckBox.checked = (config["reorgTrollsChecked"] == "true");
  reorgApplyTrollsTd.append(reorgApplyTrollsCheckBox);

  var reorgApplyTrollsLength = document.createElement('input');
  reorgApplyTrollsLength.type = 'text';
  reorgApplyTrollsLength.id = 'reorgApplyTrollsLength';
  reorgApplyTrollsLength.name = 'reorgApplyTrollsLength';
  reorgApplyTrollsLength.size = 3;
  reorgApplyTrollsLength.length = 3;
  reorgApplyTrollsLength.value = isNaN(config["distanceReorgTrolls"]) ? 5 : config["distanceReorgTrolls"];
  reorgApplyTrollsTd.append(reorgApplyTrollsLength);

  reorgConfigTr.append(reorgApplyTrollsTd);

  // distance et activation ou non de la reorg aux tresors 
  var reorgApplyTresorsTd = document.createElement('td');

  var reorgApplyTresorsLabel = document.createElement('label');
  reorgApplyTresorsLabel.textContent = 'Tresors';
  reorgApplyTresorsTd.append(reorgApplyTresorsLabel);

  var reorgApplyTresorsCheckBox = document.createElement('input');
  reorgApplyTresorsCheckBox.type = 'checkbox';
  reorgApplyTresorsCheckBox.id = 'reorgApplyTresors';
  reorgApplyTresorsCheckBox.name = 'reorgApplyTresors';
  reorgApplyTresorsCheckBox.value = 'reorgApplyTresors';
  reorgApplyTresorsCheckBox.checked = (config["reorgTresorsChecked"] == "true");
  reorgApplyTresorsTd.append(reorgApplyTresorsCheckBox);

  var reorgApplyTresorsLength = document.createElement('input');
  reorgApplyTresorsLength.type = 'text';
  reorgApplyTresorsLength.id = 'reorgApplyTresorsLength';
  reorgApplyTresorsLength.name = 'reorgApplyTresorsLength';
  reorgApplyTresorsLength.size = 3;
  reorgApplyTresorsLength.length = 3;
  reorgApplyTresorsLength.value = isNaN(config["distanceReorgTresors"]) ? 5 : config["distanceReorgTresors"];
  reorgApplyTresorsTd.append(reorgApplyTresorsLength);

  reorgConfigTr.append(reorgApplyTresorsTd);

  // distance et activation ou non de la reorg aux champignons 
  var reorgApplyChampignonsTd = document.createElement('td');

  var reorgApplyChampignonsLabel = document.createElement('label');
  reorgApplyChampignonsLabel.textContent = 'Champignons';
  reorgApplyChampignonsTd.append(reorgApplyChampignonsLabel);

  var reorgApplyChampignonsCheckBox = document.createElement('input');
  reorgApplyChampignonsCheckBox.type = 'checkbox';
  reorgApplyChampignonsCheckBox.id = 'reorgApplyChampignons';
  reorgApplyChampignonsCheckBox.name = 'reorgApplyChampignons';
  reorgApplyChampignonsCheckBox.value = 'reorgApplyChampignons';
  reorgApplyChampignonsCheckBox.checked = (config["reorgChampignonsChecked"] == "true");
  reorgApplyChampignonsTd.append(reorgApplyChampignonsCheckBox);

  var reorgApplyChampignonsLength = document.createElement('input');
  reorgApplyChampignonsLength.type = 'text';
  reorgApplyChampignonsLength.id = 'reorgApplyChampignonsLength';
  reorgApplyChampignonsLength.name = 'reorgApplyChampignonsLength';
  reorgApplyChampignonsLength.size = 3;
  reorgApplyChampignonsLength.length = 3;
  reorgApplyChampignonsLength.value = isNaN(config["distanceReorgChampignons"]) ? 5 : config["distanceReorgChampignons"];
  reorgApplyChampignonsTd.append(reorgApplyChampignonsLength);

  reorgConfigTr.append(reorgApplyChampignonsTd);

  // distance et activation ou non de la reorg aux lieux 
  var reorgApplyLieuxTd = document.createElement('td');

  var reorgApplyLieuxLabel = document.createElement('label');
  reorgApplyLieuxLabel.textContent = 'Lieux';
  reorgApplyLieuxTd.append(reorgApplyLieuxLabel);

  var reorgApplyLieuxCheckBox = document.createElement('input');
  reorgApplyLieuxCheckBox.type = 'checkbox';
  reorgApplyLieuxCheckBox.id = 'reorgApplyLieux';
  reorgApplyLieuxCheckBox.name = 'reorgApplyLieux';
  reorgApplyLieuxCheckBox.value = 'reorgApplyLieux';
  reorgApplyLieuxCheckBox.checked = (config["reorgLieuxChecked"] == "true");
  reorgApplyLieuxTd.append(reorgApplyLieuxCheckBox);

  var reorgApplyLieuxLength = document.createElement('input');
  reorgApplyLieuxLength.type = 'text';
  reorgApplyLieuxLength.id = 'reorgApplyLieuxLength';
  reorgApplyLieuxLength.name = 'reorgApplyLieuxLength';
  reorgApplyLieuxLength.size = 3;
  reorgApplyLieuxLength.length = 3;
  reorgApplyLieuxLength.value = isNaN(config["distanceReorgLieux"]) ? 5 : config["distanceReorgLieux"];
  reorgApplyLieuxTd.append(reorgApplyLieuxLength);

  reorgConfigTr.append(reorgApplyLieuxTd);

  // distance et activation ou non de la reorg aux cenotaphes 
  var reorgApplyCenotaphesTd = document.createElement('td');

  var reorgApplyCenotaphesLabel = document.createElement('label');
  reorgApplyCenotaphesLabel.textContent = 'Cenotasphes';
  reorgApplyCenotaphesTd.append(reorgApplyCenotaphesLabel);

  var reorgApplyCenotaphesCheckBox = document.createElement('input');
  reorgApplyCenotaphesCheckBox.type = 'checkbox';
  reorgApplyCenotaphesCheckBox.id = 'reorgApplyCenotaphes';
  reorgApplyCenotaphesCheckBox.name = 'reorgApplyCenotaphes';
  reorgApplyCenotaphesCheckBox.value = 'reorgApplyCenotaphes';
  reorgApplyCenotaphesCheckBox.checked = (config["reorgCenotaphesChecked"] == "true");
  reorgApplyCenotaphesTd.append(reorgApplyCenotaphesCheckBox);

  var reorgApplyCenotaphesLength = document.createElement('input');
  reorgApplyCenotaphesLength.type = 'text';
  reorgApplyCenotaphesLength.id = 'reorgApplyCenotaphesLength';
  reorgApplyCenotaphesLength.name = 'reorgApplyCenotaphesLength';
  reorgApplyCenotaphesLength.size = 3;
  reorgApplyCenotaphesLength.length = 3;
  reorgApplyCenotaphesLength.value = isNaN(config["distanceReorgCenotaphes"]) ? 5 : config["distanceReorgCenotaphes"];
  reorgApplyCenotaphesTd.append(reorgApplyCenotaphesLength);

  reorgConfigTr.append(reorgApplyCenotaphesTd);

  // et le submit
  var reorgApplySubmitTd = document.createElement('td');
  reorgButtonSubmit = document.createElement("button")
  reorgButtonSubmit.id = "reorgSubmit";
  reorgButtonSubmit.name = "Appliquer";
  reorgButtonSubmit.value = "Appliquer";
  reorgButtonSubmit.textContent = "Appliquer";
  reorgButtonSubmit.addEventListener("click", updateConfig);

  reorgApplySubmitTd.append(reorgButtonSubmit);

  reorgConfigTr.append(reorgApplySubmitTd);

  reorgConfigTable.append(reorgConfigTr);
  insertDiv.append(reorgConfigTable);

  entryPoint.after(insertDiv);
}

function addVueReorg(vueTriee) {



  [nbColonnes, colonnesArray] = getColonnes(vueTriee);

  const translateColumns = {
    "Dist.": "dist",
    "X": "x",
    "Y": "y",
    "N": "n",
    "Nom": "nom",
    "Actions": "action",
    "Ref.": "id",
    "Type": "type",
    "Guilde": "guilde",
    "Niv": "niv"
  };

  var entryPoint = document.getElementById("configTableDiv");


  var reorgTable = document.createElement('table');
  var reorgTitlesTr = document.createElement('tr');

  colonnesArray.forEach(nomColonne => {
    colonneTd = document.createElement('td');
    var titreTexte = document.createTextNode(nomColonne);
    colonneTd.append(titreTexte);
    reorgTitlesTr.append(colonneTd);

  });

  reorgTable.append(reorgTitlesTr);

  vueTriee.forEach(elementVue => {
    elementTr = document.createElement('tr');
    colonnesArray.forEach(nomColonne => {
      elementTd = document.createElement('td');
      var elementValue = elementVue[translateColumns[nomColonne.normalize("NFD").replace(/[\u0300-\u036f]/g, "")]] ?? "";
      const elementContent = elementValue.value ?? elementValue;

      elementTd.insertAdjacentHTML('beforeend', elementContent);
      elementTr.append(elementTd);
    });
    reorgTable.append(elementTr);
  });

  insertReorgDiv.append(reorgTable);
  entryPoint.after(insertReorgDiv);
}