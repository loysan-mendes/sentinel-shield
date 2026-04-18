# SentinelShield 🛡️

**SentinelShield** is a lightweight, high-performance Web Application Firewall (WAF) and Intrusion Detection System (IDS) for Node.js applications. It provides real-time protection against common web vulnerabilities and automated abuse via signature-based detection and behavioral rate limiting.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)

## 🚀 Features

- **Injection Defense**: Detects and blocks SQL Injection (SQLi), Cross-Site Scripting (XSS), and OS Command Injection.
- **Path Protection**: Mitigates Local File Inclusion (LFI) and Directory Traversal attempts.
- **Behavioral Rate Limiting**: Intelligent IP-based tracking to block brute-force and DoS attempts.
- **Deep Inspection**: Normalizes encoded payloads (URL encoding) to prevent bypasses.
- **Real-time Dashboard**: A premium visual interface to monitor active threats and traffic distribution.
- **Forensic Logging**: Detailed security event logging for post-incident analysis.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JS, CSS (Glassmorphism UI)
- **Security Logic**: Custom Regex-based Detection Engine

## 📦 Installation

To use SentinelShield as a standalone demo:

```bash
git clone https://github.com/YOUR_USERNAME/sentinel-shield.git
cd sentinel-shield
npm install
node server.js
```

## 🧩 Reusable Middleware Usage

You can easily integrate the SentinelShield logic into your own Express projects:

```javascript
const express = require('express');
const { scanRequest } = require('./waf.js');
const { logAlert } = require('./logger.js');

const app = express();

app.use((req, res, next) => {
    const detection = scanRequest(req);
    if (detection.detected) {
        logAlert(req.ip, detection.rule, `Blocked: ${req.url}`);
        return res.status(403).send("Action blocked by SentinelShield");
    }
    next();
});
```

## 📊 Dashboard
Access the real-time security monitor at `http://localhost:3000`.
## ⚖️ License
Distributed under the ISC License. See `LICENSE` for more information.

---
*Developed as part of the Security Engineering Internship - 2026*
