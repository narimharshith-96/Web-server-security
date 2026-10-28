# Web Server Security --- Group Assignment

**Course:** Cyber Security (IT-30001)\
**Institution:** Indian Institute of Information Technology Allahabad\
**Semester:** Autumn 2026

## Project overview

This repository contains our group's educational demonstrations of
web-server vulnerabilities. Each member is responsible for one distinct
vulnerability variant, including the vulnerable implementation, a
working demonstration, an explanation of the root cause, and one
implemented mitigation.

Our current project covers three categories:

-   **SQL Injection --- Authentication Bypass**
-   **Cross-Site Scripting (XSS) --- Reflected XSS**
-   **Cross-Site Request Forgery (CSRF) --- GET-based forged action**

OS command injection is not part of our current implementation and is
therefore not listed as a project component.

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

The exact contents within each project folder may include additional
supporting files. Each application has its own dependencies and should
be installed and run from its own directory, except where a project's
README says otherwise.

## Group ownership declaration

  -----------------------------------------------------------------------
  Member name       Roll number       Vulnerability     Variant
                                      category          implemented
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

The assignment requires each member's contribution to be identifiable in
the ownership declaration, demonstration video, and viva.

## Assignment demonstration requirements

For each implemented variant, the group prepares to demonstrate:

1.  The vulnerable code path.
2.  The working exploit or forged request in the group's own test
    application.
3.  The root cause.
4.  The mitigation implemented and evidence that the same test is
    blocked.
5.  The basic idea of the other mitigation options listed for that
    vulnerability.

### Mitigation topics

-   **SQL injection:** parameterized queries, allow-list input
    validation, least-privilege database accounts, and safe error
    handling.
-   **XSS:** context-aware output encoding, framework auto-escaping,
    sanitization of rich HTML, Content Security Policy (CSP), HttpOnly
    cookies, and safe DOM sinks.
-   **CSRF:** synchronizer CSRF tokens, SameSite cookies,
    re-authentication for sensitive actions, and avoiding state-changing
    GET requests.

## Safety and scope

These applications are for controlled educational testing. Test only
applications owned or authorized by our group. Do not expose
intentionally vulnerable endpoints to public networks or use them in
production.

Keep `.env` files, database credentials, and `node_modules/` out of
GitHub. The root `.gitignore` should include at least:

``` gitignore
node_modules/
.env
*.log
```

## Project-specific instructions

-   SQL injection: see
    [`sql-injection/README.md`](sql-injection/README.md).
-   Reflected XSS: see
    [`cross_site_scripting/README.md`](cross_site_scripting/README.md).
-   CSRF: see [`csrf-protection/README.md`](csrf-protection/README.md).
