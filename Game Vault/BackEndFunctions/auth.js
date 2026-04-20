console.log("auth.js running");

// ── Helpers ──────────────────────────────────────────────────────────────────

function getUsers() {
    return JSON.parse(localStorage.getItem("gv_users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("gv_users", JSON.stringify(users));
}

function getSession() {
    return JSON.parse(localStorage.getItem("gv_session")) || null;
}

function saveSession(user) {
    const { password, ...safeUser } = user;
    localStorage.setItem("gv_session", JSON.stringify(safeUser));
}

function clearSession() {
    localStorage.removeItem("gv_session");
}


(function seedDefaultUsers() {
    if (getUsers().length === 0) {
        saveUsers([
            { id: 1, username: "admin", email: "admin@gamevault.com", password: "admin123", role: "admin" }
        ]);
    }
})();


function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validatePassword(password) {
    return password.length >= 6;
}


/**
 * Register a new user.
 * @returns {{ success: boolean, message: string }}
 */
function register(username, email, password) {
    username = username.trim();
    email    = email.trim().toLowerCase();

    if (!username || !email || !password) {
        return { success: false, message: "All fields are required." };
    }
    if (!validateEmail(email)) {
        return { success: false, message: "Invalid email address." };
    }
    if (!validatePassword(password)) {
        return { success: false, message: "Password must be at least 6 characters." };
    }

    const users = getUsers();

    if (users.find(u => u.email === email)) {
        return { success: false, message: "An account with that email already exists." };
    }
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: "That username is already taken." };
    }

    const newUser = {
        id:       Date.now(),
        username,
        email,
        password, // plain-text — acceptable for a flat-file demo
        role:     "user"
    };

    users.push(newUser);
    saveUsers(users);
    saveSession(newUser);

    return { success: true, message: `Welcome, ${username}!` };
}

/**
 * Log in an existing user (email or username).
 * @returns {{ success: boolean, message: string }}
 */
function login(identifier, password) {
    identifier = identifier.trim().toLowerCase();

    if (!identifier || !password) {
        return { success: false, message: "Please enter your email/username and password." };
    }

    const users = getUsers();
    const user  = users.find(
        u => u.email === identifier || u.username.toLowerCase() === identifier
    );

    if (!user || user.password !== password) {
        return { success: false, message: "Incorrect email/username or password." };
    }

    saveSession(user);
    return { success: true, message: `Welcome back, ${user.username}!` };
}

/** Log out the current user. */
function logout() {
    clearSession();
    window.location.href = "index.html";
}

/** Returns the current session user or null. */
function currentUser() {
    return getSession();
}


function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) { el.textContent = message; el.style.display = "block"; }
}

function hideError(elementId) {
    const el = document.getElementById(elementId);
    if (el) { el.style.display = "none"; }
}


(function updateNavAuth() {
    // Wait for DOM
    document.addEventListener("DOMContentLoaded", () => {
        const user = currentUser();
        document.querySelectorAll("a[href='signin.html']").forEach(link => {
            if (user) {
                link.textContent = user.username;
                link.href = "#";
                link.addEventListener("click", e => { e.preventDefault(); logout(); });
            }
        });
    });
})();