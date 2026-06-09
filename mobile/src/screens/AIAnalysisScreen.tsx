import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import { AppCard } from '../components/AppCard';
import { AppHeader } from '../components/AppHeader';
import { incrementDailyStat } from '../data/dailyStats';

export function AIAnalysisScreen() {
  useFocusEffect(
    useCallback(() => {
      incrementDailyStat('ai');
    }, [])
  );
  return (
    <View style={styles.container}>
      <AppHeader
        title="Yapay Zeka Analizi"
        subtitle="Yanlış konuların analizi ve kişiselleştirilmiş öneri motoru bu bölümde olacak."
      />

      <AppCard>
        <Text style={styles.placeholder}>Bu alan 7. hafta görevleri için ayrıldı.</Text>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
    padding: 20,
  },
  placeholder: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
  },
});
