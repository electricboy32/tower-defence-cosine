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

// Show password requirements as a toast/banner at top of screen
let passwordReqDiv = null;
function showPasswordRequirements() {
  const msg = "Password must be at least 8 characters long and include uppercase, lowercase and a number.";
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      toast: true,
      position: 'top',
      icon: 'info',
      title: msg,
      showConfirmButton: false,
      timer: 6000,
      timerProgressBar: true
    });
  } else {
    if (!passwordReqDiv) {
      passwordReqDiv = createDiv(msg);
      passwordReqDiv.position(0, 0);
      passwordReqDiv.style('width', '100%');
      passwordReqDiv.style('padding', '12px 0');
      passwordReqDiv.style('background', '#333');
      passwordReqDiv.style('color', '#fff');
      passwordReqDiv.style('font-size', '16px');
      passwordReqDiv.style('text-align', 'center');
      passwordReqDiv.style('z-index', '9999');
      passwordReqDiv.style('position', 'fixed');
      passwordReqDiv.style('left', '0');
      passwordReqDiv.style('top', '0');
      passwordReqDiv.style('box-shadow', '0 2px 8px rgba(0,0,0,0.2)');
      passwordReqDiv.hide();
    }
    passwordReqDiv.html(msg);
    passwordReqDiv.show();
    setTimeout(() => {
      if (passwordReqDiv) passwordReqDiv.hide();
    }, 6000);
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

// --- AUTH MODE STATE ---
let authMode = 'login'; // 'login' or 'register'

/** Switch between login/register auth modes and rebuild UI */
function switchAuthMode(mode) {
    if (authMode !== mode) {
        authMode = mode;
        hideAuthUI();
        authFormElements = {};
        showAuthUI();
    }
}

// Auth UI creation/destroy logic
function showAuthUI() {
    const inMenu = (typeof gameState !== 'undefined' && gameState === 1);

    // If we're in the main menu, show compact widget in top-left
    // --- Main-menu compact auth widget ---
    if (inMenu) {
        // If the compact form for this mode is already present, just show & exit
        if (authFormElements.form && authFormElements.compact && authFormElements.mode === authMode) {
            for (let k in authFormElements) {
                if (authFormElements[k] && typeof authFormElements[k].show === 'function') {
                    authFormElements[k].show();
                } else if (authFormElements[k] && authFormElements[k].style) {
                    authFormElements[k].style.display = 'block';
                }
            }
            return;
        }
        // Rebuild widget (first time or mode change)
        hideAuthUI();
        authFormElements = {};

        // Widget X/Y follows logout button (X=40, Y=15 for top edge, 22 for button alignment)
        const widgetX = 40, widgetY = 15;
        const btnW = 150, btnH = 40;   // match logout button
        const inputW = 150, inputH = 35;
        const gap = 24;          // consistent vertical gap

        // Message
        authFormElements.message = createDiv("Login or make an account to save progress");
        authFormElements.message.position(widgetX, widgetY);
        authFormElements.message.style('font-size', '16px');
        authFormElements.message.style('color', '#222');
        authFormElements.message.style('background', 'rgba(255,255,255,0.92)');
        authFormElements.message.style('padding', '3px 12px 3px 8px');
        authFormElements.message.style('border-radius', '8px 8px 4px 4px');
        authFormElements.message.style('max-width', '260px');
        authFormElements.message.style('box-shadow', '0 2px 8px rgba(0,0,0,0.07)');
        authFormElements.message.style('z-index', '5'); // lower than inputs/buttons
        authFormElements.message.style('font-family', 'inherit');
        authFormElements.message.style('pointer-events', 'none'); // allow clicks to pass through

        // Compute message element height and use it to offset y for inputs
        const messageHeight = authFormElements.message.elt.offsetHeight || 0;
        let y = widgetY + messageHeight + gap;

        // Username input
        authFormElements.usernameInput = createInput('');
        authFormElements.usernameInput.position(widgetX, y);
        authFormElements.usernameInput.attribute("placeholder", "Username");
        authFormElements.usernameInput.class("authInputClass");
        authFormElements.usernameInput.size(inputW, inputH);
        authFormElements.usernameInput.style('z-index','10');

        y += inputH + gap;

        // Password input
        authFormElements.passwordInput = createInput('', 'password');
        authFormElements.passwordInput.position(widgetX, y);
        authFormElements.passwordInput.attribute("placeholder", "Password");
        authFormElements.passwordInput.class("authInputClass");
        authFormElements.passwordInput.size(inputW, inputH);
        authFormElements.passwordInput.style('z-index','10');

        y += inputH + gap;

        if (authMode === "login") {
            // Login button
            authFormElements.loginBtn = createButton('Login');
            authFormElements.loginBtn.position(widgetX, y);
            authFormElements.loginBtn.size(btnW, btnH);
            authFormElements.loginBtn.class("logoutButtonClass");
            authFormElements.loginBtn.style('z-index','10');
            authFormElements.loginBtn.mousePressed(function() {
                handleAuthSubmit("login");
            });

            y += btnH + gap;

            // Register button (switches to register mode)
            authFormElements.registerBtn = createButton('Register');
            authFormElements.registerBtn.position(widgetX, y);
            authFormElements.registerBtn.size(btnW, btnH);
            authFormElements.registerBtn.class("logoutButtonClass");
            authFormElements.registerBtn.style('z-index','10');
            authFormElements.registerBtn.mousePressed(function() {
                switchAuthMode("register");
            });
        } else if (authMode === "register") {
            // Confirm password input (above Register/Back buttons)
            authFormElements.confirmPasswordInput = createInput('', 'password');
            authFormElements.confirmPasswordInput.position(widgetX, y);
            authFormElements.confirmPasswordInput.attribute("placeholder", "Repeat Password");
            authFormElements.confirmPasswordInput.class("authInputClass");
            authFormElements.confirmPasswordInput.size(inputW, inputH);
            authFormElements.confirmPasswordInput.style('z-index','10');

            y += inputH + gap;

            // Register submit button
            authFormElements.registerSubmitBtn = createButton('Register');
            authFormElements.registerSubmitBtn.position(widgetX, y);
            authFormElements.registerSubmitBtn.size(btnW, btnH);
            authFormElements.registerSubmitBtn.class("logoutButtonClass");
            authFormElements.registerSubmitBtn.style('z-index','10');
            authFormElements.registerSubmitBtn.mousePressed(function() {
                handleAuthSubmit("register");
            });

            y += btnH + gap;

            // Back to Login button
            authFormElements.backBtn = createButton('Back to Login');
            authFormElements.backBtn.position(widgetX, y);
            authFormElements.backBtn.size(btnW, btnH);
            authFormElements.backBtn.class("logoutButtonClass");
            authFormElements.backBtn.style('z-index','10');
            authFormElements.backBtn.mousePressed(function() {
                switchAuthMode("login");
            });

            // Attach password requirements popup ONLY to this field
            authFormElements.passwordInput.elt.addEventListener('focus', showPasswordRequirements);
        }

        // Track mode for UI reuse checks
        authFormElements.mode = authMode;
        authFormElements.form = true;
        authFormElements.compact = true;
        return;
    }

    // --- ELSE: not in main menu, keep existing behavior ---
    hideAllGameDOM();

    // If form for this mode is already displayed, just show and return
    if (authFormElements.form && authFormElements.mode === authMode) {
        for (let key in authFormElements) {
            if (authFormElements[key] && typeof authFormElements[key].show === "function") {
                authFormElements[key].show();
            } else if (authFormElements[key] && authFormElements[key].style) {
                authFormElements[key].style.display = "block";
            }
        }
        return;
    }

    // Hide old elements if any and clear
    hideAuthUI();
    authFormElements = {};

    // --- Fullscreen (centered) auth UI ---
    let centerX = 928, centerY = 432, formWidth = 330;

    if (authMode === "login") {
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
            switchAuthMode("register");
        });

    } else if (authMode === "register") {
        // Username input
        authFormElements.usernameInput = createInput('');
        authFormElements.usernameInput.position(centerX - 160, centerY - 200);
        authFormElements.usernameInput.attribute("placeholder", "Username");
        authFormElements.usernameInput.class("authInputClass");
        authFormElements.usernameInput.size(320, 50);

        // Password input
        authFormElements.passwordInput = createInput('', 'password');
        authFormElements.passwordInput.position(centerX - 160, centerY - 120);
        authFormElements.passwordInput.attribute("placeholder", "Password");
        authFormElements.passwordInput.class("authInputClass");
        authFormElements.passwordInput.size(320, 50);

        // Attach password requirements popup ONLY to this field
        authFormElements.passwordInput.elt.addEventListener('focus', showPasswordRequirements);

        // Confirm password input
        authFormElements.confirmPasswordInput = createInput('', 'password');
        authFormElements.confirmPasswordInput.position(centerX - 160, centerY - 40);
        authFormElements.confirmPasswordInput.attribute("placeholder", "Repeat Password");
        authFormElements.confirmPasswordInput.class("authInputClass");
        authFormElements.confirmPasswordInput.size(320, 50);

        // Register submit button
        authFormElements.registerSubmitBtn = createButton('Register');
        authFormElements.registerSubmitBtn.position(centerX - 100, centerY + 60);
        authFormElements.registerSubmitBtn.class("authButtonClass");
        authFormElements.registerSubmitBtn.size(240, 50);
        authFormElements.registerSubmitBtn.mousePressed(function() {
            handleAuthSubmit("register");
        });

        // Back to Login button
        authFormElements.backBtn = createButton('Back to Login');
        authFormElements.backBtn.position(centerX - 100, centerY + 130);
        authFormElements.backBtn.class("authButtonClass");
        authFormElements.backBtn.size(240, 50);
        authFormElements.backBtn.mousePressed(function() {
            switchAuthMode("login");
        });
    }

    // Track mode to allow UI reuse checks
    authFormElements.mode = authMode;
    authFormElements.form = true;
}

