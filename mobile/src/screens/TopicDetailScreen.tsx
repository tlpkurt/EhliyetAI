import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { lessons } from '../data/lessonCatalog';
import { incrementDailyStat } from '../data/dailyStats';
import { RootStackParamList } from '../types/navigation';
import { AppHeader } from '../components/AppHeader';

export function TopicDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'TopicDetail'>>();
  const lessonId = route.params?.lessonId ?? lessons[0].id;
  const topicId = route.params?.topicId ?? lessons[0].topics[0].id;

  const lesson = lessons.find((l) => l.id === lessonId) ?? lessons[0];
  const topic = lesson.topics.find((t) => t.id === topicId) ?? lesson.topics[0];

  const [loading, setLoading] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      try {
        const raw = await AsyncStorage.getItem('completedTopics');
        const map = raw ? JSON.parse(raw) : {};
        setCompleted(!!map[topic.id]);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [topic.id]);

  async function toggleComplete() {
    try {
      const raw = await AsyncStorage.getItem('completedTopics');
      const map = raw ? JSON.parse(raw) : {};
      map[topic.id] = !map[topic.id];
      await AsyncStorage.setItem('completedTopics', JSON.stringify(map));
      setCompleted(!!map[topic.id]);

      if (map[topic.id]) {
        await incrementDailyStat('lessons');
      }
    } catch (e) {
      // ignore
    }
  }

  async function saveVideoProgress(positionMillis: number) {
    try {
      const raw = await AsyncStorage.getItem('videoProgress');
      const map = raw ? JSON.parse(raw) : {};
      map[topic.id] = positionMillis;
      await AsyncStorage.setItem('videoProgress', JSON.stringify(map));
    } catch (e) {
      // ignore
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <AppHeader title={topic.title} subtitle={topic.summary} />

      <View style={styles.videoWrap}>
        {topic.videoUrl ? (
          <View style={styles.videoPlaceholder}>
            <Text style={{ marginBottom: 10 }}>Video oynatıcı yer tutucusu</Text>
            <Pressable style={styles.playButton} onPress={() => topic.videoUrl && Linking.openURL(topic.videoUrl)}>
              <Ionicons name="play" size={18} color="#ffffff" />
            </Pressable>
          </View>
        ) : (
          <View style={styles.videoPlaceholder}>
            <Text>Video bulunamadı</Text>
          </View>
        )}
        {loading ? <ActivityIndicator style={styles.loading} /> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Yol Haritası</Text>
        {topic.roadmap?.map((step, idx) => (
          <View key={idx} style={styles.roadmapStep}>
            <View style={styles.bullet} />
            <Text style={styles.roadmapText}>{step}</Text>
          </View>
        ))}
      </View>

      <Pressable style={[styles.completeButton, completed && styles.completeActive]} onPress={toggleComplete}>
        <Ionicons name={completed ? 'checkmark' : 'checkmark-outline'} size={18} color="#ffffff" />
        <Text style={styles.completeLabel}>{completed ? 'Tamamlandı' : 'Tamamlandı olarak işaretle'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2ff' },
  content: { padding: 16, paddingTop: 24, paddingBottom: 28, gap: 14 },
  videoWrap: { backgroundColor: '#000', borderRadius: 12, overflow: 'hidden', height: 220, alignItems: 'center', justifyContent: 'center' },
  video: { width: '100%', height: '100%' },
  videoPlaceholder: { alignItems: 'center', justifyContent: 'center', height: 220 },
  loading: { position: 'absolute', top: '50%' },
  section: { backgroundColor: '#ffffff', borderRadius: 14, padding: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  roadmapStep: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  bullet: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1f8bff' },
  roadmapText: { color: '#374151' },
  completeButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#9ca3af', padding: 12, borderRadius: 10, justifyContent: 'center', marginTop: 12 },
  completeActive: { backgroundColor: '#1f8bff' },
  completeLabel: { color: '#ffffff', fontWeight: '700' },
  playButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1f8bff', alignItems: 'center', justifyContent: 'center' },
});
