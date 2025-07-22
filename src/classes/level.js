// Written by James Baldwin for my Computer Science NEA Coursework. Started on 10/11/23. This file contains the class for a campaign level.

"use strict";

class level {

    // Constructor for the class
    constructor(baseHealth, soldier, specialForces, truck, apc, ifv, tank, helicopter, fighterJet, bomber, stealthBomber) {
        this.rating = 0;
        this.baseHealth = baseHealth;
        this.soldier = soldier;
        this.specialForces = specialForces;
        this.truck = truck;
        this.apc = apc;
        this.ifv = ifv;
        this.tank = tank;
        this.helicopter = helicopter;
        this.fighterJet = fighterJet;
        this.bomber = bomber;
        this.stealthBomber = stealthBomber;
    }

    // Sets the length of the enemy arrays so only that many spawn
    setEnemies() {
        enemies[0].queue.length = this.soldier;
        enemies[1].queue.length = this.specialForces;
        enemies[2].queue.length = this.truck;
        enemies[3].queue.length = this.apc;
        enemies[4].queue.length = this.ifv;
        enemies[5].queue.length = this.tank;
        enemies[6].queue.length = this.helicopter;
        enemies[7].queue.length = this.fighterJet;
        enemies[8].queue.length = this.bomber;
        enemies[9].queue.length = this.stealthBomber;
        
        for(let i = 0; i < 10; i++) {
            for(let j = 0; j < enemies[i].queue.length; j++) {
                enemies[i].queue[j] = this.returnEnemyType(i);
            }
        }
    }

    // Returns the enemy type to fill the queue
    returnEnemyType(type) {
        switch (type) {
            case 0:
                return new enemyBasic(200, 0.12, chosenMap, "red", this.tail, 5); // Soldier.
                break;
            
            case 1:
                return new enemyBasic(300, 0.13, chosenMap, "yellow", this.tail, 5); // Special forces.
                break;

            case 2:
                return new enemyVehicle(400, 0.14, chosenMap, "gray", this.tail, 2, 100); // Truck.
                break;

            case 3:
                return new enemyVehicle(500, 0.15, chosenMap, "blue", this.tail, 2, 125); // APC.
                break;

            case 4:
                return new enemyVehicle(300, 0.16, chosenMap, "green", this.tail, 2, 150); // IFV.
                break;

            case 5:
                return new enemyVehicle(350, 0.17, chosenMap, "orange", this.tail, 1, 200); // Tank.
                break;

            case 6:
                return new enemyPlane(400, 0.18, chosenMap, "purple", this.tail, 1, 400, false); // Helicopter.
                break;

            case 7:
                return new enemyPlane(450, 0.19, chosenMap, "lime", this.tail, 1, 500, false); // Fighter jet.
                break;
            
            case 8:
                return new enemyPlane(450, 0.2, chosenMap, "white", this.tail, 1, 600, false); // Bomber.
                break;

            case 9:
                return new enemyPlane(500, 0.2, chosenMap, "black", this.tail, 1, 750, true); // Stealth bomber.
                break;
        }
    }

    returnNoOfEnemies(enemy) {
        switch (enemy) {
            case 0:
                return this.soldier;
                break;
            
            case 1:
                return this.specialForces;
                break;

            case 2:
                return this.truck;
                break;

            case 3:
                return this.apc;
                break;

            case 4:
                return this.ifv;
                break;

            case 5:
                return this.tank;
                break;

            case 6:
                return this.helicopter;
                break;

            case 7:
                return this.fighterJet;
                break;
            
            case 8:
                return this.bomber;
                break;

            case 9:
                return this.stealthBomber;
                break;
        }
    }
}