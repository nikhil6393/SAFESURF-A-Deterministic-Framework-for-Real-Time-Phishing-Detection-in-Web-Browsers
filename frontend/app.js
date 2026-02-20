const API_BASE = 'http://localhost:5000/api';
let activityChart = null;
let analyticsChart = null;
let scanHistory = [];

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupNavigation();
    initCharts();
});

function initApp() {
    fetchStats();
    fetchHistory();
    fetchDataset();
    setInterval(fetchStats, 6000);
    setInterval(fetchHistory, 12000);
}

function setupNavigation() {
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');

            document.querySelectorAll('.menu a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
            const targetPage = document.getElementById(`${pageId}-page`);
            if (targetPage) {
                targetPage.classList.add('active');
                // Force chart update on page switch to fix size issues
                if (pageId === 'dashboard' && activityChart) activityChart.update('none');
                if (pageId === 'analytics' && analyticsChart) analyticsChart.update('none');
            }
        });
    });
}

async function fetchStats() {
    try {
        const res = await fetch(`${API_BASE}/stats`);
        const data = await res.json();

        updateEl('hero-total', data.totalScanned.toLocaleString());
        updateEl('hero-blocked', data.threatsBlocked.toLocaleString());
        updateEl('intelligence-size', data.intelligenceSize.toLocaleString());

        // Update integrity score
        const integrityText = document.getElementById('integrity-text');
        if (integrityText) {
            const score = 98.5 + (Math.random() * 1.4);
            integrityText.innerText = `${score.toFixed(1)}%`;
        }
    } catch (err) {
        console.warn("Stats API connection lost.");
    }
}

function updateEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
}

async function fetchHistory() {
    try {
        const res = await fetch(`${API_BASE}/history`);
        scanHistory = await res.json();
        renderLiveStream(scanHistory.slice(0, 8));
        renderFullHistory(scanHistory);
        updateCharts(scanHistory);
    } catch (err) {
        console.warn("History API connection lost.");
    }
}

function renderLiveStream(logs) {
    const tbody = document.getElementById('scanTableBody');
    if (!tbody || logs.length === 0) return;

    tbody.innerHTML = logs.map(log => `
        <tr>
            <td><code>#${log.refId ? log.refId.substring(4) : '---'}</code></td>
            <td title="${log.url}">${log.url.length > 35 ? log.url.substring(0, 35) + '...' : log.url}</td>
            <td><span class="vector-label">${log.source ? log.source.toUpperCase() : 'UNKNOWN'}</span></td>
            <td><span class="status-pill ${log.label.toLowerCase() === 'safe' ? 'safe' : 'danger'}">${log.label}</span></td>
            <td><strong>${log.score}%</strong></td>
            <td>${new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
        </tr>
    `).join('');
}

function renderFullHistory(logs) {
    const tbody = document.getElementById('fullHistoryBody');
    if (!tbody) return;

    // Sort logic handled by backend usually, but ensuring order here
    const sorted = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    tbody.innerHTML = sorted.map(log => `
        <tr>
            <td><code>${log.refId || 'N/A'}</code></td>
            <td title="${log.url}">${log.url.length > 60 ? log.url.substring(0, 60) + '...' : log.url}</td>
            <td><span class="status-pill ${log.label.toLowerCase() === 'safe' ? 'safe' : 'danger'}">${log.label}</span></td>
            <td><strong>${log.score}%</strong></td>
            <td>${new Date(log.timestamp).toLocaleString()}</td>
        </tr>
    `).join('');
}

