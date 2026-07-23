import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Award, 
  ChevronRight, 
  Lightbulb, 
  Info, 
  HelpCircle,
  Activity,
  Sparkles
} from 'lucide-react';
import { Lecture } from '../types';
import { LECTURES } from '../data/mockData';
import { EcgCanvas } from './EcgCanvas';

interface LecturesScreenProps {
  completedLectures: string[];
  onToggleComplete: (lectureId: string) => void;
  onNavigateToAiChat: (topic: string) => void;
}

export const LecturesScreen: React.FC<LecturesScreenProps> = ({
  completedLectures,
  onToggleComplete,
  onNavigateToAiChat,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLecture, setActiveLecture] = useState<Lecture>(LECTURES[0]);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const categories = [
    'All',
    'Basic Concepts',
    'Lead Placement',
    'Ischemia/MI',
    'Arrhythmias',
    'Block Patterns',
  ];

  const filteredLectures = selectedCategory === 'All'
    ? LECTURES
    : LECTURES.filter((l) => l.category === selectedCategory);

  const isCompleted = completedLectures.includes(activeLecture.id);

  const handleSelectLecture = (lec: Lecture) => {
    setActiveLecture(lec);
    setUserAnswer(null);
    setShowAnswer(false);
  };

  const handleQuizSubmit = (index: number) => {
    setUserAnswer(index);
    setShowAnswer(true);
    if (index === activeLecture.quizCheck.correctIndex && !isCompleted) {
      onToggleComplete(activeLecture.id);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
      {/* Sidebar: Lecture Modules List */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              <span>Learning Modules</span>
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              {completedLectures.length}/{LECTURES.length} Done
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Modules List */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredLectures.map((lec) => {
              const done = completedLectures.includes(lec.id);
              const isActive = activeLecture.id === lec.id;

              return (
                <div
                  key={lec.id}
                  onClick={() => handleSelectLecture(lec)}
                  className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-teal-50/50 border-teal-500 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">
                        {lec.category}
                      </span>
                      <h3 className={`text-xs font-bold ${isActive ? 'text-teal-900' : 'text-slate-800'}`}>
                        {lec.title}
                      </h3>
                    </div>
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-2.5">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{lec.durationMinutes} mins</span>
                    </span>
                    <span>•</span>
                    <span>ECG Trace Included</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area: Active Lecture Reader */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          {/* Header & Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
                  {activeLecture.category}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {activeLecture.durationMinutes} min read
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{activeLecture.title}</h1>
            </div>

            <button
              onClick={() => onToggleComplete(activeLecture.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold shadow-sm'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
            </button>
          </div>

          {/* Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700">
            <strong className="text-slate-900 font-bold block mb-1">Key Executive Summary:</strong>
            {activeLecture.summary}
          </div>

          {/* Interactive ECG Waveform Illustration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className="flex items-center space-x-1.5 text-slate-800 font-bold">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Associated Rhythm Simulation</span>
              </span>
              <span>25 mm/s • 10 mm/mV</span>
            </div>
            <EcgCanvas waveType={activeLecture.waveType} height={170} title={`Simulated Tracing: ${activeLecture.title}`} />
          </div>

          {/* Normal vs Abnormal Intervals Table */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 border border-slate-800 shadow-md">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Info className="w-4 h-4 text-teal-400" />
              <span>Diagnostic Interval Reference Values</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <span className="font-bold text-emerald-400 uppercase tracking-wider block">Normal Range</span>
                <ul className="space-y-1 text-slate-300 font-mono">
                  <li><strong>PR Interval:</strong> {activeLecture.normalIntervals.pr}</li>
                  <li><strong>QRS Duration:</strong> {activeLecture.normalIntervals.qrs}</li>
                  <li><strong>QTc Interval:</strong> {activeLecture.normalIntervals.qtc}</li>
                  <li><strong>Heart Rate:</strong> {activeLecture.normalIntervals.rate}</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30 space-y-2">
                <span className="font-bold text-rose-400 uppercase tracking-wider block">Pathological Significance</span>
                <ul className="space-y-1 text-slate-300 font-mono">
                  <li><strong>PR Anomaly:</strong> {activeLecture.abnormalIntervals.pr}</li>
                  <li><strong>QRS Anomaly:</strong> {activeLecture.abnormalIntervals.qrs}</li>
                  <li><strong>QTc Anomaly:</strong> {activeLecture.abnormalIntervals.qtc}</li>
                  <li><strong>Rate Anomaly:</strong> {activeLecture.abnormalIntervals.rate}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {activeLecture.contentSections.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 border-l-4 border-teal-500 pl-3">
                  {sec.heading}
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">{sec.body}</p>

                {sec.bullets && (
                  <ul className="space-y-2 pl-2">
                    {sec.bullets.map((b, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5"></span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* High-Yield Clinical Pearls Callout */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-amber-900 flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>High-Yield Clinical Pearls for Rounds & Boards</span>
            </h3>
            <ul className="space-y-2">
              {activeLecture.keyPearls.map((pearl, i) => (
                <li key={i} className="text-xs text-slate-800 flex items-start space-x-2">
                  <span className="text-amber-600 font-bold shrink-0">★</span>
                  <span>{pearl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ask Dr. ECG Mentor Button */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Have questions about this lecture?</h4>
                <p className="text-xs text-slate-400">Ask Dr. ECG Mentor AI for instant step-by-step clarification.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToAiChat(`Can you explain more about ${activeLecture.title}?`)}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shrink-0"
            >
              Ask AI Mentor
            </button>
          </div>

          {/* Knowledge Check Widget */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>End-of-Module Knowledge Check</span>
            </h3>

            <p className="text-xs text-slate-800 font-bold">{activeLecture.quizCheck.question}</p>

            <div className="space-y-2">
              {activeLecture.quizCheck.options.map((option, idx) => {
                const isSelected = userAnswer === idx;
                const isCorrectOption = idx === activeLecture.quizCheck.correctIndex;

                let btnStyle = "bg-slate-50 text-slate-800 border-slate-200 hover:border-teal-500";
                if (showAnswer) {
                  if (isCorrectOption) {
                    btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                  } else if (isSelected && !isCorrectOption) {
                    btnStyle = "bg-rose-50 border-rose-500 text-rose-900 font-bold";
                  }
                } else if (isSelected) {
                  btnStyle = "bg-teal-50 border-teal-500 text-teal-900 font-bold";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleQuizSubmit(idx)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {showAnswer && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {showAnswer && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">Explanation:</span>
                <p>{activeLecture.quizCheck.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
