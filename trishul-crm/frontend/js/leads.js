/* =========================================================================
   TRISHUL CRM — Leads module (CRUD via /leads)
   ========================================================================= */

let allLeads = [];

document.addEventListener('trishul:ready', () => {
    loadLeads();
    wireToolbar();
    wireModal();
});

const STAGE_BADGE = {
    NEW: 'info', CONTACTED: 'warning', QUALIFIED: 'gold',
    PROPOSAL: 'gold', WON: 'success', LOST: 'danger',
};

async function loadLeads() {
    const body = document.getElementById('tableBody');
    body.innerHTML = `<tr><td colspan="7"><div class="loader-row"><span class="spinner"></span> Loading leads…</div></td></tr>`;
    try {
        const res = await Api.get('/leads');
        allLeads = res.data || [];
        renderTable();
    } catch (err) {
        body.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-plug-circle-xmark"></i><p>${Fmt.escape(err.message)}</p></div></td></tr>`;
    }
}

function renderTable() {
    const body = document.getElementById('tableBody');
    const search = document.getElementById('searchInput').value.trim().toLowerCase();
    const stage = document.getElementById('statusFilter').value;

    let rows = allLeads.filter(l => {
        const matchesSearch = !search || [l.name, l.email, l.assignedTo].some(v => (v || '').toLowerCase().includes(search));
        const matchesStage = !stage || l.status === stage;
        return matchesSearch && matchesStage;
    });

    if (rows.length === 0) {
        body.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-bullseye"></i><p>No leads found. Try adjusting your filters or add a new one.</p></div></td></tr>`;
        return;
    }

    body.innerHTML = rows.map(l => `
        <tr>
            <td><strong>${Fmt.escape(l.name)}</strong><div class="cell-sub">${Fmt.escape(l.email || '')}</div></td>
            <td>${prettyLabel(l.source)}</td>
            <td><span class="badge ${STAGE_BADGE[l.status] || 'neutral'}">${prettyLabel(l.status)}</span></td>
            <td>${Fmt.currency(l.value)}</td>
            <td>${Fmt.escape(l.assignedTo || '—')}</td>
            <td>${Fmt.date(l.createdAt)}</td>
            <td>
                <div class="row-actions">
                    <button onclick="editLead(${l.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="del" onclick="deleteLead(${l.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function prettyLabel(str) {
    if (!str) return '—';
    return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function wireToolbar() {
    document.getElementById('searchInput').addEventListener('input', renderTable);
    document.getElementById('statusFilter').addEventListener('change', renderTable);
}

function wireModal() {
    const modal = document.getElementById('formModal');
    const form = document.getElementById('leadForm');

    document.getElementById('openCreateModal').addEventListener('click', () => openModal());
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelForm').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('name');
        if (!nameInput.value.trim()) {
            nameInput.nextElementSibling.style.display = 'block';
            return;
        }

        const payload = {
            name: nameInput.value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            source: document.getElementById('source').value,
            status: document.getElementById('status').value,
            value: Number(document.getElementById('value').value || 0),
            assignedTo: document.getElementById('assignedTo').value.trim(),
        };

        const id = document.getElementById('leadId').value;
        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Saving…';

        try {
            if (id) {
                await Api.put(`/leads/${id}`, payload);
                Toast.success('Lead updated successfully');
            } else {
                await Api.post('/leads', payload);
                Toast.success('Lead added successfully');
            }
            closeModal();
            loadLeads();
        } catch (err) {
            Toast.error(err.message || 'Failed to save lead');
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Save Lead';
        }
    });
}

function openModal(lead = null) {
    const modal = document.getElementById('formModal');
    document.getElementById('leadForm').reset();
    document.querySelector('#leadForm .field-error').style.display = 'none';

    if (lead) {
        document.getElementById('modalTitle').textContent = 'Edit Lead';
        document.getElementById('leadId').value = lead.id;
        document.getElementById('name').value = lead.name || '';
        document.getElementById('email').value = lead.email || '';
        document.getElementById('phone').value = lead.phone || '';
        document.getElementById('source').value = lead.source || 'WEBSITE';
        document.getElementById('status').value = lead.status || 'NEW';
        document.getElementById('value').value = lead.value || 0;
        document.getElementById('assignedTo').value = lead.assignedTo || '';
    } else {
        document.getElementById('modalTitle').textContent = 'Add Lead';
        document.getElementById('leadId').value = '';
    }
    modal.classList.add('open');
}

function closeModal() {
    document.getElementById('formModal').classList.remove('open');
}

function editLead(id) {
    const lead = allLeads.find(l => l.id === id);
    if (lead) openModal(lead);
}

async function deleteLead(id) {
    if (!confirm('Delete this lead? This action cannot be undone.')) return;
    try {
        await Api.del(`/leads/${id}`);
        Toast.success('Lead deleted');
        loadLeads();
    } catch (err) {
        Toast.error(err.message || 'Failed to delete lead');
    }
}
