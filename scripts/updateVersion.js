const { execSync } = require('child_process');

function getGitInfo() {
  try {
    const commit = execSync('git rev-parse --short HEAD').toString().trim();
    const date = execSync('git log -1 --format=%cI').toString().trim();
    return { commit, buildTime: date };
  } catch (e) {
    return { commit: 'unknown', buildTime: new Date().toISOString() };
  }
}

const info = getGitInfo();
require('fs').writeFileSync('version.json', JSON.stringify(info, null, 2));
console.log('Version file updated:', info);
