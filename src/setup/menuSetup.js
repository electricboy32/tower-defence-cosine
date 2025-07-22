// Written by James Baldwin for my Computer Science NEA Coursework. Started on 17/06/23. This file sets up all the variables and functions needed for the main menu

"use strict";

let returnToMenuButton, campaignButton, arcadeButton, tutorialButton, skillTreeButton, settingsButton;

let mainMenuImage;

// Displays the title and image on the main menu.
function titleAndImageSetup() {

    // Creating title.
    textFont("Helvetica");
    textSize(60);
    fill(0, 0, 0);
    text("Military Tower Defence Game", 550, 150);

    image(mainMenuImage, 0, 686); // Image of tank firing shell at the bottom.
}

// Declares all the buttons seen on the main menu screen.
function menuButtonsSetup() {
    returnToMenuButton = createButton("Menu");
    returnToMenuButton.position(1640, 15);
    returnToMenuButton.id("returnToMenuButtonID");
    returnToMenuButton.mousePressed(returnToMenuButtonFunction);

    campaignButton = createButton("Campaign");
    campaignButton.position(740, 225);
    campaignButton.class("mainMenuButtonClass");
    campaignButton.mousePressed(campaignButtonFunction);

    arcadeButton = createButton("Arcade");
    arcadeButton.position(740, 325);
    arcadeButton.class("mainMenuButtonClass");
    arcadeButton.mousePressed(arcadeButtonFunction);

    tutorialButton = createButton("Tutorial");
    tutorialButton.position(740, 425);
    tutorialButton.class("mainMenuButtonClass");
    tutorialButton.mousePressed(tutorialButtonFunction);

    skillTreeButton = createButton("Skill Tree");
    skillTreeButton.position(740, 525);
    skillTreeButton.class("mainMenuButtonClass");
    skillTreeButton.mousePressed(skillTreeButtonFunction);

    settingsButton = createButton("Settings");
    settingsButton.position(740, 625);
    settingsButton.class("mainMenuButtonClass");
    settingsButton.mousePressed(settingsButtonFunction);
}

// Shows or hides the return to menu button depending on the input
function returnToMenuButtonDisplay(display) {
    if (display) {
        returnToMenuButton.show();
    } else {
        returnToMenuButton.hide();
    }
}

// Shows or hides the menu buttons depending on the input.
function mainMenuButtonsDisplay(display) {
    if (display) {
        campaignButton.show();
        arcadeButton.show();
        tutorialButton.show();
        skillTreeButton.show();
        settingsButton.show();
    } else {
        campaignButton.hide();
        arcadeButton.hide();
        tutorialButton.hide();
        skillTreeButton.hide();
        settingsButton.hide();
    }
}

// When the menu button is clicked on any part of the game, the menu loads (because gameState is changed to 1).
function returnToMenuButtonFunction() {
    if ((gameState == 2 || gameState == 3 || gameState == 4) && confirm("Are you sure you want to return to menu?")) {
        enemyClear();
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
        allowAbility = true;
        towers.length = 0;
        specialForces.length = 0;
        towerPlace = false;
        baseHealth = baseHealthMax;
        chosenMapInt = -1;
        chosenLevel = -1;
        campaignCheck = false;
        placeCancelButtonFunction();
        changeTowerColour(false, 0);
        changeTowerColour(true, 10);
        TRAP.placed = false;
        playerBattleMedals += Math.floor(playerScore / 50000);
        playerScore = 0;
        playerCash = 500;
        gameState = 1;
    } else if (gameState == 5 || gameState == 6) {
        gameState = 1;
    }
}

// When the campaign button is clicked on the main menu, the campaign loads (because gameState is changed to 2).
function campaignButtonFunction() {
    gameState = 2;
}

// When the arcade button is clicked on the main menu, the arcade loads (because gameState is changed to 3).
function arcadeButtonFunction() {
    gameState = 3;
}

// When the tutorial button is clicked on the main menu, the tutorial loads (because gameState is changed to 4).
function tutorialButtonFunction() {
    gameState = 4;
}

// When the skill tree button is clicked on the main menu, the skill tree loads (because gameState is changed to 5).
function skillTreeButtonFunction() {
    gameState = 5;
}

// When the settings button is clicked on the main menu, the settings load (because gameState is changed to 6).
function settingsButtonFunction() {
    gameState = 6;
}