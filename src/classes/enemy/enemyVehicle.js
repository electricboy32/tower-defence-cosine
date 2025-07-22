// Written by James Baldwin for my Computer Science NEA Coursework. Started on 27/06/23. This file contains the class for enemy vehicles.

"use strict";

class enemyVehicle extends enemyBasic {

  // Constructor method for the class.
  constructor(health, speed, map, colour, pointer, changeOfDirection, armour) {
      super(health, speed, map, colour, pointer, changeOfDirection);
      this.armour = armour  * (1 - upgradePercent(enemyArmourUpgrade));
      this.armourMax = armour;
  }

  // If the enemies still have health or armour, it is displayed. This overrides the parent method because a blue bar needs to be displayed for vehicles to show their armour.
  display() {
    if (this.health > 0) {
      if (this.armour > 0 && this.armour < this.armourMax) {
        let percentage = this.armour / this.armourMax;
        let start = color(95, 201, 209);
        let end = color(0, 18, 132);
        let gradientColour = lerpColor(start, end, percentage); // Colours the armour bar a percentage between dark blue and light blue depending on the armour remaining.
        let barWidth = map(percentage, 0, 1, 0, 76); // Makes the size of the health bar proportional to the health remaining.
        fill(gradientColour);
        noStroke();
        rect(this.posX + 10, this.posY + 91, barWidth, 5);

      } else if (this.health < this.healthMax) {
        let percentage = this.health / this.healthMax;
        let start = color(255, 0, 0);
        let end = color(0, 255, 0);
        let gradientColour = lerpColor(start, end, percentage); // Colours the health bar a percentage between red and green depending on the health remaining.

        let barWidth = map(percentage, 0, 1, 0, 76); // Makes the size of the health bar proportional to the health remaining.

        fill(gradientColour);
        noStroke();
        rect(this.posX + 10, this.posY + 91, barWidth, 5);
      }
      
      fill(this.colour);
      rect(this.posX + 10, this.posY + 10, CELL_SIZE - 20, CELL_SIZE - 20);
    }
  }
}