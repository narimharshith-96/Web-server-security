require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false, limit: "10kb" }));

const pool = mysql.createPool({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "sql_injection_lab",
    waitForConnections: true,
    connectionLimit: 5
});

const styles = `
:root {
    color-scheme: dark;
    --bg: #090d19;
    --panel: #11182a;
    --border: #27324b;
    --text: #edf2ff;
    --muted: #98a6c4;
    --blue: #7c8cff;
    --green: #43d9a3;
    --red: #ff7d91;
}
* { box-sizing: border-box; }
body {
    margin: 0;
    background: radial-gradient(ellipse at top, #192343 0, var(--bg) 55%);
    color: var(--text);
    font-family: Inter, "Segoe UI", Arial, sans-serif;
    line-height: 1.6;
}
a { color: #b6c0ff; text-decoration: none; }
button, input { font: inherit; }
button, .button {
    border: 0;
    border-radius: 10px;
    padding: 12px 16px;
    font-weight: 700;
    cursor: pointer;
    transition: .2s;
}
button:hover, .button:hover { filter: brightness(1.12); }
.primary { background: var(--blue); color: #090d19; }
.secondary {
    background: #202b43;
    border: 1px solid #394765;
    color: var(--text);
}
.wrap { max-width: 1120px; width: 92%; margin: auto; }
nav {
    display: flex; justify-content: space-between;
    align-items: center; gap: 16px; flex-wrap: wrap;
    padding: 22px 0; border-bottom: 1px solid var(--border);
}
.brand { font-size: 19px; font-weight: 800; letter-spacing: -.4px; }
.brand span { color: var(--blue); }
.pill {
    border: 1px solid #354361; border-radius: 99px;
    padding: 6px 11px; color: var(--muted); font-size: 12px;
}
.hero { padding: 55px 0 30px; }
.eyebrow {
    color: var(--green); font-size: 12px;
    font-weight: 800; letter-spacing: 2px; text-transform: uppercase;
}
h1 { font-size: clamp(34px, 5vw, 54px); line-height: 1.12; margin: 14px 0; }
h1 span { color: var(--blue); }
h2 { font-size: 22px; margin: 0 0 8px; }
h3 { font-size: 16px; margin: 0 0 8px; }
p { color: var(--muted); margin: 8px 0 18px; }
.section { padding: 25px 0; }
.grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 20px; }
.card {
    background: linear-gradient(145deg, #151e34, #0f1525);
    border: 1px solid var(--border); border-radius: 18px;
    padding: 24px; min-width: 0;
    box-shadow: 0 15px 45px #0002;
}
.card-top {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; margin-bottom: 14px;
}
.icon {
    display: grid; place-items: center; width: 44px; height: 44px;
    border-radius: 12px; background: #222e49; font-size: 22px;
}
.danger { color: var(--red); }
.safe { color: var(--green); }
label { display: block; color: #cbd5ee; font-size: 13px; margin: 14px 0 6px; }
input {
    width: 100%; background: #0b1120; color: var(--text);
    border: 1px solid #34415e; border-radius: 10px;
    padding: 12px; outline: none;
}
input:focus { border-color: var(--blue); }
.field-row { display: flex; gap: 8px; }
.field-row input { flex: 1; min-width: 0; }
.field-row button { padding: 8px 12px; }
.submit { width: 100%; margin-top: 18px; }
.note { font-size: 12px; color: var(--muted); margin-top: 12px; }
.result {
    padding: 12px 14px; border-radius: 10px; margin: 16px 0;
    background: #19243a; border: 1px solid var(--border);
}
.result.good { border-color: #26795e; color: var(--green); }
.result.bad { border-color: #854251; color: var(--red); }
.stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
.stat { border: 1px solid var(--border); border-radius: 14px; padding: 17px; background: #10182a; }
.stat strong { display: block; font-size: 21px; }
.stat span { color: var(--muted); font-size: 12px; }
.code {
    padding: 15px; overflow-x: auto; border-radius: 10px;
    background: #080d18; border: 1px solid var(--border);
    color: #c8d4ff; font: 13px/1.8 Consolas, monospace;
    white-space: pre-wrap; overflow-wrap: anywhere;
}
.list { padding-left: 20px; color: var(--muted); }
footer { border-top: 1px solid var(--border); margin-top: 30px; padding: 25px 0 35px; color: var(--muted); font-size: 12px; }
@media (max-width: 720px) {
    .grid { grid-template-columns: 1fr; }
    .stats { grid-template-columns: 1fr; }
    .hero { padding-top: 35px; }
    .card { padding: 18px; }
}
`;

