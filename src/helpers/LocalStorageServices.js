export default class {
  static getItem = (key, placeholder = '') => {
    const data = localStorage.getItem(key);
    if (!data && !placeholder) return placeholder;
    return JSON.parse(data || placeholder);
  };

  static setItem = (key, data) => {
    if (!data) return;
    localStorage.setItem(key, JSON.stringify(data));
  };

  static removeItem = (key) => {
    localStorage.removeItem(key);
  };

  static removeAll = () => {
    for (const key in STORAGE_KEYS) {
      localStorage.removeItem(STORAGE_KEYS[key]);
    }
  };
}

export const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  profile: 'profile',
};
