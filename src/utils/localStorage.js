const STORAGE_KEYS = {
  GOALS: 'goalTracker_goals',
  USER_PROGRESS: 'goalTracker_userProgress',
  STATISTICS: 'goalTracker_statistics',
  SETTINGS: 'goalTracker_settings',
};

export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

export const getGoals = () => {
  return getFromStorage(STORAGE_KEYS.GOALS) || [];
};

export const saveGoals = (goals) => {
  saveToStorage(STORAGE_KEYS.GOALS, goals);
};

export const getUserProgress = () => {
  return getFromStorage(STORAGE_KEYS.USER_PROGRESS) || {
    xpTotal: 0,
    streak: 0,
    completedCount: 0,
    lastCompletionDate: null,
  };
};

export const saveUserProgress = (progress) => {
  saveToStorage(STORAGE_KEYS.USER_PROGRESS, progress);
};

export const getStatistics = () => {
  return getFromStorage(STORAGE_KEYS.STATISTICS) || {
    weeklyCompletions: [],
    xpHistory: [],
  };
};

export const saveStatistics = (statistics) => {
  saveToStorage(STORAGE_KEYS.STATISTICS, statistics);
};

export const getSettings = () => {
  return getFromStorage(STORAGE_KEYS.SETTINGS) || {
    direction: 'ltr',
    language: 'en',
  };
};

export const saveSettings = (settings) => {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings);
};

export default STORAGE_KEYS;
