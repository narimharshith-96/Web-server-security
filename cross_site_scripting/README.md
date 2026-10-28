# Cross-Site Scripting (XSS) --- Reflected XSS

## Overview

This project demonstrates **Reflected Cross-Site Scripting (XSS),
Variant 2** in accordance with the Web Server Security assignment. The
application uses Node.js and Express to compare a vulnerable search page
with a secure page that HTML-escapes user input before reflecting it in
the response.

## Project files

-   `server.js` --- implements the vulnerable and secure search routes.
-   `package.json` and `package-lock.json` --- application dependencies.
-   `demonstration_pictures/` --- screenshots supporting the
    demonstration.

## Requirements

-   Node.js and npm

## Setup and run

1.  Open a terminal in the repository root.

2.  Install this project's dependencies:

    ``` powershell
    npm --prefix cross_site_scripting install
    ```

3.  Start the application:

    ``` powershell
    node cross_site_scripting/server.js
    ```

4.  Open `http://127.0.0.1:3000` in your browser.

The application binds to `127.0.0.1`, so it is intended for local
demonstration.

## Demonstration pages

-   `/vulnerable` --- reflects the search parameter `q` into the HTML
    response without escaping it.
-   `/secure` --- passes the same parameter through `escapeHTML()`
    before reflecting it.

Use the class demonstration input in your own local application. Compare
how the vulnerable page handles it with how the secure page renders it.
The secure version should display user input as text rather than
interpreting it as HTML.

## Root cause

The vulnerable route interpolates the query-string value directly into
an HTML response. Because the value is not encoded for the HTML context,
browser-parsed markup or script-capable input may be interpreted rather
than displayed as plain text.

## Implemented mitigation

The secure route calls `escapeHTML()` to encode special HTML characters,
including `&`, `<`, `>`, double quotes, and single quotes. This helps
ensure the reflected input is displayed as text in the HTML text context
used by this page.

## Other mitigations to explain

-   **Context-aware output encoding:** encode data for the exact HTML,
    attribute, JavaScript, URL, or CSS context where it is inserted.
-   **Framework auto-escaping:** use template systems and frameworks
    that escape output by default, and avoid unsafe raw-HTML insertion.
-   **HTML sanitization:** when rich HTML must be accepted, use a
    maintained sanitizer with a restrictive policy.
-   **Content Security Policy (CSP):** apply a restrictive policy as
    defense in depth; it is not a replacement for correct output
    encoding.
-   **HttpOnly cookies:** prevent client-side JavaScript from reading
    those cookies, reducing some cookie-theft impact, but not preventing
    XSS itself.
-   **Safe DOM sinks:** use text-oriented APIs such as `textContent`
    rather than unsafe HTML insertion APIs when rendering untrusted
    text.

## Security notes

This application intentionally includes a vulnerable route for a
controlled educational demonstration. Run it locally and do not expose
the vulnerable endpoint to public networks or use it in production.
