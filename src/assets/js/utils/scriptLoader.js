/**
 * Dynamically loads external scripts and prevents duplicate loads.
 *
 * @param {string} src - Path to the script file to load.
 * @returns {Promise<void>} Resolves when the script has loaded.
 */
(function (global) {
  const loaded = new Set();

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (loaded.has(src)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        loaded.add(src);
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadScript };
  } else {
    global.loadScript = loadScript;
  }
})(this);
