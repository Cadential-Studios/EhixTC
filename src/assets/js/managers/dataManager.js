(function (global) {
  class DataManager {
    constructor() {
      this.cache = new Map();
      this.basePath = '';
    }

    async init() {
      if (!this.basePath && typeof global.detectDataPath === 'function') {
        this.basePath = await global.detectDataPath();
      }
      return this.basePath;
    }

    async load(key, filename) {
      const base = await this.init();
      const response = await fetch(`${base}${filename}`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}`);
      }
      const data = await response.json();
      this.cache.set(key, data);
      return data;
    }

    set(key, value) {
      this.cache.set(key, value);
    }

    get(key) {
      return this.cache.get(key);
    }

    has(key) {
      return this.cache.has(key);
    }

    getAll() {
      return Object.fromEntries(this.cache.entries());
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
  } else {
    global.DataManager = DataManager;
  }
})(typeof window !== 'undefined' ? window : globalThis);
