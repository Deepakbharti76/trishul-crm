/* =========================================================================
   TRISHUL CRM — Settings module
   GET/PUT /settings restricted to ADMIN for writes (mirrors backend rule).
   ========================================================================= */

document.addEventListener('trishul:ready', (e) => {
    wireTabs();
    loadSettings();
    fillAccountTab(e.detail.user);
    wireSave(e.detail.user);
});

function wireTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
        });
    });
}

async function loadSettings() {
    try {
        const res = await Api.get('/settings');
        const s = res.data;
        document.getElementById('companyName').value = s.companyName || '';
        document.getElementById('companyEmail').value = s.companyEmail || '';
        document.getElementById('currency').value = s.currency || 'INR';
        document.getElementById('timezone').value = s.timezone || 'Asia/Kolkata';
        document.getElementById('fiscalYearStart').value = s.fiscalYearStart || 'April';
        document.getElementById('emailNotifications').checked = !!s.emailNotifications;
        document.getElementById('smsNotifications').checked = !!s.smsNotifications;
    } catch (err) {
        Toast.error(err.message || 'Failed to load settings');
    }
}

function fillAccountTab(user) {
    document.getElementById('accountName').value = user.fullName || '';
    document.getElementById('accountUsername').value = user.username || '';
    document.getElementById('accountEmail').value = user.email || '';
    document.getElementById('accountRole').value = user.role || '';
}

function wireSave(user) {
    const saveBtn = document.getElementById('saveSettingsBtn');

    if (user.role !== 'ADMIN') {
        document.getElementById('settingsRoleNote').style.display = 'flex';
        document.querySelectorAll('#tab-general input, #tab-general select, #tab-notifications input').forEach(el => el.disabled = true);
        return;
    }

    saveBtn.addEventListener('click', async () => {
        const payload = {
            companyName: document.getElementById('companyName').value.trim(),
            companyEmail: document.getElementById('companyEmail').value.trim(),
            currency: document.getElementById('currency').value,
            timezone: document.getElementById('timezone').value,
            fiscalYearStart: document.getElementById('fiscalYearStart').value,
            theme: 'dark',
            emailNotifications: document.getElementById('emailNotifications').checked,
            smsNotifications: document.getElementById('smsNotifications').checked,
        };

        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="spinner"></span> Saving…';
        try {
            await Api.put('/settings', payload);
            Toast.success('Settings updated successfully');
        } catch (err) {
            Toast.error(err.message || 'Failed to update settings');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Changes';
        }
    });
}
