// Written by James Baldwin for my Computer Science NEA Coursework. Started on 23/07/23. This file contains the setup information for the towers.

"use strict";

let towers = [];

let mapFilled = [ 
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    ];


const TOWER_PRICES = [100, 250, 400, 500, 750, 900, 1200, 1500];

let placeCancelButton, displayRangeButon;

let soldierButton, machineGunnerButton, rpgButton, ifvButton, tankButton, shoulderAntiAirButton, surfaceAirButton, advancedSurfaceAirButton;

let selectedTower;

let displayRange = false;

// Declares all the buttons the user click to place a specific type of tower.
function towerButtonsSetup() {
    placeCancelButton = createButton("Cancel");
    placeCancelButton.position(1640, 720);
    placeCancelButton.class("selectTowerButtonClass");
    placeCancelButton.mousePressed(placeCancelButtonFunction);

    soldierButton = createButton("Soldier <br> 💵100");
    soldierButton.position(1640, 300);
    soldierButton.class("towerButtonClass");
    soldierButton.mousePressed(() => towerButtonFunction(0));

    machineGunnerButton = createButton("Machine Gunner <br> 💵250");
    machineGunnerButton.position(1740, 300);
    machineGunnerButton.class("towerButtonClass");
    machineGunnerButton.mousePressed(() => towerButtonFunction(1));

    rpgButton = createButton("RPG <br> 💵400");
    rpgButton.position(1640, 400);
    rpgButton.class("towerButtonClass");
    rpgButton.mousePressed(() => towerButtonFunction(2));

    ifvButton = createButton("IFV <br> 💵500");
    ifvButton.position(1740, 400);
    ifvButton.class("towerButtonClass");
    ifvButton.mousePressed(() => towerButtonFunction(3));

    tankButton = createButton("Tank <br> 💵750");
    tankButton.position(1640, 500);
    tankButton.class("towerButtonClass");
    tankButton.mousePressed(() => towerButtonFunction(4));

    shoulderAntiAirButton = createButton("MANPADS <br> 💵900");
    shoulderAntiAirButton.position(1740, 500);
    shoulderAntiAirButton.class("towerButtonClass");
    shoulderAntiAirButton.mousePressed(() => towerButtonFunction(5));

    surfaceAirButton = createButton("Surface to Air Missile <br> 💵1200");
    surfaceAirButton.position(1640, 600);
    surfaceAirButton.class("towerButtonClass");
    surfaceAirButton.mousePressed(() => towerButtonFunction(6));

    advancedSurfaceAirButton = createButton("Advanced Surface to Air Missile <br> 💵1500");
    advancedSurfaceAirButton.position(1740, 600);
    advancedSurfaceAirButton.class("towerButtonClass");
    advancedSurfaceAirButton.mousePressed(() => towerButtonFunction(7));

    displayRangeButon = createButton("Toggle tower ranges");
    displayRangeButon.position(1640, 780);
    displayRangeButon.class("towerRangeSpecialAbility");
    displayRangeButon.mousePressed(displayRangeButtonFunction);
}

// Place's a tower at the x and y the user clicks.
function placeTowerFunction() {
    if (towerPlace && mouseIsPressed && mouseX >= MAP_TILE_X[0] && mouseX <= MAP_TILE_X[17] && mouseY >= MAP_TILE_Y[0] && mouseY <= MAP_TILE_Y[9] 
        && playerCash >= TOWER_PRICES[selectedTower]) {
        let tileX = Math.floor(mouseX / CELL_SIZE);
        let tileY = Math.floor(mouseY / CELL_SIZE);
        if (mapFilled[tileX][tileY] == 0) {
            switch(selectedTower) {
                case 0:
                    towers.push(new towerBasic(MAP_TILE_X[tileX], MAP_TILE_Y[tileY], "red", 0, 200, 2, 0.2)); // Soldier.
                    break;

                case 1:
                    towers.push(new towerBasic(MAP_TILE_X[tileX], MAP_TILE_Y[tileY], "yellow", 1, 220, 2, 0.2)); // Machine gunner.
                    break;

                case 2:
                    towers.push(new towerBasic(MAP_TILE_X[tileX], MAP_TILE_Y[tileY], "gray", 2, 240, 3, 0.19)); // RPG.
                    break;
                
                case 3:
                    towers.push(new towerBasic(MAP_TILE_X[tileX], MAP_TILE_Y[tileY], "blue", 3, 260, 3, 0.23)); // IFV.
                    break;

                case 4:
                    towers.push(new towerBasic(MAP_TILE_X[tileX], MAP_TILE_Y[tileY], "green", 4, 280, 4, 0.24)); // Tank.
                    break;

                case 5:
                    towers.push(new towerBasic(MAP_TILE_X[tileX], MAP_TILE_Y[tileY], "orange", 5, 300, 4, 0.25)); // MANPADS.
                    break;

                case 6:
                    towers.push(new towerBasic(MAP_TILE_X[tileX], MAP_TILE_Y[tileY], "purple", 6, 320, 5, 0.26)); // Surface Air Missile.
                    break;

                case 7:
                    towers.push(new towerBasic(MAP_TILE_X[tileX], MAP_TILE_Y[tileY], "black", 7, 340, 6, 0.27)); // Advanced Surface Air Missile.
                    break;
            }
            playerCash -= TOWER_PRICES[selectedTower];
            towerPlace = false;
            mapFilled[tileX][tileY] = 1;
            placeCancelButtonDisplay(false);
            changeTowerColour(false, 0);
        }
    }
}

