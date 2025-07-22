// Written by James Baldwin for my Computer Science NEA Coursework. Started on 19/06/23. This file contains the base class for the enemy, used for soldiers and special forces. 

"use strict";

class enemyBasic {

  // Constructor method for the class.
  constructor(health, speed, map, colour, pointer, changeOfDirection) {
    this.posX = MAP_TILE_X[0];
    this.posY = MAP_TILE_Y[4];
    this.nextX = MAP_TILE_X[1];
    this.nextY = MAP_TILE_Y[4];
    this.health = health;
    this.healthMax = health;
    this.speed = speed * (1 - upgradePercent(enemySpeedUgrade)); // The rate at which the enemy moves to the text square.
    this.colour = colour;
    this.map = map; // Current map.
    this.mapPassed = [ // Tracks where the enemy has already been on the map so it doesn't go back on itself.
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
    ];
    this.pointer = pointer; // Position in the queue.
    this.move = false; // Contains the direction which the enemy is moving (false is left or right, true is up or down).
    this.changeOfDirection = changeOfDirection;
  }

  // Updates the enemies position each frame.
  update(queue) {
    let i = Math.floor(this.posX / CELL_SIZE);
    let j = Math.floor(this.posY / CELL_SIZE);

    // Checks if adjacent tiles are path tiles and need to be moved onto.
    if (this.map[i + 1][j] == 1 && this.mapPassed[i + 1][j] == 0 && distance(this.posX, this.posY, this.nextX, this.nextY) < 1) {
      this.mapPassed[i][j] = 1;
      this.nextX = (i + 1) * CELL_SIZE;
      this.move = false;
      
    } else if (i >= 1 && this.map[i - 1][j] == 1 && this.mapPassed[i - 1][j] == 0 && distance(this.posX, this.posY, this.nextX, this.nextY) < 1) {
      this.mapPassed[i][j] = 1;
      this.nextX = (i - 1) * CELL_SIZE;
      this.move = false;

    } else if (this.map[i][j + 1] == 1 && this.mapPassed[i][j + 1] == 0 && distance(this.posX, this.posY, this.nextX, this.nextY) < 1) {
      this.mapPassed[i][j] = 1;
      this.nextY = (j + 1) * CELL_SIZE;
      this.move = true;

    } else if (j >= 1 && this.map[i][j - 1] == 1 && this.mapPassed[i][j - 1] == 0 && distance(this.posX, this.posY, this.nextX, this.nextY) < 1) {
      this.mapPassed[i][j] = 1;
      this.nextY = (j - 1) * CELL_SIZE;
      this.move = true;

    } else if (this.map[i + 1][j] == 2 && this.mapPassed[i + 1][j] == 0) { // If the next tile is the user base then the enemy damages it and disappears. 
      if (baseHealth > 0) {
        baseHealth -= this.health;
      }
      queue.dequeue();
    }

    // Checks whether the x or y direction needs to be changed and changes it, as well as checking if the enemy has moved to the next tile.
    switch (this.move) {
      case false:
        if (Math.abs(this.nextX - this.posX) < this.changeOfDirection) {
          this.posX = this.nextX;
        } else {
          this.posX = cosineInterpolate(this.posX, this.nextX, this.speed);
        }
        break;

      case true:
        if (Math.abs(this.nextY - this.posY) < this.changeOfDirection) {
          this.posY = this.nextY;
        } else {
          this.posY = cosineInterpolate(this.posY, this.nextY, this.speed);
        }
        break;
    }

    // If the end of the current tile is reached, it is marked as passed.
    if (distance(this.posX, this.posY, this.nextX, this.nextY) < this.changeOfDirection) {
      this.mapPassed[i][j] = 1;
    }
    this.display();
  }

  // If the enemies still has health, it is displayed.
  display() {
    if (this.health > 0) {
      if (this.health < this.healthMax) {
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