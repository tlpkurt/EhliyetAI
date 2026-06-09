import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'EhliyetAI\'ya Hoş Geldiniz',
    description: 'Yapay zeka destekli sürüş asistanınız ile ehliyet sınavına hazırlanın. Akıllı öğrenme sistemiyle zayıf yönlerinizi keşfedin.',
    icon: 'hardware-chip-outline' as const,
    colors: ['#0f766e', '#14b8a6'],
  },
  {
    id: '2',
    title: 'Kapsamlı Deneme Sınavları',
    description: 'Gerçek sınav deneyimini yaşayın. Binlerce güncel soru ile pratik yapın ve başarınızı ölçün.',
    icon: 'clipboard-outline' as const,
    colors: ['#0369a1', '#0ea5e9'],
  },
  {
    id: '3',
    title: 'Kişiselleştirilmiş Dersler',
    description: 'Trafik, motor, ilk yardım ve trafik adabı konularında size özel hazırlanmış ders materyalleri ile çalışın.',
    icon: 'book-outline' as const,
    colors: ['#6d28d9', '#8b5cf6'],
  },
];

export function OnboardingScreen() {
  const { completeOnboarding } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const currentData = ONBOARDING_DATA[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={currentData.colors as [string, string]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Atla</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Ionicons name={currentData.icon} size={80} color={currentData.colors[0]} />
          </View>
        </View>

        <Text style={styles.title}>{currentData.title}</Text>
        <Text style={styles.description}>{currentData.description}</Text>

        <View style={styles.pagination}>
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={[styles.nextButtonText, { color: currentData.colors[0] }]}>
            {currentIndex === ONBOARDING_DATA.length - 1 ? 'Başla' : 'İleri'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackground: {
    width: 160,
    height: 160,
    backgroundColor: '#ffffff',
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#ffffff',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#ffffff',
    opacity: 0.4,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
