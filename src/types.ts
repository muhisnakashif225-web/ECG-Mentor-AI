export type Screen = 'dashboard' | 'lectures' | 'flashcards' | 'quiz' | 'ai-assistant' | 'chat';

export type UrgencyLevel = 'Critical' | 'High' | 'Moderate' | 'Low';

export interface Lecture {
  id: string;
  title: string;
  category: 'Basic Concepts' | 'Lead Placement' | 'Rhythm Analysis' | 'Ischemia/MI' | 'Arrhythmias' | 'Block Patterns';
  durationMinutes: number;
  summary: string;
  waveType: string;
  normalIntervals: {
    pr: string;
    qrs: string;
    qtc: string;
    rate: string;
  };
  abnormalIntervals: {
    pr: string;
    qrs: string;
    qtc: string;
    rate: string;
  };
  contentSections: {
    heading: string;
    body: string;
    bullets?: string[];
  }[];
  keyPearls: string[];
  quizCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Flashcard {
  id: string;
  category: 'ST Segment & Ischemia' | 'Arrhythmias' | 'Conduction Blocks' | 'Wave Anomalies' | 'Electrolytes & Drugs';
  title: string;
  snippet: string;
  waveType: string;
  diagnosis: string;
  keyCriteria: string[];
  clinicalAction: string;
  learned: boolean;
}

export interface QuizQuestion {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  clinicalHistory: string;
  waveType: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  keyFindings: {
    rate: string;
    rhythm: string;
    stSegment: string;
  };
}

export interface EcgAnalysisInput {
  heartRate: number;
  rhythm: string;
  pWavePresent: string;
  qrsWidth: string;
  stChanges: string;
  axisDeviation: string;
  notes: string;
}

export interface EcgAnalysisResult {
  primaryDiagnosis: string;
  urgencyLevel: UrgencyLevel;
  differentialDiagnoses: string[];
  keyFindings: {
    rateAndRhythm: string;
    intervals: string;
    stTChanges: string;
    axisAnalysis: string;
  };
  nextSteps: string[];
  clinicalPearls: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface UserProgress {
  completedLectures: string[];
  learnedFlashcards: string[];
  quizScores: {
    totalTaken: number;
    correctAnswers: number;
    recentScore: number;
  };
  streakDays: number;
  lastActiveDate: string;
}
