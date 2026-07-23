import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  HelpCircle, 
  Clock, 
  Activity, 
  Check, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../data/mockData';
import { EcgCanvas } from './EcgCanvas';

interface QuizScreenProps {
  onRecordScore: (scorePercent: number, correctCount: number, totalCount: number) => void;
  onNavigateToAiChat: (topic: string) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ onRecordScore, onNavigateToAiChat }) => {
  const [questions] = useState<QuizQuestion[]>(QUIZ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswersHistory, setUserAnswersHistory] = useState<(number | null)[]>(
    new Array(QUIZ_QUESTIONS.length).fill(null)
  );
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    const isCorrect = selectedOption === currentQuestion.correctIndex;
    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
    }

    const newHistory = [...userAnswersHistory];
    newHistory[currentIndex] = selectedOption;
    setUserAnswersHistory(newHistory);

    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      const scorePercent = Math.round((score / questions.length) * 100);
      onRecordScore(scorePercent, score, questions.length);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setUserAnswersHistory(new Array(questions.length).fill(null));
    setQuizFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Quiz Progress & Live Score Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span>ECG Clinical Master Quiz</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Test your clinical decision-making with real-world patient cases and interactive ECGs.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center space-x-2">
              <span className="text-slate-500">Score:</span>
              <span className="text-teal-700 text-sm font-extrabold">{score} / {questions.length}</span>
            </div>

            <button
              onClick={handleRestartQuiz}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
              title="Restart Quiz"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-teal-500 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* QUIZ RESULTS VIEW */}
      {quizFinished ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mx-auto">
            <Award className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Case Test Completed!</h2>
            <p className="text-sm text-slate-600">
              You scored <strong className="text-teal-700 font-extrabold">{score} out of {questions.length}</strong> (
              {Math.round((score / questions.length) * 100)}%).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-xs text-slate-700 space-y-2">
            <span className="font-bold text-slate-900 block">Performance Summary:</span>
            {score === questions.length ? (
              <p className="text-emerald-700 font-bold">🌟 Perfect Score! Excellent clinical diagnostic skills!</p>
            ) : score >= questions.length / 2 ? (
              <p className="text-teal-700 font-bold">👍 Solid effort! Review the missed questions in the lecture modules.</p>
            ) : (
              <p className="text-rose-700 font-bold">💡 Recommended: Revisit the STEMI and Arrhythmia lecture modules.</p>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-sm flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE QUESTION VIEW */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          {/* Question Category & Difficulty Tag */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                {currentQuestion.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                Difficulty: {currentQuestion.difficulty}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Case #{currentQuestion.id}</span>
          </div>

          {/* Clinical History Presentation */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">{currentQuestion.title}</h2>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm text-slate-700 leading-relaxed font-sans">
              <strong className="text-slate-900 font-bold block mb-1">Clinical Scenario:</strong>
              {currentQuestion.clinicalHistory}
            </div>
          </div>

          {/* Simulated ECG Canvas */}
          <div className="space-y-1">
            <EcgCanvas waveType={currentQuestion.waveType} height={160} title={`12-Lead Tracing for ${currentQuestion.title}`} />
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Select Most Likely Diagnosis:
            </label>

            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectIndex = idx === currentQuestion.correctIndex;

                let optionStyle = "bg-slate-50 border-slate-200 text-slate-800 hover:border-teal-500/80";

                if (isAnswerSubmitted) {
                  if (isCorrectIndex) {
                    optionStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-sm";
                  } else if (isSelected && !isCorrectIndex) {
                    optionStyle = "bg-rose-50 border-rose-500 text-rose-900 font-bold";
                  } else {
                    optionStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                  }
                } else if (isSelected) {
                  optionStyle = "bg-teal-50 border-teal-500 text-teal-900 font-bold";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-4 rounded-xl border text-left text-xs transition-all duration-200 flex items-center justify-between ${optionStyle}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0 text-[11px]">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="font-semibold text-sm">{option}</span>
                    </div>

                    {isAnswerSubmitted && isCorrectIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrectIndex && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button: Submit or Next */}
          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className={`w-full py-3.5 rounded-xl font-bold text-xs transition shadow-sm flex items-center justify-center space-x-2 ${
                selectedOption !== null
                  ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Submit Answer</span>
            </button>
          ) : (
            /* DETAILED EXPLANATION BOX */
            <div className="space-y-4 pt-2">
              <div
                className={`p-5 rounded-2xl border text-xs space-y-3 ${
                  selectedOption === currentQuestion.correctIndex
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold text-sm">
                  {selectedOption === currentQuestion.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Correct Diagnosis!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>Incorrect Diagnosis</span>
                    </>
                  )}
                </div>

                <p className="leading-relaxed font-sans">{currentQuestion.explanation}</p>

                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-700 font-mono space-y-1">
                  <div><strong>Key Rate & Rhythm:</strong> {currentQuestion.keyFindings.rate}</div>
                  <div><strong>ST-Segment Analysis:</strong> {currentQuestion.keyFindings.stSegment}</div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => onNavigateToAiChat(`Can you explain why the correct diagnosis for case "${currentQuestion.title}" is ${currentQuestion.options[currentQuestion.correctIndex]}?`)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 font-semibold text-xs transition flex items-center space-x-2 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Ask Dr. ECG Mentor for Deep Dive</span>
                </button>

                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs transition shadow-sm flex items-center space-x-2"
                >
                  <span>Next Case</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
