async function displayVersion() {
    try {
        const response = await fetch('version.json');
        if (!response.ok) throw new Error('Version file not found');
        const data = await response.json();
        const el = document.getElementById('version-info');
        const overlay = document.getElementById('version-overlay');
        const dateEl = document.getElementById('build-date');
        const closeBtn = document.getElementById('close-version-overlay');

        if (el) {
            el.textContent = `Build ${data.commit}`;
            el.addEventListener('click', () => {
                if (dateEl) {
                    dateEl.textContent = `Build Date: ${new Date(data.buildTime).toLocaleDateString()}`;
                }
                if (overlay) overlay.style.display = 'flex';
            });
        }

        if (closeBtn && overlay) {
            closeBtn.addEventListener('click', () => {
                overlay.style.display = 'none';
            });
        }

        window.GAME_VERSION = `${data.commit}`;
    } catch (err) {
        console.warn('Unable to load version info', err);
    }
}

document.addEventListener('DOMContentLoaded', displayVersion);
