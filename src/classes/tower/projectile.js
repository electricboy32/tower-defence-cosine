// Written by James Baldwin for my Computer Science NEA Coursework. Started on 22/08/23. This file contains the class for projectiles.

"use strict";

class projectile {

    // Constructor method for the class.
    constructor(posX, posY, targetX, targetY, colour, speed, damage) {
        this.posX = posX;
        this.posY = posY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.colour = colour;
        this.speed = speed;
        this.damage = damage;
    }

    // Updates the posistion of the projectile using cosine interpolation. 
    update() {
        this.posX = cosineInterpolate(this.posX, this.targetX, 0.18 - (upgradePercent(projectileUpgrade) / 6));
        this.posY = cosineInterpolate(this.posY, this.targetY, 0.18 - (upgradePercent(projectileUpgrade) / 6));
        fill(this.colour);
        circle(this.posX + 48, this.posY + 48, 5);
    }
}