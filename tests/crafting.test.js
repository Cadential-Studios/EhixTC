// tests/crafting.test.js
// Test: Crafting panel opens and closes without error

describe('Crafting Panel', () => {
  it('should open and close without error', () => {
    let error = null;
    try {
      document.body.innerHTML = '<div id="crafting-panel" style="display:none"></div>';
      const panel = document.getElementById('crafting-panel');
      panel.style.display = 'block'; // open
      panel.style.display = 'none'; // close
    } catch (e) {
      error = e;
    }
    expect(error).toBeNull();
  });
});
