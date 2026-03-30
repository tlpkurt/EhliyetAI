import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export function HomeScreen() {
  const categories = [
    { label: 'Traffic', icon: 'car-sport-outline', tone: '#e9f2ff', iconColor: '#1f8bff' },
    { label: 'Engine', icon: 'construct-outline', tone: '#fff4e8', iconColor: '#ff8a1f' },
    { label: 'First Aid', icon: 'medkit-outline', tone: '#ffeef0', iconColor: '#ff4d4f' },
    { label: 'Etiquette', icon: 'leaf-outline', tone: '#e9fff2', iconColor: '#14b85c' },
  ] as const;

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <Text style={styles.pageHint}>Home Screen</Text>

      <View style={styles.topBar}>
        <View style={styles.profileWrap}>
          <View style={styles.avatarOuter}>
            <View style={styles.avatarInner}>
              <Ionicons name="person" size={18} color="#183153" />
            </View>
          </View>
          <View>
            <Text style={styles.greetingTitle}>Hello, Driver!</Text>
            <Text style={styles.greetingSubtitle}>Ready to master the road?</Text>
          </View>
        </View>
        <Pressable style={styles.bellButton}>
          <Ionicons name="notifications-outline" size={22} color="#183153" />
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardEyebrow}>DAILY GOAL</Text>
        <View style={styles.goalRow}>
          <View>
            <Text style={styles.goalTitle}>Progress</Text>
            <Text style={styles.goalSubtitle}>12/20 Questions Completed</Text>
          </View>
          <View style={styles.progressRing}>
            <Text style={styles.progressValue}>65%</Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.suggestionCard}>
        <View style={styles.suggestionIconWrap}>
          <Ionicons name="bulb-outline" size={18} color="#ffffff" />
        </View>
        <View style={styles.suggestionTextWrap}>
          <Text style={styles.suggestionTitle}>AI Suggestion</Text>
          <Text style={styles.suggestionText}>Focus on First Aid today based on your last quiz results.</Text>
        </View>
      </Pressable>

      <View style={styles.cardNoPadding}>
        <Image
          source={require('../../assets/splash-icon.png')}
          resizeMode="cover"
          style={styles.lessonImage}
        />
        <View style={styles.lessonBody}>
          <Text style={styles.cardEyebrow}>NEXT LESSON</Text>
          <Text style={styles.lessonTitle}>Traffic Signs</Text>
          <Text style={styles.lessonText}>Learn the most common regulatory and warning signs.</Text>
          <Pressable style={styles.ctaButton}>
            <Text style={styles.ctaLabel}>Continue Learning</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>Categories</Text>
        <Pressable>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

      <View style={styles.categoryGrid}>
        {categories.map((item) => (
          <Pressable key={item.label} style={styles.categoryCard}>
            <View style={[styles.categoryIconWrap, { backgroundColor: item.tone }]}>
              <Ionicons name={item.icon} size={20} color={item.iconColor} />
            </View>
            <Text style={styles.categoryLabel}>{item.label}</Text>
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
    fontSize: 33,
    fontWeight: '700',
    color: '#04163a',
  },
  greetingSubtitle: {
    marginTop: 2,
    fontSize: 25,
    color: '#5f7695',
    fontWeight: '500',
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
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  goalSubtitle: {
    marginTop: 6,
    fontSize: 24,
    color: '#4b5563',
    fontWeight: '500',
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
    fontSize: 26,
    fontWeight: '700',
    color: '#04163a',
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
    fontSize: 26,
    fontWeight: '700',
    color: '#04163a',
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  categoryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#04163a',
  },
});
