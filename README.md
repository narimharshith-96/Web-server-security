# Web Server Security --- Group Assignment

**Institution:** Indian Institute of Information Technology Allahabad\
**Department:** Information Technology\
**Course:** Cyber Security (IT-30001)\
**Semester:** Autumn 2026

## Project overview

This repository contains our group's implementations for the Web Server
Security assignment. Each member implements one vulnerability variant,
demonstrates the vulnerable behavior in the group's own application,
explains the root cause, and demonstrates one mitigation that blocks the
same test.

The current implementations in this repository cover SQL Injection,
Cross-Site Scripting (XSS), and Cross-Site Request Forgery (CSRF).

## Repository structure

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

Each application has its own dependencies. Refer to the README inside
the relevant folder for setup and demonstration instructions.

## Ownership declaration

The following table follows **Table 3 (Ownership)** in the assignment
document.

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

## Demonstration requirements

For each member's variant, the demonstration should identify the
vulnerable code path, show the working exploit or forged request,
explain the root cause, and show the same test being blocked by the
implemented mitigation. Each member should also be prepared to explain
the alternative mitigations listed for their category.

### Mitigation topics

-   **SQL Injection:** parameterized queries, input validation with
    allow-lists, least-privilege database accounts, and safe errors.
-   **Cross-Site Scripting (XSS):** context-aware output encoding,
    framework auto-escaping, sanitization for rich HTML, Content
    Security Policy (CSP), HttpOnly cookies, and safe DOM sinks.
-   **Cross-Site Request Forgery (CSRF):** anti-CSRF (synchronizer)
    tokens, SameSite cookies, re-authentication for sensitive actions,
    and avoiding state-changing GET requests.

## Safety and scope

These applications are for educational demonstrations. Test only
applications owned or authorized by our group. Do not expose
intentionally vulnerable endpoints to public networks or use them in
production.

Keep local `.env` files, database credentials, and `node_modules/` out
of GitHub. The root `.gitignore` should include:

``` gitignore
node_modules/
.env
*.log
```

## Project-specific documentation

-   [SQL Injection README](sql-injection/README.md)
-   [Cross-Site Scripting README](cross_site_scripting/README.md)
-   [CSRF README](csrf-protection/README.md)