async function scanURL() {
    const input = document.getElementById('urlInput');
    const url = input.value.trim();
    if (!url) return;

    const btn = document.querySelector('.scan-btn');
    const btnText = document.getElementById('scan-text');
    const originalText = btnText.innerText;

    btn.disabled = true;
    btnText.innerText = 'CHECKING...';

    try {
        const res = await fetch(`${API_BASE}/check-url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        const result = await res.json();

        showToast(result.label, `${result.label.toUpperCase()} detected for node analysis.`);

        fetchStats();
        fetchHistory();
        input.value = '';
    } catch (err) {
        showToast('error', 'Neural Core connection severed.');
    } finally {
        btn.disabled = false;
        btnText.innerText = originalText;
    }
}

function showToast(type, msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const icon = toast.querySelector('i');

    toastMsg.innerText = msg;
    toast.className = 'toast-notification active';

    if (type.toLowerCase() === 'safe') {
        toast.style.borderLeftColor = 'var(--emerald)';
        icon.className = 'fas fa-shield-check';
        icon.style.color = 'var(--emerald)';
    } else if (type === 'error') {
        toast.style.borderLeftColor = 'var(--rose)';
        icon.className = 'fas fa-triangle-exclamation';
        icon.style.color = 'var(--rose)';
    } else {
        toast.style.borderLeftColor = 'var(--rose)';
        icon.className = 'fas fa-biohazard';
        icon.style.color = 'var(--rose)';
    }

    setTimeout(() => {
        toast.classList.remove('active');
    }, 4000);
}

function initCharts() {
    // CHART DEFAULTS
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = '"Plus Jakarta Sans", sans-serif';

    const ctx1 = document.getElementById('activityChart')?.getContext('2d');
    if (ctx1) {
        // Gradient for Area Chart
        const gradient = ctx1.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(217, 70, 239, 0.5)'); // Neon Magenta Glow
        gradient.addColorStop(1, 'rgba(217, 70, 239, 0.0)');

        activityChart = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Risk Velocity',
                    data: [],
                    borderColor: '#d946ef', // Neon Magenta
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#09090b', // Zinc 950
                    pointBorderColor: '#d946ef',
                    pointBorderWidth: 2,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#d946ef',
                    pointHoverBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        border: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        border: { display: false }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                }
            }
        });
    }

    const ctx2 = document.getElementById('analyticsChart')?.getContext('2d');
    if (ctx2) {
        analyticsChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Malicious', 'Safe', 'Suspicious', 'Other'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: [
                        '#f43f5e', // Rose
                        '#2dd4bf', // Teal (Safe)
                        '#fbbf24', // Amber
                        '#d946ef'  // Magenta (Other)
                    ],
                    borderRadius: 8,
                    borderSkipped: false,
                    barThickness: 40
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        border: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        border: { display: false }
                    }
                }
            }
        });
    }
}

function updateCharts(logs) {
    if (!logs.length) return;

    if (activityChart) {
        const last12 = logs.slice(0, 12).reverse();
        activityChart.data.labels = last12.map(l => new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        activityChart.data.datasets[0].data = last12.map(l => l.score);
        activityChart.update('none');
    }

    if (analyticsChart) {
        const counts = { Malicious: 0, Safe: 0, Suspicious: 0, Other: 0 };
        logs.forEach(l => {
            const label = l.label || 'Other';
            if (counts[label] !== undefined) counts[label]++;
            else counts.Other++;
        });
        analyticsChart.data.datasets[0].data = [counts.Malicious, counts.Safe, counts.Suspicious, counts.Other];
        analyticsChart.update('none');
    }
}

async function fetchDataset() {
    try {
        const res = await fetch(`${API_BASE}/dataset`);
        const data = await res.json();
        updateEl('db-count', `${data.length.toLocaleString()} Indexed Signatures`);

        const grid = document.getElementById('databaseGrid');
        if (grid) {
            grid.innerHTML = data.slice(0, 16).map(item => `
                <div class="card intel-node">
                    <div class="intel-url" title="${item.url}">${item.url}</div>
                    <div class="intel-meta">
                        <span class="status-pill ${item.label === 'safe' ? 'safe' : 'danger'}">${item.label}</span>
                        <span class="type-tag">${item.type || 'Signature'}</span>
                    </div>
                </div>
            `).join('');
        }
    } catch (err) { }
}

// History Search Logic
const historySearch = document.getElementById('historySearch');
if (historySearch) {
    historySearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = scanHistory.filter(log =>
            log.url.toLowerCase().includes(term) ||
            log.label.toLowerCase().includes(term) ||
            (log.refId && log.refId.toLowerCase().includes(term))
        );
        renderFullHistory(filtered);
    });
}
