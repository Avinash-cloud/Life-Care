// Safe localStorage operations
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      if (!item || item === 'undefined' || item === 'null') {
        return null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error parsing localStorage item "${key}":`, error);
      localStorage.removeItem(key);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage item "${key}":`, error);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage item "${key}":`, error);
    }
  }
};