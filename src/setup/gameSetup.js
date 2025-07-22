// Written by James Baldwin for my Computer Science NEA Coursework. Started on 19/06/23. This file contains all the variables and functions needed to draw the map.

"use strict";

const CELL_SIZE = 96;
const MAP_HEIGHT = 864;
const MAP_WIDTH = 1632;

const MAP_TILE_X = [];
const MAP_TILE_Y = [];

// Fills the arrays declared above with the x and y posistions where each tile starts to make referencing them easier and clearer.
for (let i = 0; i < 18; i++) {
    MAP_TILE_X[i] = i * CELL_SIZE;
    if (i < 10) {
        MAP_TILE_Y[i] = i * CELL_SIZE;
    }
}

const MAP_VIETNAM = [
  [0,0,0,0,1,0,0,0,0],
  [0,3,3,0,1,1,1,0,0],
  [0,3,3,0,0,0,1,0,0],
  [0,0,0,0,0,0,1,0,0],
  [0,1,1,1,1,1,1,0,0],
  [0,1,0,0,0,0,0,0,0],
  [0,1,0,3,0,0,0,0,0],
  [0,1,0,3,0,1,1,1,0],
  [0,1,0,3,0,1,0,1,0],
  [0,1,0,3,0,1,0,1,0],
  [0,1,0,0,0,1,0,1,0],
  [0,1,1,1,1,1,0,1,0],
  [0,0,0,0,0,0,0,1,0],
  [0,0,0,0,0,0,0,1,0],
  [0,3,3,0,0,1,1,1,0],
  [0,3,3,0,0,1,0,0,0],
  [0,0,0,0,0,2,0,0,0],
];

const MAP_STALINGRAD = [
  [0,0,0,0,1,0,0,0,0],
  [0,0,0,0,1,0,3,3,3],
  [0,1,1,1,1,0,3,3,3],
  [0,1,0,0,0,0,3,3,3],
  [0,1,1,0,0,0,3,3,3],
  [0,0,1,0,0,0,3,3,3],
  [0,0,1,1,1,0,0,0,0],
  [0,0,0,0,1,0,0,0,0],
  [3,3,3,0,1,1,1,0,0],
  [0,0,0,0,0,0,1,0,0],
  [0,1,1,1,1,3,1,0,0],
  [0,1,0,0,1,3,1,0,0],
  [0,1,0,0,1,1,1,0,0],
  [0,1,0,0,0,0,0,0,3],
  [0,1,3,3,0,0,0,0,3],
  [0,1,1,1,1,1,0,0,3],
  [0,0,0,0,0,2,0,0,3],
];

const MAP_GULFWAR = [
  [0,0,0,0,1,0,3,3,3],
  [0,0,0,0,1,0,3,3,3],
  [0,0,0,0,1,0,0,0,0],
  [0,0,0,0,1,1,0,0,0],
  [0,0,0,0,0,1,0,0,0],
  [3,3,0,0,0,1,0,0,0],
  [0,0,0,1,1,1,0,0,0],
  [0,0,0,1,0,0,0,3,3],
  [3,0,0,1,0,0,0,0,0],
  [3,0,0,1,1,1,1,1,0],
  [3,0,0,0,0,3,3,1,0],
  [3,0,0,0,0,3,3,1,0],
  [0,0,1,1,1,1,1,1,0],
  [0,0,1,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,0,0],
  [0,0,1,1,1,1,0,0,0],
  [0,0,0,0,0,2,0,0,0],
];

