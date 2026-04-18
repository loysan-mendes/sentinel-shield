const rules = [
    {
        name: "SQL Injection (SQLi)",
        category: "malicious",
        patterns: [/union\s+select/i, /select\s+\*\s+from/i, /OR\s+1=1/i, /'--/i, /waitfor\s+delay/i, /sleep\(\d+\)/i]
    },
    {
        name: "Cross-Site Scripting (XSS)",
        category: "malicious",
        patterns: [/<script.*?>/i, /onclick\s*=/i, /onerror\s*=/i, /onload\s*=/i, /javascript:/i, /alert\(/i]
    },
    {
        name: "Local File Inclusion (LFI)",
        category: "malicious",
        patterns: [/\.\.\/\.\.\//i, /\/etc\/passwd/i, /\/windows\/system32\//i, /proc\/self\/environ/i]
    },
    {
        name: "Command Injection",
        category: "malicious",
        patterns: [/[;&|`]\s*cat\s+/i, /[;&|`]\s*whoami/i, /[;&|`]\s*id/i, /[;&|`]\s*netstat/i]
    },
    {
        name: "Directory Traversal",
        category: "malicious",
        patterns: [/\.\.\//i, /%2e%2e%2f/i, /%2e%2e%5c/i]
    }
];

function scanRequest(req) {
    const inputs = [
        decodeURIComponent(req.originalUrl || req.url),
        JSON.stringify(req.query),
        JSON.stringify(req.body),
        JSON.stringify(req.headers)
    ];

    for (const rule of rules) {
        for (const pattern of rule.patterns) {
            for (const input of inputs) {
                if (pattern.test(input)) {
                    return { detected: true, rule: rule.name, type: rule.category };
                }
            }
        }
    }

    return { detected: false };
}

module.exports = { scanRequest };
