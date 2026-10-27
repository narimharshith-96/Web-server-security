# Web Server Security — Vulnerability Exploitation and Mitigation

## 1. Project Overview

This repository contains our group assignment on identifying, demonstrating, and mitigating web server vulnerabilities. Each group member implements one vulnerability variant, demonstrates how it can be exploited in a controlled environment, and implements a mitigation to prevent the same attack.

The project focuses on the following vulnerability categories:

- SQL Injection
- OS Command Injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)

The categories included in the final submission depend on the variants implemented by our group members.

## 2. Repository Structure

```text
Web-server-security/
├── sql-injection/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── sql_injection_lab.sql
├── command-injection/
├── xss/
├── csrf/
├── .gitignore
└── README.md
```

Each vulnerability folder contains the source code and other required files for that implementation. Folders for unimplemented categories may be empty or omitted.

## 3. Implemented Vulnerability: SQL Injection

**Variant:** Authentication Bypass

The SQL injection application uses Node.js, Express, and MySQL to demonstrate an authentication vulnerability and its mitigation.

### Vulnerable implementation

The vulnerable login endpoint constructs an SQL query by concatenating user-supplied input into the query string. An attacker may manipulate the query's logic to bypass authentication.

### Exploitation demonstration

The application provides a controlled test environment where the same demonstration input can be tested against both the vulnerable and secure login endpoints.

Testing is restricted to our own local application and test database.

### Implemented mitigation

The secure login endpoint uses parameterized SQL queries. User input is bound as data rather than interpreted as part of the SQL statement.

The same injection attempt should fail against the secure endpoint.

### Technologies used

- JavaScript
- Node.js
- Express.js
- MySQL
- mysql2
- dotenv

## 4. Other Vulnerability Implementations

Additional group members may contribute separate implementations for OS command injection, XSS, and CSRF. Each implementation should document its selected variant, vulnerable code path, demonstration input, root cause, implemented mitigation, and other mitigation approaches.

## 5. Group Ownership Declaration

| Group Member | Roll Number | Vulnerability Category | Variant |
|---|---|---|---|
| Narim Harshith | IIT2024225 | SQL Injection | Authentication Bypass |
| [Member 2] | [Roll Number] | [Category] | [Variant] |
| [Member 3] | [Roll Number] | [Category] | [Variant] |
| [Member 4] | [Roll Number] | [Category] | [Variant] |

Replace the placeholders with the actual details of your group members and the variants they implement.

## 6. Running the SQL Injection Application

Requirements:

- Node.js and npm
- MySQL Server

1. Create the `sql_injection_lab` database and the `users` table using the supplied SQL script.
2. Configure the local database credentials in a `.env` file.
3. Install the Node.js dependencies from the SQL injection project's directory:

   ```bash
   npm install
   ```

4. Start the application:

   ```bash
   node server.js
   ```

5. Open `http://localhost:3000` in your browser.
6. Test the vulnerable and secure login endpoints using the application's test inputs.

Keep `.env` and `node_modules` out of version control. Use only test accounts and a local database for the demonstration.

## 7. Security and Testing Scope

This project is intended for educational purposes. Vulnerability demonstrations must be performed only against applications owned or authorized by our group. The intentionally vulnerable endpoints must not be exposed to public networks or used in production.

---
