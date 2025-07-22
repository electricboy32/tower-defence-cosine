// Written by James Baldwin for my Computer Science NEA Coursework. Started on 27/06/23. This file contains the class for enemy planes and helicopters.

"use strict";

class enemyPlane extends enemyVehicle {
    
    // Constructor method for the class.
    constructor(health, speed, map, colour, pointer, changeOfDirection, armour, stealth) {
        super(health, speed, map, colour, pointer, changeOfDirection, armour);
        this.flight = true;
        this.stealth = stealth;
    }
}