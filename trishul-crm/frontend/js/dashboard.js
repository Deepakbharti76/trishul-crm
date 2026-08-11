/* =========================================================================
   TRISHUL CRM — Dashboard logic
   ========================================================================= */

document.addEventListener('trishul:ready', loadDashboard);

const STATUS_COLORS = {
    NEW: '#5b9df9', CONTACTED: '#e0a83f', QUALIFIED: '#22b8a4',
    PROPOSAL: '#c9972f', WON: '#3ecf8e', LOST: '#e5586a',
    PENDING: '#e0a83f', IN_PROGRESS: '#5b9df9', COMPLETED: '#3ecf8e', CANCELLED: '#e5586a',
};

async function loadDashboard() {
    let stats;
    try {
        const res = await Api.get('/dashboard/stats');
        stats = res.data;
    } catch (err) {
        Toast.error(err.message || 'Failed to load dashboard');
        document.getElementById('statGrid').innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i class="fa-solid fa-plug-circle-xmark"></i><p>Could not load dashboard data. Is the backend running?</p></div>`;
        return;
    }

    // Data fetched successfully — render each widget independently so a
    // problem in one (e.g. Chart.js failing to load) never blanks out the
    // others, which already have real data to show.
    renderStatCards(stats);
    renderActivity(stats.recentActivity);

    if (typeof Chart === 'undefined') {
        console.error('Chart.js failed to load — charts will be skipped, but the rest of the dashboard is unaffected.');
        Toast.error('Charts could not load (Chart.js library failed to load from CDN).');
    } else {
        try { renderRevenueChart(stats.monthlyRevenue); } catch (e) { console.error('Revenue chart failed:', e); }
        try { renderLeadsChart(stats.leadsByStatus); } catch (e) { console.error('Leads chart failed:', e); }
        try { renderTasksChart(stats.tasksByStatus); } catch (e) { console.error('Tasks chart failed:', e); }
    }
}

function renderStatCards(stats) {
    const cards = [
        { label: 'Total Customers', value: stats.totalCustomers, icon: 'fa-address-book', color: 'var(--gold-300)', bg: 'rgba(201,151,47,0.14)', glow: 'var(--gold-glow)' },
        { label: 'Total Leads', value: stats.totalLeads, icon: 'fa-bullseye', color: 'var(--teal-300)', bg: 'rgba(34,184,164,0.14)', glow: 'var(--teal-glow)' },
        { label: 'Pending Tasks', value: stats.pendingTasks, icon: 'fa-list-check', color: '#e0a83f', bg: 'rgba(224,168,63,0.14)', glow: 'rgba(224,168,63,0.3)' },
        { label: 'Total Revenue', value: Fmt.currency(stats.totalRevenue), icon: 'fa-sack-dollar', color: '#3ecf8e', bg: 'rgba(62,207,142,0.14)', glow: 'rgba(62,207,142,0.3)' },
    ];

    document.getElementById('statGrid').innerHTML = cards.map(c => `
        <div class="stat-card" style="--stat-icon-color:${c.color}; --stat-icon-bg:${c.bg}; --stat-glow:${c.glow};">
            <div class="stat-top">
                <div class="stat-icon"><i class="fa-solid ${c.icon}"></i></div>
            </div>
            <div class="stat-value">${c.value}</div>
            <div class="stat-label">${c.label}</div>
        </div>
    `).join('');
}

function renderRevenueChart(monthlyRevenue) {
    const ctx = document.getElementById('revenueChart');
    const labels = monthlyRevenue.map(m => m.month);
    const data = monthlyRevenue.map(m => m.revenue);

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, 'rgba(201,151,47,0.35)');
    gradient.addColorStop(1, 'rgba(201,151,47,0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Revenue',
                data,
                borderColor: '#c9972f',
                backgroundColor: gradient,
                borderWidth: 2.5,
                pointBackgroundColor: '#e0b86a',
                pointBorderColor: '#0b0d13',
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4,
            }]
        },
        options: chartBaseOptions({
            yTicks: (v) => '₹' + (v / 1000) + 'k',
            tooltipLabel: (ctx) => 'Revenue: ' + Fmt.currency(ctx.parsed.y),
        })
    });
}

function renderLeadsChart(leadsByStatus) {
    const ctx = document.getElementById('leadsChart');
    const labels = Object.keys(leadsByStatus);
    const data = Object.values(leadsByStatus);
    const colors = labels.map(l => STATUS_COLORS[l] || '#6b7180');

    new Chart(ctx, {
        type: 'doughnut',
        data: { labels: labels.map(prettyLabel), datasets: [{ data, backgroundColor: colors, borderColor: '#12151d', borderWidth: 3 }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#a6acbb', usePointStyle: true, boxWidth: 8, font: { size: 11.5 } } },
                tooltip: { backgroundColor: '#1c212c', titleColor: '#eef0f4', bodyColor: '#a6acbb', borderColor: '#262c3a', borderWidth: 1, padding: 10 }
            },
            cutout: '68%'
        }
    });
}

function renderTasksChart(tasksByStatus) {
    const ctx = document.getElementById('tasksChart');
    const labels = Object.keys(tasksByStatus);
    const data = Object.values(tasksByStatus);
    const colors = labels.map(l => STATUS_COLORS[l] || '#6b7180');

    new Chart(ctx, {
        type: 'bar',
        data: { labels: labels.map(prettyLabel), datasets: [{ data, backgroundColor: colors, borderRadius: 8, maxBarThickness: 42 }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1c212c', titleColor: '#eef0f4', bodyColor: '#a6acbb', borderColor: '#262c3a', borderWidth: 1, padding: 10 } },
            scales: {
                x: { ticks: { color: '#a6acbb', font: { size: 11.5 } }, grid: { display: false } },
                y: { ticks: { color: '#a6acbb', stepSize: 1 }, grid: { color: '#1d222d' }, beginAtZero: true }
            }
        }
    });
}

function renderActivity(activity) {
    const el = document.getElementById('activityList');
    if (!activity || activity.length === 0) {
        el.innerHTML = `<div class="empty-state"><i class="fa-regular fa-clock"></i><p>No recent activity yet.</p></div>`;
        return;
    }
    el.innerHTML = activity.map(a => `
        <div class="activity-item">
            <div class="activity-dot ${a.type === 'LEAD' ? 'lead' : ''}"><i class="fa-solid ${a.type === 'LEAD' ? 'fa-bullseye' : 'fa-list-check'}"></i></div>
            <div class="activity-body">
                <p>${Fmt.escape(a.title)}</p>
                <span>${prettyLabel(a.status)} · ${Fmt.timeAgo(a.timestamp)}</span>
            </div>
        </div>
    `).join('');
}

function chartBaseOptions({ yTicks, tooltipLabel }) {
    return {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1c212c', titleColor: '#eef0f4', bodyColor: '#a6acbb',
                borderColor: '#262c3a', borderWidth: 1, padding: 10,
                callbacks: tooltipLabel ? { label: tooltipLabel } : undefined
            }
        },
        scales: {
            x: { ticks: { color: '#a6acbb', font: { size: 11.5 } }, grid: { display: false } },
            y: { ticks: { color: '#a6acbb', font: { size: 11 }, callback: yTicks }, grid: { color: '#1d222d' }, beginAtZero: true }
        }
    };
}

function prettyLabel(str) {
    if (!str) return str;
    return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}
