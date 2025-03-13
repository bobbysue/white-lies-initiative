currentRound = 0;
lastActorId = 0;
lastDamageTakerId = 0;

actors = [
  new Actor("Jo Spirit", 2, 1),
  new Actor("Jo Body", 5, 4),
  new Actor("Beth", 0, 0),
  new Actor("Artemis", 2, 1),
  new Actor("Michael", 1, 1),
  new Actor("Big Bad", 1, 1),
  new Actor("Mooks", 0, 0),
  new Actor("Allies", 0, 0)
];

damageTakers = [
  new DamageTaker("Big Bad", 30, 30),
  new DamageTaker("Mook 1", 15, 15)
];

window.onload=function() {
  for (var i = 0; i < actors.length; i++) {
    addActorToTable(actors[i])
  }
  for (i = 0; i < damageTakers.length; i++) {
    addDamageTakerToTable(damageTakers[i])
  }
}

function d20() {
  return 1 + Math.floor(Math.random() * 20);
}

function DamageTaker(name, HP, maxHP) {
  this.name = name;
  this.HP = HP;
  this.maxHP = maxHP;
  this.id = lastDamageTakerId;
  lastDamageTakerId += 1;
}

function Actor(name, initiative, dexterity) {
  this.name = name;
  this.initiative = initiative;
  this.dexterity = dexterity;
  this.id = lastActorId;
  lastActorId += 1;
}

function rollWithTiebreaker(actor) {
  return actor.roll * 10 + actor.dexterity + Math.random();
}

function addRound() {
  currentRound += 1;
  var table = document.getElementById("initiativeTable");
  table.rows[0].insertCell().innerHTML = "<b> Round " + currentRound + "</b";

  var presentActors = [];
  for (var i = 0; i < actors.length; i++) {
    if(document.getElementById(actors[i].checkbox.id).checked) {
      presentActors.push(actors[i]);
      actors[i].roll = d20() + actors[i].initiative;
    }
  }

  presentActors.sort(function(a, b) {
    return(rollWithTiebreaker(b) - rollWithTiebreaker(a));
  });

  for (var i = 0; i < presentActors.length; i++) {
    if (table.rows.length <= i+1) {
      table.insertRow();
    }
    var row = table.rows[i+1];
    while(row.cells.length < currentRound) {
      row.insertCell();
    }
    row.cells[currentRound-1].innerHTML = presentActors[i].name + " (" + presentActors[i].roll + ")";
    row.cells[currentRound-1].style.textAlign = "left";
  }

  // Create empty cells past current actor list
  for (var i = presentActors.length; i < table.rows.length; i++) {
    var row = table.rows[i];
    while(row.cells.length < currentRound) {
      row.insertCell();
    }
  }
}

function removeRound() {
  if (currentRound === 0) {
    return;
  }
  currentRound -= 1;
  var table = document.getElementById("initiativeTable");
  for (var i = 0; i < table.rows.length; i++) {
    table.rows[i].deleteCell(-1);
  }
}

function addActor() {
  var name = document.getElementById("newActorName").value;
  if (name === "") {
    name = "No name";
  }
  var initiative = parseInt(document.getElementById("newInitiative").value);
  if (isNaN(initiative)) {
    initiative = 0;
  }
  var dexterity = parseInt(document.getElementById("newDexterity").value);
    if (isNaN(dexterity)) {
    dexterity = 0;
  }
  var actor = new Actor(name, initiative, dexterity)
  actors.push(actor);
  addActorToTable(actor);
}

function addActorToTable(actor) {
  var table = document.getElementById("actorTable");
  actor.column = table.rows[0].cells.length;
  table.rows[0].insertCell().innerHTML = actor.name;
  table.rows[1].insertCell().innerHTML = actor.initiative;
  table.rows[2].insertCell().innerHTML = actor.dexterity;
  var checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.id = actor.id + " present";
  actor.checkbox = checkbox;
  table.rows[3].insertCell().innerHTML = '<input type="checkbox" id="' + checkbox.id + '">';
  document.getElementById(checkbox.id).checked = true;
  var button = document.createElement('button');
  button.id = actor.id + " remove actor";
  table.rows[4].insertCell().innerHTML = '<button type="button" onclick="removeActor(' + actor.id + ')" id="' + button.id + '">Remove</button>';
}

