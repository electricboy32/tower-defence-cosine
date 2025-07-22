// Written by James Baldwin for my Computer Science NEA Coursework. Started on 26/10/23. This file sets up the "Skill Tree" option in the menu.

"use strict";

let projectileUpgrade = 0, damageUpgrade = 0, baseHealthUpgrade = 0, enemySpeedUgrade = 0, enemyArmourUpgrade = 0, specialAbilityUpgrade = 0;

let projectileUpgradeButton, damageUpgradeButton, baseHealthUpgradeButton, enemySpeedUpgradeButton, enemyArmourUpgradeButton, specialAbilityUpgradeButton;

// Declares all the buttons seen on the skill tree screen.
function skillTreeButtonsSetup() {
    projectileUpgradeButton = createButton("Upgrade Tower Projectile Speed");
    projectileUpgradeButton.position(740, 125);
    projectileUpgradeButton.class("skillTreeButtonClass");
    projectileUpgradeButton.mousePressed(() => skillTreeButtonsFunction(projectileUpgrade, 0));

    damageUpgradeButton = createButton("Upgrade Tower Projectile Damage");
    damageUpgradeButton.position(740, 225);
    damageUpgradeButton.class("skillTreeButtonClass");
    damageUpgradeButton.mousePressed(() => skillTreeButtonsFunction(damageUpgrade, 1));

    baseHealthUpgradeButton = createButton("Upgrade Base Health");
    baseHealthUpgradeButton.position(740, 325);
    baseHealthUpgradeButton.class("skillTreeButtonClass");
    baseHealthUpgradeButton.mousePressed(() => skillTreeButtonsFunction(baseHealthUpgrade, 2));

    enemySpeedUpgradeButton = createButton("Decrease All Enemy Speed");
    enemySpeedUpgradeButton.position(740, 425);
    enemySpeedUpgradeButton.class("skillTreeButtonClass");
    enemySpeedUpgradeButton.mousePressed(() => skillTreeButtonsFunction(enemySpeedUgrade, 3));

    enemyArmourUpgradeButton = createButton("Decrease All Enemy Armour");
    enemyArmourUpgradeButton.position(740, 525);
    enemyArmourUpgradeButton.class("skillTreeButtonClass");
    enemyArmourUpgradeButton.mousePressed(() => skillTreeButtonsFunction(enemyArmourUpgrade, 4));

    specialAbilityUpgradeButton = createButton("Upgrade All Special Abilities");
    specialAbilityUpgradeButton.position(740, 625);
    specialAbilityUpgradeButton.class("skillTreeButtonClass");
    specialAbilityUpgradeButton.mousePressed(() => skillTreeButtonsFunction(specialAbilityUpgrade, 5));
}

// Shows or hides the skill tree buttons depending on the input.
function skillTreeButtonsDisplay(display) {
    if (display) {
        projectileUpgradeButton.show();
        damageUpgradeButton.show();
        baseHealthUpgradeButton.show();
        enemySpeedUpgradeButton.show();
        enemyArmourUpgradeButton.show();
        specialAbilityUpgradeButton.show();
        displayInformationSkillTree();
    } else {
        projectileUpgradeButton.hide();
        damageUpgradeButton.hide();
        baseHealthUpgradeButton.hide();
        enemySpeedUpgradeButton.hide();
        enemyArmourUpgradeButton.hide();
        specialAbilityUpgradeButton.hide();
    }
}

function displayInformationSkillTree() {
    noFill();
    stroke("black");
    for(let i=0; i<6; i++) {
        rect(640, 125 + 100*i, 75, 75);
        rect(1165, 125 + 100*i, 75, 75);
    }
    fill("black");
    textSize(35);
    text(100*upgradePercent(projectileUpgrade) + "%", 645, 175);
    text(100*upgradePercent(damageUpgrade) + "%", 645, 275);
    text(100*upgradePercent(baseHealthUpgrade) + "%", 645, 375);
    text(100*upgradePercent(enemySpeedUgrade) + "%", 645, 475);
    text(100*upgradePercent(enemyArmourUpgrade) + "%", 645, 575);
    text(100*upgradePercent(specialAbilityUpgrade) + "%", 645, 675);
    text(upgradeCost(projectileUpgrade), 1170, 175);
    text(upgradeCost(damageUpgrade), 1170, 275);
    text(upgradeCost(baseHealthUpgrade), 1170, 375);
    text(upgradeCost(enemySpeedUgrade), 1170, 475);
    text(upgradeCost(enemyArmourUpgrade), 1170, 575);
    text(upgradeCost(specialAbilityUpgrade), 1170, 675);
    text("🎖️Medals: " + playerBattleMedals, 1170, 75);
    textSize(20);
    text("Currently: ", 640, 100);
    text("Cost: ", 1165, 100);
}

// Returns the percentage upgrade depending on the tier of the upgrade variable passed.
function upgradePercent(upgrade) {
    switch(upgrade) {
        case 0:
            return 0;
            break;

        case 1:
            return 0.02;
            break;

        case 2:
            return 0.05;
            break;
        
        case 3:
            return 0.08;
            break;

        case 4:
            return 0.12;
            break;

        case 5:
            return 0.18;
            break;
    }
}

// Returns the cost to upgrade depending on the tier of the upgrade varaible passed.
function upgradeCost(upgrade) {
    switch(upgrade) {
        case 0:
            return "1 🎖️";
            break;

        case 1:
            return "2 🎖️";
            break;

        case 2:
            return "3 🎖️";
            break;
        
        case 3:
            return "4 🎖️";
            break;

        case 4:
            return "5 🎖️";
            break;

        case 5:
            return "Max";
            break;
    }
}

// Edits the variable depending on the upgrade passed.
function skillTreeButtonsFunction(upgrade, type) {
    if(upgrade < 5 && playerBattleMedals >= upgrade + 1) {
        playerBattleMedals -= upgrade + 1;
        switch(type) {
            case 0:
                projectileUpgrade++;
                break;

            case 1:
                damageUpgrade++;
                break;

            case 2:
                baseHealthUpgrade++;
                break;
           
            case 3:
                enemySpeedUgrade++;
                break;

            case 4:
                enemyArmourUpgrade++;
                break;

            case 5:
                specialAbilityUpgrade++;
                break;
        }
    }
}