function hideAuthUI() {
    for (let key in authFormElements) {
        if (authFormElements[key] && typeof authFormElements[key].hide === "function") {
            authFormElements[key].hide();
        } else if (authFormElements[key] && authFormElements[key].style) {
            authFormElements[key].style.display = "none";
        }
        // Remove password requirements popup listener if present (cleanup)
        if (
            key === "passwordInput" &&
            authFormElements[key] &&
            authFormElements[key].elt &&
            typeof authFormElements[key].elt.removeEventListener === "function"
        ) {
            authFormElements[key].elt.removeEventListener('focus', showPasswordRequirements);
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

    // Hide Arcade Start Game button if present
    if (typeof startGameButtonDisplay === "function") startGameButtonDisplay(false);
}

// Handle login/register
function handleAuthSubmit(type) {
    if (!authFormElements.usernameInput || !authFormElements.passwordInput) return;
    let username = authFormElements.usernameInput.value().trim();
    let pw = authFormElements.passwordInput.value();

    if (!username || !pw) {
        showGameDialog('Missing Information', 'Please enter all required fields.');
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
        // New: check both passwords present and match
        if (!authFormElements.confirmPasswordInput) {
            showGameDialog('Error', 'Repeat password field missing.');
            return;
        }
        let confirmPw = authFormElements.confirmPasswordInput.value();
        if (!confirmPw) {
            showGameDialog('Missing Information', 'Please repeat your password.');
            return;
        }
        if (pw !== confirmPw) {
            showGameDialog('Passwords Do Not Match', 'The passwords you entered do not match. Please try again.');
            return;
        }
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
            gameState = 1; // Go back to main menu after logout
            showAuthUI();  // Show compact auth widget in menu
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