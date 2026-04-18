async function updateStats() {
    try {
        const res = await fetch('/api/stats');
        const data = await res.json();

        document.getElementById('total-requests').innerText = data.totalRequests;
        document.getElementById('blocked-requests').innerText = data.blockedRequests;
        
        document.getElementById('unique-targets').innerText = 1;
        document.getElementById('ip-bans').innerText = data.attacksByCategory['Rate Limiting / Abuse'] || 0;

        const tbody = document.getElementById('logs-tbody');
        if (data.alerts && data.alerts.length > 0) {
            tbody.innerHTML = '';
            data.alerts.forEach(alert => {
                const tr = document.createElement('tr');
                const tagClass = getTagClass(alert.category);
                
                tr.innerHTML = `
                    <td style="color: var(--text-muted); font-size: 0.85rem;">${new Date(alert.timestamp).toLocaleTimeString()}</td>
                    <td style="font-family: monospace;">${alert.ip}</td>
                    <td><span class="tag ${tagClass}">${alert.category}</span></td>
                    <td><span style="color: ${getSeverityColor(alert.category)};">Critical</span></td>
                    <td style="color: var(--text-muted); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${alert.detail}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        const distContainer = document.getElementById('distribution-container');
        if (Object.values(data.attacksByCategory).some(count => count > 0)) {
            distContainer.innerHTML = '';
            const maxVal = Math.max(...Object.values(data.attacksByCategory));

            for (const [cat, count] of Object.entries(data.attacksByCategory)) {
                if(count === 0 && cat !== 'SQL Injection (SQLi)') continue; 
                
                const percentage = maxVal === 0 ? 0 : (count / maxVal) * 100;
                const div = document.createElement('div');
                div.className = 'distribution-item';
                div.innerHTML = `
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span>${cat}</span>
                            <span>${count}</span>
                        </div>
                        <div class="distribution-bar-bg">
                            <div class="distribution-bar-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
                distContainer.appendChild(div);
            }
        }

    } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
    }
}

function getTagClass(cat) {
    if (cat.includes('SQL')) return 'tag-sqli';
    if (cat.includes('XSS')) return 'tag-xss';
    if (cat.includes('File')) return 'tag-lfi';
    if (cat.includes('Abuse')) return 'tag-abuse';
    return '';
}

function getSeverityColor(cat) {
    if (cat.includes('SQL') || cat.includes('Injection')) return '#ff4d4d';
    if (cat.includes('XSS')) return '#00d2ff';
    return '#ffa502';
}

updateStats();
setInterval(updateStats, 2000);
document.getElementById('refresh-logs').addEventListener('click', updateStats);
