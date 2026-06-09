import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppCard } from '../components/AppCard';
import { useAuth } from '../context/AuthContext';
import { lessons } from '../data/lessonCatalog';
import { getDailyStats } from '../data/dailyStats';

type LessonProgress = {
  lessonId: string;
  title: string;
  done: number;
  total: number;
  percent: number;
};

export function ProfileScreen() {
  const { user, updateProfile, logout } = useAuth();
  const navigation: any = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [licenseClass, setLicenseClass] = useState('');
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setFullName(user.profile.fullName);
    setEmail(user.profile.email);
    setCity(user.profile.city);
    setLicenseClass(user.profile.licenseClass);
  }, [user]);

  const loadLessonProgress = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem('completedTopics');
      const completed = raw ? JSON.parse(raw) : {};

      const mapped = lessons.map((lesson) => {
        const total = lesson.topics.length;
        const done = lesson.topics.filter((topic) => completed[topic.id]).length;

        return {
          lessonId: lesson.id,
          title: lesson.title,
          total,
          done,
          percent: Math.round((done / Math.max(total, 1)) * 100),
        };
      });

      setLessonProgress(mapped);
    } catch {
      setLessonProgress([]);
    }
  }, []);

  const [goals, setGoals] = useState([
    { id: 'g1', title: 'Sıradaki dersi tamamla', done: false, route: 'Lessons' },
    { id: 'g2', title: 'Bugün 1 deneme sınavı çöz', done: false, route: 'Tests' },
    { id: 'g3', title: 'Yapay zeka analizini incele', done: false, route: 'AICoach' },
  ]);

  useFocusEffect(
    useCallback(() => {
      loadLessonProgress();
      
      getDailyStats().then(stats => {
        setGoals([
          { id: 'g1', title: 'Sıradaki dersi tamamla', done: (stats.lessons || 0) > 0, route: 'Lessons' },
          { id: 'g2', title: 'Bugün 1 deneme sınavı çöz', done: (stats.exams || 0) > 0, route: 'Tests' },
          { id: 'g3', title: 'Yapay zeka analizini incele', done: (stats.ai || 0) > 0, route: 'AICoach' },
        ]);
      });
    }, [loadLessonProgress])
  );

  async function handleSave() {
    try {
      await updateProfile({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        city: city.trim(),
        licenseClass: licenseClass.trim().toUpperCase(),
      });

      Alert.alert('Başarılı', 'Profil bilgileri kaydedildi.');
    } catch {
      Alert.alert('Hata', 'Profil kaydedilirken bir sorun oluştu.');
    }
  }

  async function handleResetProgress() {
    Alert.alert(
      'İlerlemeyi Sıfırla',
      'Tüm ders ve hedef ilerlemeleriniz tamamen silinecek. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: async () => {
            try {
              const keys = await AsyncStorage.getAllKeys();
              const progressKeys = keys.filter(k => k.startsWith('dailyStats_') || k === 'completedTopics' || k === 'videoProgress');
              await AsyncStorage.multiRemove(progressKeys);
              loadLessonProgress();
              setGoals(goals.map(g => ({...g, done: false})));
              Alert.alert('Başarılı', 'Tüm ilerleme sıfırlandı.');
            } catch {
              Alert.alert('Hata', 'Sıfırlama sırasında bir sorun oluştu.');
            }
          }
        }
      ]
    );
  }

  const providerLabel =
    user?.provider === 'email'
      ? 'E-posta'
      : user?.provider === 'google'
        ? 'Google'
        : user?.provider === 'guest'
          ? 'Misafir'
          : '-';

    const totalTopics = lessonProgress.reduce((acc, item) => acc + item.total, 0);
    const doneTopics = lessonProgress.reduce((acc, item) => acc + item.done, 0);
    const totalProgress = Math.round((doneTopics / Math.max(totalTopics, 1)) * 100);
    const initials = (fullName || user?.profile.fullName || 'S').trim().slice(0, 2).toUpperCase();

    const firstUnfinishedId = lessonProgress.find(item => item.percent < 100)?.lessonId;

  return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.heroShapeOne} />
          <View style={styles.heroShapeTwo} />
          <View style={styles.heroTopRow}>
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>{fullName || user?.profile.fullName || 'Sürücü'}</Text>
              <Text style={styles.heroSubtitle}>Öğrenci Sürücü</Text>
            </View>
          </View>
          <View style={styles.heroStatRow}>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatValue}>%{(totalProgress || 0).toString()}</Text>
              <Text style={styles.heroStatLabel}>Genel İlerleme</Text>
            </View>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatValue}>{doneTopics || 0}/{totalTopics || 0}</Text>
              <Text style={styles.heroStatLabel}>Tamamlanan Konu</Text>
            </View>
          </View>
        </View>

        <AppCard>
          <Text style={styles.sectionTitle}>Öğrenme Haritam</Text>
          <Text style={styles.sectionSubtitle}>Ders bazlı ilerlemeni buradan takip edip doğrudan ilgili derse geçebilirsin.</Text>

          {lessonProgress.slice(0, 8).map((item, index) => {
            const finished = item.percent >= 100;
            const isNextLesson = item.lessonId === firstUnfinishedId;
            const active = (item.percent > 0 && item.percent < 100) || isNextLesson;

            return (
              <Pressable
                key={item.lessonId}
                style={styles.timelineRow}
                onPress={() => navigation.navigate('Lessons', { screen: 'LessonDetail', params: { lessonId: item.lessonId } })}
              >
                <View style={styles.timelineRail}>
                  <View style={[styles.timelineDot, finished ? styles.dotDone : active ? styles.dotActive : styles.dotIdle]}>
                    {finished ? <Ionicons name="checkmark" size={11} color="#ffffff" /> : null}
                  </View>
                  {index !== Math.min(lessonProgress.length, 8) - 1 ? <View style={styles.timelineLine} /> : null}
                </View>

                <View style={styles.timelineBody}>
                  <View style={styles.timelineHeader}>
                    <Text style={styles.timelineTitle}>{item.title}</Text>
                    {isNextLesson ? (
                      <View style={styles.timelineNextBadgeWrap}>
                        <Text style={styles.timelineNextBadgeText}>Sıradaki</Text>
                      </View>
                    ) : null}
                    <Text style={styles.timelinePercent}>{item.percent}%</Text>
                  </View>
                  <View style={styles.timelineTrack}>
                    <View style={[styles.timelineFill, { width: `${item.percent}%` }]} />
                  </View>
                  <Text style={styles.timelineMeta}>{item.done}/{item.total} konu tamamlandı</Text>
                </View>
              </Pressable>
            );
          })}
        </AppCard>

        <AppCard>
          <Text style={styles.sectionTitle}>Günlük Hedefler</Text>
          <Text style={styles.sectionSubtitle}>Bugün tamamlaman gereken görevlerin listesi.</Text>
          
          <View style={styles.goalsContainer}>
            {goals.map((goal) => (
              <View key={goal.id} style={styles.goalRow}>
                <View style={{ padding: 10, paddingLeft: 0 }}>
                  <Ionicons 
                    name={goal.done ? "checkmark-circle" : "ellipse-outline"} 
                    size={24} 
                    color={goal.done ? "#0f7b36" : "#cbd5e1"} 
                  />
                </View>
                <Pressable 
                  style={{ flex: 1, paddingVertical: 10 }} 
                  onPress={() => navigation.navigate(goal.route)}
                >
                  <Text style={[styles.goalText, goal.done ? styles.goalTextDone : null]}>
                    {goal.title}
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        </AppCard>

        <AppCard>
          <Text style={styles.sectionTitle}>Profil Bilgileri</Text>
          <Text style={styles.metaRow}>Giriş yöntemi: {providerLabel}</Text>

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

        <Text style={styles.label}>Şehir</Text>
        <TextInput value={city} onChangeText={setCity} style={styles.input} placeholder="İstanbul" />

        <Text style={styles.label}>Ehliyet Sınıfı</Text>
        <TextInput value={licenseClass} onChangeText={setLicenseClass} style={styles.input} placeholder="B" />

        <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]} onPress={handleSave}>
          <Text style={styles.primaryButtonLabel}>Profili Kaydet</Text>
        </Pressable>

        <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]} onPress={logout}>
          <Text style={styles.secondaryButtonLabel}>Çıkış Yap</Text>
        </Pressable>

        <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed, { borderColor: '#fca5a5', backgroundColor: '#fff1f2' }]} onPress={handleResetProgress}>
          <Text style={[styles.secondaryButtonLabel, { color: '#ef4444' }]}>Tüm İlerlemeyi Sıfırla</Text>
        </Pressable>
      </AppCard>
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
    paddingBottom: 34,
    gap: 14,
  },
  heroCard: {
    borderRadius: 24,
    backgroundColor: '#0d3758',
    borderWidth: 1,
    borderColor: '#1a547c',
    padding: 16,
    overflow: 'hidden',
  },
  heroShapeOne: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#1f73a3',
    opacity: 0.28,
    right: -46,
    top: -56,
  },
  heroShapeTwo: {
    position: 'absolute',
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: '#2a93c7',
    opacity: 0.24,
    left: -20,
    bottom: -42,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e5f6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0d3758',
  },
  heroTextWrap: {
    flex: 1,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  heroSubtitle: {
    marginTop: 3,
    color: '#c7e7fb',
    fontSize: 13,
  },
  heroStatRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
  },
  heroStatBox: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  heroStatValue: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '800',
  },
  heroStatLabel: {
    marginTop: 2,
    fontSize: 11,
    color: '#bde1f6',
    fontWeight: '600',
  },
  metaRow: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: '#4b5563',
    marginBottom: 10,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  timelineRail: {
    alignItems: 'center',
    width: 20,
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  dotDone: {
    backgroundColor: '#0f7b36',
  },
  dotActive: {
    backgroundColor: '#0b79bb',
  },
  dotIdle: {
    backgroundColor: '#c5d8e8',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#d8e7f4',
    marginTop: 4,
  },
  timelineBody: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e3ecf6',
    backgroundColor: '#f9fcff',
    padding: 10,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
  },
  timelinePercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0b79bb',
  },
  timelineNextBadgeWrap: {
    backgroundColor: '#0b79bb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  timelineNextBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  timelineTrack: {
    marginTop: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dceaf7',
    overflow: 'hidden',
  },
  timelineFill: {
    height: '100%',
    backgroundColor: '#0b79bb',
    borderRadius: 4,
  },
  timelineMeta: {
    marginTop: 6,
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d4dee8',
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
    backgroundColor: '#0b79bb',
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
    borderColor: '#d4dee8',
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
  goalsContainer: {
    gap: 10,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f9fcff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e3ecf6',
  },
  goalText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
  goalTextDone: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
});
