const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = 3000;

const DEMO_USER = {
  username: 'goutham',
  password: 'goutham123',
  email: 'goutham@gmail.com'
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(session({
  name: 'secure_sid',
  secret: 'csrf-lab-secure-demo-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,  // JavaScript on any page cannot read this cookie
    sameSite: 'lax',  // defence-in-depth, NOT a substitute for CSRF tokens -
                       // a top-level GET navigation (what our attacker page
                       // uses) is still sent by the browser under Lax
    secure: false      // local http only; would be true behind HTTPS
  }
}));

function timestamp() { return new Date().toISOString(); }

function log(label, details) {
  console.log('='.repeat(50));
  console.log(`[${label}]`);
  Object.entries(details).forEach(([k, v]) => console.log(`${k}: ${v}`));
  console.log('='.repeat(50));
}

function requireLogin(req, res, next) {
  if (!req.session.loggedIn) {
    log('SESSION REJECTED', {
      Time: timestamp(), Method: req.method, Endpoint: req.originalUrl,
      Status: 401, Reason: 'No authenticated session'
    });
    return res.redirect('/login?error=Please log in first');
  }
  next();
}

function getOrCreateCsrfToken(req) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  return req.session.csrfToken;
}

function validCsrfToken(req, submitted) {
  const expected = req.session.csrfToken;
  if (!expected || !submitted) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(submitted);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function renderRejection(title, message) {
  return `
    <html><body style="font-family:sans-serif;padding:40px;text-align:center;background:#fef2f2;">
      <h2 style="color:#b91c1c;">${title}</h2>
      <p style="max-width:480px;margin:0 auto;">${message}</p>
      <p style="margin-top:24px;"><a href="http://localhost:3000/dashboard">Return to dashboard</a></p>
    </body></html>
  `;
}

app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res) => {
  res.render('login', { error: req.query.error || null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    req.session.loggedIn = true;
    getOrCreateCsrfToken(req);
    log('LOGIN SUCCESS', { Time: timestamp(), User: username });
    return res.redirect('/dashboard');
  }
  log('LOGIN FAILED', { Time: timestamp(), User: username || '(empty)' });
  res.render('login', { error: 'Invalid username or password' });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

app.get('/dashboard', requireLogin, (req, res) => {
  res.render('dashboard', { email: DEMO_USER.email, message: req.query.message || null });
});

app.get('/profile', requireLogin, (req, res) => {
  res.render('profile', { email: DEMO_USER.email, username: DEMO_USER.username });
});

app.get('/settings', requireLogin, (req, res) => {
  res.render('settings', {
    email: DEMO_USER.email,
    csrfToken: getOrCreateCsrfToken(req),
    success: req.query.success || null,
    error: req.query.error || null
  });
});

// Legitimate email update: POST + a valid CSRF token are both required.

app.post('/settings/update-email', requireLogin, (req, res) => {
  const { email, csrfToken } = req.body;

  if (!csrfToken) {
    log('INVALID TOKEN', {
      Time: timestamp(), Method: 'POST', Endpoint: '/settings/update-email',
      Status: 403, Reason: 'CSRF token missing', 'Account modification': 'Not performed'
    });
    return res.status(403).send(renderRejection(
      '403 Forbidden',
      'Missing CSRF token. This request was not submitted through the real settings form and has been rejected.'
    ));
  }

  if (!validCsrfToken(req, csrfToken)) {
    log('INVALID TOKEN', {
      Time: timestamp(), Method: 'POST', Endpoint: '/settings/update-email',
      Status: 403, Reason: 'CSRF token mismatch', 'Account modification': 'Not performed'
    });
    return res.status(403).send(renderRejection(
      '403 Forbidden', 'Invalid CSRF token. The request has been rejected.'
    ));
  }

  const newEmail = (email || '').trim();
  if (!newEmail) {
    return res.redirect('/settings?error=Email cannot be empty');
  }

  DEMO_USER.email = newEmail;
  req.session.csrfToken = crypto.randomBytes(32).toString('hex'); // rotate after use

  log('EMAIL UPDATED (legitimate)', {
    Time: timestamp(), Method: 'POST', Endpoint: '/settings/update-email',
    Status: 200, 'New email': newEmail, 'CSRF token': 'valid'
  });

  res.redirect('/settings?success=Email updated successfully');
});


app.get('/settings/update-email', (req, res) => {
  log('CSRF BLOCKED', {
    Time: timestamp(), Method: 'GET', Endpoint: '/settings/update-email',
    Status: 405, Reason: 'State-changing GET requests are prohibited',
    Action: 'Request rejected', 'Account modification': 'Not performed'
  });

  res.status(405).send(renderRejection(
    '405 Method Not Allowed',
    'This endpoint no longer accepts GET requests. Account changes must be submitted as POST, with a valid session and a valid CSRF token.'
  ));
});

// Unsupported methods on known endpoints, then unknown routes.

const knownPaths = ['/', '/login', '/logout', '/dashboard', '/profile', '/settings', '/settings/update-email'];

app.use((req, res, next) => {
  if (knownPaths.includes(req.path)) {
    log('METHOD REJECTED', {
      Time: timestamp(), Method: req.method, Endpoint: req.path,
      Status: 405, Reason: 'Unsupported HTTP method for this endpoint'
    });
    return res.status(405).send(renderRejection('405 Method Not Allowed', 'Unsupported method for this endpoint.'));
  }
  next();
});

app.use((req, res) => {
  log('UNKNOWN ROUTE', {
    Time: timestamp(), Method: req.method, Endpoint: req.path, Status: 404
  });
  res.status(404).send(renderRejection('404 Not Found', 'This page does not exist.'));
});

// Basic error handler.
app.use((err, req, res, next) => { 
  log('SERVER ERROR', { Time: timestamp(), Endpoint: req.originalUrl, Message: err.message });
  res.status(500).send(renderRejection('500 Internal Server Error', 'Something went wrong.'));
});

app.listen(PORT, () => {
  console.log(`[SECURE SERVER] Running at http://localhost:${PORT}`);
});