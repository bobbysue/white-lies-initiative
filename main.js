currentRound = 0;
lastActorId = 0;

actors = [
  new Actor("Jo", 2, 1),
  new Actor("Beth", 0, 0),
  new Actor("Artemis", 2, 2),
  new Actor("Michael", 1, 1),
  new Actor("Big Bad", 1, 1),
  new Actor("Mooks", 0, 0)
];

window.onload=function() {
  for (var i = 0; i < actors.length; i++) {
    addActorToTable(actors[i], i)
  }
}

function d20() {
  return 1 + Math.floor(Math.random() * 20);
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
  console.log(presentActors);

  for (var i = 0; i < presentActors.length; i++) {
    if (table.rows.length <= i+1) {
      table.insertRow();
    }
    var row = table.rows[i+1];
    while(row.cells.length < currentRound) {
      row.insertCell();
    }
    row.cells[currentRound-1].innerHTML = presentActors[i].name + " (" + presentActors[i].roll + ")";
  }

  // Create empty cells past current actor list
  for (var i = presentActors.length; i < table.rows.length; i++) {
    console.log(i);
    var row = table.rows[i];
    while(row.cells.length < currentRound) {
      row.insertCell();
    }
  }
}

function addActor() {
  var name = document.getElementById("newName").value;
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
  console.log(actor);
  actors.push(actor);
  addActorToTable(actor);
}

function addActorToTable(actor) {
  var table = document.getElementById("actorTable");
  actor.column = table.rows[0].cells.length;
  var cell = table.rows[0].insertCell().innerHTML = actor.name;
  table.rows[1].insertCell().innerHTML = actor.initiative;
  table.rows[2].insertCell().innerHTML = actor.dexterity;
  var checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.id = actor.id + " present";
  actor.checkbox = checkbox;
  table.rows[3].insertCell().innerHTML = '<input type="checkbox" id="' + checkbox.id + '">';
  document.getElementById(checkbox.id).checked = true;
  var button = document.createElement('button');
  button.id = actor.id + " remove";
  table.rows[4].insertCell().innerHTML = '<button type="button" onclick="removeActor(' + actor.id + ')" id="' + button.id + '">Remove</button>';
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
