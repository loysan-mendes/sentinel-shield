const express = require('express');
const cors = require('cors');
const path = require('path');
const { scanRequest } = require('./waf.js');
const { logAlert, logRequest, getStats } = require('./logger.js');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const rateLimitingTracker = new Map();
const RATE_LIMIT_THRESHOLD = 50;
const IP_BAN_DURATION = 60 * 1000;

app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const now = Date.now();
    const tracker = rateLimitingTracker.get(ip) || { count: 0, firstRequestAt: now, banned: false };

    if (tracker.banned && now - tracker.bannedAt < IP_BAN_DURATION) {
        logAlert(ip, 'Rate Limiting / Abuse', 'Blocked: IP still banned');
        return res.status(429).send('Too many requests, IP blocked temporarily.');
    }

    if (now - tracker.firstRequestAt < 60000) {
        tracker.count++;
        if (tracker.count > RATE_LIMIT_THRESHOLD) {
            tracker.banned = true;
            tracker.bannedAt = now;
            rateLimitingTracker.set(ip, tracker);
            logAlert(ip, 'Rate Limiting / Abuse', `Blocked: ${tracker.count} requests / min exceeded`);
            return res.status(429).send('Rate limit exceeded.');
        }
    } else {
        tracker.count = 1;
        tracker.firstRequestAt = now;
    }
    rateLimitingTracker.set(ip, tracker);

    const detection = scanRequest(req);
    logRequest();

    if (detection.detected) {
        logAlert(ip, detection.rule, `Detail: URL ${req.url}`);
        return res.status(403).json({
            error: "Forbidden",
            message: "Action blocked by SentinelShield",
            category: detection.rule
        });
    }

    next();
});

app.get('/api/stats', (req, res) => {
    res.json(getStats());
});

app.get('/api/user/:id', (req, res) => {
    res.json({ id: req.params.id, name: 'John Doe', role: 'Intern' });
});

app.post('/api/login', (req, res) => {
    res.json({ message: 'Login successful' });
});

app.listen(PORT, () => {
    console.log(`SentinelShield Active on http://localhost:${PORT}`);
});
