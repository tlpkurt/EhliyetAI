import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { AuthUser, UserProfile } from '../types/auth';

const SESSION_KEY = 'ehliyetai.session.v1';

type AuthContextValue = {
  user: AuthUser | null;
  isInitializing: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (fullName: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function buildDefaultProfile(): UserProfile {
  return {
    fullName: 'Ehliyet Adayi',
    email: '',
    city: 'Istanbul',
    licenseClass: 'B',
  };
}

function normalizeNameFromEmail(email: string): string {
  const name = email.split('@')[0]?.trim() || 'Kullanici';
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function hydrateSession() {
      try {
        const rawSession = await AsyncStorage.getItem(SESSION_KEY);

        if (!rawSession) {
          return;
        }

        const parsedSession = JSON.parse(rawSession) as AuthUser;
        setUser(parsedSession);
      } catch {
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    }

    hydrateSession();
  }, []);

  async function persistUser(nextUser: AuthUser | null) {
    setUser(nextUser);

    if (!nextUser) {
      await AsyncStorage.removeItem(SESSION_KEY);
      return;
    }

    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
  }

  async function loginWithEmail(email: string, password: string) {
    const safeEmail = email.trim().toLowerCase();

    if (!safeEmail.includes('@')) {
      throw new Error('Gecerli bir e-posta girin.');
    }

    if (password.trim().length < 4) {
      throw new Error('Sifre en az 4 karakter olmali.');
    }

    const nextUser: AuthUser = {
      id: `email-${Date.now()}`,
      provider: 'email',
      profile: {
        ...buildDefaultProfile(),
        fullName: normalizeNameFromEmail(safeEmail),
        email: safeEmail,
      },
    };

    await persistUser(nextUser);
  }

  async function registerWithEmail(fullName: string, email: string, password: string, confirmPassword: string) {
    const safeFullName = fullName.trim();
    const safeEmail = email.trim().toLowerCase();

    if (safeFullName.length < 2) {
      throw new Error('Ad soyad en az 2 karakter olmali.');
    }

    if (!safeEmail.includes('@')) {
      throw new Error('Gecerli bir e-posta girin.');
    }

    if (password.trim().length < 4) {
      throw new Error('Sifre en az 4 karakter olmali.');
    }

    if (password !== confirmPassword) {
      throw new Error('Sifre ve sifre tekrar ayni olmali.');
    }

    const nextUser: AuthUser = {
      id: `email-${Date.now()}`,
      provider: 'email',
      profile: {
        ...buildDefaultProfile(),
        fullName: safeFullName,
        email: safeEmail,
      },
    };

    await persistUser(nextUser);
  }

  async function loginWithGoogle() {
    // OAuth entegrasyonu sonraki sprintte eklenecek, simdilik demo Google girisi saglanir.
    const nextUser: AuthUser = {
      id: `google-${Date.now()}`,
      provider: 'google',
      profile: {
        ...buildDefaultProfile(),
        fullName: 'Google Kullanici',
        email: 'driver.google@example.com',
      },
    };

    await persistUser(nextUser);
  }

  async function continueAsGuest() {
    const nextUser: AuthUser = {
      id: `guest-${Date.now()}`,
      provider: 'guest',
      profile: {
        ...buildDefaultProfile(),
        fullName: 'Misafir Kullanici',
      },
    };

    await persistUser(nextUser);
  }

  async function updateProfile(profile: Partial<UserProfile>) {
    if (!user) {
      return;
    }

    const nextUser: AuthUser = {
      ...user,
      profile: {
        ...user.profile,
        ...profile,
      },
    };

    await persistUser(nextUser);
  }

  async function logout() {
    await persistUser(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isInitializing,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      continueAsGuest,
      updateProfile,
      logout,
    }),
    [user, isInitializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
