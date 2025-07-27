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
            const buildDate = new Date(data.buildTime);
            const dateStr = buildDate.toLocaleDateString();
            const timeStr = buildDate.toLocaleTimeString();
            el.innerHTML = `Version <b>${data.buildType}</b> - <b>${data.commit}</b>`;
            el.style.cursor = 'pointer';
            el.addEventListener('click', () => {
                if (dateEl) {
                    dateEl.innerHTML = `Version: <b>${data.buildType} - ${data.commit}</b><br>Build Date: <b>${dateStr}</b><br>Build Time: <b>${timeStr}</b><br><a href='docs/CHANGE_LOG.md#${data.commit}' target='_blank' style='color:#4af;text-decoration:underline'>View Changelog</a>`;
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