// Function called if the user cancels the tower place.
function placeCancelButtonFunction() {
    towerPlace = false;
    changeTowerColour(false, 0)
    placeCancelButtonDisplay(false);
}

// Show or hides the tower place buttons depending on the input.
function towerButtonDisplay(display) {
    if (display) {
        soldierButton.show();
        machineGunnerButton.show();
        rpgButton.show();
        ifvButton.show();
        tankButton.show();
        shoulderAntiAirButton.show();
        surfaceAirButton.show();
        advancedSurfaceAirButton.show();

    } else {
        soldierButton.hide();
        machineGunnerButton.hide();
        rpgButton.hide();
        ifvButton.hide();
        tankButton.hide();
        shoulderAntiAirButton.hide();
        surfaceAirButton.hide();
        advancedSurfaceAirButton.hide();
    }
}

// Shows or hides the tower place cancel button depending on the input.
function placeCancelButtonDisplay(display) {
    if (display) {
        placeCancelButton.show();
    } else {
        placeCancelButton.hide();
    }
}

// Shows or hides the toggle tower range button depending on the input.
function displayRangeButtonDisplay(display) {
    if (display) {
        displayRangeButon.show();
    } else {
        displayRangeButon.hide();
    }
}

// Function called when one of the tower buttons is clicked to select that tower to be placed.
function towerButtonFunction(tower) {
    towerButtonDisplay(false);
    placeCancelButtonDisplay(true);
    changeTowerColour(false, 0);
    towerPlace = true;
    selectedTower = tower;
    changeTowerColour(true, tower);
}

// Function called when the toggle tower range button is clicked.
function displayRangeButtonFunction() {
    if (displayRange || towers.length == 0) {
        displayRange = false;
    } else {
        displayRange = true;
    }
}

//Updates each of the towers the user has placed.
function towerUpdate() {
    for (let tower of towers) {
        tower.update();
    }
}

// Changes the colour of the button the user is currently clicking
function changeTowerColour(change, tower) {
    if (change) {
        switch (tower) {
            case 0:
                soldierButton.style("background-color", "green");
                break;

            case 1:
                machineGunnerButton.style("background-color", "green");
                break;
            
            case 2:
                rpgButton.style("background-color", "green");
                break;

            case 3:
                ifvButton.style("background-color", "green");
                break;

            case 4:
                tankButton.style("background-color", "green");
                break;

            case 5:
                shoulderAntiAirButton.style("background-color", "green");
                break;
            
            case 6:
                surfaceAirButton.style("background-color", "green");
                break;

            case 7:
                advancedSurfaceAirButton.style("background-color", "green");
                break;

            case 8:
                specialAbilityButton.style("background-color", "green");
                break;
                
            case 9:
                specialAbilityButton.style("background-color", "lightgrey");
                break;

            case 10:
                specialAbilityButton.style("background-color", "#3fcaca");
                break;
        }
    } else {
        soldierButton.style("background-color", "#3fcaca");
        machineGunnerButton.style("background-color", "#3fcaca");
        rpgButton.style("background-color", "#3fcaca");
        ifvButton.style("background-color", "#3fcaca");
        tankButton.style("background-color", "#3fcaca");
        shoulderAntiAirButton.style("background-color", "#3fcaca");
        surfaceAirButton.style("background-color", "#3fcaca");
        advancedSurfaceAirButton.style("background-color", "#3fcaca");
    }
}