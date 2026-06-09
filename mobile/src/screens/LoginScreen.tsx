import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  async function handleEmailLogin() {
    setError(null);
    setIsLoading(true);

    try {
      await loginWithEmail(email, password);
    } catch (loginError) {
      if (loginError instanceof Error) {
        setError(loginError.message);
      } else {
        setError('Giriş yapılamadı. Tekrar deneyin.');
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
        setError('Kayıt işlemi başarısız. Tekrar deneyin.');
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

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
  };

  const renderInput = (
    id: string,
    icon: keyof typeof Ionicons.glyphMap,
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    secureTextEntry?: boolean,
    keyboardType?: 'default' | 'email-address'
  ) => {
    const isFocused = focusedInput === id;
    return (
      <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
        <Ionicons name={icon} size={22} color={isFocused ? '#0f766e' : '#9ca3af'} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          editable={!isLoading}
          onFocus={() => setFocusedInput(id)}
          onBlur={() => setFocusedInput(null)}
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['#0f766e', '#14b8a6']}
            style={styles.iconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="car-sport" size={44} color="#ffffff" />
          </LinearGradient>
          <Text style={styles.title}>EhliyetAI</Text>
          <Text style={styles.subtitle}>
            {mode === 'login' 
              ? 'Tekrar hoş geldin! Sınava hazırlanmaya devam et.' 
              : 'Yolculuğa başla! Hemen bir hesap oluştur.'}
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          {mode === 'register' && (
            renderInput('fullname', 'person-outline', 'Ad Soyad', fullName, setFullName)
          )}

          {renderInput('email', 'mail-outline', 'E-posta Adresi', email, setEmail, false, 'email-address')}

          {renderInput('password', 'lock-closed-outline', 'Şifre', password, setPassword, true)}

          {mode === 'register' && (
            renderInput('confirmPassword', 'lock-closed-outline', 'Şifre (Tekrar)', confirmPassword, setConfirmPassword, true)
          )}

          {mode === 'login' && (
            <Pressable style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
            </Pressable>
          )}

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={18} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Primary Submit Button */}
          <Pressable
            onPress={mode === 'login' ? handleEmailLogin : handleEmailRegister}
            disabled={isLoading}
            style={({ pressed }) => [styles.primaryButtonWrapper, pressed && styles.pressed, isLoading && styles.disabled]}
          >
            <LinearGradient
              colors={['#0f766e', '#115e59']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryButtonLabel}>{mode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}</Text>
              )}
            </LinearGradient>
          </Pressable>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ya da şununla devam et</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Button */}
          <Pressable
            onPress={handleGoogleLogin}
            disabled={isLoading}
            style={({ pressed }) => [styles.googleButton, pressed && styles.pressed, isLoading && styles.disabled]}
          >
            <Ionicons name="logo-google" size={20} color="#374151" style={styles.googleIcon} />
            <Text style={styles.googleButtonLabel}>Google</Text>
          </Pressable>

        </View>

        {/* Footer Links */}
        <View style={styles.footerContainer}>
          <Pressable onPress={toggleMode} style={styles.toggleModeContainer}>
            <Text style={styles.toggleModeText}>
              {mode === 'login' ? "Hesabın yok mu? " : "Zaten bir hesabın var mı? "}
              <Text style={styles.toggleModeTextHighlight}>
                {mode === 'login' ? "Kayıt Ol" : "Giriş Yap"}
              </Text>
            </Text>
          </Pressable>

          <Pressable
            onPress={handleGuestLogin}
            disabled={isLoading}
            style={styles.guestButton}
          >
            <Text style={styles.guestButtonLabel}>Şimdilik misafir olarak devam et</Text>
          </Pressable>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Clean white background for a modern feel
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 28, // Apple-style squircle look
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: {
    gap: 16, // Space between form elements
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60, // Taller inputs for a more premium feel
  },
  inputContainerFocused: {
    backgroundColor: '#ffffff',
    borderColor: '#0f766e',
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '500',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 4,
  },
  forgotPasswordText: {
    color: '#0f766e',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 14,
    borderRadius: 12,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
    fontWeight: '500',
  },
  primaryButtonWrapper: {
    marginTop: 8,
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    height: 60,
  },
  primaryButtonLabel: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#f1f5f9',
    borderRadius: 16,
    height: 60,
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonLabel: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '700',
  },
  footerContainer: {
    marginTop: 40,
    alignItems: 'center',
    gap: 20,
  },
  toggleModeContainer: {
    padding: 8,
  },
  toggleModeText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '500',
  },
  toggleModeTextHighlight: {
    color: '#0f766e',
    fontWeight: '700',
  },
  guestButton: {
    padding: 8,
  },
  guestButtonLabel: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.7,
  },
});

