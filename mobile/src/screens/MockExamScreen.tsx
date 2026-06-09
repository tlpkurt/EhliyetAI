import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { AppHeader } from '../components/AppHeader';
import { CategoryArtwork } from '../components/CategoryArtwork';
import { getQuestionCountByCategory, questionCategories } from '../data/questionCatalog';
import { questions } from '../data/questionBank';
import { RootStackParamList } from '../types/navigation';

export function MockExamScreen() {
  const navigation: any = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'MockExam'>>();
  const categoryStats = questionCategories.map((category) => ({
    ...category,
    count: getQuestionCountByCategory(questions, category.id),
  }));

  useEffect(() => {
    const category = route.params?.category;

    if (!category) {
      return;
    }

    navigation.navigate('QuestionSolve', { category });
  }, [navigation, route.params?.category]);

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <AppHeader
        title="Test Kategorileri"
        subtitle="Bir kategori seçin, soru ekranı doğrudan o başlıkla açılsın."
      />

      <View style={styles.grid}>
        {categoryStats.map((item) => (
          <Pressable
            key={item.id}
            style={styles.categoryCard}
            onPress={() => navigation.navigate('QuestionSolve', { category: item.id })}
          >
            <CategoryArtwork categoryId={item.id} title={item.title} />
            <View style={styles.categoryBody}>
              <Text style={styles.categoryTitle}>{item.title}</Text>
              <Text style={styles.categoryText}>{item.description}</Text>
              <Text style={styles.categoryCount}>{item.count} soru</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.examSection}>
        <Text style={styles.sectionTitle}>Deneme Sınavları</Text>
        <Text style={styles.sectionSubtitle}>15 dakikalık süre ve sınav sonu değerlendirmesiyle gerçek sınav deneyimi yaşayın.</Text>
        <View style={styles.examGrid}>
          <Pressable 
            style={styles.examCard}
            onPress={() => navigation.navigate('ExamSession', { examId: 'deneme-1' })}
          >
            <View style={styles.examIconWrap}>
              <Text style={styles.examIconText}>1</Text>
            </View>
            <View style={styles.examBody}>
              <Text style={styles.examTitle}>Deneme 1</Text>
              <Text style={styles.examText}>Rastgele 10 soru</Text>
            </View>
          </Pressable>

          <Pressable 
            style={styles.examCard}
            onPress={() => navigation.navigate('ExamSession', { examId: 'deneme-2' })}
          >
            <View style={styles.examIconWrap}>
              <Text style={styles.examIconText}>2</Text>
            </View>
            <View style={styles.examBody}>
              <Text style={styles.examTitle}>Deneme 2</Text>
              <Text style={styles.examText}>Rastgele 10 soru</Text>
            </View>
          </Pressable>
        </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  categoryCard: {
    width: '48.2%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e7edf7',
  },
  categoryCount: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1f8bff',
    marginTop: 2,
  },
  categoryBody: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 4,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  categoryText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#5b687a',
    minHeight: 34,
  },
  examSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e7edf7',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#5b687a',
    marginBottom: 12,
    lineHeight: 18,
  },
  examGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  examCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e7edf7',
  },
  examIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1f8bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  examIconText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  examBody: {
    flex: 1,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  examText: {
    fontSize: 13,
    color: '#5b687a',
    marginTop: 2,
  },
});
