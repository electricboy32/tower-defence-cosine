const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
const USERS_PATH = path.join(DATA_DIR, "users.json");
const PORT = 3000;

// Ensure data directory and users.json file exist
fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(USERS_PATH)) {
    fs.writeFileSync(USERS_PATH, "{}");
}

// Helper to read user data atomically
function readUsers() {
    let raw = fs.readFileSync(USERS_PATH, "utf-8");
    return JSON.parse(raw || "{}");
}

// Helper to write user data atomically
function writeUsers(users) {
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

const app = express();
app.use(cors());
app.use(express.json());

// GET /users -- return all users object
app.get("/users", (req, res) => {
    try {
        const users = readUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ ok: false, msg: "Failed to read users." });
    }
});

// POST /login -- { username, password }
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.json({ ok: false, msg: "Missing fields" });
    const users = readUsers();
    if (!(username in users)) return res.json({ ok: false, msg: "No such user" });
    if (users[username].password !== password) return res.json({ ok: false, msg: "Incorrect password" });
    const { password: _pw, ...data } = users[username];
    res.json({ ok: true, data: { ...data, password: undefined } });
});

// POST /register -- { username, password }
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.json({ ok: false, msg: "Missing fields" });
    const users = readUsers();
    if (users[username]) return res.json({ ok: false, msg: "Username exists" });
    // Default user data structure
    users[username] = {
        password,
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
    writeUsers(users);
    res.json({ ok: true });
});

// POST /save -- { username, data }
app.post("/save", (req, res) => {
    const { username, data } = req.body;
    if (!username || !data) return res.json({ ok: false, msg: "Missing fields" });
    const users = readUsers();
    if (!users[username]) return res.json({ ok: false, msg: "User not found" });
    // Merge password (don't overwrite with undefined)
    const password = users[username].password;
    users[username] = { ...data, password };
    writeUsers(users);
    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});