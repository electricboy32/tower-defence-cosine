// Written by James Baldwin for my Computer Science NEA Coursework. Started on 14/06/23. This is the main file which combines code from other files to run the program.

"use strict";

// Preload function from the p5.js library. Contains images which need to be loaded before the main menu appears.
function preload() {
  mainMenuImage = loadImage("./../img/mainMenuImage.png");
  vietnamMapImage = loadImage("./../img/vietnamMapImage.png");
  stalingradMapImage = loadImage("./../img/stalingradMapImage.png");
  gulfwarMapImage = loadImage("./../img/gulfwarMapImage.png");
}

// Setup function from the p5.js library. This function is run once at the start of the program and never again, so it is used for creating the canvas, etc.
function setup() {
  createCanvas(1856, 864);
  menuButtonsSetup();
  mapButtonsSetup();
  towerButtonsSetup();
  skillTreeButtonsSetup();
  campaignButtonsSetup();
  specialAbilityButtonSetup();
}

// Draw function from the p5.js library. This function runs 60 times per second and is used for animation (i.e. updating object positions, drawing map, etc.).
function draw() {
  background(21, 191, 61);
  switch(gameState) {
    
    // Loads the menu.
    case 1:
      titleAndImageSetup();
      mainMenuButtonsDisplay(true);
      mapButtonsDisplay(false);
      returnToMenuButtonDisplay(false);
      placeCancelButtonDisplay(false);
      displayRangeButtonDisplay(false);
      towerButtonDisplay(false);
      skillTreeButtonsDisplay(false);
      campaignButtonsDisplay(false);
      specialAbilityButtonDisplay(false);
      break;

    // Loads the campaign game mode.
    case 2:
      if (JSON.stringify(chosenMap) == JSON.stringify(MAP_BLANK)) {
        mapButtonsDisplay(true);
        mainMenuButtonsDisplay(false);
        returnToMenuButtonDisplay(true);
      } else if (chosenLevel == -1) {
        mapButtonsDisplay(false);
        campaignButtonsDisplay(true);
        returnToMenuButtonDisplay(true);
        setBaseHealth(1000);
      } else{
        specialAbilityButton.html(returnSpecialAbilityName());
        returnSpecialAbilityName();
        campaignButtonsDisplay(false);
        mapButtonsDisplay(false);
        mainMenuButtonsDisplay(false);
        displayRangeButtonDisplay(true);
        returnToMenuButtonDisplay(true);
        specialAbilityButtonDisplay(true);
        towerButtonDisplay(true);
        drawMap();
        displayInformation();
        checkBaseHealth();
        displayBaseHealth(baseHealth, baseHealthMax);
        placeTowerFunction();
        enemyUpdate();
        towerUpdate();
        specialForcesUpdate();
        enemySetup(0);
        enemyUpdateCampaign();
        showSpecialForces();
        showAirstrike();
        showTrap();
        trapFunction();
      }
      break;

    // Loads the arcade game mode.
    case 3:
      if (JSON.stringify(chosenMap) == JSON.stringify(MAP_BLANK)) {
        mapButtonsDisplay(true);
        mainMenuButtonsDisplay(false);
        returnToMenuButtonDisplay(true);
        setBaseHealth(1000);
      } else{
        specialAbilityButton.html(returnSpecialAbilityName());
        mapButtonsDisplay(false);
        mainMenuButtonsDisplay(false);
        displayRangeButtonDisplay(true);
        returnToMenuButtonDisplay(true);
        specialAbilityButtonDisplay(true);
        towerButtonDisplay(true);
        drawMap();
        displayInformation();
        checkBaseHealth();
        displayBaseHealth(baseHealth, baseHealthMax);
        placeTowerFunction();
        enemySpawn();
        enemyUpdate();
        towerUpdate();
        specialForcesUpdate();
        enemySetup(1);
        showSpecialForces();
        showAirstrike();
        showTrap();
        trapFunction();
      }
      break;

    // Loads the tutorial.
    case 4:
      mainMenuButtonsDisplay(false);
      returnToMenuButtonDisplay(true);

      break;

    // Loads the skill tree.
    case 5:
      mainMenuButtonsDisplay(false);
      returnToMenuButtonDisplay(true);
      skillTreeButtonsDisplay(true);

      break;

    // Loads the settings.
    case 6:
      mainMenuButtonsDisplay(false);
      returnToMenuButtonDisplay(true);
      
      break;

    default:
      gameState = 1;
  }
}