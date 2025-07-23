// Written by James Baldwin for my Computer Science NEA Coursework. Started on 17/11/23. This file contains the setup information for the special abilities.

"use strict";

let specialAbilityButton;

let allowAbility = true;

let placeTrap = false;
const TRAP = {
    posX : 0,
    posY : 0,
    placed : false
};
let trapFrameCount = 0;

let specialForces = [];
let specialForcesFrameCount = 0;

let airStrikeFrameCount = 0;
let airstrikeCheck = false;
let airstrikeX = 0, airstrikeY = 0;
let airstrikeCheckCoordCheck = false;

// Sets up the button to call the special ability.
function specialAbilityButtonSetup() {
    specialAbilityButton = createButton(" ");
    specialAbilityButton.position(1750, 780);
    specialAbilityButton.class("towerRangeSpecialAbility");
    specialAbilityButton.mousePressed(() => specialAbilityButtonFunction(chosenMapInt));
}

// Shows or hides the special ability buttons depending on the input.
function specialAbilityButtonDisplay(display) {
    if (display) {
        specialAbilityButton.show();
    } else {
        specialAbilityButton.hide();
    }
}

// Function called when the special ability button is clicked.
function specialAbilityButtonFunction(map) {
    if(map == 0 && allowAbility) {
        changeTowerColour(true, 8);
        vietnamSpecialAbility();
    } else if (map == 1 && allowAbility) {
        changeTowerColour(true, 8);
        stalingradSpecialAbility();
    } else if (map == 2 && allowAbility) {
        changeTowerColour(true, 8);
        gulfWarSpecialAbility();
    }
}

// The special ability for the Vietnam Map.
function vietnamSpecialAbility() {
    placeTrap = true;
}

// Places the trap.
function showTrap() {
   if (placeTrap && allowAbility && mouseIsPressed && mouseX >= MAP_TILE_X[0] && mouseX <= MAP_TILE_X[17] && mouseY >= MAP_TILE_Y[0] && mouseY <= MAP_TILE_Y[9]) {
        let tileX = Math.floor(mouseX / CELL_SIZE);
        let tileY = Math.floor(mouseY / CELL_SIZE);
        if (chosenMap[tileX][tileY] == 1) {
            TRAP.placed = true;
            TRAP.posX = Math.floor(mouseX / CELL_SIZE);
            TRAP.posY = Math.floor(mouseY / CELL_SIZE);
            trapFrameCount = frameCount;
            changeTowerColour(true, 9);
            placeTrap = false;
        }
    }

    if(TRAP.placed) {
        drawTrap();
    }
}

// Uses the trap.
function trapFunction() {
    if (TRAP.placed && allowAbility) {
        for (let i = 0; i < 10; i++){
            for (let j = enemies[i].head; j < enemies[i].tail; j++) {
                let enemyX = Math.floor(enemies[i].queue[j].posX/CELL_SIZE);
                let enemyY = Math.floor(enemies[i].queue[j].posY/CELL_SIZE);
                if(enemyX - TRAP.posX == 0 && enemyY - TRAP.posY == 0) {
                    enemies[i].queue[j].speed = 0;
                }
            }
        }
    }

    if (TRAP.placed && allowAbility && frameCount - trapFrameCount > 300) {
        TRAP.placed = false;
        allowAbility = false;
    }
}

// Displays the trap on screen
function drawTrap() {
    for(let i = 0; i < 88; i+=22) {
        for(let j = 0; j < 88; j+=22) {
            fill("gray");
            circle(TRAP.posX*CELL_SIZE + 15 + i, TRAP.posY*CELL_SIZE + 15 + j, 20);
            fill(3, 38, 11);
            circle(TRAP.posX*CELL_SIZE + 15 + i, TRAP.posY*CELL_SIZE + 15 + j, 10);
        }
    }
}

// The special ability for the Stalingrad map.
function stalingradSpecialAbility() {
    towerPlace = true;
}

// Places the special forces.
function showSpecialForces() {
    if (towerPlace && allowAbility && mouseIsPressed && mouseX >= MAP_TILE_X[0] && mouseX <= MAP_TILE_X[17] && mouseY >= MAP_TILE_Y[0] && mouseY <= MAP_TILE_Y[9]) {
        let tileX = Math.floor(mouseX / CELL_SIZE);
        let tileY = Math.floor(mouseY / CELL_SIZE);
        if (mapFilled[tileX][tileY] == 0) {
            specialForces[0] = new towerBasic(MAP_TILE_X[tileX], MAP_TILE_Y[tileY], "black", 8, 240, 2, 0.2);
            specialForces[1] = new towerBasic(MAP_TILE_X[tileX] + 20, MAP_TILE_Y[tileY] + 20, "black", 8, 240, 2, 0.2);
            specialForces[2] = new towerBasic(MAP_TILE_X[tileX] + 20, MAP_TILE_Y[tileY] - 20, "black", 8, 240, 2, 0.2);
            specialForces[3] = new towerBasic(MAP_TILE_X[tileX] - 20, MAP_TILE_Y[tileY] + 20, "black", 8, 240, 2, 0.2);
            specialForces[4] = new towerBasic(MAP_TILE_X[tileX] - 20, MAP_TILE_Y[tileY] - 20, "black", 8, 240, 2, 0.2);
            allowAbility = false;
            changeTowerColour(true, 9);
            towerPlace = false;
            mapFilled[tileX][tileY] = 1;
            specialForcesFrameCount = frameCount;
        }
    }

    if (specialForces.length > 0 && frameCount - specialForcesFrameCount > 900) {
        let x = specialForces[0].posX / CELL_SIZE;
        let y = specialForces[0].posY / CELL_SIZE;
        mapFilled[x][y] = 0;
        specialForces.length = 0;
    }
}

