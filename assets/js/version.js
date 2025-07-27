async function displayVersion() {
    try {
        const response = await fetch('version.json');
        if (!response.ok) throw new Error('Version file not found');
        const data = await response.json();
        const el = document.getElementById('version-info');
        if (el) {
            el.textContent = `Build ${data.commit} \u2014 ${new Date(data.buildTime).toLocaleString()}`;
        }
        window.GAME_VERSION = `${data.commit}`;
    } catch (err) {
        console.warn('Unable to load version info', err);
    }
}

document.addEventListener('DOMContentLoaded', displayVersion);