const MAP_BLANK = [ 
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

let chosenMap = [ 
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


// Draws the map including the lines and filling in the tiles for the map.
function drawMap() {
  
  // Drawing the lines to create the tiles.
  stroke("black");
  for (let i = 0; i < MAP_WIDTH+CELL_SIZE; i+=CELL_SIZE) {
    line(i, 0, i, MAP_HEIGHT);
    if (i < MAP_HEIGHT+CELL_SIZE) {
        line(0, i, MAP_WIDTH, i);
    }
  }

  // Filling in the tiles needed.
  if (JSON.stringify(chosenMap)==JSON.stringify(MAP_VIETNAM)) {
    for (let i = 0; i < MAP_VIETNAM.length; i++) {
      for (let j = 0; j < MAP_VIETNAM[0].length; j++) {
        if (MAP_VIETNAM[i][j] == 0) {
          fill(3, 38, 11);
          rect(MAP_TILE_X[i], MAP_TILE_Y[j], CELL_SIZE, CELL_SIZE);

        } else if (MAP_VIETNAM[i][j] == 1) {
          fill(66, 66, 32);
          rect(MAP_TILE_X[i], MAP_TILE_Y[j], CELL_SIZE, CELL_SIZE);

        } else if (MAP_VIETNAM[i][j] == 2) {
          fill("black");
          rect(MAP_TILE_X[i], MAP_TILE_Y[j], CELL_SIZE, CELL_SIZE);

        } else if (MAP_VIETNAM[i][j] == 3) {
          fill(69, 69, 69);
          rect(MAP_TILE_X[i], MAP_TILE_Y[j], CELL_SIZE, CELL_SIZE);

        }
      }
    }

  } else if (JSON.stringify(chosenMap)==JSON.stringify(MAP_STALINGRAD)) {
    for (let i = 0; i < MAP_STALINGRAD.length; i++) {
      for (let j = 0; j < MAP_STALINGRAD[0].length; j++) {
        if (MAP_STALINGRAD[i][j] == 0) {
          fill(168, 168, 168);
          rect(MAP_TILE_X[i], MAP_TILE_Y[j], CELL_SIZE, CELL_SIZE);

        } else if (MAP_STALINGRAD[i][j] == 1) {
          fill(66, 66, 32);
          rect(MAP_TILE_X[i], MAP_TILE_Y[j], CELL_SIZE, CELL_SIZE);

        } else if (MAP_STALINGRAD[i][j] == 2) {
          fill("black");
          rect(MAP_TILE_X[i], MAP_TILE_Y[j], CELL_SIZE, CELL_SIZE);

        } else if (MAP_STALINGRAD[i][j] == 3) {
          fill(69, 69, 69);
          rect(MAP_TILE_X[i], MAP_TILE_Y[j], CELL_SIZE, CELL_SIZE);

        }
      }
    }

  } else if (JSON.stringify(chosenMap)==JSON.stringify(MAP_GULFWAR)) {
    for (let i = 0; i < MAP_GULFWAR.length; i++) {
      for( let j = 0; j < MAP_GULFWAR[0].length; j++) {
        if (MAP_GULFWAR[i][j] == 0) {
          fill(255, 255, 111);
          rect(MAP_TILE_X[i], MAP_TILE_Y[j], CELL_SIZE, CELL_SIZE);

        } else if (MAP_GULFWAR[i][j] == 1) {
          fill(66, 66, 32);
          rect(MAP_TILE_X[i], MAP_TILE_Y[j], CELL_SIZE, CELL_SIZE);

        } else if (MAP_GULFWAR[i][j] == 2) {
          fill("black");
          rect(MAP_TILE_X[i], MAP_TILE_Y[j], CELL_SIZE, CELL_SIZE);

        } else if (MAP_GULFWAR[i][j] == 3) {
          fill(36, 162, 22);
          rect(MAP_TILE_X[i], MAP_TILE_Y[j], CELL_SIZE, CELL_SIZE);

        }
      }
    }
  }

  // If the user wishes to place a tower, this screen is displayed on top of the map.
  if (towerPlace) {
    let colourFill;
    for (let i = 0; i < mapFilled.length; i++) {
      for (let j = 0; j < mapFilled[0].length; j++) {
        if (mapFilled[i][j] == 0) {
          colourFill = color(67, 198, 11, 97);
        } else {
          colourFill = color(212, 0, 0, 98);
        }
        fill(colourFill);
        rect(MAP_TILE_X[i], MAP_TILE_Y[j], CELL_SIZE, CELL_SIZE);
      }
    }
  }

  if(chosenMapInt == 2) {
    gulfWarSpecialAbility();
  }
}

// Displays the user score, cash and battle medals.
function displayInformation() {
  fill("black");
  textSize(25);
  text("🔢Score: " + playerScore, 1640, 100);
  text("💵Cash: " + playerCash, 1640, 140);
  text("🎖️Medals: " + playerBattleMedals, 1640, 180);
}

// Displays the base health as a gradient and ends the game if the health is zero.
function displayBaseHealth(health, max) {
  text("❤️Base Health:", 1640, 220);

  let percentage = health/max; // Percentage of original health remaining.
  let start = color(255, 0, 0);
  let end = color(0, 255, 0);
  let gradientColour = lerpColor(start, end, percentage); // Colours the health bar a percentage between red and green depending on the health remaining.
  let barWidth = map(percentage, 0, 1, 0, 205); // Makes the size of the health bar proportional to the health remaining.

  stroke("black");
  rect(1640, 230, 205, 30);

  if (health > 0) {
    fill(gradientColour);
    noStroke();
    rect(1640, 230, barWidth, 30);
  }
}

let vietnamMapButton, stalingradMapButton, gulfwarMapButton;

let vietnamMapImage, stalingradMapImage, gulfwarMapImage;

// Declares all the buttons which control the map selection.
function mapButtonsSetup() {
  vietnamMapButton = createButton("Vietnam");
  vietnamMapButton.position(200, 550);
  vietnamMapButton.class("mainMenuButtonClass");
  vietnamMapButton.mousePressed(vietnamMapButtonFunction);

  stalingradMapButton = createButton("Stalingrad");
  stalingradMapButton.position(700, 550);
  stalingradMapButton.class("mainMenuButtonClass");
  stalingradMapButton.mousePressed(stalingradMapButtonFunction);

  gulfwarMapButton = createButton("Gulf War");
  gulfwarMapButton.position(1200, 550);
  gulfwarMapButton.class("mainMenuButtonClass");
  gulfwarMapButton.mousePressed(gulfwarMapButtonFunction);
}

// Toggles the map selection buttons on and off depending on the input.
function mapButtonsDisplay(display) {
  if (display == true) {
    textSize(30);
    fill("black");
    text("Choose your map:", 770, 100);
    vietnamMapButton.show();
    stalingradMapButton.show();
    gulfwarMapButton.show();
    image(vietnamMapImage, 200, 200, 400, 300);
    image(stalingradMapImage, 700, 200, 400, 300);
    image(gulfwarMapImage, 1200 , 200, 400, 300);
  } else if (display == false) {
    vietnamMapButton.hide();
    stalingradMapButton.hide();
    gulfwarMapButton.hide();
  }
}

// When the Vietnam themed map is clicked in the menu, this is changed to the users chosen map.
function vietnamMapButtonFunction() {
  chosenMap = MAP_VIETNAM;
  chosenMapInt = 0;

  for (let i = 0; i < mapFilled.length; i++) {
    for (let j = 0; j < mapFilled[0].length; j++) {
      if (chosenMap[i][j] == 1 || chosenMap[i][j] == 2 || chosenMap[i][j] == 3) {
        mapFilled[i][j] = 1;
      } 
    }
  }
}

// When the Stalingrad themed map is clicked in the menu, this is changed to the users chosen map.
function stalingradMapButtonFunction() {
  chosenMap = MAP_STALINGRAD;
  chosenMapInt = 1;

  for (let i = 0; i < mapFilled.length; i++) {
    for (let j = 0; j < mapFilled[0].length; j++) {
      if (chosenMap[i][j] == 1 || chosenMap[i][j] == 2 || chosenMap[i][j] == 3) {
        mapFilled[i][j] = 1;
      } 
    }
  }
}

// When the Gulf War themed map is clicked in the menu, this is changed to the user's chosen map.
function gulfwarMapButtonFunction() {
  chosenMap = MAP_GULFWAR;
  chosenMapInt = 2;

  for (let i = 0; i < mapFilled.length; i++) {
    for (let j = 0; j < mapFilled[0].length; j++) {
      if (chosenMap[i][j] == 1 || chosenMap[i][j] == 2 || chosenMap[i][j] == 3) {
        mapFilled[i][j] = 1;
      } 
    }
  }
}

// If an enemy is killed, the player score is edited accordingly using the function below
function addScoreAndCash(type) {
  playerScore += (type + 1) * 500;
  playerCash += (type + 1) * 25;
}

// Checks if the base still has health and resets the game if it doesn't
function checkBaseHealth() {
  if (baseHealth < 0) {
    enemyClear();
    baseHealth = baseHealthMax;
    mapFilled = [ 
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

    for (let i = 0; i < mapFilled.length; i++) {
      for (let j = 0; j < mapFilled[0].length; j++) {
        if (chosenMap[i][j] == 1 || chosenMap[i][j] == 2 || chosenMap[i][j] == 3) {
          mapFilled[i][j] = 1;
        } 
      }
    }
    placeCancelButtonFunction();
    changeTowerColour(false, 0);
    changeTowerColour(true, 10);
    TRAP.placed = false;
    towers.length = 0;
    specialForces.length = 0;
    allowAbility = true;
    airstrikeCheck = false;
    airstrikeCheckCoordCheck = false;
    campaignCheck = false;
    let tempText = "The game is over. Your score was " + playerScore.toString() + ". Press 'Ok' to restart or press 'Cancel' to return to the menu and/or select another map.";
    playerBattleMedals += Math.floor(playerScore / 50000);
    playerScore = 0;
    playerCash = 500;
    baseHealth = baseHealthMax;
    if (!(confirm(tempText))) {
      chosenMap = [ 
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
      mapFilled = [ 
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
      gameState = 1;
      chosenMapInt = -1;
      chosenLevel = -1;
    }
  }
}

// Resets the base health relative to the upgraded value
function setBaseHealth(health) {
  baseHealth = health * (1 + upgradePercent(baseHealthUpgrade));
  baseHealthMax = health * (1 + upgradePercent(baseHealthUpgrade));
}