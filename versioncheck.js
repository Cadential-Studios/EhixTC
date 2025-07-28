// versioncheck.js
// Usage: node versioncheck.js
// Prints the contents of version.json in a readable format

const fs = require('fs');
const path = require('path');

const versionPath = path.join(__dirname, 'version.json');

fs.readFile(versionPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Could not read version.json:', err.message);
        process.exit(1);
    }
    try {
        const version = JSON.parse(data);
        console.log('--- Build Information ---');
        console.log(`Commit:     ${version.commit}`);
        console.log(`Build Time: ${version.buildTime}`);
        console.log(`Build Type: ${version.buildType}`);
        if (version.changelog) {
            console.log(`Changelog:  ${version.changelog}`);
        }
    } catch (e) {
        console.error('Invalid JSON in version.json:', e.message);
        process.exit(1);
    }
});
