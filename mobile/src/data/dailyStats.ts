import AsyncStorage from '@react-native-async-storage/async-storage';

function getTodayKey() {
  // Use local time for 'today'
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - offset);
  return 'dailyStats_' + localDate.toISOString().split('T')[0];
}

export async function incrementDailyStat(key: 'lessons' | 'exams' | 'ai') {
  try {
    const storageKey = getTodayKey();
    const raw = await AsyncStorage.getItem(storageKey);
    const stats = raw ? JSON.parse(raw) : {};
    stats[key] = (stats[key] || 0) + 1;
    await AsyncStorage.setItem(storageKey, JSON.stringify(stats));
  } catch (e) {
    // ignore
  }
}

export async function getDailyStats() {
  try {
    const storageKey = getTodayKey();
    const raw = await AsyncStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}
