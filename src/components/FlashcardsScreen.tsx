import React, { useState } from 'react';
import { 
  CreditCard, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Shuffle, 
  Sparkles, 
  Check, 
  Activity,
  Award
} from 'lucide-react';
import { Flashcard } from '../types';
import { FLASHCARDS } from '../data/mockData';
import { EcgCanvas } from './EcgCanvas';

interface FlashcardsScreenProps {
  learnedCards: string[];
  onToggleLearned: (cardId: string) => void;
}

export const FlashcardsScreen: React.FC<FlashcardsScreenProps> = ({
  learnedCards,
  onToggleLearned,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cards, setCards] = useState<Flashcard[]>(FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const categories = [
    'All',
    'ST Segment & Ischemia',
    'Arrhythmias',
    'Conduction Blocks',
    'Wave Anomalies',
    'Electrolytes & Drugs',
  ];

  const filteredCards = selectedCategory === 'All'
    ? cards
    : cards.filter((c) => c.category === selectedCategory);

  const currentCard = filteredCards[currentIndex] || cards[0];
  const isLearned = learnedCards.includes(currentCard?.id);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header & Category Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-teal-600" />
              <span>Interactive ECG Flashcards</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Master rapid visual recognition of high-yield ECG wave anomalies and clinical criteria.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleShuffle}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition flex items-center space-x-1.5"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle Cards</span>
            </button>

            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
              {learnedCards.length} / {cards.length} Mastered
            </span>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flashcard 3D Perspective Area */}
      {currentCard && (
        <div className="space-y-6">
          <div className="relative min-h-[420px] w-full perspective-1000">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`relative w-full h-full rounded-2xl cursor-pointer transition-all duration-500 transform-style-3d shadow-md border ${
                isFlipped ? 'rotate-y-180 border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
              }`}
            >
              {/* CARD FRONT: ECG Wave Snippet & Description */}
              {!isFlipped ? (
                <div className="p-6 md:p-8 space-y-6 flex flex-col justify-between h-full min-h-[420px]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      {currentCard.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Card {currentIndex + 1} of {filteredCards.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-slate-900">{currentCard.title}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                      "{currentCard.snippet}"
                    </p>
                  </div>

                  {/* Simulated ECG Canvas Trace Preview */}
                  <div className="space-y-1">
                    <EcgCanvas waveType={currentCard.waveType} height={140} title="Diagnostic ECG Tracing Snippet" />
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-teal-600 font-bold">
                    <span className="flex items-center space-x-1">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Click card or press space to reveal Diagnosis & Action</span>
                    </span>
                    <span className="text-slate-400">FRONT</span>
                  </div>
                </div>
              ) : (
                /* CARD BACK: Diagnosis, Criteria, Clinical Action */
                <div className="p-6 md:p-8 space-y-6 flex flex-col justify-between h-full min-h-[420px]">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      DIAGNOSIS & CLINICAL PLAN
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Card {currentIndex + 1} of {filteredCards.length}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">Primary Diagnosis</span>
                      <h2 className="text-xl font-bold text-teal-300 bg-slate-950 p-3 rounded-xl border border-teal-500/30">
                        {currentCard.diagnosis}
                      </h2>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Key Diagnostic Criteria</span>
                      <ul className="space-y-1.5">
                        {currentCard.keyCriteria.map((crit, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-xs text-slate-200">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{crit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-rose-950/40 border border-rose-500/30 p-3.5 rounded-xl space-y-1">
                      <span className="text-xs font-bold text-rose-400 uppercase block">Immediate Clinical Action</span>
                      <p className="text-xs text-slate-200 leading-relaxed">{currentCard.clinicalAction}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-teal-400 font-bold">
                    <span className="flex items-center space-x-1">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Click to flip back</span>
                    </span>
                    <span className="text-slate-500">BACK</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Flashcard Navigation & Mark as Learned Bar */}
          <div className="flex items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <button
              onClick={handlePrev}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center space-x-2 border border-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <button
              onClick={() => onToggleLearned(currentCard.id)}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs transition flex items-center space-x-2 shadow-sm ${
                isLearned
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isLearned ? 'Marked as Learned' : 'Mark as Learned'}</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center space-x-2 border border-slate-200"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
