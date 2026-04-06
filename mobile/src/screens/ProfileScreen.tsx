import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppCard } from '../components/AppCard';
import { AppHeader } from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';

export function ProfileScreen() {
  const { user, updateProfile, logout } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [licenseClass, setLicenseClass] = useState('');

  useEffect(() => {
    if (!user) {
      return;
    }

    setFullName(user.profile.fullName);
    setEmail(user.profile.email);
    setCity(user.profile.city);
    setLicenseClass(user.profile.licenseClass);
  }, [user]);

  async function handleSave() {
    try {
      await updateProfile({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        city: city.trim(),
        licenseClass: licenseClass.trim().toUpperCase(),
      });

      Alert.alert('Basarili', 'Profil bilgileri kaydedildi.');
    } catch {
      Alert.alert('Hata', 'Profil kaydedilirken bir sorun olustu.');
    }
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Profil"
        subtitle="Kullanici bilgilerini guncelle, hesabini yonet ve cikis yap."
      />

      <AppCard>
        <Text style={styles.metaRow}>Giris Yontemi: {user?.provider || '-'}</Text>

        <Text style={styles.label}>Ad Soyad</Text>
        <TextInput value={fullName} onChangeText={setFullName} style={styles.input} placeholder="Ad Soyad" />

        <Text style={styles.label}>E-posta</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="ornek@mail.com"
        />

        <Text style={styles.label}>Sehir</Text>
        <TextInput value={city} onChangeText={setCity} style={styles.input} placeholder="Istanbul" />

        <Text style={styles.label}>Ehliyet Sinifi</Text>
        <TextInput value={licenseClass} onChangeText={setLicenseClass} style={styles.input} placeholder="B" />

        <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]} onPress={handleSave}>
          <Text style={styles.primaryButtonLabel}>Profili Kaydet</Text>
        </Pressable>

        <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]} onPress={logout}>
          <Text style={styles.secondaryButtonLabel}>Cikis Yap</Text>
        </Pressable>
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
  metaRow: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 14,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  primaryButton: {
    marginTop: 2,
    borderRadius: 12,
    backgroundColor: '#0f766e',
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonLabel: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
});
