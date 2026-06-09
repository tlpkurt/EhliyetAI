import { Question } from '../types/question';

type QuestionCategory = {
  id: string;
  title: string;
  description: string;
  tone: string;
  iconColor: string;
  icon: string;
};

export const questionCategories: QuestionCategory[] = [
  {
    id: 'Trafik',
    title: 'Trafik',
    description: 'Levha, hız ve yol önceliği soruları',
    tone: '#e8f2ff',
    iconColor: '#1f8bff',
    icon: 'car-sport-outline',
  },
  {
    id: 'Motor',
    title: 'Motor',
    description: 'Bakım, arıza ve kontrol adımları',
    tone: '#fff3e7',
    iconColor: '#ff8a1f',
    icon: 'construct-outline',
  },
  {
    id: 'Ilk Yardim',
    title: 'İlk Yardım',
    description: 'Acil müdahale ve temel güvenlik',
    tone: '#ffeef1',
    iconColor: '#ff4d4f',
    icon: 'medkit-outline',
  },
  {
    id: 'Trafik Adabi',
    title: 'Trafik Adabı',
    description: 'Saygılı ve güvenli sürüş davranışları',
    tone: '#e9fff3',
    iconColor: '#14b85c',
    icon: 'leaf-outline',
  },
];

export function getCategoryById(categoryId: string) {
  return questionCategories.find((category) => category.id === categoryId) ?? questionCategories[0];
}

export function getQuestionCountByCategory(questions: Question[], categoryId: string) {
  return questions.filter((question) => question.kategori === categoryId).length;
}
