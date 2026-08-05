/* =========================================================================
   TRISHUL CRM — Shared layout behavior for every authenticated page.
   Handles: auth guard, active nav highlight, user chip, logout, RBAC hiding,
   mobile sidebar toggle.
   ========================================================================= */

(async function initLayout() {
    const user = await Session.requireAuth();
    if (!user) return; // requireAuth already redirected to login

    // Populate user chip
    const nameEl = document.getElementById('sidebarUserName');
    const roleEl = document.getElementById('sidebarUserRole');
    const avatarEl = document.getElementById('sidebarAvatar');
    if (nameEl) nameEl.textContent = user.fullName;
    if (roleEl) roleEl.textContent = user.role.toLowerCase();
    if (avatarEl) avatarEl.textContent = Fmt.initials(user.fullName);

    // Highlight active nav item based on current filename
    const current = window.location.pathname.split('/').pop() || 'dashboard.html';
    document.querySelectorAll('.nav-item').forEach(item => {
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === current) {
            item.classList.add('active');
        }
    });

    // Role based visibility: elements with data-roles="ADMIN,SUPERVISOR"
    document.querySelectorAll('[data-roles]').forEach(el => {
        const allowed = el.dataset.roles.split(',').map(r => r.trim());
        if (!allowed.includes(user.role)) {
            el.style.display = 'none';
        }
    });

    // Employees nav item restricted to ADMIN/SUPERVISOR
    if (!['ADMIN', 'SUPERVISOR'].includes(user.role)) {
        document.querySelectorAll('[data-nav="employees"]').forEach(el => el.style.display = 'none');
    }

    // Logout
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                await Api.post('/logout', {});
            } catch (e) { /* ignore network errors on logout */ }
            Session.clear();
            sessionStorage.removeItem('trishul_intro_played');
            window.location.href = 'login.html';
        });
    });

    // Mobile sidebar toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== menuToggle && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    document.dispatchEvent(new CustomEvent('trishul:ready', { detail: { user } }));
})();
