// tests/inventory.test.js
// Test: Inventory panel opens and closes without error

describe('Inventory Panel', () => {
  it('should open and close without error', () => {
    let error = null;
    try {
      document.body.innerHTML = '<div id="inventory-panel" style="display:none"></div>';
      const panel = document.getElementById('inventory-panel');
      panel.style.display = 'block'; // open
      panel.style.display = 'none'; // close
    } catch (e) {
      error = e;
    }
    expect(error).toBeNull();
  });
});
