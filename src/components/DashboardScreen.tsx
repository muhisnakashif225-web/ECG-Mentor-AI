import React, { useState } from 'react';
import { 
  BookOpen, 
  CreditCard, 
  Award, 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  Lightbulb, 
  CheckCircle2, 
  TrendingUp, 
  Activity, 
  RotateCw,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { Screen, UserProgress } from '../types';
import { DAILY_PEARLS } from '../data/mockData';
import { EcgCanvas } from './EcgCanvas';

interface DashboardScreenProps {
  onNavigate: (screen: Screen) => void;
  progress: UserProgress;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate, progress }) => {
  const [pearlIndex, setPearlIndex] = useState(0);
  const currentPearl = DAILY_PEARLS[pearlIndex];

  const handleNextPearl = () => {
    setPearlIndex((prev) => (prev + 1) % DAILY_PEARLS.length);
  };

  const totalLectures = 5;
  const totalFlashcards = 8;
  const lectureCompletionPercent = Math.round((progress.completedLectures.length / totalLectures) * 100);
  const flashcardMasteryPercent = Math.round((progress.learnedFlashcards.length / totalFlashcards) * 100);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner: Daily Clinical Pearl (Professional Polish Dark Banner) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 h-full opacity-10 pointer-events-none hidden md:block">
          <svg width="400" height="150" viewBox="0 0 400 150">
            <path d="M0 75 L50 75 L60 40 L70 110 L80 75 L120 75 L130 10 L150 140 L170 75 L300 75 L310 60 L320 90 L330 75 L400 75" stroke="#2DD4BF" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 text-xs font-bold border border-teal-500/30 tracking-wider">
                <Lightbulb className="w-3.5 h-3.5 text-teal-400" />
                <span>DAILY CLINICAL PEARL • {currentPearl.category.toUpperCase()}</span>
              </span>
              <button 
                onClick={handleNextPearl}
                className="text-xs text-slate-400 hover:text-teal-300 flex items-center space-x-1 transition"
              >
                <RotateCw className="w-3 h-3" />
                <span>Next</span>
              </button>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
              {currentPearl.title}
            </h1>

            <p className="text-slate-300 text-base leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 font-sans">
              "{currentPearl.pearl}"
            </p>

            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span>Author: <strong className="text-teal-400">{currentPearl.author}</strong></span>
              <span>•</span>
              <span>High-Yield Cardiology Board Review</span>
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="w-full md:w-auto bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 flex flex-col space-y-3 min-w-[240px] shrink-0">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Daily Case Challenge</div>
            <div className="text-sm text-white font-semibold">Test clinical judgment with real tracings</div>
            <button
              onClick={() => onNavigate('quiz')}
              className="w-full py-2.5 px-4 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md"
            >
              <span>Launch Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Summary Metric Cards (Clean White Theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-teal-500/50 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Curriculum Progress</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{lectureCompletionPercent}%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-teal-500 h-2 rounded-full transition-all duration-500" style={{ width: `${lectureCompletionPercent}%` }}></div>
          </div>
          <div className="text-xs text-slate-400 mt-2 font-medium">{progress.completedLectures.length} of {totalLectures} Modules Completed</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-cyan-500/50 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Quiz Accuracy</span>
            <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {progress.quizScores.totalTaken > 0
              ? `${Math.round((progress.quizScores.correctAnswers / progress.quizScores.totalTaken) * 100)}%`
              : '100%'}
          </div>
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{progress.quizScores.correctAnswers} / {progress.quizScores.totalTaken} Questions Correct</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-purple-500/50 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Flashcard Mastery</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{progress.learnedFlashcards.length} Cards</div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${flashcardMasteryPercent}%` }}></div>
          </div>
          <div className="text-xs text-slate-400 mt-2 font-medium">{flashcardMasteryPercent}% Active Recall Mastery</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-amber-500/50 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Study Streak</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{progress.streakDays} Days</div>
          <div className="text-xs text-amber-600 font-bold mt-3">Active Daily Learner</div>
        </div>
      </div>

      {/* Modules & AI Callout Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Modules (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base">Curriculum Navigation</h3>
            <button 
              onClick={() => onNavigate('lectures')}
              className="text-teal-600 hover:text-teal-700 text-xs font-bold flex items-center gap-1"
            >
              <span>View All Modules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => onNavigate('lectures')}
              className="bg-white border border-slate-200 rounded-xl p-5 flex gap-4 hover:border-teal-500 transition cursor-pointer shadow-sm group"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-900 text-teal-400 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-teal-500 group-hover:text-slate-950 transition">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm group-hover:text-teal-600 transition">Lectures & Protocols</h4>
                <p className="text-xs text-slate-500 leading-relaxed">STEMI, Lead Placement, Arrhythmias & Blocks.</p>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('flashcards')}
              className="bg-white border border-slate-200 rounded-xl p-5 flex gap-4 hover:border-teal-500 transition cursor-pointer shadow-sm group"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-900 text-cyan-400 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-cyan-500 group-hover:text-slate-950 transition">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm group-hover:text-cyan-600 transition">High-Yield Flashcards</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Rapid visual wave criteria & diagnosis.</p>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('quiz')}
              className="bg-white border border-slate-200 rounded-xl p-5 flex gap-4 hover:border-teal-500 transition cursor-pointer shadow-sm group"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-900 text-purple-400 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-purple-500 group-hover:text-slate-950 transition">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm group-hover:text-purple-600 transition">Clinical Case Quiz</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Simulated 12-lead patient cases.</p>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('chat')}
              className="bg-white border border-slate-200 rounded-xl p-5 flex gap-4 hover:border-teal-500 transition cursor-pointer shadow-sm group"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition">Dr. ECG Mentor AI</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Ask cardiology fellow questions 24/7.</p>
              </div>
            </div>
          </div>

          {/* Quick AI Analysis Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg border border-teal-500/20">
            <div className="flex gap-4 items-center">
              <div className="w-11 h-11 rounded-full bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-sm">Quick AI ECG Parameter Interpretation</div>
                <div className="text-teal-300 text-xs">Enter HR, rhythm, and ST changes for an instant structured report.</div>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('ai-assistant')}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold py-2 px-5 rounded-lg transition text-xs shrink-0 shadow-md"
            >
              Start Analyzer
            </button>
          </div>
        </div>

        {/* Right Side: Recent Clinical Activity & Quote */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Recent Activity</h3>
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
            <div className="p-4 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-xs font-bold">
                ✓
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Completed: Lead Placement & Axes</div>
                <div className="text-[11px] text-slate-400">Lectures Curriculum • Active Status</div>
              </div>
            </div>

            <div className="p-4 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0 text-xs font-bold">
                ★
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Mastered STEMI & LBBB Flashcard</div>
                <div className="text-[11px] text-slate-400">Active Recall Engine</div>
              </div>
            </div>

            <div className="p-4 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 text-xs font-bold">
                ?
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Consulted Dr. ECG Mentor</div>
                <div className="text-[11px] text-slate-400">Topic: SVT vs. VT with Aberrancy</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 rounded-xl p-4 border border-dashed border-slate-300">
            <p className="text-xs text-slate-600 text-center italic font-medium leading-relaxed">
              "Systematic evaluation is the single best defense against diagnostic error in clinical electrophysiology."
            </p>
          </div>
        </div>
      </div>

      {/* Featured Live ECG Simulator Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold text-slate-800">Live Tracing Simulator • Acute Anterior STEMI</h3>
          </div>
          <span className="text-xs font-mono text-slate-500">Lead II • 25 mm/s • 10 mm/mV</span>
        </div>

        <EcgCanvas waveType="STEMI" height={160} bpm={85} title="Interactive Real-Time Waveform" />

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-center space-x-4 text-xs text-slate-600 font-medium">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>ST Elevation (V1-V4)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              <span>Rate: 85 bpm</span>
            </span>
          </div>

          <button
            onClick={() => onNavigate('ai-assistant')}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-300 font-bold text-xs transition flex items-center space-x-2 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Open AI Analyzer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

