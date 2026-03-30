import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '../components/AppCard';
import { AppHeader } from '../components/AppHeader';

export function MockExamScreen() {
  return (
    <View style={styles.container}>
      <AppHeader
        title="Deneme Sinavi"
        subtitle="50 soruluk sureli sinav akisi (baslat, sure, bitir, sonuc) bu ekranda gelistirilecek."
      />

      <AppCard>
        <Text style={styles.placeholder}>Bu alan 5. hafta gorevleri icin ayrildi.</Text>
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