function page(content, title = "SQL Shield | Security Lab") {
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>${styles}</style>
</head>
<body>
<div class="wrap">
<nav>
    <a class="brand" href="/">◈ SQL <span>SHIELD</span></a>
    <span class="pill">LOCAL EDUCATIONAL LAB</span>
</nav>
${content}
<footer>
    SQL Shield · Web Server Security Assignment ·
    Run only on your own local machine. The vulnerable route is for
    controlled classroom demonstration, not production use.
</footer>
</div>
</body>
</html>`;
}

function resultPage(mode, success, message) {
    const isSecure = mode === "secure";
    const heading = isSecure ? "Protected Login" : "Vulnerable Login";
    const status = success ? "Login successful" : "Login rejected";
    const explanation = isSecure
        ? "The input was bound as a parameter, so it could not alter the SQL statement."
        : success
            ? "The unsafe query returned a user record. This demonstrates why concatenating input into SQL is dangerous."
            : "No matching row was returned. Check your payload and database test accounts.";
    return page(`
    <main class="hero">
        <div class="eyebrow">Test result / ${heading}</div>
        <h1>${success ? "Request completed" : "Request not accepted"}</h1>
        <div class="result ${success ? "good" : "bad"}">
            <strong>${status}</strong><br>${message}
        </div>
        <section class="card">
            <h2>What happened?</h2>
            <p>${explanation}</p>
            <a class="button primary" href="/">← Back to dashboard</a>
        </section>
    </main>`, `${heading} Result`);
}

app.get("/", (req, res) => {
    res.send(page(`
    <main>
        <section class="hero">
            <div class="eyebrow">Web application security / Practical lab</div>
            <h1>Understand the flaw.<br><span>Prove the fix.</span></h1>
            <p>Compare unsafe SQL construction with parameterized queries
            in a controlled, local authentication demo.</p>
            <div class="pill">● MySQL database &nbsp; ● Express backend &nbsp; ● Two test modes</div>
        </section>

        <section class="section stats">
            <div class="stat"><strong>01</strong><span>Vulnerability: SQL injection</span></div>
            <div class="stat"><strong>02</strong><span>Mitigation: parameterized query</span></div>
            <div class="stat"><strong>03</strong><span>Scope: local test database</span></div>
        </section>

        <section class="section">
            <div class="grid">
                <article class="card">
                    <div class="card-top">
                        <div class="icon">⚠</div>
                        <span class="pill danger">INTENTIONALLY VULNERABLE</span>
                    </div>
                    <h2>Vulnerable login</h2>
                    <p>Demonstrates how joining input directly into SQL can change query logic.</p>
                    <form method="POST" action="/login-vulnerable">
                        <label for="vu">Username</label>
                        <input id="vu" name="username" required maxlength="200"
                            placeholder="Enter a test username">
                        <label for="vp">Password</label>
                        <div class="field-row">
                            <input id="vp" name="password" type="password"
                                required maxlength="200" placeholder="Enter a test password">
                            <button class="secondary" type="button"
                                onclick="toggle('vp',this)">Show</button>
                        </div>
                        <button class="submit primary" type="submit">Run vulnerable test →</button>
                    </form>
                    <p class="note">For this local assignment only. Do not expose this endpoint to a network.</p>
                </article>

                <article class="card">
                    <div class="card-top">
                        <div class="icon">✓</div>
                        <span class="pill safe">MITIGATION IMPLEMENTED</span>
                    </div>
                    <h2>Secure login</h2>
                    <p>Uses placeholders and binds the username and password as data.</p>
                    <form method="POST" action="/login-secure">
                        <label for="su">Username</label>
                        <input id="su" name="username" required maxlength="200"
                            placeholder="Enter a test username">
                        <label for="sp">Password</label>
                        <div class="field-row">
                            <input id="sp" name="password" type="password"
                                required maxlength="200" placeholder="Enter a test password">
                            <button class="secondary" type="button"
                                onclick="toggle('sp',this)">Show</button>
                        </div>
                        <button class="submit primary" type="submit">Run secure test →</button>
                    </form>
                    <p class="note">The same injection input should be treated as literal text.</p>
                </article>
            </div>
        </section>

        <section class="section card">
            <div class="eyebrow">Guided test</div>
            <h2>Try a controlled test input</h2>
            <p>Fill the vulnerable form with the assignment's demonstration input,
            then submit it manually. You can repeat the same test in the secure form.</p>
            <div class="code">' OR '1'='1' -- </div>
            <button class="secondary" type="button" onclick="fillDemo()">Fill vulnerable form</button>
            <p class="note">This button fills the form only; it does not submit it automatically.</p>
        </section>

        <section class="section grid">
            <article class="card">
                <h2>Why the vulnerable query fails securely?</h2>
                <p>It doesn't: the vulnerable query is the unsafe example. User input is concatenated into the SQL string, so SQL syntax can be interpreted as part of the query.</p>
                <div class="code">WHERE username = 'INPUT'
AND password = 'INPUT'</div>
            </article>
            <article class="card">
                <h2>How the fix works</h2>
                <p>The secure route separates the query structure from the values supplied by the user.</p>
                <div class="code">WHERE username = ? AND password = ?</div>
                <ul class="list">
                    <li>Parameterized queries</li>
                    <li>Least-privilege database access</li>
                    <li>Input validation and safe errors</li>
                </ul>
            </article>
        </section>
    </main>
    <script>
    function toggle(id, button) {
        const input = document.getElementById(id);
        input.type = input.type === "password" ? "text" : "password";
        button.textContent = input.type === "password" ? "Show" : "Hide";
    }
    function fillDemo() {
        document.getElementById("vu").value = "' OR '1'='1' -- ";
        document.getElementById("vp").value = "anything";
        document.getElementById("vu").focus();
    }
    </script>
    `));
});

// Intentionally unsafe: local security demonstration only.
app.post("/login-vulnerable", async (req, res) => {
    const { username, password } = req.body;

    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).send(resultPage(
            "vulnerable", false, "Please submit valid text fields."
        ));
    }

    try {
        const sql =
            "SELECT id, username FROM users WHERE username = '" +
            username + "' AND password = '" + password + "'";

        console.log("[LAB ONLY] Vulnerable query executed.");
        const [rows] = await pool.query(sql);

        if (rows.length > 0) {
            return res.send(resultPage(
                "vulnerable", true, "A user record matched the constructed query."
            ));
        }

        return res.status(401).send(resultPage(
            "vulnerable", false, "No matching user was found."
        ));
    } catch (error) {
        console.error("Vulnerable route database error:", error.message);
        return res.status(500).send(resultPage(
            "vulnerable", false, "The database rejected the query. Check the server terminal."
        ));
    }
});

// Mitigation: parameterized query.
app.post("/login-secure", async (req, res) => {
    const { username, password } = req.body;

    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).send(resultPage(
            "secure", false, "Please submit valid text fields."
        ));
    }

    try {
        const sql =
            "SELECT id, username FROM users WHERE username = ? AND password = ?";

        const [rows] = await pool.execute(sql, [username, password]);

        if (rows.length > 0) {
            return res.send(resultPage(
                "secure", true, "The supplied credentials matched a test account."
            ));
        }

        return res.status(401).send(resultPage(
            "secure", false, "Invalid credentials. No matching account was found."
        ));
    } catch (error) {
        console.error("Secure route database error:", error.message);
        return res.status(500).send(resultPage(
            "secure", false, "The database request failed. Check the server terminal."
        ));
    }
});

app.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.json({ status: "ok", database: "connected" });
    } catch {
        res.status(503).json({ status: "error", database: "disconnected" });
    }
});

async function startServer() {
    try {
        await pool.query("SELECT 1");
        app.listen(PORT, "127.0.0.1", () => {
            console.log(`SQL Shield running at http://localhost:${PORT}`);
            console.log("Bound to localhost for the classroom demonstration.");
        });
    } catch (error) {
        console.error("Could not connect to MySQL:", error.message);
        console.error("Check MySQL80, database name, username, and password.");
        process.exit(1);
    }
}

startServer();
