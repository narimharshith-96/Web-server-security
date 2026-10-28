# CSRF Lab — Variant 1: GET-Based Forged Action

IIIT Allahabad · Cyber Security (IT-30001) · Web Server Security Assignment

> **Note on the assignment deadline:** the brief lists a submission deadline of
> 27 October 2026, and this project was produced on 28 October 2026. If this
> is a late submission, check with your instructor about how that is handled —
> the technical content below is unaffected either way.

This folder contains three independent Node.js/Express applications used to
demonstrate, then mitigate, a GET-based Cross-Site Request Forgery (CSRF)
vulnerability.

| App | Folder | Port | Purpose |
|---|---|---|---|
| Vulnerable user site | `vulnerable/` | `3000` | Accepts an account change (email) via GET — exploitable |
| Secure user site | `secure/` | `3000` | Same app, hardened — rejects the GET attack |
| Attacker site | `attacker/` | `4000` | Fake "90% off" voucher page that fires the forged request |

Only **one** of the two user apps runs on port 3000 at a time. The attacker
app runs independently on port 4000 and can stay running throughout.

Demo credentials (hard-coded for this local educational project only):

- Username: `goutham`
- Password: `goutham123`
- Starting email: `goutham@example.test`

---

## 1. Setup

From the `csrf-lab/` folder:

```bash
npm install
```

This installs `express`, `express-session`, and `ejs` (see `package.json`).

> This sandbox used to generate the project had no internet access, so
> `npm install` could not be executed here. Every `.js` file was checked
> with `node --check` (passes) and every `.ejs` template was checked for
> balanced template tags (passes), but the servers have **not** been
> run end-to-end. Run `npm install` and the commands below on your own
> machine to do the live demonstration — that is also a more faithful
> test of the exact environment you'll present from.

## 2. Commands

Open three terminals.

**Terminal 1 — attacker site (leave running for both demos):**
```bash
npm run start:attacker
# [ATTACKER SERVER] Running at http://127.0.0.1:4000
```

**Terminal 2 — Demonstration A (vulnerable):**
```bash
npm run start:vulnerable
# [VULNERABLE SERVER] Running at http://localhost:3000
```
Stop it with `Ctrl+C` when you're ready to switch.

**Terminal 2 — Demonstration B (secure), after stopping the vulnerable server:**
```bash
npm run start:secure
# [SECURE SERVER] Running at http://localhost:3000
```

If you see `EADDRINUSE` on port 3000, the previous server is still
running — go back to its terminal and press `Ctrl+C`, or find and kill it:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# macOS/Linux
lsof -i :3000
kill -9 <pid>
```

## 3. Demonstration workflow

### Demo A — Vulnerable app
1. `npm run start:attacker` (terminal 1), `npm run start:vulnerable` (terminal 2).
2. Open `http://localhost:3000`, log in (`goutham` / `goutham123`).
3. View dashboard/profile — email is `goutham@example.test`.
4. In the same browser, open `http://127.0.0.1:4000`.
5. Click **Claim Offer**.
6. Terminal 1 logs `[ATTACK DEMONSTRATION]`. A new tab opens the forged URL;
   terminal 2 logs `[CSRF ATTACK SUCCEEDED]`.
7. Return to `http://localhost:3000/dashboard` — email is now
   `forged@example.test`.

### Demo B — Secure app
1. Stop the vulnerable server (`Ctrl+C` in terminal 2); keep the attacker
   server running.
2. `npm run start:secure` (terminal 2).
3. Log in again with the same credentials; email starts again at
   `goutham@example.test` (in-memory state resets on restart — expected and
   repeatable, see §7).
4. Go back to the still-open `http://127.0.0.1:4000` tab (no edits needed —
   the target URL is identical) and click **Claim Offer** again.
5. Terminal 1 logs the same `[ATTACK DEMONSTRATION]` entry. The new tab now
   shows **405 Method Not Allowed**; terminal 2 logs `[CSRF BLOCKED]`.
6. Dashboard still shows `goutham@example.test` — unchanged.
7. On `/settings`, submit the real form (POST + hidden CSRF token) with a
   new email — it succeeds, terminal 2 logs `[EMAIL UPDATED (legitimate)]`.

## 4. Testing the controls directly (optional, for the viva)

