import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppCard } from '../components/AppCard';
import { AppHeader } from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';

export function LoginScreen() {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleEmailLogin() {
    setError(null);
    setIsLoading(true);

    try {
      await loginWithEmail(email, password);
    } catch (loginError) {
      if (loginError instanceof Error) {
        setError(loginError.message);
      } else {
        setError('Giris yapilamadi. Tekrar deneyin.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEmailRegister() {
    setError(null);
    setIsLoading(true);

    try {
      await registerWithEmail(fullName, email, password, confirmPassword);
    } catch (registerError) {
      if (registerError instanceof Error) {
        setError(registerError.message);
      } else {
        setError('Kayit islemi basarisiz. Tekrar deneyin.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setIsLoading(true);

    try {
      await loginWithGoogle();
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuestLogin() {
    setError(null);
    setIsLoading(true);

    try {
      await continueAsGuest();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Ehliyet AI"
        subtitle={
          mode === 'login'
            ? 'Email, Google veya misafir girisi ile calismana kaldigin yerden devam et.'
            : 'Hizli bir hesap olustur ve ilerlemeni kaydetmeye basla.'
        }
      />

      <AppCard>
        <View style={styles.modeSwitcher}>
          <Pressable
            onPress={() => setMode('login')}
            style={({ pressed }) => [styles.modeButton, mode === 'login' && styles.modeButtonActive, pressed && styles.pressed]}
          >
            <Text style={[styles.modeButtonLabel, mode === 'login' && styles.modeButtonLabelActive]}>Giris Yap</Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('register')}
            style={({ pressed }) => [styles.modeButton, mode === 'register' && styles.modeButtonActive, pressed && styles.pressed]}
          >
            <Text style={[styles.modeButtonLabel, mode === 'register' && styles.modeButtonLabelActive]}>Kayit Ol</Text>
          </Pressable>
        </View>

        {mode === 'register' ? (
          <>
            <Text style={styles.label}>Ad Soyad</Text>
            <TextInput value={fullName} onChangeText={setFullName} editable={!isLoading} placeholder="Ad Soyad" style={styles.input} />
          </>
        ) : null}

        <Text style={styles.label}>E-posta</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!isLoading}
          placeholder="ornek@mail.com"
          style={styles.input}
        />

        <Text style={styles.label}>Sifre</Text>
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
          placeholder="Sifre"
          style={styles.input}
        />

        {mode === 'register' ? (
          <>
            <Text style={styles.label}>Sifre Tekrar</Text>
            <TextInput
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!isLoading}
              placeholder="Sifre Tekrar"
              style={styles.input}
            />
          </>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable
          onPress={mode === 'login' ? handleEmailLogin : handleEmailRegister}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.primaryButtonLabel}>{mode === 'login' ? 'Email ile Giris' : 'Email ile Kayit Ol'}</Text>
          )}
        </Pressable>

        <Pressable
          onPress={handleGoogleLogin}
          disabled={isLoading}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed, isLoading && styles.disabled]}
        >
          <Text style={styles.secondaryButtonLabel}>{mode === 'login' ? 'Google ile Giris (Demo)' : 'Google ile Kayit Ol (Demo)'}</Text>
        </Pressable>

        <Pressable
          onPress={handleGuestLogin}
          disabled={isLoading}
          style={({ pressed }) => [styles.ghostButton, pressed && styles.pressed, isLoading && styles.disabled]}
        >
          <Text style={styles.ghostButtonLabel}>Misafir Olarak Devam Et</Text>
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
    justifyContent: 'center',
  },
  modeSwitcher: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  modeButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingVertical: 9,
  },
  modeButtonActive: {
    borderColor: '#0f766e',
    backgroundColor: '#ecfdf5',
  },
  modeButtonLabel: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  modeButtonLabelActive: {
    color: '#065f46',
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
  errorText: {
    color: '#b91c1c',
    marginBottom: 12,
    fontSize: 13,
  },
  primaryButton: {
    marginTop: 4,
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
    borderColor: '#0ea5e9',
    backgroundColor: '#f0f9ff',
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonLabel: {
    color: '#075985',
    fontSize: 15,
    fontWeight: '600',
  },
  ghostButton: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    alignItems: 'center',
  },
  ghostButtonLabel: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.6,
  },
});
