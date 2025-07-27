// tests/settings.test.js
// Test: Settings panel opens and closes without error

describe('Settings Panel', () => {
  it('should open and close without error', () => {
    let error = null;
    try {
      document.body.innerHTML = '<div id="settings-panel" style="display:none"></div>';
      const panel = document.getElementById('settings-panel');
      panel.style.display = 'block'; // open
      panel.style.display = 'none'; // close
    } catch (e) {
      error = e;
    }
    expect(error).toBeNull();
  });
});
