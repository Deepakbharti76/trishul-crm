/* =========================================================================
   TRISHUL CRM — Employees module (CRUD via /employees)
   Create/Update restricted to ADMIN & SUPERVISOR, Delete restricted to ADMIN
   (mirrors backend SecurityConfig rules).
   ========================================================================= */

let allEmployees = [];

document.addEventListener('trishul:ready', () => {
    loadEmployees();
    wireToolbar();
    wireModal();
});

const EMP_STATUS_BADGE = { ACTIVE: 'success', ON_LEAVE: 'warning', INACTIVE: 'neutral' };

function currentRole() {
    const u = Session.get();
    return u ? u.role : null;
}
function canEdit() { return ['ADMIN', 'SUPERVISOR'].includes(currentRole()); }
function canDelete() { return currentRole() === 'ADMIN'; }

async function loadEmployees() {
    const body = document.getElementById('tableBody');
    body.innerHTML = `<tr><td colspan="6"><div class="loader-row"><span class="spinner"></span> Loading employees…</div></td></tr>`;
    try {
        const res = await Api.get('/employees');
        allEmployees = res.data || [];
        renderTable();
    } catch (err) {
        body.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-plug-circle-xmark"></i><p>${Fmt.escape(err.message)}</p></div></td></tr>`;
    }
}

function renderTable() {
    const body = document.getElementById('tableBody');
    const search = document.getElementById('searchInput').value.trim().toLowerCase();
    const status = document.getElementById('statusFilter').value;

    let rows = allEmployees.filter(e => {
        const matchesSearch = !search || [e.name, e.email, e.designation, e.department].some(v => (v || '').toLowerCase().includes(search));
        const matchesStatus = !status || e.status === status;
        return matchesSearch && matchesStatus;
    });

    if (rows.length === 0) {
        body.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-users"></i><p>No employees found. Try adjusting your filters.</p></div></td></tr>`;
        return;
    }

    const editable = canEdit();
    const deletable = canDelete();

    body.innerHTML = rows.map(e => `
        <tr>
            <td><strong>${Fmt.escape(e.name)}</strong><div class="cell-sub">${Fmt.escape(e.email || '')}</div></td>
            <td>${Fmt.escape(e.designation || '—')}</td>
            <td>${Fmt.escape(e.department || '—')}</td>
            <td>${Fmt.date(e.joiningDate)}</td>
            <td><span class="badge ${EMP_STATUS_BADGE[e.status] || 'neutral'}">${prettyLabel(e.status)}</span></td>
            <td>
                <div class="row-actions">
                    ${editable ? `<button onclick="editEmployee(${e.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>` : ''}
                    ${deletable ? `<button class="del" onclick="deleteEmployee(${e.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>` : ''}
                    ${(!editable && !deletable) ? '<span class="cell-sub">View only</span>' : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function prettyLabel(str) { if (!str) return '—'; return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); }

function wireToolbar() {
    document.getElementById('searchInput').addEventListener('input', renderTable);
    document.getElementById('statusFilter').addEventListener('change', renderTable);
}

function wireModal() {
    const modal = document.getElementById('formModal');
    const form = document.getElementById('employeeForm');

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
            designation: document.getElementById('designation').value.trim(),
            department: document.getElementById('department').value.trim(),
            joiningDate: document.getElementById('joiningDate').value || null,
            salary: Number(document.getElementById('salary').value || 0),
            status: document.getElementById('status').value,
        };

        const id = document.getElementById('employeeId').value;
        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Saving…';

        try {
            if (id) {
                await Api.put(`/employees/${id}`, payload);
                Toast.success('Employee updated successfully');
            } else {
                await Api.post('/employees', payload);
                Toast.success('Employee added successfully');
            }
            closeModal();
            loadEmployees();
        } catch (err) {
            Toast.error(err.message || 'Failed to save employee');
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Save Employee';
        }
    });
}

function openModal(employee = null) {
    if (!canEdit()) { Toast.error('You do not have permission to modify employees.'); return; }
    const modal = document.getElementById('formModal');
    document.getElementById('employeeForm').reset();
    document.querySelector('#employeeForm .field-error').style.display = 'none';

    if (employee) {
        document.getElementById('modalTitle').textContent = 'Edit Employee';
        document.getElementById('employeeId').value = employee.id;
        document.getElementById('name').value = employee.name || '';
        document.getElementById('email').value = employee.email || '';
        document.getElementById('phone').value = employee.phone || '';
        document.getElementById('designation').value = employee.designation || '';
        document.getElementById('department').value = employee.department || '';
        document.getElementById('joiningDate').value = employee.joiningDate || '';
        document.getElementById('salary').value = employee.salary || 0;
        document.getElementById('status').value = employee.status || 'ACTIVE';
    } else {
        document.getElementById('modalTitle').textContent = 'Add Employee';
        document.getElementById('employeeId').value = '';
    }
    modal.classList.add('open');
}

function closeModal() {
    document.getElementById('formModal').classList.remove('open');
}

function editEmployee(id) {
    const employee = allEmployees.find(e => e.id === id);
    if (employee) openModal(employee);
}

async function deleteEmployee(id) {
    if (!canDelete()) { Toast.error('Only Admins can remove employees.'); return; }
    if (!confirm('Remove this employee record? This action cannot be undone.')) return;
    try {
        await Api.del(`/employees/${id}`);
        Toast.success('Employee removed');
        loadEmployees();
    } catch (err) {
        Toast.error(err.message || 'Failed to remove employee');
    }
}
