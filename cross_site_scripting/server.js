const express = require("express");

const app = express();
const PORT = 3000;

// Escape special HTML characters before displaying user input
function escapeHTML(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Home page
app.get("/", (req, res) => {
    res.send(`
        <h1>Reflected XSS Demonstration</h1>
        <p><a href="/vulnerable">Vulnerable Search Page</a></p>
        <p><a href="/secure">Secure Search Page</a></p>
    `);
});

// Vulnerable version: intentionally unsafe for local testing
app.get("/vulnerable", (req, res) => {
    const q = req.query.q || "";

    res.send(`
        <h1>Vulnerable Search Page</h1>

        <form action="/vulnerable" method="GET">
            <input type="text" name="q"
                   placeholder="Enter your search">
            <button type="submit">Search</button>
        </form>

        <p>You searched for: ${q}</p>

        <p><a href="/">Home</a></p>
    `);
});

// Secure version
app.get("/secure", (req, res) => {
    const q = req.query.q || "";
    const safeQ = escapeHTML(q);

    res.send(`
        <h1>Secure Search Page</h1>

        <form action="/secure" method="GET">
            <input type="text" name="q"
                   placeholder="Enter your search">
            <button type="submit">Search</button>
        </form>

        <p>You searched for: ${safeQ}</p>

        <p><a href="/">Home</a></p>
    `);
});

app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});