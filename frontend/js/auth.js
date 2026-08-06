/* =========================================================================
   TRISHUL CRM — Login page logic
   Plays the cinematic trident opening once per browser tab, then reveals
   the login form and wires it up to POST /login.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, skip straight to dashboard.
    Api.get('/me').then(() => {
        window.location.href = 'dashboard.html';
    }).catch(() => {
        initCinematic();
        initLoginForm();
    });
});

function initCinematic() {
    const stage = document.getElementById('cinematicStage');
    const trident = document.getElementById('cinematicTrident');
    const wordmark = document.getElementById('cinematicWordmark');
    const tagline = document.getElementById('cinematicTagline');
    const progress = document.getElementById('cinematicProgress');
    const authShell = document.getElementById('authShell');

    const alreadyPlayed = sessionStorage.getItem('trishul_intro_played');
    const skipDelay = alreadyPlayed ? 200 : 3400;

    requestAnimationFrame(() => {
        trident.classList.add('play');
        wordmark.classList.add('play');
        tagline.classList.add('play');
        progress.classList.add('play');
    });

    setTimeout(() => {
        stage.classList.add('hide');
        authShell.classList.add('reveal');
        sessionStorage.setItem('trishul_intro_played', '1');
        setTimeout(() => stage.remove(), 950);
    }, skipDelay);

    stage.addEventListener('click', () => {
        stage.classList.add('hide');
        authShell.classList.add('reveal');
        sessionStorage.setItem('trishul_intro_played', '1');
        setTimeout(() => stage.remove(), 950);
    });
}

function initLoginForm() {
    const form = document.getElementById('loginForm');
    const btn = document.getElementById('loginBtn');
    const errorBox = document.getElementById('loginError');

    // Quick-fill demo credential chips
    document.querySelectorAll('.demo-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.getElementById('username').value = chip.dataset.username;
            document.getElementById('password').value = chip.dataset.password;
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorBox.style.display = 'none';

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            errorBox.textContent = 'Please enter both username and password.';
            errorBox.style.display = 'block';
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Signing in…';

        try {
            const res = await Api.post('/login', { username, password });
            Session.save(res.data);
            Toast.success('Welcome back, ' + res.data.fullName.split(' ')[0]);
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 500);
        } catch (err) {
            errorBox.textContent = err.message || 'Invalid username or password.';
            errorBox.style.display = 'block';
            btn.disabled = false;
            btn.innerHTML = 'Sign In <i class="fa-solid fa-arrow-right"></i>';
        }
    });
}
