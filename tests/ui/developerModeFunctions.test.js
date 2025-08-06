describe('Global developer mode functions', () => {
  beforeEach(() => {
    global.localStorage = {
      _data: {},
      setItem(key, val) { this._data[key] = val; },
      removeItem(key) { delete this._data[key]; },
      getItem(key) {
        return Object.prototype.hasOwnProperty.call(this._data, key)
          ? this._data[key]
          : null;
      }
    };
    global.devMenu = {
      isEnabled: false,
      hide: jest.fn(),
      log: jest.fn()
    };
    global.enableDevMode = () => {
      localStorage.setItem('devMode', 'true');
      devMenu.isEnabled = true;
      devMenu.log('Developer mode enabled globally');
    };
    global.disableDevMode = () => {
      localStorage.removeItem('devMode');
      devMenu.isEnabled = false;
      devMenu.hide();
      devMenu.log('Developer mode disabled');
    };
  });

  test('enableDevMode sets dev flag', () => {
    enableDevMode();
    expect(localStorage.getItem('devMode')).toBe('true');
    expect(devMenu.isEnabled).toBe(true);
  });

  test('disableDevMode clears dev flag', () => {
    enableDevMode();
    disableDevMode();
    expect(localStorage.getItem('devMode')).toBeNull();
    expect(devMenu.isEnabled).toBe(false);
    expect(devMenu.hide).toHaveBeenCalled();
  });
});
