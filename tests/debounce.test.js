const { debounce } = require('../src/assets/js/utils/debounce');

describe('debounce utility', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('delays function execution', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 200);

    debounced();
    expect(fn).not.toBeCalled();

    jest.advanceTimersByTime(199);
    expect(fn).not.toBeCalled();

    jest.advanceTimersByTime(1);
    expect(fn).toBeCalledTimes(1);
  });

  test('resets timer on rapid calls', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 200);

    debounced();
    jest.advanceTimersByTime(100);
    debounced();
    jest.advanceTimersByTime(199);
    expect(fn).not.toBeCalled();

    jest.advanceTimersByTime(1);
    expect(fn).toBeCalledTimes(1);
  });
});
