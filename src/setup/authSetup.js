// Authentication and User Data Management for Military Tower Defence Game

"use strict";

// GLOBALS for user authentication and data
let currentUser = null;
let currentUserData = null;

// DOM elements for auth UI
let authFormElements = {};

// --- API helpers using axios ---
const API = axios.create({ baseURL: "http://localhost:3000" });
async function apiPost(path, payload) {
    const { data } = await API.post(path, payload);
    return data;
}

// Simple password hashing (base64 for demo purposes)
function hashPassword(pw) {
    try {
        return btoa(pw);
    } catch (e) {
        // fallback for unicode
        return btoa(unescape(encodeURIComponent(pw)));
    }
}

// Attempt to login, returns true if successful, false otherwise
async function login(username, pw) {
    const res = await apiPost("/login", { username, password: hashPassword(pw) });
    if (res.ok) {
        currentUser = username;
        currentUserData = res.data;
        syncGlobalsWithUserData();
        return true;
    } else {
        return false;
    }
}

// Register a new user and log in
async function register(username, pw) {
    const reg = await apiPost("/register", { username, password: hashPassword(pw) });
    if (reg.ok) {
        // Auto-login after registration
        return await login(username, pw);
    } else {
        return false;
    }
}

// Save current global variables back to currentUserData and disk
async function saveCurrentUserData() {
    if (!currentUser || !currentUserData) return;
    // Update from globals
    currentUserData.medals = (typeof playerBattleMedals !== "undefined") ? playerBattleMedals : 0;
    if (typeof currentUserData.upgrades !== "object") currentUserData.upgrades = {};
    currentUserData.upgrades.projectileUpgrade = (typeof projectileUpgrade !== "undefined") ? projectileUpgrade : 0;
    currentUserData.upgrades.damageUpgrade = (typeof damageUpgrade !== "undefined") ? damageUpgrade : 0;
    currentUserData.upgrades.baseHealthUpgrade = (typeof baseHealthUpgrade !== "undefined") ? baseHealthUpgrade : 0;
    currentUserData.upgrades.enemySpeedUgrade = (typeof enemySpeedUgrade !== "undefined") ? enemySpeedUgrade : 0;
    currentUserData.upgrades.enemyArmourUpgrade = (typeof enemyArmourUpgrade !== "undefined") ? enemyArmourUpgrade : 0;
    currentUserData.upgrades.specialAbilityUpgrade = (typeof specialAbilityUpgrade !== "undefined") ? specialAbilityUpgrade : 0;
    // Save ratings if global 'levels' exists
    if (typeof levels !== "undefined" && Array.isArray(levels)) {
        currentUserData.ratings = levels.map(map =>
            map.map(level =>
                level && typeof level.rating !== "undefined" ? level.rating : 0
            )
        );
    }
    // Write to server
    await apiPost("/save", { username: currentUser, data: currentUserData });
}

// Load user data into global variables after login
function syncGlobalsWithUserData() {
    if (!currentUserData) return;
    // Medals
    if (typeof playerBattleMedals !== "undefined") playerBattleMedals = currentUserData.medals || 0;
    // Upgrades
    if (currentUserData.upgrades) {
        if (typeof projectileUpgrade !== "undefined") projectileUpgrade = currentUserData.upgrades.projectileUpgrade || 0;
        if (typeof damageUpgrade !== "undefined") damageUpgrade = currentUserData.upgrades.damageUpgrade || 0;
        if (typeof baseHealthUpgrade !== "undefined") baseHealthUpgrade = currentUserData.upgrades.baseHealthUpgrade || 0;
        if (typeof enemySpeedUgrade !== "undefined") enemySpeedUgrade = currentUserData.upgrades.enemySpeedUgrade || 0;
        if (typeof enemyArmourUpgrade !== "undefined") enemyArmourUpgrade = currentUserData.upgrades.enemyArmourUpgrade || 0;
        if (typeof specialAbilityUpgrade !== "undefined") specialAbilityUpgrade = currentUserData.upgrades.specialAbilityUpgrade || 0;
    }
    // Ratings: inject into levels
    if (currentUserData.ratings && typeof levels !== "undefined") {
        for (let i = 0; i < levels.length; i++) {
            for (let j = 0; j < (levels[i] ? levels[i].length : 0); j++) {
                if (levels[i][j] && typeof currentUserData.ratings[i] !== "undefined" && typeof currentUserData.ratings[i][j] !== "undefined") {
                    levels[i][j].rating = currentUserData.ratings[i][j];
                }
            }
        }
    }
}

