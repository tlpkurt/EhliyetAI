import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { AppCard } from '../components/AppCard';
import { AppHeader } from '../components/AppHeader';
import { questions } from '../data/questionBank';
import { incrementDailyStat } from '../data/dailyStats';
import { RootStackParamList } from '../types/navigation';

const EXAM_DURATION_SECONDS = 15 * 60; // 15 minutes

export function ExamSessionScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'ExamSession'>>();
  const navigation = useNavigation<any>();
  const examId = route.params?.examId || 'deneme-1';

  // State
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  
  // Select 10 random questions for the exam (could be deterministic based on examId if desired)
  const examQuestions = useMemo(() => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, [examId]);

  const question = examQuestions[index];

  // Timer effect
  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  function handleSelect(optionIndex: number) {
    if (isFinished) return;
    setAnswers((prev) => ({
      ...prev,
      [index]: optionIndex,
    }));
  }

  function handleFinishExam() {
    if (isFinished) return;
    setIsFinished(true);
    incrementDailyStat('exams');
  }

  function confirmFinish() {
    Alert.alert(
      'Sınavı Bitir',
      'Sınavı bitirmek istediğinize emin misiniz? Kalan süre ve boş sorularınız olabilir.',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Bitir', style: 'destructive', onPress: handleFinishExam },
      ]
    );
  }

  function nextQuestion() {
    if (index < examQuestions.length - 1) {
      setIndex((i) => i + 1);
    }
  }

  function prevQuestion() {
    if (index > 0) {
      setIndex((i) => i - 1);
    }
  }

  // Formatting time
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Evaluate results
  const correctCount = useMemo(() => {
    let count = 0;
    examQuestions.forEach((q, i) => {
      if (answers[i] === q.dogruCevap) count++;
    });
    return count;
  }, [answers, examQuestions]);

  const answeredCount = Object.keys(answers).length;
  const wrongCount = answeredCount - correctCount;
  const emptyCount = examQuestions.length - answeredCount;
  const timeSpent = EXAM_DURATION_SECONDS - timeLeft;
  const timeSpentMins = Math.floor(timeSpent / 60);
  const timeSpentSecs = timeSpent % 60;

  if (isFinished) {
    return (
      <ScrollView contentContainerStyle={styles.content} style={styles.container}>
        <AppHeader
          title="Sınav Sonucu"
          subtitle="Deneme sınavı tamamlandı. İşte sonuçlarınız:"
        />
        <AppCard>
          <View style={styles.resultHeader}>
            <Ionicons name="trophy" size={48} color="#f59e0b" />
            <Text style={styles.resultTitle}>Tebrikler!</Text>
            <Text style={styles.resultSubtitle}>Sınavı başarıyla tamamladınız.</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Doğru</Text>
              <Text style={[styles.statValue, { color: '#059669' }]}>{correctCount}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Yanlış</Text>
              <Text style={[styles.statValue, { color: '#dc2626' }]}>{wrongCount}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Boş</Text>
              <Text style={[styles.statValue, { color: '#6b7280' }]}>{emptyCount}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Süre</Text>
              <Text style={[styles.statValue, { color: '#1f8bff' }]}>
                {timeSpentMins}m {timeSpentSecs}s
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('MockExam')}
          >
            <Text style={styles.actionButtonText}>Testlere Dön</Text>
          </TouchableOpacity>
        </AppCard>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <AppHeader
        title={examId === 'deneme-1' ? 'Deneme 1' : 'Deneme 2'}
        subtitle="Gerçek sınav deneyimi. Başarılar dileriz!"
      />

      <AppCard>
        <View style={styles.examTopBar}>
          <View style={styles.timerWrap}>
            <Ionicons name="time-outline" size={20} color="#1f8bff" />
            <Text style={styles.timerText}>{timeString}</Text>
          </View>
          <TouchableOpacity onPress={confirmFinish} style={styles.finishLink}>
            <Text style={styles.finishText}>Sınavı Bitir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressRow}>
          <Text style={styles.meta}>SORU {index + 1} / {examQuestions.length}</Text>
        </View>

        <Text style={styles.questionText}>{question.soru}</Text>

        {question.secenekler.map((opt, i) => {
          const isSelected = answers[index] === i;

          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.optionRow,
                isSelected && styles.optionRowSelected,
              ]}
              onPress={() => handleSelect(i)}
              activeOpacity={0.8}
            >
              <View style={[styles.letterCircle, isSelected && styles.letterCircleSelected]}>
                <Text style={[styles.letterText, isSelected && styles.letterTextSelected]}>
                  {String.fromCharCode(65 + i)}
                </Text>
              </View>
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}

        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.navButton, index === 0 && styles.navButtonDisabled]} 
            onPress={prevQuestion}
            disabled={index === 0}
          >
            <Text style={[styles.navButtonText, index === 0 && styles.navButtonTextDisabled]}>Önceki</Text>
          </TouchableOpacity>

          {index === examQuestions.length - 1 ? (
            <TouchableOpacity style={styles.navButtonPrimary} onPress={confirmFinish}>
              <Text style={styles.navButtonTextPrimary}>Bitir</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.navButtonPrimary} onPress={nextQuestion}>
              <Text style={styles.navButtonTextPrimary}>Sonraki</Text>
            </TouchableOpacity>
          )}
        </View>
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
  examTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  timerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f8bff',
  },
  finishLink: {
    padding: 8,
  },
  finishText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 15,
  },
  progressRow: {
    marginBottom: 12,
  },
  meta: {
    color: '#6b7280',
    fontWeight: '700',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
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
    backgroundColor: '#eff6ff',
  },
  optionText: {
    color: '#111827',
    flex: 1,
    paddingHorizontal: 12,
  },
  optionTextSelected: {
    color: '#1e3a8a',
    fontWeight: '600',
  },
  letterCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterCircleSelected: {
    backgroundColor: '#1f8bff',
  },
  letterText: {
    color: '#1f3a8a',
    fontWeight: '700',
  },
  letterTextSelected: {
    color: '#ffffff',
  },
  controls: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#eef6ff',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#f3f4f6',
  },
  navButtonText: {
    color: '#1f8bff',
    fontWeight: '700',
    fontSize: 16,
  },
  navButtonTextDisabled: {
    color: '#9ca3af',
  },
  navButtonPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1f8bff',
    alignItems: 'center',
  },
  navButtonTextPrimary: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  
  // Results view styles
  resultHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginTop: 12,
  },
  resultSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  actionButton: {
    backgroundColor: '#1f8bff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});
