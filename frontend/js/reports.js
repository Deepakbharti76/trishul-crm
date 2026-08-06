/* =========================================================================
   TRISHUL CRM — Reports module
   Read: GET /reports (+ dashboard stats for the funnel). Write: POST /reports
   restricted to ADMIN & SUPERVISOR (mirrors backend SecurityConfig).
   ========================================================================= */

const REPORT_TYPE_ICON = {
    SALES: 'fa-chart-line', CUSTOMER: 'fa-address-book', LEAD: 'fa-bullseye',
    EMPLOYEE: 'fa-users', REVENUE: 'fa-sack-dollar',
};

document.addEventListener('trishul:ready', () => {
    loadReportsPage();
    wireModal();
});

async function loadReportsPage() {
    try {
        const [reportsRes, statsRes] = await Promise.all([
            Api.get('/reports'),
            Api.get('/dashboard/stats'),
        ]);
        renderStats(statsRes.data);
        renderFunnel(statsRes.data.leadsByStatus);
        renderReports(reportsRes.data || []);
    } catch (err) {
        Toast.error(err.message || 'Failed to load reports');
        document.getElementById('reportsList').innerHTML = `<div class="empty-state"><i class="fa-solid fa-plug-circle-xmark"></i><p>Could not load reports.</p></div>`;
    }
}

function renderStats(stats) {
    const won = stats.leadsByStatus?.WON || 0;
    const totalLeads = stats.totalLeads || 1;
    const conversion = Math.round((won / totalLeads) * 100);
    const avgDeal = stats.totalLeads > 0 ? stats.totalRevenue / Math.max(won, 1) : 0;

    const cards = [
        { label: 'Total Revenue (Won)', value: Fmt.currency(stats.totalRevenue), icon: 'fa-sack-dollar', color: '#3ecf8e', bg: 'rgba(62,207,142,0.14)' },
        { label: 'Conversion Rate', value: conversion + '%', icon: 'fa-chart-line', color: 'var(--gold-300)', bg: 'rgba(201,151,47,0.14)' },
        { label: 'Avg. Deal Size', value: Fmt.currency(avgDeal), icon: 'fa-coins', color: 'var(--teal-300)', bg: 'rgba(34,184,164,0.14)' },
        { label: 'Active Employees', value: stats.totalEmployees, icon: 'fa-users', color: '#5b9df9', bg: 'rgba(91,157,249,0.14)' },
    ];
    document.getElementById('statGrid').innerHTML = cards.map(c => `
        <div class="stat-card" style="--stat-icon-color:${c.color}; --stat-icon-bg:${c.bg};">
            <div class="stat-top"><div class="stat-icon"><i class="fa-solid ${c.icon}"></i></div></div>
            <div class="stat-value">${c.value}</div>
            <div class="stat-label">${c.label}</div>
        </div>
    `).join('');
}

function renderFunnel(leadsByStatus) {
    const order = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON'];
    const labels = order.filter(k => leadsByStatus[k] !== undefined);
    const data = labels.map(k => leadsByStatus[k]);
    const colors = ['#5b9df9', '#e0a83f', '#22b8a4', '#c9972f', '#3ecf8e'];

    new Chart(document.getElementById('funnelChart'), {
        type: 'bar',
        data: {
            labels: labels.map(l => l.charAt(0) + l.slice(1).toLowerCase()),
            datasets: [{ data, backgroundColor: colors, borderRadius: 8, maxBarThickness: 46 }]
        },
        options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: '#1c212c', titleColor: '#eef0f4', bodyColor: '#a6acbb', borderColor: '#262c3a', borderWidth: 1, padding: 10 }
            },
            scales: {
                x: { ticks: { color: '#a6acbb', stepSize: 1 }, grid: { color: '#1d222d' }, beginAtZero: true },
                y: { ticks: { color: '#a6acbb', font: { size: 12 } }, grid: { display: false } }
            }
        }
    });
}

function renderReports(reports) {
    const el = document.getElementById('reportsList');
    if (reports.length === 0) {
        el.innerHTML = `<div class="empty-state"><i class="fa-solid fa-chart-pie"></i><p>No reports generated yet.</p></div>`;
        return;
    }
    const sorted = [...reports].sort((a, b) => new Date(b.generatedDate) - new Date(a.generatedDate));
    el.innerHTML = sorted.map(r => `
        <div class="report-card">
            <div class="report-icon"><i class="fa-solid ${REPORT_TYPE_ICON[r.type] || 'fa-file-lines'}"></i></div>
            <div>
                <h4>${Fmt.escape(r.title)}</h4>
                <p>${Fmt.escape(r.summary || 'No summary provided.')}</p>
                <div class="report-meta">
                    <span class="type-tag">${Fmt.escape(r.type || 'GENERAL')}</span>
                    <span><i class="fa-regular fa-user"></i> ${Fmt.escape(r.generatedBy || 'System')}</span>
                    <span><i class="fa-regular fa-clock"></i> ${Fmt.dateTime(r.generatedDate)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function wireModal() {
    const modal = document.getElementById('formModal');
    const form = document.getElementById('reportForm');
    const openBtn = document.getElementById('openCreateModal');

    if (openBtn) openBtn.addEventListener('click', () => {
        form.reset();
        document.querySelector('#reportForm .field-error').style.display = 'none';
        modal.classList.add('open');
    });
    document.getElementById('closeModal').addEventListener('click', () => modal.classList.remove('open'));
    document.getElementById('cancelForm').addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('title');
        if (!titleInput.value.trim()) {
            titleInput.nextElementSibling.style.display = 'block';
            return;
        }
        const user = Session.get();
        const payload = {
            title: titleInput.value.trim(),
            type: document.getElementById('type').value,
            summary: document.getElementById('summary').value.trim(),
            generatedBy: user ? user.fullName : 'System',
        };

        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Generating…';
        try {
            await Api.post('/reports', payload);
            Toast.success('Report generated successfully');
            modal.classList.remove('open');
            loadReportsPage();
        } catch (err) {
            Toast.error(err.message || 'Failed to generate report');
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Generate';
        }
    });
}
