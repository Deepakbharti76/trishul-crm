/* =========================================================================
   TRISHUL CRM — AI Assistant
   A lightweight, rule-based assistant that answers natural-language
   questions about the business by reading live data from the existing
   REST APIs (/dashboard/stats, /customers, /leads, /tasks, /employees).
   No external AI service is called — everything is grounded in real data
   already stored in the CRM.
   ========================================================================= */

let chatHistory = [];

document.addEventListener('trishul:ready', (e) => {
    initChat(e.detail.user);
});

function initChat(user) {
    const messages = document.getElementById('chatMessages');
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput');

    addMessage('ai', `Hi ${user.fullName.split(' ')[0]}! I'm your Trishul Assistant. Ask me anything about your customers, leads, tasks, employees, or revenue.`);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const question = input.value.trim();
        if (!question) return;
        addMessage('user', Fmt.escape(question));
        input.value = '';
        const typingEl = showTyping();
        try {
            const answer = await answerQuestion(question);
            typingEl.remove();
            addMessage('ai', answer);
        } catch (err) {
            typingEl.remove();
            addMessage('ai', `I couldn't reach the CRM server just now (${Fmt.escape(err.message)}). Please make sure the backend is running and try again.`);
        }
    });

    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            input.value = btn.dataset.q;
            form.dispatchEvent(new Event('submit'));
        });
    });

    document.getElementById('clearChatBtn').addEventListener('click', () => {
        messages.innerHTML = '';
        chatHistory = [];
        addMessage('ai', 'Chat cleared. What would you like to know?');
    });
}

function addMessage(role, html) {
    const messages = document.getElementById('chatMessages');
    const wrap = document.createElement('div');
    wrap.className = `msg ${role}`;
    wrap.innerHTML = `
        <div class="msg-avatar"><i class="fa-solid ${role === 'ai' ? 'fa-wand-magic-sparkles' : 'fa-user'}"></i></div>
        <div class="msg-bubble">${html}</div>
    `;
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
    chatHistory.push({ role, html });
    return wrap;
}

function showTyping() {
    const messages = document.getElementById('chatMessages');
    const wrap = document.createElement('div');
    wrap.className = 'msg ai';
    wrap.innerHTML = `
        <div class="msg-avatar"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
        <div class="msg-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>
    `;
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
    return wrap;
}

async function answerQuestion(question) {
    const q = question.toLowerCase();

    // Small artificial delay so the "typing" indicator feels natural
    await new Promise(r => setTimeout(r, 450 + Math.random() * 350));

    if (/revenue|earning|income|sales value/.test(q)) {
        const stats = (await Api.get('/dashboard/stats')).data;
        return `Total revenue from won deals is <span class="metric">${Fmt.currency(stats.totalRevenue)}</span>. This is calculated from all leads currently marked as <strong>WON</strong>.`;
    }

    if (/pending task|task.*pending|how many task/.test(q)) {
        const stats = (await Api.get('/dashboard/stats')).data;
        return `You have <span class="metric">${stats.pendingTasks}</span> pending or in-progress tasks right now. Head to the <strong>Tasks</strong> module to review them.`;
    }

    if (/pipeline|lead.*stage|funnel|conversion/.test(q)) {
        const stats = (await Api.get('/dashboard/stats')).data;
        const byStatus = stats.leadsByStatus || {};
        const list = Object.entries(byStatus).map(([k, v]) => `<li>${prettyLabel(k)}: <span class="metric">${v}</span></li>`).join('');
        const won = byStatus.WON || 0;
        const conv = stats.totalLeads > 0 ? Math.round((won / stats.totalLeads) * 100) : 0;
        if (/conversion/.test(q)) {
            return `Your lead conversion rate is <span class="metric">${conv}%</span> (${won} won out of ${stats.totalLeads} total leads).`;
        }
        return `Here's your current lead pipeline:<ul>${list}</ul>`;
    }

    if (/top customer|best customer|customer/.test(q)) {
        const customers = (await Api.get('/customers')).data || [];
        const active = customers.filter(c => c.status === 'ACTIVE');
        const list = active.slice(0, 5).map(c => `<li>${Fmt.escape(c.name)} — ${Fmt.escape(c.company || 'N/A')}</li>`).join('');
        return `You have <span class="metric">${customers.length}</span> total customers, <span class="metric">${active.length}</span> of them active. Top accounts:<ul>${list || '<li>No active customers yet.</li>'}</ul>`;
    }

    if (/employee|headcount|team size|staff/.test(q)) {
        const employees = (await Api.get('/employees')).data || [];
        const active = employees.filter(e => e.status === 'ACTIVE').length;
        const onLeave = employees.filter(e => e.status === 'ON_LEAVE').length;
        return `Your team has <span class="metric">${employees.length}</span> employees — <span class="metric">${active}</span> active and <span class="metric">${onLeave}</span> currently on leave.`;
    }

    if (/lead/.test(q) && /how many|count|total/.test(q)) {
        const leads = (await Api.get('/leads')).data || [];
        return `You currently have <span class="metric">${leads.length}</span> leads in the system.`;
    }

    if (/customer/.test(q) && /how many|count|total/.test(q)) {
        const customers = (await Api.get('/customers')).data || [];
        return `You currently have <span class="metric">${customers.length}</span> customers on record.`;
    }

    if (/hello|hi there|^hi$|hey/.test(q)) {
        return `Hello! I can tell you about your revenue, leads, tasks, customers, or team. What would you like to know?`;
    }

    if (/thank/.test(q)) {
        return `You're welcome! Let me know if there's anything else you'd like to check.`;
    }

    // Fallback: give a general snapshot
    const stats = (await Api.get('/dashboard/stats')).data;
    return `I'm not fully sure how to answer that yet, but here's a quick snapshot: <span class="metric">${stats.totalCustomers}</span> customers, <span class="metric">${stats.totalLeads}</span> leads, <span class="metric">${stats.pendingTasks}</span> pending tasks, and <span class="metric">${Fmt.currency(stats.totalRevenue)}</span> in revenue. Try asking about revenue, leads, tasks, customers, or employees.`;
}

function prettyLabel(str) {
    if (!str) return str;
    return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}
