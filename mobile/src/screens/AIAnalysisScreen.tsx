import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '../components/AppCard';
import { AppHeader } from '../components/AppHeader';

export function AIAnalysisScreen() {
  return (
    <View style={styles.container}>
      <AppHeader
        title="AI Analiz"
        subtitle="Yanlis konularin analizi ve kisisellestirilmis oneri motoru bu bolumde olacak."
      />

      <AppCard>
        <Text style={styles.placeholder}>Bu alan 7. hafta gorevleri icin ayrildi.</Text>
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
