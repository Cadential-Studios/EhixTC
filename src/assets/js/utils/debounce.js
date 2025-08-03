/**
 * Creates a debounced version of the provided function. The debounced function
 * delays invoking `fn` until after `delay` milliseconds have elapsed since the
 * last time it was invoked.
 *
 * @param {Function} fn - Function to debounce.
 * @param {number} [delay=300] - Time in ms to wait before invoking `fn`.
 * @returns {Function} Debounced function with preserved `this` context and arguments.
 */
(function (global) {
  function debounce(fn, delay = 300) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { debounce };
  } else {
    global.debounce = debounce;
  }
})(this);
