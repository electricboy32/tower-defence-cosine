// Written by James Baldwin for my Computer Science NEA Coursework. Started on 14/06/23. This file sets up all the most important global variables and subroutines.

"use strict";

const AUTH_STATE = 0;
// Start directly in the main menu
let gameState = 1;

let playerScore = 0;
let playerCash = 500;
let playerBattleMedals = 0; // Will be loaded after login

// --- Auth system globals (defined in authSetup.js) ---
// let currentUser = null;
// let currentUserData = null;

let baseHealthMax = 1000;
let baseHealth = baseHealthMax;

let towerPlace = false;

let chosenMapInt;

// Returns a random integer between a min (inclusive) and max (exclusive) using the Javascript built-in Math library.
function randomInteger(min, max) {
    return Math.random() * (max - min) + min;
}

// Returns the distance between 2 given points.
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Linear interpolates between a given number using the third parameter.
function linearInterpolate(min, max, ratio) {
    ratio = Math.max(0, Math.min(ratio, 1)); // Ensures ratio is between 0 and 1 to allow ease of multiplication.
    return (max - min) * ratio + min;
}

// Cosine interpolation using linear interpolation to make the animation smoother.
function cosineInterpolate(min, max, ratio) {
    angleMode(RADIANS); 
    return linearInterpolate(min, max, (1 - cos(ratio*PI)) / 2);
}