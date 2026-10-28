# SQL Injection --- Authentication Bypass

## Overview

This project demonstrates the **authentication-bypass** variant of SQL
injection for the Web Server Security assignment. It uses Node.js,
Express, MySQL, and `mysql2` to compare an intentionally vulnerable
login route with a secure route using parameterized SQL.

## Project files

-   `server.js` --- local Express application with vulnerable and secure
    login endpoints.
-   `package.json` and `package-lock.json` --- Node.js dependencies.
-   `sql_injection_lab.sql` --- creates the `sql_injection_lab` database
    and the `users` table with local test accounts.
-   `.env` --- local database configuration; it must not be committed to
    GitHub.

## Requirements

-   Node.js and npm
-   MySQL Server running locally
-   A MySQL account with access to create/use the `sql_injection_lab`
    database

## Setup

1.  Open MySQL Workbench or the MySQL command line.

2.  Run `sql_injection_lab.sql` to create the database and test table.

3.  In the repository root, create a local `.env` file containing the
    password for the MySQL account used in `server.js`:

    ``` env
    MYSQL_PASSWORD=your_local_mysql_password
    ```

    Do not commit or share the real `.env` file. The application
    currently uses the MySQL user configured in `server.js` (`root` by
    default in this lab).

4.  From the **repository root**, install the dependencies for this
    project:

    ``` powershell
    npm --prefix sql-injection install
    ```

5.  Start the application from the repository root so dotenv can read
    the root `.env`:

    ``` powershell
    node sql-injection/server.js
    ```

6.  Open `http://localhost:3000` in your browser.

## Demonstration

The dashboard provides two forms:

-   **Vulnerable login** --- the route `/login-vulnerable` concatenates
    the submitted username and password into SQL query text.
-   **Secure login** --- the route `/login-secure` uses placeholders and
    supplies values separately with `pool.execute()`.

Use only the demonstration input provided by the local lab interface and
test accounts in this project. Compare the result of the same input
against both endpoints.

## Root cause

The vulnerable route builds SQL by concatenating untrusted input into
the query string. This can allow input to be interpreted as SQL syntax
and alter the intended authentication condition.

## Implemented mitigation

The secure route uses a parameterized query:

``` sql
SELECT id, username
FROM users
WHERE username = ? AND password = ?
```

The username and password are passed separately as parameter values.
They are treated as data rather than being interpreted as SQL syntax.

## Other mitigations to explain

-   **Allow-list input validation:** restrict values to the expected
    format; this supplements, but does not replace, parameterized
    queries.
-   **Least privilege:** give the application database account only the
    permissions it needs.
-   **Safe errors:** return generic login errors to users and keep
    diagnostic details in protected server logs.

## Security notes

This is a classroom demonstration, not a production authentication
system. The supplied SQL lab uses simple test credentials. Production
applications should use password hashing, a dedicated least-privilege
database account, secure session handling, and parameterized queries.
Keep the intentionally vulnerable endpoint local and do not expose it to
public networks.
