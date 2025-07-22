// Written by James Baldwin for my Computer Science NEA Coursework. Started on 22/08/23. This file contains the class for a queue structure.

"use strict";

class projectileQueue extends queue {

    // Constructor method for the class. No new attributes needed and no attributes passed into queue class hence it looks a bit empty.
    constructor() {
        super();
    }

    // Updates the posistion of each projectile in the queue.
    updatePosistion() {
        for (let i = this.head; i < this.tail; i++) {
            this.queue[i].update();
        }
    }
}