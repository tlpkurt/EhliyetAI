import React, { useState, useEffect, useCallback } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, Linking, LayoutAnimation, Platform, UIManager } from 'react-native';
import { RouteProp, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppHeader } from '../components/AppHeader';
import { lessons } from '../data/lessonCatalog';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { incrementDailyStat } from '../data/dailyStats';

export function LessonDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'LessonDetail'>>();
  const lessonId = route.params?.lessonId;
  const lesson = lessons.find((l) => l.id === lessonId) ?? lessons[0];
  

  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  function toggleTopic(id: string) {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenTopic((s) => (s === id ? null : id));
  }

  const loadCompleted = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem('completedTopics');
      const parsed = raw ? JSON.parse(raw) : {};
      setCompletedMap(parsed);
    } catch (e) {
      // ignore
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCompleted();
    }, [loadCompleted])
  );

  async function toggleComplete(topicId: string) {
    try {
      const raw = await AsyncStorage.getItem('completedTopics');
      const parsed = raw ? JSON.parse(raw) : {};
      const next = { ...(parsed || {}) };
      next[topicId] = !next[topicId];
      await AsyncStorage.setItem('completedTopics', JSON.stringify(next));
      setCompletedMap(next);

      if (next[topicId]) {
        await incrementDailyStat('lessons');
      }
    } catch (e) {
      // ignore
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <AppHeader title={lesson.title} subtitle={lesson.description} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Yol Haritası</Text>
        <Text style={styles.lessonProgressHeader}>
          İlerleme: {lesson.topics.filter((t) => completedMap[t.id]).length}/{lesson.topics.length}
        </Text>
        {lesson.topics.map((topic) => (
          <View key={topic.id} style={styles.roadmapBlockTop}>
            <Text style={styles.roadmapTopic}>{topic.title}</Text>
            {topic.roadmap?.map((step, idx) => (
              <View key={idx} style={styles.roadmapStep}>
                <View style={styles.bullet} />
                <Text style={styles.roadmapText}>{step}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Konular</Text>
        {lesson.topics.map((topic) => (
          <View key={topic.id} style={styles.topicAccordion}>
            <Pressable style={styles.topicHeader} onPress={() => toggleTopic(topic.id)}>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <Text style={styles.toggleIcon}>{openTopic === topic.id ? '-' : '+'}</Text>
            </Pressable>

            {openTopic === topic.id ? (
              <View style={styles.topicContent}>
                {topic.imageUrl ? <Image source={{ uri: topic.imageUrl }} style={styles.topicImage} /> : null}
                {topic.content ? <Text style={styles.topicDetail}>{topic.content}</Text> : topic.summary ? <Text style={styles.topicDetail}>{topic.summary}</Text> : null}
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, alignItems: 'center' }}>
                  {topic.videoUrl ? (
                    <Pressable style={styles.playRow} onPress={() => topic.videoUrl && Linking.openURL(topic.videoUrl)}>
                      <Ionicons name="play" size={18} color="#ffffff" />
                      <Text style={styles.playLabel}> Videoyu Aç</Text>
                    </Pressable>
                  ) : null}

                  <Pressable
                    style={[styles.completeButton, completedMap[topic.id] ? styles.completeOn : styles.completeOff]}
                    onPress={() => toggleComplete(topic.id)}
                  >
                    <Text style={[styles.completeLabel, completedMap[topic.id] ? { color: '#fff' } : {}]}>
                      {completedMap[topic.id] ? 'Tamamlandı' : 'Tamamla'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              topic.summary ? <Text style={styles.topicSummary}>{topic.summary}</Text> : null
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
  },
  content: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 28,
    gap: 14,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f6',
  },
  roadmapBlockTop: {
    marginBottom: 10,
  },
  topicAccordion: {
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f6',
    paddingVertical: 8,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleIcon: {
    fontSize: 20,
    color: '#6b7280',
    fontWeight: '700',
  },
  topicContent: {
    marginTop: 8,
  },
  topicImage: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginBottom: 8,
  },
  topicFullCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f6',
  },
  topicDetail: {
    marginTop: 6,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  playRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1f8bff',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  playLabel: {
    color: '#ffffff',
    fontWeight: '700',
  },
  roadmapList: {
    marginTop: 10,
  },
  roadmapStepInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  topicBody: {
    flex: 1,
    paddingRight: 8,
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  topicSummary: {
    fontSize: 13,
    color: '#6b7280',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1f8bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roadmapBlock: {
    marginTop: 10,
  },
  roadmapTopic: {
    fontWeight: '700',
    marginBottom: 6,
  },
  roadmapStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1f8bff',
  },
  roadmapText: {
    color: '#374151',
  },
  lessonProgressHeader: {
    color: '#1f8bff',
    fontWeight: '700',
    marginBottom: 8,
  },
  completeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1f8bff',
  },
  completeOn: {
    backgroundColor: '#1f8bff',
    borderColor: '#1f8bff',
  },
  completeOff: {
    backgroundColor: '#ffffff',
  },
  completeLabel: {
    color: '#1f8bff',
    fontWeight: '700',
  },
});
