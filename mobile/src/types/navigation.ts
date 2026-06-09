export type RootStackParamList = {
  Home: undefined;
  QuestionSolve: { category?: string } | undefined;
  MockExam: { category?: string } | undefined;
  ExamSession: { examId: string } | undefined;
  AIAnalysis: undefined;
  Statistics: undefined;
  LessonDetail: { lessonId: string } | undefined;
  TopicDetail: { lessonId: string; topicId: string } | undefined;
};
