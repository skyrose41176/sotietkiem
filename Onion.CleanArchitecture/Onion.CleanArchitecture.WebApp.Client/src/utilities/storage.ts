export const getItem = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);
  try {
    return JSON.parse(value ?? '');
  } catch (error) {
    return value as T;
  }
};

export const setItem = (key: string, value: string) => {
  localStorage.setItem(key, value);
};
export const removeItem = (key: string) => {
  localStorage.removeItem(key);
};
