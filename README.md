# Web Server Security --- Group Assignment

**Course:** Cyber Security (IT-30001)\
**Institution:** Indian Institute of Information Technology Allahabad\
**Semester:** Autumn 2026

## Project Overview

This repository contains our group's educational implementations of
web-server vulnerabilities. Each member is responsible for one distinct
vulnerability variant, including a vulnerable implementation, a working
demonstration, an explanation of the root cause, and one implemented
mitigation.

### Vulnerability Categories Covered

-   SQL Injection --- Authentication Bypass
-   Cross-Site Scripting (XSS) --- Reflected XSS
-   Cross-Site Request Forgery (CSRF) --- GET-based forged action

OS command injection is not included in our current project.

## Repository Structure

``` text
Web-server-security/
├── sql-injection/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── sql_injection_lab.sql
│   └── README.md
├── cross_site_scripting/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── demonstration_pictures/
│   └── README.md
├── csrf-protection/
│   ├── attacker/
│   ├── secure/
│   ├── vulnerable/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
├── .gitignore
└── README.md
```

Each project folder contains its own application code and supporting
files. Install dependencies from the relevant project folder or follow
the instructions in that folder's README.

## Ownership Declaration

The following table follows the four-column ownership format specified
in Table 3 of the assignment.

  -----------------------------------------------------------------------
  Member name       Roll number       Category          Variant
                                                        implemented
  ----------------- ----------------- ----------------- -----------------
  Narim Harshith    IIT2024225        SQL Injection     Variant 1 ---
                                                        Authentication
                                                        bypass

  Surendra Reddy    IIT2024224        Cross-Site        Variant 2 ---
                                      Scripting (XSS)   Reflected XSS

  Goutham           IIT2024272        Cross-Site        Variant 1 ---
                                      Request Forgery   GET-based forged
                                      (CSRF)            action
  -----------------------------------------------------------------------

## Demonstration Requirements

For each implemented variant, the group prepares to show:

1.  The vulnerable implementation and the affected code path.
2.  A working exploit or forged request in the group's own application.
3.  The root cause of the vulnerability.
4.  The implemented mitigation, with the same test shown failing after
    the fix.
5.  A short explanation of other relevant mitigations.

### Mitigation Topics

-   **SQL Injection:** parameterized queries, allow-list input
    validation, least-privilege database accounts, and safe error
    handling.
-   **XSS:** context-aware output encoding, framework auto-escaping,
    HTML sanitization, Content Security Policy (CSP), HttpOnly cookies,
    and safe DOM sinks.
-   **CSRF:** synchronizer CSRF tokens, SameSite cookies,
    re-authentication for sensitive actions, and avoiding state-changing
    GET requests.

## Safety and Scope

These applications are for controlled educational testing. Test only
applications owned or authorized by our group. Do not expose
intentionally vulnerable endpoints to public networks or use them in
production.

Keep `.env` files, database credentials, and `node_modules/` out of
GitHub. The root `.gitignore` should include:

``` gitignore
node_modules/
.env
*.log
```

## Project-specific READMEs

-   [SQL Injection](sql-injection/README.md)
-   [Cross-Site Scripting (XSS)](cross_site_scripting/README.md)
-   [Cross-Site Request Forgery (CSRF)](csrf-protection/README.md)
