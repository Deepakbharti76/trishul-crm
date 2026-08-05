/* =========================================================================
   TRISHUL CRM — Tasks module (CRUD via /tasks)
   ========================================================================= */

let allTasks = [];

document.addEventListener('trishul:ready', () => {
    loadTasks();
    wireToolbar();
    wireModal();
});

const PRIORITY_BADGE = { LOW: 'neutral', MEDIUM: 'info', HIGH: 'warning', URGENT: 'danger' };
const TASK_STATUS_BADGE = { PENDING: 'warning', IN_PROGRESS: 'info', COMPLETED: 'success', CANCELLED: 'danger' };

async function loadTasks() {
    const body = document.getElementById('tableBody');
    body.innerHTML = `<tr><td colspan="6"><div class="loader-row"><span class="spinner"></span> Loading tasks…</div></td></tr>`;
    try {
        const res = await Api.get('/tasks');
        allTasks = res.data || [];
        renderTable();
    } catch (err) {
        body.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-plug-circle-xmark"></i><p>${Fmt.escape(err.message)}</p></div></td></tr>`;
    }
}

function renderTable() {
    const body = document.getElementById('tableBody');
    const search = document.getElementById('searchInput').value.trim().toLowerCase();
    const status = document.getElementById('statusFilter').value;

    let rows = allTasks.filter(t => {
        const matchesSearch = !search || [t.title, t.assignedTo, t.description].some(v => (v || '').toLowerCase().includes(search));
        const matchesStatus = !status || t.status === status;
        return matchesSearch && matchesStatus;
    });

    if (rows.length === 0) {
        body.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-list-check"></i><p>No tasks found. Try adjusting your filters or add a new one.</p></div></td></tr>`;
        return;
    }

    body.innerHTML = rows.map(t => `
        <tr>
            <td><strong>${Fmt.escape(t.title)}</strong>${t.description ? `<div class="cell-sub">${Fmt.escape(truncate(t.description, 60))}</div>` : ''}</td>
            <td><span class="badge ${PRIORITY_BADGE[t.priority] || 'neutral'}">${prettyLabel(t.priority)}</span></td>
            <td><span class="badge ${TASK_STATUS_BADGE[t.status] || 'neutral'}">${prettyLabel(t.status)}</span></td>
            <td>${Fmt.escape(t.assignedTo || '—')}</td>
            <td>${Fmt.date(t.dueDate)}</td>
            <td>
                <div class="row-actions">
                    <button onclick="editTask(${t.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="del" onclick="deleteTask(${t.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function truncate(str, n) { return str.length > n ? str.slice(0, n) + '…' : str; }
function prettyLabel(str) { if (!str) return '—'; return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); }

function wireToolbar() {
    document.getElementById('searchInput').addEventListener('input', renderTable);
    document.getElementById('statusFilter').addEventListener('change', renderTable);
}

function wireModal() {
    const modal = document.getElementById('formModal');
    const form = document.getElementById('taskForm');

    document.getElementById('openCreateModal').addEventListener('click', () => openModal());
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelForm').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('title');
        if (!titleInput.value.trim()) {
            titleInput.nextElementSibling.style.display = 'block';
            return;
        }

        const payload = {
            title: titleInput.value.trim(),
            description: document.getElementById('description').value.trim(),
            priority: document.getElementById('priority').value,
            status: document.getElementById('status').value,
            assignedTo: document.getElementById('assignedTo').value.trim(),
            dueDate: document.getElementById('dueDate').value || null,
        };

        const id = document.getElementById('taskId').value;
        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Saving…';

        try {
            if (id) {
                await Api.put(`/tasks/${id}`, payload);
                Toast.success('Task updated successfully');
            } else {
                await Api.post('/tasks', payload);
                Toast.success('Task added successfully');
            }
            closeModal();
            loadTasks();
        } catch (err) {
            Toast.error(err.message || 'Failed to save task');
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Save Task';
        }
    });
}

function openModal(task = null) {
    const modal = document.getElementById('formModal');
    document.getElementById('taskForm').reset();
    document.querySelector('#taskForm .field-error').style.display = 'none';

    if (task) {
        document.getElementById('modalTitle').textContent = 'Edit Task';
        document.getElementById('taskId').value = task.id;
        document.getElementById('title').value = task.title || '';
        document.getElementById('description').value = task.description || '';
        document.getElementById('priority').value = task.priority || 'MEDIUM';
        document.getElementById('status').value = task.status || 'PENDING';
        document.getElementById('assignedTo').value = task.assignedTo || '';
        document.getElementById('dueDate').value = task.dueDate || '';
    } else {
        document.getElementById('modalTitle').textContent = 'Add Task';
        document.getElementById('taskId').value = '';
    }
    modal.classList.add('open');
}

function closeModal() {
    document.getElementById('formModal').classList.remove('open');
}

function editTask(id) {
    const task = allTasks.find(t => t.id === id);
    if (task) openModal(task);
}

async function deleteTask(id) {
    if (!confirm('Delete this task? This action cannot be undone.')) return;
    try {
        await Api.del(`/tasks/${id}`);
        Toast.success('Task deleted');
        loadTasks();
    } catch (err) {
        Toast.error(err.message || 'Failed to delete task');
    }
}
