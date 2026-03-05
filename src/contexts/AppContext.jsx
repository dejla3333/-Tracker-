import { createContext, useContext, useState, useEffect } from 'react';
import {
  getGoals,
  saveGoals,
  getUserProgress,
  saveUserProgress,
  getStatistics,
  saveStatistics,
  getSettings,
  saveSettings,
} from '../utils/localStorage';
import { generateId, getWeekNumber, calculateStreak } from '../utils/helpers';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const [userProgress, setUserProgress] = useState({
    xpTotal: 0,
    streak: 0,
    completedCount: 0,
    lastCompletionDate: null,
  });
  const [statistics, setStatistics] = useState({
    weeklyCompletions: [],
    xpHistory: [],
  });
  const [settings, setSettings] = useState({
    direction: 'ltr',
    language: 'en',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedGoals = getGoals();
    const loadedProgress = getUserProgress();
    const loadedStatistics = getStatistics();
    const loadedSettings = getSettings();

    setGoals(loadedGoals);
    setUserProgress(loadedProgress);
    setStatistics(loadedStatistics);
    setSettings(loadedSettings);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveGoals(goals);
    }
  }, [goals, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveUserProgress(userProgress);
    }
  }, [userProgress, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveStatistics(statistics);
    }
  }, [statistics, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveSettings(settings);
      document.documentElement.setAttribute('dir', settings.direction);
    }
  }, [settings, isLoading]);

  const addGoal = (goalData) => {
    const newGoal = {
      id: generateId(),
      ...goalData,
      status: 'active',
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoal = (id, updates) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
    );
  };

  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const completeGoal = (id) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    const lastDate = userProgress.lastCompletionDate
      ? new Date(userProgress.lastCompletionDate)
      : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    let newStreak = userProgress.streak;
    const diffDays = lastDate ? Math.floor((today - lastDate) / (1000 * 60 * 60 * 24)) : 0;

    if (!lastDate || diffDays === 1) {
      newStreak += 1;
    } else if (diffDays === 0) {
      newStreak = userProgress.streak;
    } else {
      newStreak = 1;
    }

    const newXP = userProgress.xpTotal + (goal.xpReward || 0);
    const newCompletedCount = userProgress.completedCount + 1;

    setUserProgress({
      xpTotal: newXP,
      streak: newStreak,
      completedCount: newCompletedCount,
      lastCompletionDate: todayStr,
    });

    const weekKey = getWeekNumber(new Date());
    const updatedWeeklyCompletions = [...statistics.weeklyCompletions];
    const weekIndex = updatedWeeklyCompletions.findIndex((w) => w.week === weekKey);
    if (weekIndex >= 0) {
      updatedWeeklyCompletions[weekIndex].count += 1;
    } else {
      updatedWeeklyCompletions.push({ week: weekKey, count: 1 });
    }

    const updatedXpHistory = [
      ...statistics.xpHistory,
      { date: todayStr, xp: newXP },
    ];

    setStatistics({
      weeklyCompletions: updatedWeeklyCompletions,
      xpHistory: updatedXpHistory,
    });

    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: 'completed', completedAt: todayStr }
          : g
      )
    );
  };

  const reorderGoals = (newGoals) => {
    setGoals(newGoals);
  };

  const toggleDirection = () => {
    setSettings((prev) => ({
      ...prev,
      direction: prev.direction === 'ltr' ? 'rtl' : 'ltr',
    }));
  };

  const value = {
    goals,
    userProgress,
    statistics,
    settings,
    isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
    reorderGoals,
    toggleDirection,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
