import React, { useState, useEffect } from 'react';
import { Screen, UserProgress } from './types';
import { Navbar } from './components/Navbar';
import { DashboardScreen } from './components/DashboardScreen';
import { LecturesScreen } from './components/LecturesScreen';
import { FlashcardsScreen } from './components/FlashcardsScreen';
import { QuizScreen } from './components/QuizScreen';
import { AiAssistantScreen } from './components/AiAssistantScreen';
import { ChatbotScreen } from './components/ChatbotScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');

  // Persistent User Progress State
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('ecg_mentor_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading progress:', e);
      }
    }
    return {
      completedLectures: ['lec-1'],
      learnedFlashcards: ['fc-1', 'fc-2'],
      quizScores: {
        totalTaken: 5,
        correctAnswers: 4,
        recentScore: 80,
      },
      streakDays: 4,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
  });

  useEffect(() => {
    localStorage.setItem('ecg_mentor_progress', JSON.stringify(progress));
  }, [progress]);

  // Handle Lecture completion toggle
  const handleToggleLectureComplete = (lectureId: string) => {
    setProgress((prev) => {
      const isAlreadyCompleted = prev.completedLectures.includes(lectureId);
      const newCompleted = isAlreadyCompleted
        ? prev.completedLectures.filter((id) => id !== lectureId)
        : [...prev.completedLectures, lectureId];
      return { ...prev, completedLectures: newCompleted };
    });
  };

  // Handle Flashcard learned toggle
  const handleToggleFlashcardLearned = (cardId: string) => {
    setProgress((prev) => {
      const isLearned = prev.learnedFlashcards.includes(cardId);
      const newLearned = isLearned
        ? prev.learnedFlashcards.filter((id) => id !== cardId)
        : [...prev.learnedFlashcards, cardId];
      return { ...prev, learnedFlashcards: newLearned };
    });
  };

  // Handle Quiz Score recording
  const handleRecordQuizScore = (scorePercent: number, correctCount: number, totalCount: number) => {
    setProgress((prev) => ({
      ...prev,
      quizScores: {
        totalTaken: prev.quizScores.totalTaken + totalCount,
        correctAnswers: prev.quizScores.correctAnswers + correctCount,
        recentScore: scorePercent,
      },
      streakDays: prev.streakDays + 1,
    }));
  };

  // Navigate to AI Chat with a custom pre-filled question
  const handleNavigateToAiChat = (initialMessage?: string) => {
    if (initialMessage) {
      setChatInitialPrompt(initialMessage);
    }
    setCurrentScreen('chat');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Navigation Sidebar / Header */}
      <Navbar
        currentScreen={currentScreen}
        onSelectScreen={(s) => {
          if (s !== 'chat') setChatInitialPrompt('');
          setCurrentScreen(s);
        }}
        progress={progress}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-8 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400 font-medium">Welcome back,</span>
            <span className="font-bold text-slate-800">Dr. Sarah Mitchell</span>
            <span className="hidden sm:inline-block ml-2 text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-0.5 rounded-full border border-slate-200">
              Electrophysiology Fellow
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-slate-700 block">St. Jude Medical Center</span>
              <span className="text-[10px] text-teal-600 font-semibold">Cardiology Division</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-900 text-teal-400 border border-slate-800 flex items-center justify-center font-bold text-xs shadow-sm">
              SM
            </div>
          </div>
        </header>

        {/* Main Screen Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentScreen === 'dashboard' && (
            <DashboardScreen onNavigate={setCurrentScreen} progress={progress} />
          )}

          {currentScreen === 'lectures' && (
            <LecturesScreen
              completedLectures={progress.completedLectures}
              onToggleComplete={handleToggleLectureComplete}
              onNavigateToAiChat={handleNavigateToAiChat}
            />
          )}

          {currentScreen === 'flashcards' && (
            <FlashcardsScreen
              learnedCards={progress.learnedFlashcards}
              onToggleLearned={handleToggleFlashcardLearned}
            />
          )}

          {currentScreen === 'quiz' && (
            <QuizScreen
              onRecordScore={handleRecordQuizScore}
              onNavigateToAiChat={handleNavigateToAiChat}
            />
          )}

          {currentScreen === 'ai-assistant' && (
            <AiAssistantScreen onNavigateToChat={handleNavigateToAiChat} />
          )}

          {currentScreen === 'chat' && (
            <ChatbotScreen initialPrompt={chatInitialPrompt} />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-700">ECG Mentor AI</span>
              <span>•</span>
              <span>Professional Clinical Electrophysiology Suite</span>
            </div>

            <p className="text-[11px] text-slate-400">
              Designed for clinical training & board prep. Always verify diagnoses with attending physicians.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
