// Written by James Baldwin for my Computer Science NEA Coursework. Started on 22/08/23. This file contains the class for a queue structure.

"use strict";

class queue {

    // Constructor for the class.
    constructor() {
        this.queue = [];
        this.head = 0;
        this.tail = 0;
    }

    // Pushes a given item to the queue.
    enqueue(newItem) {
        if (this.tail!=this.queue.length) {
            return false;
        } else {
            this.queue[this.tail] = newItem;
            this.tail++;
        }
    }

    // Removes the item at the start of the queue.
    dequeue() {
        if (this.head==this.tail) {
            return false;
        } else {
            let item = this.queue[this.head];
            this.head++;
            return item;
        }
    }

    // Clears the queue.
    clear() {
        this.queue = [];
        this.head = 0;
        this.tail = 0;
    }
}