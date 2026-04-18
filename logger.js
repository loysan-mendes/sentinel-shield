const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'security.log');

let stats = {
    totalRequests: 0,
    blockedRequests: 0,
    attacksByCategory: {
        'SQL Injection (SQLi)': 0,
        'Cross-Site Scripting (XSS)': 0,
        'Local File Inclusion (LFI)': 0,
        'Command Injection': 0,
        'Directory Traversal': 0,
        'Rate Limiting / Abuse': 0
    },
    alerts: []
};

function logAlert(ip, alertType, detail) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [ALERT] [IP: ${ip}] [CATEGORY: ${alertType}] [DETAIL: ${detail}]\n`;

    fs.appendFileSync(LOG_FILE, logMessage);

    stats.blockedRequests++;
    stats.attacksByCategory[alertType] = (stats.attacksByCategory[alertType] || 0) + 1;
    stats.alerts.unshift({
        timestamp,
        ip,
        category: alertType,
        detail
    });

    if (stats.alerts.length > 100) {
        stats.alerts.pop();
    }
}

function logRequest() {
    stats.totalRequests++;
}

function getStats() {
    return stats;
}

module.exports = { logAlert, logRequest, getStats };
