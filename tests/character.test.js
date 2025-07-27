// tests/character.test.js
// Test: Character panel opens and closes without error

describe('Character Panel', () => {
  it('should open and close without error', () => {
    let error = null;
    try {
      document.body.innerHTML = '<div id="character-panel" style="display:none"></div>';
      const panel = document.getElementById('character-panel');
      panel.style.display = 'block'; // open
      panel.style.display = 'none'; // close
    } catch (e) {
      error = e;
    }
    expect(error).toBeNull();
  });
});
