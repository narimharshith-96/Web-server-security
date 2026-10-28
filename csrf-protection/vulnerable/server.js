const express = require('express');
const session = require('express-session');
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
  name: 'vuln_sid',
  secret: 'csrf-lab-vulnerable-demo-secret', // demo only, not for production
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax', // deliberately not relied upon as protection here
    secure: false     // local http only
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
    return res.redirect('/login?error=Please log in first');
  }
  next();
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// Routes

app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res) => {
  res.render('login', { error: req.query.error || null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    req.session.loggedIn = true;
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
    success: req.query.success || null,
    error: req.query.error || null
  });
});

app.post('/settings/update-email', requireLogin, (req, res) => {
  const newEmail = (req.body.email || '').trim();
  if (!newEmail) {
    return res.redirect('/settings?error=Email cannot be empty');
  }
  DEMO_USER.email = newEmail;
  log('EMAIL UPDATED (form)', { Time: timestamp(), NewEmail: newEmail });
  res.redirect('/settings?success=Email updated successfully');
});


//  INTENTIONALLY VULNERABLE ROUTE - CSRF (GET-based forged action) 

app.get('/settings/update-email', requireLogin, (req, res) => {
  const forgedEmail = req.query.email;
  if (!forgedEmail) {
    return res.redirect('/settings?error=Missing email parameter');
  }

  // VULNERABLE: no CSRF token check, no Origin/Referer check, and GET is
  // being used to perform a state-changing operation.
  DEMO_USER.email = forgedEmail;

  log('CSRF ATTACK SUCCEEDED', {
    Time: timestamp(),
    Method: 'GET',
    Endpoint: '/settings/update-email',
    'New email': forgedEmail,
    Note: 'Request accepted with no CSRF protection'
  });

  res.send(`
    <html><body style="font-family:sans-serif;padding:40px;text-align:center;background:#f4f6fb;">
      <h2>Email address updated</h2>
      <p>Your account email was changed to <strong>${escapeHtml(forgedEmail)}</strong>.</p>
      <p><a href="http://localhost:3000/dashboard">Return to dashboard</a></p>
    </body></html>
  `);
});

app.use((req, res) => res.status(404).send('Not found'));

app.listen(PORT, () => {
  console.log(`[VULNERABLE SERVER] Running at http://localhost:${PORT}`);
  console.log('WARNING: this server is intentionally insecure (CSRF lab demo).');
});