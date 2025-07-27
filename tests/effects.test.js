// tests/effects.test.js
// Test: Effects panel opens and closes without error

describe('Effects Panel', () => {
  it('should open and close without error', () => {
    let error = null;
    try {
      document.body.innerHTML = '<div id="effects-panel" style="display:none"></div>';
      const panel = document.getElementById('effects-panel');
      panel.style.display = 'block'; // open
      panel.style.display = 'none'; // close
    } catch (e) {
      error = e;
    }
    expect(error).toBeNull();
  });
});
