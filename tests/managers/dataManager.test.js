const DataManager = require('../../src/assets/js/managers/dataManager.js');

describe('DataManager', () => {
  beforeEach(() => {
    global.detectDataPath = jest.fn().mockResolvedValue('');
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ value: 42 })
      })
    );
  });

  it('stores and retrieves values', () => {
    const dm = new DataManager();
    dm.set('test', { a: 1 });
    expect(dm.get('test')).toEqual({ a: 1 });
    expect(dm.has('test')).toBe(true);
  });

  it('loads JSON data and caches it', async () => {
    const dm = new DataManager();
    const data = await dm.load('sample', 'sample.json');
    expect(global.fetch).toHaveBeenCalledWith('sample.json', { cache: 'no-store' });
    expect(data).toEqual({ value: 42 });
    expect(dm.get('sample')).toEqual({ value: 42 });
  });
});
