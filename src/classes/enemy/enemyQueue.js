// Written by James Baldwin for my Computer Science NEA Coursework. Started on 22/06/23. This file contains the queue data structure used for the enemies.

"use strict";

class enemyQueue extends queue {

    // Constructor method for the class.
    constructor(spawnRate, type) {
        super();
        this.timeElapsed = 0; // Time elapsed since the last time an enemy was spawned.
        this.spawnRate = spawnRate; // The rate at which enemies spawn. The lower the value, the more frequently they spawn.
        this.type = type; // The type of enemy.
    }

    // Clears the queue. Overrides the parent clear method.
    clear() {
        this.queue = [];
        this.head = 0;
        this.tail = 0;
        this.timeElapsed = 0;
    }

    // Checks the enemy type to see what needs to be displayed.
    checkType() {
        switch (this.type) {
            case 0:
                this.enqueue(new enemyBasic(200, 0.12, chosenMap, "red", this.tail, 5)); // Soldier.
                break;
            
            case 1:
                this.enqueue(new enemyBasic(300, 0.13, chosenMap, "yellow", this.tail, 5)); // Special forces.
                break;

            case 2:
                this.enqueue(new enemyVehicle(400, 0.14, chosenMap, "gray", this.tail, 2, 100)); // Truck.
                break;

            case 3:
                this.enqueue(new enemyVehicle(500, 0.15, chosenMap, "blue", this.tail, 2, 125)); // APC.
                break;

            case 4:
                this.enqueue(new enemyVehicle(300, 0.16, chosenMap, "green", this.tail, 2, 150)); // IFV.
                break;

            case 5:
                this.enqueue(new enemyVehicle(350, 0.17, chosenMap, "orange", this.tail, 1, 200)); // Tank.
                break;

            case 6:
                this.enqueue(new enemyPlane(400, 0.18, chosenMap, "purple", this.tail, 1, 400, false)); // Helicopter.
                break;

            case 7:
                this.enqueue(new enemyPlane(450, 0.19, chosenMap, "lime", this.tail, 1, 500, false)); // Fighter jet.
                break;
            
            case 8:
                this.enqueue(new enemyPlane(450, 0.2, chosenMap, "white", this.tail, 1, 600, false)); // Bomber.
                break;

            case 9:
                this.enqueue(new enemyPlane(500, 0.2, chosenMap, "black", this.tail, 1, 750, true)); // Stealth bomber.
                break;
        }
    }

    // For each item in the queue, its position is updated (using the update method from the enemy class).
    updatePosistion() {
        for (let i = this.head; i < this.tail; i++) {
                this.queue[i].update(this);
        }
     }

    // Spawns new enemies.
    spawn() {
        this.timeElapsed += deltaTime;
        if (this.timeElapsed > this.spawnRate) {
          this.checkType();
          this.timeElapsed = 0;
        }
    }
}