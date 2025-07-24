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
let arcadeStarted = false;      // false = Build Phase, true = active gameplay
let arcadeInfoShown = false;    // ensures we only show the dialog once per run
let startGameButton = null;

// Helper: Show/hide Start Game button
function startGameButtonDisplay(show) {
  if (startGameButton) {
    if (show) {
      startGameButton.show();
    } else {
      startGameButton.hide();
    }
  }
}

// Helper: Called when Start Game button is pressed
function startArcadeGame() {
  arcadeStarted = true;
  startGameButtonDisplay(false);
  // Force each enemyQueue's timeElapsed so next spawn() immediately enqueues an enemy
  if (typeof enemies !== "undefined" && Array.isArray(enemies)) {
    for (let i = 0; i < enemies.length; i++) {
      if (typeof enemies[i].spawnRate !== "undefined") {
        enemies[i].timeElapsed = enemies[i].spawnRate + 1;
      }
    }
  }
}

function setup() {
  createCanvas(1856, 864);
  menuButtonsSetup();
  mapButtonsSetup();
  towerButtonsSetup();
  skillTreeButtonsSetup();
  campaignButtonsSetup();
  specialAbilityButtonSetup();

  // Create Start Game button for Arcade Build Phase
  startGameButton = createButton('Start Game');
  startGameButton.position(860, 780);  // Centered at bottom
  startGameButton.class('mainMenuButtonClass');
  startGameButton.mousePressed(startArcadeGame);
  startGameButton.hide();
}

// Draw function from the p5.js library. This function runs 60 times per second and is used for animation (i.e. updating object positions, drawing map, etc.).
function draw() {
  background(21, 191, 61);
  switch(gameState) {
    case AUTH_STATE:
      if (typeof showAuthUI === "function") showAuthUI();
      return; // Do nothing else

    // Loads the menu.
    case 1:
      if (typeof hideAuthUI === "function") hideAuthUI();
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
      // Show logout if user logged in
      if (typeof showLogoutButton === "function" && currentUser) showLogoutButton();
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
        checkCampaignLevelComplete(); // <-- Call after enemy updates for campaign only
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
        startGameButtonDisplay(false);
      } else {
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

        // Arcade Build Phase logic
        if (!arcadeStarted) {
          // Show info dialog once per run
          if (!arcadeInfoShown) {
            if (typeof showGameDialog === "function") {
              showGameDialog('Build Phase', 'You have time to place your initial towers. Press Start Game when you\'re ready.', 'info');
            }
            arcadeInfoShown = true;
          }
          startGameButtonDisplay(true);
          // NO enemySpawn, enemyUpdate, specialForcesUpdate, etc. in Build Phase!
        } else {
          startGameButtonDisplay(false);
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
      }
      break;

    // Loads the tutorial.
    case 4:
      if (typeof showTutorial === "function") showTutorial();
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