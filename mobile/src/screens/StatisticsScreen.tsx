import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '../components/AppCard';
import { AppHeader } from '../components/AppHeader';

export function StatisticsScreen() {
  return (
    <View style={styles.container}>
      <AppHeader
        title="İstatistikler"
        subtitle="Çözülen soru, başarı oranı ve gelişim grafiği gibi metrikler bu ekranda yer alacak."
      />

      <AppCard>
        <Text style={styles.placeholder}>Bu alan 6. hafta görevleri için ayrıldı.</Text>
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
