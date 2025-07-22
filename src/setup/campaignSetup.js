// Written by James Baldwin for my Computer Science NEA Coursework. Started on 10/11/23. This contains the setup for the campaign gamemode.

"use strict";

let chosenLevel = -1;

let campaignCheck = false;

let levelOneButton, levelTwoButton, levelThreeButton;

let levels = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
levels[0][0] = new level(800, 5, 3, 2, 1, 0, 0, 0, 0, 0, 0);
levels[0][1] = new level(900, 8, 6, 4, 3, 3, 1, 0, 0, 0, 0);
levels[0][2] = new level(1000, 12, 8, 8, 6, 4, 2, 1, 0, 0, 0);
levels[1][0] = new level(800, 5, 3, 2, 1, 0, 0, 0, 0, 0, 0);
levels[1][1] = new level(900, 12, 8, 4, 3, 3, 1, 0, 0, 0, 0);
levels[1][2] = new level(1000, 15, 10, 5, 5, 3, 2, 1, 0, 0, 0);
levels[2][0] = new level(800, 5, 3, 2, 1, 0, 0, 0, 0, 0, 0);
levels[2][1] = new level(900, 7, 8, 10, 5, 2, 1, 0, 0, 0, 0);
levels[2][2] = new level(1000, 8, 10, 12, 8, 3, 1, 2, 0, 0, 0);

// Declares all the buttons seen on the skill tree screen.
function campaignButtonsSetup() {
    levelOneButton = createButton("Level One");
    levelOneButton.position(140, 125);
    levelOneButton.class("campaignButtonClass");
    levelOneButton.mousePressed(() => campaignButtonsFunction(0));

    levelTwoButton = createButton("Level Two");
    levelTwoButton.position(340, 125);
    levelTwoButton.class("campaignButtonClass");
    levelTwoButton.mousePressed(() => campaignButtonsFunction(1));

    levelThreeButton = createButton("Level Three");
    levelThreeButton.position(540, 125);
    levelThreeButton.class("campaignButtonClass");
    levelThreeButton.mousePressed(() => campaignButtonsFunction(2));
}

// Shows or hides the campaign buttons depending on the input.
function campaignButtonsDisplay(display) {
    if (display) {
        levelOneButton.show();
        levelTwoButton.show();
        levelThreeButton.show();
        displayStarRatings();
    } else {
        levelOneButton.hide();
        levelTwoButton.hide();
        levelThreeButton.hide();
    }
}

// Displays the users previous best attempts at each level.
function displayStarRatings() {
    for (let i = 0; i<3; i++) {
        let rating = levels[chosenMapInt][i].rating;
        if (rating == 0) {
            text("⚫", 145 + (200 * i), 240)
            text("⚫", 195 + (200 * i), 240)
            text("⚫", 245 + (200 * i), 240)
        } else if (rating == 1) {
            text("🟡", 145 + (200 * i), 240)
            text("⚫", 195 + (200 * i), 240)
            text("⚫", 245 + (200 * i), 240)
        } else if (rating == 2) {
            text("🟡", 145 + (200 * i), 240)
            text("🟡", 195 + (200 * i), 240)
            text("⚫", 245 + (200 * i), 240)
        } else if (rating == 3) {
            text("🟡", 145 + (200 * i), 240)
            text("🟡", 195 + (200 * i), 240)
            text("🟡", 245 + (200 * i), 240)
        }
    }
}

// Changes the value of chosenMap depending on the button the user clicks
function campaignButtonsFunction(level) {
    chosenLevel = level;
}

// Updates the enemies for the campaign gamemode
function enemyUpdateCampaign() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < enemies[i].queue.length; j++) {
            enemies[i].timeElapsed += deltaTime;
            if(enemies[i].timeElapsed > enemies[i].spawnRate && enemies[i].tail < levels[chosenMapInt][chosenLevel].returnNoOfEnemies(i)) {
                enemies[i].tail++;
                enemies[i].timeElapsed = 0;
            }
        }
    }
    enemyUpdate();
}