// Auth UI creation/destroy logic
function showAuthUI() {
    hideAllGameDOM();
    // Don't create again if already exists
    if (authFormElements.form) {
        for (let key in authFormElements) {
            if (authFormElements[key] && typeof authFormElements[key].show === "function") {
                authFormElements[key].show();
            } else if (authFormElements[key] && authFormElements[key].style) {
                authFormElements[key].style.display = "block";
            }
        }
        return;
    }
    // Center the form on canvas
    let centerX = 928, centerY = 432, formWidth = 330;

    // Username input
    authFormElements.usernameInput = createInput('');
    authFormElements.usernameInput.position(centerX - formWidth/2 + 25, centerY - 60);
    authFormElements.usernameInput.attribute("placeholder", "Username");
    authFormElements.usernameInput.class("mainMenuButtonClass");

    // Password input
    authFormElements.passwordInput = createInput('', 'password');
    authFormElements.passwordInput.position(centerX - formWidth/2 + 25, centerY - 20);
    authFormElements.passwordInput.attribute("placeholder", "Password");
    authFormElements.passwordInput.class("mainMenuButtonClass");

    // Login button
    authFormElements.loginBtn = createButton('Login');
    authFormElements.loginBtn.position(centerX - formWidth/2 + 25, centerY + 30);
    authFormElements.loginBtn.class("mainMenuButtonClass");
    authFormElements.loginBtn.mousePressed(function() {
        handleAuthSubmit("login");
    });

    // Register button
    authFormElements.registerBtn.class("mainMenuButtonClass");
    authFormElements.registerBtn.mousePressed(function() {
        handleAuthSubmit("register");
    });

    // Message
    authFormElements.message = createP('');
    authFormElements.message.position(centerX - formWidth/2 + 25, centerY + 70);

    // Attach a pseudo-form object for easier hide/show
    authFormElements.form = true;
}

function hideAuthUI() {
    for (let key in authFormElements) {
        if (authFormElements[key] && typeof authFormElements[key].hide === "function") {
            authFormElements[key].hide();
        } else if (authFormElements[key] && authFormElements[key].style) {
            authFormElements[key].style.display = "none";
        }
    }
}

// Hide all game UI buttons for auth state
function hideAllGameDOM() {
    // Try to hide standard buttons if they exist
    if (typeof mainMenuButtonsDisplay === "function") mainMenuButtonsDisplay(false);
    if (typeof mapButtonsDisplay === "function") mapButtonsDisplay(false);
    if (typeof returnToMenuButtonDisplay === "function") returnToMenuButtonDisplay(false);
    if (typeof placeCancelButtonDisplay === "function") placeCancelButtonDisplay(false);
    if (typeof displayRangeButtonDisplay === "function") displayRangeButtonDisplay(false);
    if (typeof towerButtonDisplay === "function") towerButtonDisplay(false);
    if (typeof skillTreeButtonsDisplay === "function") skillTreeButtonsDisplay(false);
    if (typeof campaignButtonsDisplay === "function") campaignButtonsDisplay(false);
    if (typeof specialAbilityButtonDisplay === "function") specialAbilityButtonDisplay(false);
    // Hide logout button if present
    if (window.logoutButton && typeof window.logoutButton.hide === "function") window.logoutButton.hide();
}

// Handle login/register
function handleAuthSubmit(type) {
    if (!authFormElements.usernameInput || !authFormElements.passwordInput) return;
    let username = authFormElements.usernameInput.value().trim();
    let pw = authFormElements.passwordInput.value();
    if (!username || !pw) {
        authFormElements.message.html("Please enter both fields.");
        return;
    }
    if (type === "login") {
        let ok = login(username, pw);
        if (ok) {
            hideAuthUI();
            // Ensure user ratings array is initialized to match levels
            if (typeof levels !== "undefined" && (!currentUserData.ratings || currentUserData.ratings.length !== levels.length)) {
                currentUserData.ratings = levels.map(map => map.map(() => 0));
                saveCurrentUserData();
            }
            syncGlobalsWithUserData();
            gameState = 1; // Go to main menu
        } else {
            authFormElements.message.html("Invalid login.");
        }
    } else if (type === "register") {
        let ok = register(username, pw);
        if (ok) {
            hideAuthUI();
            // Ensure user ratings array is initialized to match levels
            if (typeof levels !== "undefined" && (!currentUserData.ratings || currentUserData.ratings.length !== levels.length)) {
                currentUserData.ratings = levels.map(map => map.map(() => 0));
                saveCurrentUserData();
            }
            syncGlobalsWithUserData();
            gameState = 1; // Go to main menu
        } else {
            authFormElements.message.html("Username already exists.");
        }
    }
}

// Logout button logic (to be called on menu)
function showLogoutButton() {
    if (!currentUser) return;
    if (!window.logoutButton) {
        window.logoutButton = createButton("Logout");
        window.logoutButton.position(40, 22);
        window.logoutButton.class("logout-btn");
        window.logoutButton.mousePressed(function() {
            saveCurrentUserData();
            currentUser = null;
            currentUserData = null;
            gameState = 0; // Back to auth
            showAuthUI();
        });
    }
    window.logoutButton.show();
}

// Hide logout button
function hideLogoutButton() {
    if (window.logoutButton && typeof window.logoutButton.hide === "function") {
        window.logoutButton.hide();
    }
}

// Listen for window unload to auto-save
window.onbeforeunload = function() {
    saveCurrentUserData();
};