function addDamageTaker() {
  var name = document.getElementById("newDamageTakerName").value;
  if (name === "") {
    name = "No name";
  }

  var maxHP = parseInt(document.getElementById("newMaxHP").value);
  var HP = parseInt(document.getElementById("newHP").value);
  if (isNaN(maxHP) && isNaN(HP)) {
    maxHP = 0;
    HP = maxHP
  } else if (isNaN(HP)) {
    HP = maxHP;
  } else if (isNaN(maxHP)) {
    maxHP = HP
  }
  var damageTaker = new DamageTaker(name, HP, maxHP)
  damageTakers.push(damageTaker);
  addDamageTakerToTable(damageTaker);
}

function addDamageTakerToTable(damageTaker) {
  var table = document.getElementById("damageTable");
  table.insertRow()
  damageTaker.row = table.rows.length - 1;
  table.rows[damageTaker.row].insertCell().innerHTML = damageTaker.name;
  table.rows[damageTaker.row].insertCell().innerHTML = damageTaker.HP + ' / ' + damageTaker.maxHP;
  var HPText = document.createElement('text');
  HPText.id = damageTaker.id + " HP change";
  table.rows[damageTaker.row].insertCell().innerHTML = '<input type="text" id="' + HPText.id + '">';
  var damageButton = document.createElement('button');
  damageButton.id = damageTaker.id + " damage";
  table.rows[damageTaker.row].insertCell().innerHTML = '<button type="button" onclick="damage(' + damageTaker.id + ', false)" id="' + damageButton.id + '">Damage</button>';
  var healButton = document.createElement('button');
  healButton.id = damageTaker.id + " heal";
  table.rows[damageTaker.row].insertCell().innerHTML = '<button type="button" onclick="damage(' + damageTaker.id + ', true)" id="' + healButton.id + '">Heal</button>';
  var removeButton = document.createElement('button');
  removeButton.id = damageTaker.id + " remove damage taker";
  table.rows[damageTaker.row].insertCell().innerHTML = '<button type="button" onclick="removeDamageTaker(' + damageTaker.id + ', true)" id="' + removeButton.id + '">Remove</button>';
}

function damage(id, heal) {
  var damageTaker;
  for (var i = 0; i < damageTakers.length; i++) {
    if (damageTakers[i].id === id) {
      damageTaker = damageTakers[i];
      break;
    }
  }

  var table = document.getElementById("damageTable");
  var damage = parseInt(document.getElementById(damageTaker.id + " HP change").value);
  if (isNaN(damage)) {
    damage = 0;
  }
  if (heal) {
    damage = -damage;
  }
  damageTaker.HP -= damage;

  table.rows[damageTaker.row].cells[1].innerHTML = damageTaker.HP + ' / ' + damageTaker.maxHP;
}

function removeDamageTaker(id) {
  console.log(damageTakers);
  var removedDamageTaker;
  for (var i = 0; i < damageTakers.length; i++) {
    if (damageTakers[i].id === id) {
      removedDamageTaker = damageTakers[i];
      damageTakers.splice(i,1);
      break;
    }
  }
  var table = document.getElementById("damageTable");
  table.deleteRow(removedDamageTaker.row);

  for (var i = 0; i < damageTakers.length; i++) {
    if (damageTakers[i].row > removedDamageTaker.row) {
      damageTakers[i].row -= 1;
    }
  }
  console.log(damageTakers);
}

function removeActor(id) {
  var removedActor;
  for (var i = 0; i < actors.length; i++) {
    if (actors[i].id === id) {
      removedActor = actors[i];
      actors.splice(i,1);
      break;
    }
  }

  var table = document.getElementById("actorTable");
  for (var i = 0; i < table.rows.length; i++) {
    table.rows[i].deleteCell(removedActor.column);
  }

  for (var i = 0; i < actors.length; i++) {
    if (actors[i].column > removedActor.column) {
      actors[i].column -= 1;
    }
  }
}
