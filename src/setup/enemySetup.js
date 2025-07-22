// Written by James Baldwin for my Computer Science NEA Coursework. Started on 23/06/23. This file contains the setup information (queues) for the enemies.

"use strict";

let enemies = [];
enemies[0] = new enemyQueue(15000, 0);
enemies[1] = new enemyQueue(18000, 1);
enemies[2] = new enemyQueue(20000, 2);
enemies[3] = new enemyQueue(25000, 3);
enemies[4] = new enemyQueue(30000, 4);
enemies[5] = new enemyQueue(30000, 5);
enemies[6] = new enemyQueue(50000, 6);
enemies[7] = new enemyQueue(60000, 7);
enemies[8] = new enemyQueue(70000, 8);
enemies[9] = new enemyQueue(80000, 9);

let arcade1 = false, arcade2 = false, arcade3 = false;

// Spawns all types of enemy in one function to keep modularity.
function enemySpawn() {
    for (let i = 0; i < 10; i++) {
        enemies[i].spawn();
    }
}


// Updates all types of enemy in one function to keep modularity.
function enemyUpdate() {
    for (let i = 0; i < 10; i++) {
        enemies[i].updatePosistion();
    }
}

// Clears all the enemies on screen.
function enemyClear() {
    for (let i = 0; i < 10; i++) {
        enemies[i].clear();
    }
}

// Sets up the enemies depending on the input (for each gamemode)
function enemySetup(gamemode) {
    switch (gamemode) {
        case 0:
            if (!(campaignCheck)) {
                campaignCheck = true;
                let userLevel = levels[chosenMapInt][chosenLevel];
                userLevel.setEnemies();
            }
            break;

        case 1:
            if(playerScore > 1000000 && !(arcade3)) {
                arcade3 = true;
                enemies[0].spawnRate = 2000;
                enemies[1].spawnRate = 5000;
                enemies[2].spawnRate = 8000;
                enemies[3].spawnRate = 8000;
                enemies[4].spawnRate = 10000;
                enemies[5].spawnRate = 15000;
                enemies[6].spawnRate = 20000;
                enemies[7].spawnRate = 25000;
                enemies[8].spawnRate = 25000;
                enemies[9].spawnRate = 30000;
            } else if (playerScore > 500000 && !(arcade2)) {
                enemies[0].spawnRate = 5000;
                enemies[1].spawnRate = 8000;
                enemies[2].spawnRate = 8000;
                enemies[3].spawnRate = 10000;
                enemies[4].spawnRate = 15000;
                enemies[5].spawnRate = 20000;
                enemies[6].spawnRate = 30000;
                enemies[7].spawnRate = 40000;
                enemies[8].spawnRate = 50000;
                enemies[9].spawnRate = 50000;
            } else if (playerScore > 100000 && !(arcade1))  {
                enemies[0].spawnRate = 5000;
                enemies[1].spawnRate = 5000;
                enemies[2].spawnRate = 8000;
                enemies[3].spawnRate = 10000;
                enemies[4].spawnRate = 15000;
                enemies[5].spawnRate = 20000;
                enemies[6].spawnRate = 30000;
                enemies[7].spawnRate = 40000;
                enemies[8].spawnRate = 50000
                enemies[9].spawnRate = 60000;
            }
            break;
    }
}