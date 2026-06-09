import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { lessons } from '../data/lessonCatalog';

type ProgressMap = { [lessonId: string]: number };

export function LessonsScreen() {
  const navigation: any = useNavigation();
  const [progress, setProgress] = useState<ProgressMap>({});

  const loadProgress = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem('completedTopics');
      const completed = raw ? JSON.parse(raw) : {};
      const map: ProgressMap = {};

      lessons.forEach((lesson) => {
        const total = lesson.topics.length;
        const done = lesson.topics.filter((t) => completed[t.id]).length;
        map[lesson.id] = Math.round((done / Math.max(1, total)) * 100);
      });

      setProgress(map);
    } catch (e) {
      // ignore
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [loadProgress])
  );

  const lessonStats = lessons.map((lesson) => {
    const ratio = (progress[lesson.id] ?? 0) / 100;
    const done = Math.round(lesson.topics.length * ratio);

    return {
      ...lesson,
      done,
      ratio,
      value: progress[lesson.id] ?? 0,
      remaining: Math.max(0, lesson.topics.length - done),
    };
  });

  const totalTopics = lessons.reduce((acc, lesson) => acc + lesson.topics.length, 0);
  const completedTopics = lessonStats.reduce((acc, item) => acc + item.done, 0);
  const overallProgress = Math.round((completedTopics / Math.max(1, totalTopics)) * 100);

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <View style={styles.heroCard}>
        <View style={styles.heroShapeOne} />
        <View style={styles.heroShapeTwo} />
        <Text style={styles.eyebrow}>DERS MERKEZİ</Text>
        <Text style={styles.heroTitle}>Bugün öğrenmeye kaldığın yerden devam et</Text>
        <Text style={styles.heroSubtitle}>Konu anlatımları, videolar ve adım adım yol haritası burada.</Text>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStatBox}>
            <Text style={styles.heroStatValue}>{overallProgress}%</Text>
            <Text style={styles.heroStatLabel}>Toplam İlerleme</Text>
          </View>
          <View style={styles.heroStatBox}>
            <Text style={styles.heroStatValue}>{completedTopics}</Text>
            <Text style={styles.heroStatLabel}>Tamamlanan Konu</Text>
          </View>
          <View style={styles.heroStatBox}>
            <Text style={styles.heroStatValue}>{lessons.length}</Text>
            <Text style={styles.heroStatLabel}>Toplam Ders</Text>
          </View>
        </View>
      </View>

      <View style={styles.grid}>
        {lessonStats.map((lesson) => (
          <Pressable
            key={lesson.id}
            style={styles.lessonCard}
            onPress={() => navigation.navigate('LessonDetail', { lessonId: lesson.id })}
          >
            <View style={styles.lessonTopRow}>
              <View style={styles.iconWrap}>
                <Ionicons name="book-outline" size={18} color="#0b4a6f" />
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{lesson.value}%</Text>
              </View>
            </View>

            <View style={styles.lessonBody}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonText}>{lesson.description}</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${lesson.value}%` }]} />
              </View>
              <View style={styles.progressMetaRow}>
                <Text style={styles.lessonProgress}>{lesson.done}/{lesson.topics.length} konu tamamlandı</Text>
                <Text style={styles.remainingText}>{lesson.remaining} konu kaldı</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff5fb',
  },
  content: {
    padding: 16,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 16,
  },
  heroCard: {
    borderRadius: 24,
    backgroundColor: '#083b5e',
    padding: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0f587f',
  },
  heroShapeOne: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#0f5f8b',
    opacity: 0.35,
    top: -70,
    right: -40,
  },
  heroShapeTwo: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#1f80b5',
    opacity: 0.3,
    bottom: -60,
    left: -20,
  },
  eyebrow: {
    color: '#7fd8ff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitle: {
    marginTop: 6,
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 29,
  },
  heroSubtitle: {
    marginTop: 8,
    color: '#c7e9fa',
    fontSize: 14,
    lineHeight: 21,
    maxWidth: '94%',
  },
  heroStatsRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  heroStatBox: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  heroStatValue: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  heroStatLabel: {
    marginTop: 2,
    color: '#bde6fb',
    fontSize: 11,
    fontWeight: '600',
  },
  grid: {
    gap: 14,
  },
  lessonCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#deebf7',
    padding: 14,
    shadowColor: '#0b2f4b',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  lessonTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#d8f0ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    borderRadius: 999,
    backgroundColor: '#e8f7e9',
    borderWidth: 1,
    borderColor: '#c7e9ca',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: '#216c2f',
    fontWeight: '700',
    fontSize: 12,
  },
  lessonBody: {
    gap: 8,
  },
  lessonTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0f172a',
  },
  lessonText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 21,
  },
  progressTrack: {
    marginTop: 4,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#dcecf8',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#0b7bc0',
  },
  progressMetaRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonProgress: {
    fontSize: 12,
    color: '#0b5f92',
    fontWeight: '700',
  },
  remainingText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
});
