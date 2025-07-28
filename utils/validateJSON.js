const fs = require('fs');

function validateFile(path) {
  try {
    JSON.parse(fs.readFileSync(path, 'utf8'));
    console.log(path + ' valid');
    return true;
  } catch (e) {
    console.error(path + ' invalid JSON');
    return false;
  }
}

const files = process.argv.slice(2);
let ok = true;
files.forEach(f => { if (!validateFile(f)) ok = false; });
if (!ok) process.exit(1);
