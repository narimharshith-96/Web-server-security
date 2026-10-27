
CREATE DATABASE IF NOT EXISTS sql_injection_lab;
USE sql_injection_lab;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

INSERT INTO users (username, password)
SELECT 'admin', 'Admin123'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'admin'
);

INSERT INTO users (username, password)
SELECT 'student', 'Student123'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'student'
);

SELECT * FROM users;
