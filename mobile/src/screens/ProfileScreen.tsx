import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '../components/AppCard';
import { AppHeader } from '../components/AppHeader';

export function ProfileScreen() {
  return (
    <View style={styles.container}>
      <AppHeader
        title="Profil"
        subtitle="Kullanici bilgileri, ilerleme rozetleri ve ayarlar bu bolumde yer alacak."
      />

      <AppCard>
        <Text style={styles.placeholder}>Profil detaylari 3. hafta sonrasi asamali olarak eklenecek.</Text>
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