With the secure server running, log in via the browser first so a session
cookie exists, then reuse that cookie value (`secure_sid=...`, from your
browser's dev tools → Application → Cookies) in `curl` to probe each control
without the browser:

```bash
# 1. Legacy GET endpoint -> 405
curl -i "http://localhost:3000/settings/update-email?email=x@test.com" \
  -H "Cookie: secure_sid=<paste-value>"

# 2. POST with no CSRF token -> 403
curl -i -X POST http://localhost:3000/settings/update-email \
  -H "Cookie: secure_sid=<paste-value>" \
  --data "email=x@test.com"

# 3. POST with a wrong CSRF token -> 403
curl -i -X POST http://localhost:3000/settings/update-email \
  -H "Cookie: secure_sid=<paste-value>" \
  --data "email=x@test.com&csrfToken=not-the-real-token"

# 4. Unknown route -> 404
curl -i http://localhost:3000/no-such-page
```

These are local tests of your own application, not a capability a real
remote attacker would have (a remote attacker cannot read your session
cookie value — it is HttpOnly and never exposed to page JavaScript).

---

## 5. Where the vulnerability lives

`vulnerable/server.js`, the route `app.get('/settings/update-email', ...)`,
changes `DEMO_USER.email` directly from `req.query.email` with:
- no CSRF token check,
- no Origin/Referer check,
- and critically, **GET** used for a state-changing action.

A browser automatically attaches the `vuln_sid` session cookie to *any*
request to `localhost:3000`, no matter which page initiated the navigation.
So a simple link or button on an unrelated site (`attacker/views/voucher.ejs`)
is enough to trigger the change for anyone who is currently logged in — the
victim never has to see or approve the request.

## 6. How the secure app fixes it

`secure/server.js`:
1. **Rejects the legacy GET route outright** — `app.get('/settings/update-email', ...)`
   now always returns `405 Method Not Allowed`, before any session or token
   check, so no GET request can change state, forged or not.
2. **Requires POST** for the real update, plus a **synchronizer CSRF token**:
   a random value (`crypto.randomBytes(32)`) is generated per session,
   embedded as a hidden field in the legitimate settings form, and compared
   with `crypto.timingSafeEqual` against the value stored server-side in
   `req.session.csrfToken` on submission. Missing or mismatched tokens get
   `403 Forbidden`.
3. Uses **HttpOnly** (JS can't read the cookie) and **SameSite=Lax** cookies
   as defence-in-depth — not as the fix itself, since a top-level navigation
   like the one the attacker page performs is still sent under `Lax`.

### Why a valid session alone isn't enough
The session cookie only proves *who is asking*; it says nothing about
*whether this specific request was actually initiated by the real site's own
UI*. An attacker's page can ride on a victim's valid session (that's exactly
what CSRF is) but cannot read or guess the CSRF token, because the token
lives only in the session on the server and in a same-origin form the
attacker page is never given access to. Authentication answers "who are
you?"; a CSRF token answers "did you mean to do this, right now, through our
own page?" — CSRF defence needs the second question answered too.

### Meaning of the HTTP status codes used here
- **403 Forbidden** — you are authenticated, but this specific request isn't
  trusted (missing/invalid CSRF token).
- **405 Method Not Allowed** — this endpoint exists, but not for the method
  you used (GET on a POST-only, state-changing action).
- **404 Not Found** — no such endpoint at all.

## 7. Other mitigation options (theory, per Table 2(e) of the brief)

Only one mitigation (GET-rejection + synchronizer CSRF token) is implemented
here, as the assignment allows. Other standard options, for completeness:

- **SameSite cookies (Strict or Lax)** — tell the browser not to send the
  cookie on certain cross-site requests. Strong, free defence-in-depth, but
  not a full replacement: `Lax` still allows top-level GET navigations
  (exactly this lab's attack vector), and it depends entirely on browser
  support/compliance rather than server-side verification.
- **Double-submit cookie pattern** — the server sets a random token both as
  a readable cookie and expects it echoed back in a request parameter/header;
  the two must match. Avoids server-side session storage of the token, but
  is weaker than a session-bound synchronizer token if any subdomain can set
  cookies on the parent domain.
- **Checking the `Origin`/`Referer` header** — reject requests whose Origin
  or Referer doesn't match the expected site. Easy to add, but headers can
  be missing (stripped by some proxies/clients) or (historically) spoofable
  in edge cases, so it's usually used as a secondary check, not the sole one.
  
- **Re-authentication / step-up confirmation for sensitive actions** —
  require the password (or a fresh prompt) again before a high-impact change
  (e.g., changing a password or payment details). Strong for the highest-risk
  actions, but too heavy to apply to every state-changing request.
- **Avoiding state-changing GET requests in general** — a RESTful discipline
  where GET is only ever used to read, never to mutate. This alone removes
  an entire class of CSRF (including link-based and image-tag-based
  attacks), which is why it's applied here as the first line of defence,
  alongside the CSRF token.

## 8. What this demo proves — and what it doesn't

It proves: this specific GET-based CSRF against this specific endpoint is
exploitable in the vulnerable build and blocked in the secure build, with
the browser, both terminals, and the final email value as evidence.

It does **not** prove the secure build is immune to every possible attack —
no comprehensive security audit, penetration test, or review of other
attack classes (XSS, header injection, timing side-channels, etc.) was
performed. The claim is scoped to the tested CSRF cases only.

---