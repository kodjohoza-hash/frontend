const STORAGE_PREFIX = 'btc_';

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
      return true;
    } catch {
      return false;
    }
  },

  clear: () => {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(STORAGE_PREFIX))
        .forEach((key) => localStorage.removeItem(key));
      return true;
    } catch {
      return false;
    }
  },

  getSession: (key) => {
    try {
      const item = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  setSession: (key, value) => {
    try {
      sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  removeSession: (key) => {
    try {
      sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`);
      return true;
    } catch {
      return false;
    }
  },
};

export default storage;
