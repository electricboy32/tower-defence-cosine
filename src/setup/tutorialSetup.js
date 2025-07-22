// Lightweight Tutorial Mode Overlay for gameState 4

let tutorialSteps = [
    "Welcome to the Tutorial! Let's learn the basics.",
    "Step 1: Select a map to begin your campaign.",
    "Step 2: Place your first tower by clicking on a buildable spot.",
    "Step 3: Use your special ability if it's available! (Button will appear during gameplay.)",
    "Step 4: Finish a wave by defeating all enemies.",
    "That's it! You're ready to play. Click Next to return to the main menu."
];
let tutorialIndex = 0;
let tutorialP = null;
let tutorialNextButton = null;
let tutorialMenuButton = null;
let tutorialActive = false;

function showTutorial() {
    // Only activate tutorial once per entry into gameState 4
    if (!tutorialActive) {
        tutorialActive = true;
        tutorialIndex = 0;
        hideAllUIExceptTutorial();
        createTutorialUI();
    }
    // If tutorial DOM elements were removed (e.g. on menu return), recreate if still in tutorial
    else if (!tutorialP || !tutorialNextButton || !tutorialMenuButton) {
        createTutorialUI();
    }
}

function createTutorialUI() {
    removeTutorialUI(); // Defensive: clear any old UI

    tutorialP = createP(tutorialSteps[tutorialIndex]);
    tutorialP.style("font-size", "1.7em");
    tutorialP.style("color", "#fff");
    tutorialP.style("background", "rgba(32,32,32,0.85)");
    tutorialP.style("padding", "18px 30px");
    tutorialP.style("border-radius", "12px");
    tutorialP.style("max-width", "800px");
    tutorialP.position(windowWidth/2 - 400, 30);

    tutorialNextButton = createButton(tutorialIndex < tutorialSteps.length - 1 ? "Next" : "Finish");
    tutorialNextButton.style("font-size", "1.2em");
    tutorialNextButton.style("margin-top", "24px");
    tutorialNextButton.position(windowWidth/2 - 60, 120);
    tutorialNextButton.mousePressed(() => {
        tutorialIndex++;
        if (tutorialIndex < tutorialSteps.length) {
            // Update message
            tutorialP.html(tutorialSteps[tutorialIndex]);
            tutorialNextButton.html(tutorialIndex < tutorialSteps.length - 1 ? "Next" : "Finish");
        } else {
            endTutorial();
        }
    });

    tutorialMenuButton = createButton("Return to Menu");
    tutorialMenuButton.style("margin-left", "18px");
    tutorialMenuButton.style("font-size", "1.1em");
    tutorialMenuButton.position(windowWidth/2 + 60, 120);
    tutorialMenuButton.mousePressed(() => {
        endTutorial();
    });
}

// Hide all non-tutorial UI (like auth does), so only tutorial overlay and menu button are visible
function hideAllUIExceptTutorial() {
    if (typeof mainMenuButtonsDisplay === "function") mainMenuButtonsDisplay(false);
    if (typeof mapButtonsDisplay === "function") mapButtonsDisplay(false);
    if (typeof towerButtonDisplay === "function") towerButtonDisplay(false);
    if (typeof displayRangeButtonDisplay === "function") displayRangeButtonDisplay(false);
    if (typeof skillTreeButtonsDisplay === "function") skillTreeButtonsDisplay(false);
    if (typeof campaignButtonsDisplay === "function") campaignButtonsDisplay(false);
    if (typeof specialAbilityButtonDisplay === "function") specialAbilityButtonDisplay(false);
    if (typeof returnToMenuButtonDisplay === "function") returnToMenuButtonDisplay(true);
    if (typeof placeCancelButtonDisplay === "function") placeCancelButtonDisplay(false);
    // You could add more UI hiding here if needed
}

function removeTutorialUI() {
    if (tutorialP) { tutorialP.remove(); tutorialP = null; }
    if (tutorialNextButton) { tutorialNextButton.remove(); tutorialNextButton = null; }
    if (tutorialMenuButton) { tutorialMenuButton.remove(); tutorialMenuButton = null; }
}

function endTutorial() {
    removeTutorialUI();
    tutorialActive = false;
    gameState = 1; // Return to main menu
}

// Defensive: reset tutorial if gameState leaves 4 unexpectedly
function maybeResetTutorial() {
    if (gameState !== 4 && tutorialActive) {
        removeTutorialUI();
        tutorialActive = false;
    }
}

// Optionally call maybeResetTutorial() in draw() if needed elsewhere