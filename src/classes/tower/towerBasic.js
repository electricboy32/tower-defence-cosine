// Written by James Baldwin for my Computer Science NEA Coursework. Started on 22/08/23. This file contains the base class for the towers. 

"use strict";

class towerBasic {
    
    // Constructor method for the class.
    constructor(posX, posY, colour, type, range, damage, speed) {
        this.posX = posX;
        this.posY = posY;
        this.colour = colour;
        this.type = type; // Type of tower.
        this.range = range;
        this.damage = damage  * (1 + upgradePercent(damageUpgrade));
        this.speed = speed;
        this.projectiles = new projectileQueue(); // Queue to store and manage the towers projectiles.
        this.targetEnemy; // Stores the type and pointer of the enemy, if one is in range.
        this.time = 0; // Stores the time since the last projectile hit an enemy.
    }

    // Displays the tower (which doesn't move) and calls the method to move the projectiles. Also calls the method to check whether an enemy is in range of the tower.
    update() {

        this.time +=deltaTime;

        // If an enemy is in range, information to find its position is stored in targetEnemy and a projectile is fired towards this position.
        if (this.calculateDistance() != false) {
            this.targetEnemy = this.calculateDistance();
            if (this.checkEnemyType()) {
                this.fireProjectile();
            }
        } else {
            this.projectiles.clear();
        }

        // If a projecile has been fired, its posistion is updated and whether or not it has hit the enemy is checked.
        if (this.projectiles.queue.length != 0) {
            this.projectiles.updatePosistion();
            this.checkIfCollision();
        }

        if (this.type == 8) {
            fill(this.colour);
            circle(this.posX + 48, this.posY + 48, 20);
        } else {
            fill(this.colour);
            circle(this.posX + 48, this.posY + 48, 76);
        }

        // If the user wants, the tower ranges are displayed.
        if (displayRange) {
            noFill();
            stroke(this.colour);
            circle(this.posX + 48, this.posY + 48, this.range*2);
        }
    }

    // Checks if an enemy is in range of the tower.
    calculateDistance() {
        for (let i = 0; i < 10; i++){
            for (let j = enemies[i].head; j < enemies[i].tail; j++) {
                let enemyX = enemies[i].queue[j].posX;
                let enemyY = enemies[i].queue[j].posY;
                if (distance(this.posX, this.posY, enemyX, enemyY) < this.range){
                    return {
                        type: enemies[i].type,
                        pointer: enemies[i].queue[j].pointer
                    }
                }
            }
        }
        this.projectiles.clear();
        return false;
    }

    // Check if the tower can shoot at the given enemy type.
    checkEnemyType() {
        if (this.type <= 1 && this.targetEnemy.type <= 1) {
            return true;
        } else if (this.type >= 2 && this.type <= 4 && this.targetEnemy.type <= 4) {
            return true;
        } else if (this.type == 5  || this.type == 8 && this.targetEnemy.type <= 7) {
            return true;
        } else if (this.type == 6 && this.targetEnemy.type != 9) {
            return true;
        } else if (this.type == 7) {
            return true;
        } else {
            return false;
        }
    }

    // Fires a projectile at the target enemy.
    fireProjectile(){
        this.projectiles.enqueue(new projectile(this.posX, this.posY, enemies[this.targetEnemy.type].queue[this.targetEnemy.pointer].posX, 
            enemies[this.targetEnemy.type].queue[this.targetEnemy.pointer].posY, this.colour, this.speed, this.damage));
    }

    // Checks if any projectiles in the queue (i.e. the first) have hit the enemy.
    checkIfCollision() {
        let type = this.targetEnemy.type;
        let pointer = this.targetEnemy.pointer;
        let projX;
        let projY;
        if (this.projectiles.queue[this.projectiles.head]) {
            projX =  this.projectiles.queue[this.projectiles.head].posX;
            projY = this.projectiles.queue[this.projectiles.head].posY;
        }
        let enemyX = enemies[type].queue[pointer].posX;
        let enemyY = enemies[type].queue[pointer].posY;
        
        if (type <= 4 && distance(projX, projY, enemyX, enemyY) < 100) {
            this.time = 0;
            this.projectiles.dequeue();
            if (type >= 2 && enemies[type].queue[pointer].armour > 0) {
                enemies[type].queue[pointer].armour -= this.damage;
            } else {
                enemies[type].queue[pointer].health -= this.damage;
            }

            // If this projectile destroys the enemy, the enemy is cleared.
            if (enemies[type].queue[pointer].health < 0) {
                enemies[type].dequeue();
                this.projectiles.clear();
                addScoreAndCash(type);
            }
                
        } else if (distance(projX, projY, enemyX, enemyY) < 130) {
            this.time = 0;
            this.projectiles.dequeue();
            if (enemies[type].queue[pointer].armour > 0) {
                enemies[type].queue[pointer].armour -= this.damage;
            } else {
                enemies[type].queue[pointer].health -= this.damage;
            }

            // If this projectile destroys the enemy, the enemy is cleared.
            if (enemies[type].queue[pointer].health < 0) {
                enemies[type].dequeue();
                this.projectiles.clear();
                addScoreAndCash(type);
            }

        } else if (this.time > 50) {
            this.time = 0;
            this.projectiles.dequeue();
                if (enemies[type].queue[pointer].armour > 0) {
                    enemies[type].queue[pointer].armour -= this.damage;
                } else {
                    enemies[type].queue[pointer].health -= this.damage;
                }

                // If this projectile destroys the enemy, the enemy is cleared.
                if (enemies[type].queue[pointer].health < 0) {
                    enemies[type].dequeue();
                    this.projectiles.clear();
                    addScoreAndCash(type);
                }
        }
    }
}