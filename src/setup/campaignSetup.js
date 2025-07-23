// Campaign mode setup and logic (dynamic levels, buttons, and completion) - revised July 2025

"use strict";

let chosenLevel = -1;
let campaignCheck = false;

// --- DYNAMIC CAMPAIGN LEVEL SETUP ---

// Each map gets 6 levels with progressive difficulty (params can be tweaked per map)
let levels = [];
for (let m = 0; m < 3; m++) {
    levels[m] = [
        new level(800, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0),    // L1 easy
        new level(900, 6, 4, 2, 1, 1, 0, 0, 0, 0, 0),    // L2
        new level(1000, 8, 6, 4, 2, 1, 1, 0, 0, 0, 0),   // L3 medium
        new level(1100, 10, 8, 6, 4, 2, 1, 1, 0, 0, 0),  // L4
        new level(1200, 12, 10, 8, 5, 3, 2, 1, 0, 0, 0), // L5 hard
        new level(1300, 15, 12, 10, 8, 4, 3, 2, 1, 1, 0) // L6 hardest
    ];
}

// --- DYNAMIC CAMPAIGN BUTTONS ---

let campaignLevelButtons = [];

// Create campaign level buttons dynamically for the current map
function campaignButtonsSetup() {
    // Remove any old buttons if present
    for (let btn of campaignLevelButtons) {
        btn.remove();
    }
    campaignLevelButtons = [];

    // Place horizontally, spaced
    let nLevels = levels[0].length;
    for (let i = 0; i < nLevels; i++) {
        let btn = createButton("Level " + (i+1));
        btn.position(140 + i * 200, 125);
        btn.class("campaignButtonClass");
        btn.mousePressed(() => campaignButtonsFunction(i));
        campaignLevelButtons.push(btn);
    }
}

// Show/hide campaign level buttons and display star ratings
function campaignButtonsDisplay(display) {
    for (let btn of campaignLevelButtons) {
        if (display) btn.show();
        else btn.hide();
    }
    if (display) displayStarRatings();
}

// Displays star ratings for all campaign levels for the current map
function displayStarRatings() {
    fill("black");
    textSize(30);
    let nLevels = levels[0].length;
    for (let i = 0; i < nLevels; i++) {
        let rating = levels[chosenMapInt][i].rating || 0;
        let baseX = 145 + (200 * i), y = 240;
        for (let s = 0; s < 3; s++) {
            let star = (s < rating) ? "🟡" : "⚫";
            text(star, baseX + (s * 50), y);
        }
    }
}

// Sets chosenLevel when a campaign button is clicked
function campaignButtonsFunction(levelIdx) {
    chosenLevel = levelIdx;
}

// --- ENEMY UPDATE LOGIC (unchanged, but using chosenLevel dynamically) ---

function enemyUpdateCampaign() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < enemies[i].queue.length; j++) {
            enemies[i].timeElapsed += deltaTime;
            if (enemies[i].timeElapsed > enemies[i].spawnRate &&
                enemies[i].tail < levels[chosenMapInt][chosenLevel].returnNoOfEnemies(i)) {
                enemies[i].tail++;
                enemies[i].timeElapsed = 0;
            }
        }
    }
    enemyUpdate();
}

// --- CAMPAIGN LEVEL COMPLETION CHECK ---

function checkCampaignLevelComplete() {
    // Only run if campaignCheck is true (i.e. after setEnemies)
    if (!campaignCheck) return;
    if (chosenLevel === -1 || typeof chosenMapInt === "undefined") return;

    // 1. Check for completion (all enemy queues empty and all have spawned)
    let allDone = true;
    for (let i = 0; i < 10; i++) {
        let enemy = enemies[i];
        let needed = levels[chosenMapInt][chosenLevel].returnNoOfEnemies(i);
        if (!(enemy.tail >= needed && enemy.head >= enemy.tail)) {
            allDone = false;
            break;
        }
    }
    if (!allDone) return; // Not done yet

    // 2. Calculate star rating based on remaining baseHealth
    let ratio = baseHealth / baseHealthMax;
    let newRating = 0;
    if (ratio > 0.8) newRating = 3;
    else if (ratio > 0.5) newRating = 2;
    else if (ratio > 0) newRating = 1;

    // 3. If newRating > previous, store it
    let levelObj = levels[chosenMapInt][chosenLevel];
    if (!levelObj.rating || newRating > levelObj.rating) {
        levelObj.rating = newRating;
    }

    // 4. Award medals and update user data
    if (typeof playerBattleMedals !== "undefined") {
        playerBattleMedals += newRating;
    }
    if (typeof saveCurrentUserData === "function") {
        saveCurrentUserData();
    }

    // 5. Show alert
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Level Complete!',
            text: "You earned " + newRating + " star(s). Medals awarded: " + newRating,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    } else {
        alert("Level complete! You earned " + newRating + " star(s). Medals awarded: " + newRating);
    }

    // 6. Reset for return to level-select
    enemyClear();
    setBaseHealth(levels[chosenMapInt][0].baseHealth);
    chosenLevel = -1;

    // 7. Reset campaignCheck so next setEnemies will run
    campaignCheck = false;
}