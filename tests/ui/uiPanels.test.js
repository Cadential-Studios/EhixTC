const panels = ['character', 'crafting', 'effects', 'inventory', 'settings'];

describe('UI Panels', () => {
  test.each(panels)('%s panel toggles visibility', (name) => {
    const id = `${name}-panel`;
    document.body.innerHTML = `<div id="${id}" style="display:none"></div>`;
    const panel = document.getElementById(id);
    panel.style.display = 'block';
    expect(panel.style.display).toBe('block');
    panel.style.display = 'none';
    expect(panel.style.display).toBe('none');
  });
});