// Displays the special forces once placed.
function specialForcesUpdate() {
    for (let tower of specialForces) {
        tower.update();
    }
}

// The special ability for the Gulf War map.
function gulfWarSpecialAbility(){
    if (allowAbility && mouseIsPressed && mouseX >= MAP_TILE_X[0] && mouseX <= MAP_TILE_X[17] && mouseY >= MAP_TILE_Y[0] && mouseY <= MAP_TILE_Y[9] ) {
        let tileX = Math.floor(mouseX / CELL_SIZE);
        let tileY = Math.floor(mouseY / CELL_SIZE);

        for (let i = 0; i < 10; i++){
            for (let j = enemies[i].head; j < enemies[i].tail; j++) {
                let enemyX = Math.floor(enemies[i].queue[j].posX/CELL_SIZE);
                let enemyY = Math.floor(enemies[i].queue[j].posY/CELL_SIZE);

                if(Math.abs(enemyX - tileX) < 2 && Math.abs(enemyY - tileY) < 2) {
                    airStrikeFrameCount = frameCount;
                    airstrikeCheck = true;
                    enemies[i].queue[j].health -= 600;
                    allowAbility = false;
                    changeTowerColour(true, 9);
                }
            }
        }
    }
}

// Displays an explosion on the screen.
function showAirstrike() {
    if(frameCount - airStrikeFrameCount < 100 && airstrikeCheck && !(airstrikeCheckCoordCheck)) {
        airstrikeX = mouseX;
        airstrikeY = mouseY;
        airstrikeCheckCoordCheck = true;
        fill("orange");
        circle(airstrikeX + 10, airstrikeY + 10, 60);
        circle(airstrikeX - 10, airstrikeY - 10, 80);
        circle(airstrikeX + 30, airstrikeY + 30, 40);
        circle(airstrikeX, airstrikeY, 50);
        fill("red");
        circle(airstrikeX + 15, airstrikeY + 10, 30);
        circle(airstrikeX - 10, airstrikeY - 10, 60);
        circle(airstrikeX - 65, airstrikeY + 25, 30);
        circle(airstrikeX - 45, airstrikeY + 45, 30);
        circle(airstrikeX, airstrikeY, 30);
        fill("yellow");
        circle(airstrikeX + 5, airstrikeY + 20, 50);
        circle(airstrikeX + 20, airstrikeY - 40, 40);
        circle(airstrikeX - 45, airstrikeY - 35, 25);
        circle(airstrikeX - 20, airstrikeY + 30, 10);
    } else if(frameCount - airStrikeFrameCount < 100 && airstrikeCheck) {
        fill("orange");
        circle(airstrikeX + 10, airstrikeY + 10, 60);
        circle(airstrikeX - 10, airstrikeY - 10, 80);
        circle(airstrikeX + 30, airstrikeY + 30, 40);
        circle(airstrikeX, airstrikeY, 50);
        fill("red");
        circle(airstrikeX + 15, airstrikeY + 10, 30);
        circle(airstrikeX - 10, airstrikeY - 10, 60);
        circle(airstrikeX - 65, airstrikeY + 25, 30);
        circle(airstrikeX - 45, airstrikeY + 45, 30);
        circle(airstrikeX, airstrikeY, 30);
        fill("yellow");
        circle(airstrikeX + 5, airstrikeY + 20, 50);
        circle(airstrikeX + 20, airstrikeY - 40, 40);
        circle(airstrikeX - 45, airstrikeY - 35, 25);
        circle(airstrikeX - 20, airstrikeY + 30, 10);
    } else {
        airstrikeCheck = false;
        airStrikeFrameCount = 0;
    }
}

// Changes the text displayed on the special ability button depending on the map.
function returnSpecialAbilityName() {
    switch(chosenMapInt) {
        case 0:
            return "Place trap";
            break;
        
        case 1:
            return "Call special forces";
            break;

        case 2:
            return "Call an airstrike";
            break;
    }
}