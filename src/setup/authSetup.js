// Node.js local file-based authentication for Military Tower Defence Game

const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_PATH = path.join(DATA_DIR, 'userinfo.json');
const MIN_PASSWORD_LENGTH = 8;

// Show a SweetAlert2 modal, fallback to alert if Swal is missing
function showGameDialog(title, message, icon = 'warning') {
  if (typeof Swal !== 'undefined') {
    Swal.fire({ title, text: message, icon, confirmButtonText: 'OK' });
  } else {
    alert(title + "\n\n" + message); // graceful fallback
  }
}

// Ensure data directory and file exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, '{}');

let currentUser = null;
let currentUserData = null;
let authFormElements = {};

function loadUsersFromFile() {
    try {
        const raw = fs.readFileSync(DATA_PATH, 'utf8');
        return JSON.parse(raw || '{}');
    } catch (e) {
        return {};
    }
}

function saveUsersToFile(obj) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(obj, null, 2));
}

// Simple password hashing
function hashPassword(pw) {
    try {
        return btoa(pw);
    } catch (e) {
        // fallback for unicode
        return btoa(unescape(encodeURIComponent(pw)));
    }
}

// Returns true if password meets security requirements
function isPasswordValid(pw) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pw);
}

// Returns true if login success, else false
function login(username, pw) {
    const users = loadUsersFromFile();
    if (users[username] && users[username].password === hashPassword(pw)) {
        currentUser = username;
        currentUserData = users[username];
        syncGlobalsWithUserData();
        return true;
    }
    return false;
}

// Returns true if registration success (and logs in), else false
function register(username, pw) {
    const users = loadUsersFromFile();
    if (users[username]) return false;
    if (!isPasswordValid(pw)) return false;
    users[username] = {
        password: hashPassword(pw),
        medals: 0,
        upgrades: {
            projectileUpgrade: 0,
            damageUpgrade: 0,
            baseHealthUpgrade: 0,
            enemySpeedUgrade: 0,
            enemyArmourUpgrade: 0,
            specialAbilityUpgrade: 0
        },
        ratings: []
    };
    saveUsersToFile(users);
    return login(username, pw);
}

// Save in-memory globals to file
function saveCurrentUserData() {
    if (!currentUser || !currentUserData) return;
    currentUserData.medals = (typeof playerBattleMedals !== "undefined") ? playerBattleMedals : 0;
    if (typeof currentUserData.upgrades !== "object") currentUserData.upgrades = {};
    currentUserData.upgrades.projectileUpgrade = (typeof projectileUpgrade !== "undefined") ? projectileUpgrade : 0;
    currentUserData.upgrades.damageUpgrade = (typeof damageUpgrade !== "undefined") ? damageUpgrade : 0;
    currentUserData.upgrades.baseHealthUpgrade = (typeof baseHealthUpgrade !== "undefined") ? baseHealthUpgrade : 0;
    currentUserData.upgrades.enemySpeedUgrade = (typeof enemySpeedUgrade !== "undefined") ? enemySpeedUgrade : 0;
    currentUserData.upgrades.enemyArmourUpgrade = (typeof enemyArmourUpgrade !== "undefined") ? enemyArmourUpgrade : 0;
    currentUserData.upgrades.specialAbilityUpgrade = (typeof specialAbilityUpgrade !== "undefined") ? specialAbilityUpgrade : 0;
    if (typeof levels !== "undefined" && Array.isArray(levels)) {
        currentUserData.ratings = levels.map(map =>
            map.map(level =>
                level && typeof level.rating !== "undefined" ? level.rating : 0
            )
        );
    }
    const users = loadUsersFromFile();
    users[currentUser] = currentUserData;
    saveUsersToFile(users);
}

