import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';

import { CategoryArtwork } from '../components/CategoryArtwork';
import { useAuth } from '../context/AuthContext';
import { lessons } from '../data/lessonCatalog';
import { getDailyStats } from '../data/dailyStats';
import { getQuestionCountByCategory, questionCategories } from '../data/questionCatalog';
import { questions } from '../data/questionBank';

export function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const isWide = width >= 768;
  const [nextLessonId, setNextLessonId] = useState<string>(lessons[0]?.id ?? '');
  const [nextLessonTitle, setNextLessonTitle] = useState<string>(lessons[0]?.title ?? 'Ders');
  const [nextLessonHint, setNextLessonHint] = useState<string>('Kaldığın yerden devam et.');
  const [dailyProgress, setDailyProgress] = useState({ done: 0, total: 3, percent: 0 });

  const categoryStats = questionCategories.map((category) => ({
    ...category,
    count: getQuestionCountByCategory(questions, category.id),
  }));

  const loadNextLesson = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem('completedTopics');
      const completed = raw ? JSON.parse(raw) : {};

      let selectedLesson = lessons[0];
      let selectedTopicTitle = '';

      for (const lesson of lessons) {
        const nextTopic = lesson.topics.find((topic) => !completed[topic.id]);
        if (nextTopic) {
          selectedLesson = lesson;
          selectedTopicTitle = nextTopic.title;
          break;
        }
      }

      if (selectedLesson) {
        setNextLessonId(selectedLesson.id);
        setNextLessonTitle(selectedLesson.title);
        setNextLessonHint(
          selectedTopicTitle ? `Sıradaki konu: ${selectedTopicTitle}` : 'Tüm konular tamamlandı, tekrar yap.'
        );
      }
    } catch {
      setNextLessonId(lessons[0]?.id ?? '');
      setNextLessonTitle(lessons[0]?.title ?? 'Ders');
      setNextLessonHint('Kaldığın yerden devam et.');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNextLesson();
      getDailyStats().then(stats => {
        let doneCount = 0;
        if ((stats.lessons || 0) > 0) doneCount++;
        if ((stats.exams || 0) > 0) doneCount++;
        if ((stats.ai || 0) > 0) doneCount++;
        setDailyProgress({
          done: doneCount,
          total: 3,
          percent: Math.round((doneCount / 3) * 100)
        });
      });
    }, [loadNextLesson])
  );

  return (
    <ScrollView contentContainerStyle={[styles.content, isWide && styles.contentWide]} style={styles.container}>
      <Text style={styles.pageHint}>Ana Sayfa</Text>

      <View style={styles.topBar}>
        <View style={styles.profileWrap}>
          <View style={styles.avatarOuter}>
            <View style={styles.avatarInner}>
              <Ionicons name="person" size={18} color="#183153" />
            </View>
          </View>
          <View style={styles.greetingWrap}>
            <Text numberOfLines={1} style={[styles.greetingTitle, isCompact && styles.greetingTitleCompact]}>
              Merhaba, {user?.profile.fullName || 'Sürücü'}!
            </Text>
            <Text numberOfLines={2} style={[styles.greetingSubtitle, isCompact && styles.greetingSubtitleCompact]}>
              Yola hakim olmaya hazır mısın?
            </Text>
          </View>
        </View>
        <Pressable style={styles.bellButton}>
          <Ionicons name="notifications-outline" size={22} color="#183153" />
        </Pressable>
      </View>

      <Pressable style={styles.card} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.cardEyebrow}>GÜNLÜK HEDEF</Text>
        <View style={styles.goalRow}>
          <View>
            <Text style={[styles.goalTitle, isCompact && styles.goalTitleCompact]}>İlerleme</Text>
            <Text style={[styles.goalSubtitle, isCompact && styles.goalSubtitleCompact]}>3 hedefin {dailyProgress.done}'i tamamlandı</Text>
          </View>
          <View style={styles.progressRing}>
            <Text style={styles.progressValue}>{dailyProgress.percent}%</Text>
          </View>
        </View>
      </Pressable>

      <Pressable style={styles.suggestionCard}>
        <View style={styles.suggestionIconWrap}>
          <Ionicons name="bulb-outline" size={18} color="#ffffff" />
        </View>
        <View style={styles.suggestionTextWrap}>
          <Text style={styles.suggestionTitle}>Yapay Zeka Önerisi</Text>
          <Text style={styles.suggestionText}>Son sınav sonucuna göre bugün ilk yardım konusuna odaklan.</Text>
        </View>
      </Pressable>

      <Pressable
        style={styles.cardNoPadding}
        onPress={() => navigation.navigate('Lessons', { screen: 'LessonDetail', params: { lessonId: nextLessonId } })}
      >
        <Image
          source={require('../../assets/splash-icon.png')}
          resizeMode="cover"
          style={styles.lessonImage}
        />
        <View style={styles.lessonBody}>
          <Text style={styles.cardEyebrow}>SIRADAKİ DERS</Text>
          <Text style={[styles.lessonTitle, isCompact && styles.lessonTitleCompact]}>{nextLessonTitle}</Text>
          <Text style={styles.lessonText}>{nextLessonHint}</Text>
          <Pressable
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Lessons', { screen: 'LessonDetail', params: { lessonId: nextLessonId } })}
          >
            <Text style={styles.ctaLabel}>Öğrenmeye Devam Et</Text>
          </Pressable>
        </View>
      </Pressable>

      <View style={styles.categoryHeader}>
        <Text style={[styles.categoryTitle, isCompact && styles.categoryTitleCompact]}>Kategoriler</Text>
        <Pressable onPress={() => navigation.navigate('Tests')}>
          <Text style={styles.viewAll}>Tümünü Gör</Text>
        </Pressable>
      </View>

      <View style={styles.categoryGrid}>
        {categoryStats.map((item) => (
          <Pressable
            key={item.id}
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Tests', { screen: 'MockExam', params: { category: item.id } })}
          >
            <CategoryArtwork categoryId={item.id} title={item.title} />
            <View style={styles.categoryBody}>
              <Text style={styles.categoryLabel}>{item.title}</Text>
              <Text style={styles.categoryDescription}>{item.description}</Text>
              <Text style={styles.categoryCount}>{item.count} soru</Text>
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
    backgroundColor: '#f8fbff',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 14,
  },
  contentWide: {
    width: '100%',
    maxWidth: 820,
    alignSelf: 'center',
  },
  pageHint: {
    color: '#c5cdd8',
    fontSize: 14,
    fontWeight: '700',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  greetingWrap: {
    flex: 1,
  },
  avatarOuter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2d6a8e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f2f7fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#04163a',
  },
  greetingTitleCompact: {
    fontSize: 16,
  },
  greetingSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#5f7695',
    fontWeight: '500',
    lineHeight: 18,
  },
  greetingSubtitleCompact: {
    fontSize: 11,
    lineHeight: 16,
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#d7e4f5',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#edf2f9',
  },
  cardNoPadding: {
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#edf2f9',
  },
  cardEyebrow: {
    color: '#1f8bff',
    fontWeight: '700',
    letterSpacing: 0.7,
    fontSize: 12,
  },
  goalRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  goalTitleCompact: {
    fontSize: 17,
  },
  goalSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
    lineHeight: 20,
  },
  goalSubtitleCompact: {
    fontSize: 13,
    lineHeight: 18,
  },
  progressRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 6,
    borderColor: '#1f8bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#183153',
  },
  suggestionCard: {
    borderRadius: 18,
    backgroundColor: '#f1f9ff',
    borderWidth: 1,
    borderColor: '#bee3ff',
    padding: 14,
    flexDirection: 'row',
    gap: 12,
  },
  suggestionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1f8bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  suggestionTextWrap: {
    flex: 1,
  },
  suggestionTitle: {
    color: '#1f8bff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  suggestionText: {
    color: '#23324f',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  lessonImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#f5f7fb',
  },
  lessonBody: {
    padding: 16,
  },
  lessonTitle: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '700',
    color: '#04163a',
  },
  lessonTitleCompact: {
    fontSize: 20,
  },
  lessonText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#5f7695',
    marginBottom: 14,
  },
  ctaButton: {
    backgroundColor: '#1f8bff',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  ctaLabel: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  categoryHeader: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#04163a',
  },
  categoryTitleCompact: {
    fontSize: 17,
  },
  viewAll: {
    fontSize: 16,
    color: '#1f8bff',
    fontWeight: '700',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  categoryCard: {
    width: '48.2%',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#edf2f9',
    overflow: 'hidden',
  },
  categoryBody: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 4,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#04163a',
  },
  categoryDescription: {
    fontSize: 12,
    lineHeight: 17,
    color: '#5f7695',
    minHeight: 34,
  },
  categoryCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1f8bff',
  },
});
