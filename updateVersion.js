const { execSync } = require('child_process');


function getGitInfo() {
  try {
    const commit = execSync('git rev-parse --short HEAD').toString().trim();
    const date = execSync('git log -1 --format=%cI').toString().trim();
    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    let buildType = 'dev';
    if (branch === 'main') buildType = 'release';
    return { commit, buildTime: date, buildType };
  } catch (e) {
    return { commit: 'unknown', buildTime: new Date().toISOString(), buildType: 'unknown' };
  }
}

const info = getGitInfo();
require('fs').writeFileSync('version.json', JSON.stringify(info, null, 2));
console.log('Version file updated:', info);
