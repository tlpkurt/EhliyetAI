import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { AppCard } from '../components/AppCard';
import { AppHeader } from '../components/AppHeader';
import { CategoryArtwork } from '../components/CategoryArtwork';
import { getCategoryById, questionCategories } from '../data/questionCatalog';
import { questions } from '../data/questionBank';
import { incrementDailyStat } from '../data/dailyStats';
import { RootStackParamList } from '../types/navigation';

export function QuestionSolveScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'QuestionSolve'>>();
  const initialCategory = route.params?.category ?? questionCategories[0].id;
  const [category, setCategory] = useState<string>(initialCategory);
  const filtered = useMemo(() => questions.filter((question) => question.kategori === category), [category]);
  const [index, setIndex] = useState<number>(0);
  const categoryInfo = getCategoryById(category);
  const question = filtered[index];

  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const nextCategory = route.params?.category ?? questionCategories[0].id;
    setCategory(nextCategory);
  }, [route.params?.category]);

  useEffect(() => {
    setIndex(0);
    setSelected(null);
    setIsCorrect(null);
  }, [category]);

  function handleSelect(i: number) {
    if (!question) return;
    setSelected(i);
    setIsCorrect(null); // wait for check
  }

  function checkAnswer() {
    if (selected === null || !question) return;
    setIsCorrect(selected === question.dogruCevap);
    incrementDailyStat('exams');
  }

  function nextQuestion() {
    if (filtered.length === 0) return;
    setSelected(null);
    setIsCorrect(null);
    setIndex((s) => (s + 1) % filtered.length);
  }

  function prevQuestion() {
    if (filtered.length === 0) return;
    setSelected(null);
    setIsCorrect(null);
    setIndex((s) => (s - 1 + filtered.length) % filtered.length);
  }

  function randomQuestion() {
    if (filtered.length === 0) return;
    setSelected(null);
    setIsCorrect(null);
    setIndex(Math.floor(Math.random() * filtered.length));
  }

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <AppHeader
        title="Soru Çöz"
        subtitle="Seçtiğin kategoride tek tek ilerle, cevabı kontrol et ve açıklamayı gör."
      />

      <AppCard>
        <CategoryArtwork categoryId={category} title={categoryInfo.title} variant="banner" />

        <View style={styles.categoryPillRow}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{categoryInfo.title}</Text>
          </View>
          <Text style={styles.questionCount}>{filtered.length} soru</Text>
        </View>

        {!question ? (
          <Text style={styles.placeholder}>Bu kategoride soru bulunmuyor.</Text>
        ) : (
          <View>
            <View style={styles.topRow}>
              <Text style={styles.meta}>SORU {index + 1} / {filtered.length}</Text>
              <TouchableOpacity style={styles.hintLink} onPress={() => {}}>
                <Text style={styles.hintText}>Yapay Zeka İpucu</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.questionText}>{question.soru}</Text>

            {question.secenekler.map((opt, i) => {
              const isSelected = selected === i;
              const showCorrect = isCorrect !== null && i === question.dogruCevap;
              const showWrong = isCorrect === false && isSelected && i !== question.dogruCevap;

              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.optionRow,
                    isSelected && styles.optionRowSelected,
                    showCorrect && styles.optionRowCorrect,
                    showWrong && styles.optionRowWrong,
                  ]}
                  onPress={() => handleSelect(i)}
                  activeOpacity={0.8}
                >
                  <View style={styles.letterCircle}>
                    <Text style={styles.letterText}>{String.fromCharCode(65 + i)}</Text>
                  </View>
                  <Text style={styles.optionText}>{opt}</Text>
                  {showCorrect && <Ionicons name="checkmark-circle" size={20} color="#065f46" />}
                </TouchableOpacity>
              );
            })}

            {isCorrect !== null && (
              <Text style={[styles.feedback, isCorrect ? styles.correctText : styles.wrongText]}>
                {isCorrect ? 'Doğru!' : `Yanlış. Doğru cevap: ${question.secenekler[question.dogruCevap]}`}
              </Text>
            )}

            {question.aciklama ? <Text style={styles.explanation}>{question.aciklama}</Text> : null}

            <View style={styles.aiHintBubble}>
              <Text style={styles.aiHintText}>İpucu: Önce ana işareti, sonra yol koşullarını değerlendir.</Text>
            </View>

            <View style={styles.checkControl}>
              <TouchableOpacity style={styles.checkButton} onPress={checkAnswer}>
                <Text style={styles.checkButtonText}>KONTROL ET</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity style={styles.navButton} onPress={prevQuestion}>
                <Text style={styles.navButtonText}>Önceki</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButton} onPress={randomQuestion}>
                <Text style={styles.navButtonText}>Rastgele</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButton} onPress={nextQuestion}>
                <Text style={styles.navButtonText}>Sonraki</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </AppCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 24,
    paddingBottom: 26,
  },
  placeholder: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  optionRowSelected: {
    borderColor: '#1f8bff',
    backgroundColor: '#f0f9ff',
  },
  optionRowCorrect: {
    borderColor: '#86efac',
    backgroundColor: '#ecfdf5',
  },
  optionRowWrong: {
    borderColor: '#fca5a5',
    backgroundColor: '#fff1f2',
  },
  optionText: {
    color: '#111827',
    flex: 1,
    paddingHorizontal: 12,
  },
  letterCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterText: {
    color: '#1f3a8a',
    fontWeight: '700',
  },
  feedback: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  correctText: {
    color: '#065f46',
  },
  wrongText: {
    color: '#991b1b',
  },
  explanation: {
    marginTop: 6,
    color: '#374151',
  },
  aiHintBubble: {
    marginTop: 12,
    backgroundColor: '#e6f0ff',
    padding: 12,
    borderRadius: 12,
  },
  aiHintText: {
    color: '#0b5394',
  },
  checkControl: {
    marginTop: 12,
    alignItems: 'center',
  },
  checkButton: {
    backgroundColor: '#1f8bff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  controls: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  navButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#eef6ff',
    alignItems: 'center',
  },
  navButtonText: {
    color: '#1f8bff',
    fontWeight: '700',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  meta: {
    color: '#6b7280',
    fontWeight: '700',
  },
  hintLink: {},
  hintText: {
    color: '#1f8bff',
    fontWeight: '700',
  },
  categoryPillRow: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryPill: {
    backgroundColor: '#eef6ff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  categoryPillText: {
    color: '#1f8bff',
    fontWeight: '700',
  },
  questionCount: {
    color: '#6b7280',
    fontWeight: '700',
  },
});