// Load user data into global variables after login
function syncGlobalsWithUserData() {
    if (!currentUserData) return;
    if (typeof playerBattleMedals !== "undefined") playerBattleMedals = currentUserData.medals || 0;
    if (currentUserData.upgrades) {
        if (typeof projectileUpgrade !== "undefined") projectileUpgrade = currentUserData.upgrades.projectileUpgrade || 0;
        if (typeof damageUpgrade !== "undefined") damageUpgrade = currentUserData.upgrades.damageUpgrade || 0;
        if (typeof baseHealthUpgrade !== "undefined") baseHealthUpgrade = currentUserData.upgrades.baseHealthUpgrade || 0;
        if (typeof enemySpeedUgrade !== "undefined") enemySpeedUgrade = currentUserData.upgrades.enemySpeedUgrade || 0;
        if (typeof enemyArmourUpgrade !== "undefined") enemyArmourUpgrade = currentUserData.upgrades.enemyArmourUpgrade || 0;
        if (typeof specialAbilityUpgrade !== "undefined") specialAbilityUpgrade = currentUserData.upgrades.specialAbilityUpgrade || 0;
    }
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

    // (message element removed)

    // Username input
    authFormElements.usernameInput = createInput('');
    authFormElements.usernameInput.position(centerX - 160, centerY - 150);
    authFormElements.usernameInput.attribute("placeholder", "Username");
    authFormElements.usernameInput.class("authInputClass");
    authFormElements.usernameInput.size(320, 50);

    // Password input
    authFormElements.passwordInput = createInput('', 'password');
    authFormElements.passwordInput.position(centerX - 160, centerY - 60);
    authFormElements.passwordInput.attribute("placeholder", "Password");
    authFormElements.passwordInput.class("authInputClass");
    authFormElements.passwordInput.size(320, 50);

    // Password requirements info div (hidden by default)
    authFormElements.passwordInfo = createDiv("Password must be at least 8 characters long and include uppercase, lowercase and a number.");
    authFormElements.passwordInfo.position(centerX - 160, centerY - 60 + 60);
    authFormElements.passwordInfo.size(320);
    authFormElements.passwordInfo.class("passwordInfoClass");
    authFormElements.passwordInfo.style("display", "none");

    // Show info on password input focus, hide on blur
    authFormElements.passwordInput.elt.addEventListener('focus', () => {
        authFormElements.passwordInfo.style("display", "block");
    });
    authFormElements.passwordInput.elt.addEventListener('blur', () => {
        authFormElements.passwordInfo.style("display", "none");
    });

    // Login button
    authFormElements.loginBtn = createButton('Login');
    authFormElements.loginBtn.position(centerX - 100, centerY + 40);
    authFormElements.loginBtn.class("authButtonClass");
    authFormElements.loginBtn.size(240, 50);
    authFormElements.loginBtn.mousePressed(function() {
        handleAuthSubmit("login");
    });

    // Register button
    authFormElements.registerBtn = createButton('Register');
    authFormElements.registerBtn.position(centerX - 100, centerY + 110);
    authFormElements.registerBtn.class("authButtonClass");
    authFormElements.registerBtn.size(240, 50);
    authFormElements.registerBtn.mousePressed(function() {
        handleAuthSubmit("register");
    });

    // (message element removed)

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
    if (typeof mainMenuButtonsDisplay === "function") mainMenuButtonsDisplay(false);
    if (typeof mapButtonsDisplay === "function") mapButtonsDisplay(false);
    if (typeof returnToMenuButtonDisplay === "function") returnToMenuButtonDisplay(false);
    if (typeof placeCancelButtonDisplay === "function") placeCancelButtonDisplay(false);
    if (typeof displayRangeButtonDisplay === "function") displayRangeButtonDisplay(false);
    if (typeof towerButtonDisplay === "function") towerButtonDisplay(false);
    if (typeof skillTreeButtonsDisplay === "function") skillTreeButtonsDisplay(false);
    if (typeof campaignButtonsDisplay === "function") campaignButtonsDisplay(false);
    if (typeof specialAbilityButtonDisplay === "function") specialAbilityButtonDisplay(false);
    if (window.logoutButton && typeof window.logoutButton.hide === "function") window.logoutButton.hide();
}

// Handle login/register
function handleAuthSubmit(type) {
    if (!authFormElements.usernameInput || !authFormElements.passwordInput) return;
    let username = authFormElements.usernameInput.value().trim();
    let pw = authFormElements.passwordInput.value();
    // (message element removed)
    if (!username || !pw) {
        showGameDialog('Missing Information', 'Please enter both fields.');
        return;
    }
    const users = loadUsersFromFile();
    if (type === "login") {
        if (!users[username]) {
            showGameDialog('Account Not Found', 'Account not found. Please register.');
            return;
        }
        if (users[username].password !== hashPassword(pw)) {
            showGameDialog('Incorrect Password', 'Incorrect password.');
            return;
        }
        let ok = login(username, pw);
        if (ok) {
            hideAuthUI();
            if (typeof levels !== "undefined" && (!currentUserData.ratings || currentUserData.ratings.length !== levels.length)) {
                currentUserData.ratings = levels.map(map => map.map(() => 0));
                saveCurrentUserData();
            }
            syncGlobalsWithUserData();
            gameState = 1;
        }
    } else if (type === "register") {
        if (users[username]) {
            showGameDialog('Username Already Exists', 'Username already exists.');
            return;
        }
        if (!isPasswordValid(pw)) {
            showGameDialog('Invalid Password', 'Password must be at least 8 characters long and include uppercase, lowercase and a number.');
            return;
        }
        let ok = register(username, pw);
        if (ok) {
            hideAuthUI();
            if (typeof levels !== "undefined" && (!currentUserData.ratings || currentUserData.ratings.length !== levels.length)) {
                currentUserData.ratings = levels.map(map => map.map(() => 0));
                saveCurrentUserData();
            }
            syncGlobalsWithUserData();
            gameState = 1;
        }
    }
}

// Logout button logic (to be called on menu)
function showLogoutButton() {
    if (!currentUser) return;
    if (!window.logoutButton) {
        window.logoutButton = createButton("Logout");
        window.logoutButton.position(40, 22);
        window.logoutButton.class("logoutButtonClass");
        window.logoutButton.size(150, 40);
        window.logoutButton.mousePressed(function() {
            saveCurrentUserData();
            currentUser = null;
            currentUserData = null;
            gameState = 0;
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