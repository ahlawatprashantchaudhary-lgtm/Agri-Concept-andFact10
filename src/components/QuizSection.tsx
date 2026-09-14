import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  HelpCircle,
  ExternalLink,
  Link as LinkIcon,
  Clock,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { QUIZ_QUESTIONS, DEFAULT_QUIZ_LINKS } from '../data/portalData';
import { QuizQuestion, QuizLink } from '../types';
import { Edit3, Trash2, Plus } from 'lucide-react';

interface QuizSectionProps {
  questions?: QuizQuestion[];
  quizLinks?: QuizLink[];
  isAdmin?: boolean;
  onEditQuizLink?: (link: QuizLink) => void;
  onDeleteQuizLink?: (id: string) => void;
  onOpenUploadQuiz?: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ 
  questions = QUIZ_QUESTIONS,
  quizLinks = DEFAULT_QUIZ_LINKS,
  isAdmin = false,
  onEditQuizLink,
  onDeleteQuizLink,
  onOpenUploadQuiz
}) => {
  const currentList = questions && questions.length > 0 ? questions : QUIZ_QUESTIONS;
  const currentLinks = quizLinks && quizLinks.length > 0 ? quizLinks : DEFAULT_QUIZ_LINKS;

  const [activeTab, setActiveTab] = useState<'mcqs' | 'online-links'>('mcqs');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const safeIndex = Math.min(currentIndex, currentList.length - 1);
  const currentQ = currentList[safeIndex];
  const selectedOption = currentQ ? selectedAnswers[currentQ.id] : undefined;
  const isCurrentSubmitted = currentQ ? !!submittedQuestions[currentQ.id] : false;

  const handleSelectOption = (optionKey: string) => {
    if (!currentQ || isCurrentSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionKey
    }));
  };

  const handleSubmitCurrent = () => {
    if (!currentQ || !selectedOption) return;
    setSubmittedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: true
    }));
  };

  const handleNext = () => {
    if (currentIndex < currentList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmittedQuestions({});
    setQuizFinished(false);
  };

  // Calculate score
  const score = currentList.reduce((acc, q) => {
    return selectedAnswers[q.id] === q.correctAnswer ? acc + 1 : acc;
  }, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="border-b-2 border-zinc-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#1b5e20] flex items-center gap-2">
            <span>📝 Agriculture Quiz & Mock Test Portal</span>
          </h2>
          <p className="text-sm text-zinc-600 mt-1">
            Daily practice questions solve karein ya faculty dwara upload kiye gaye live mock test links par pariksha dein.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex items-center gap-1.5 bg-zinc-200/80 p-1 rounded-xl self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('mcqs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'mcqs'
                ? 'bg-[#1b5e20] text-white shadow-xs'
                : 'text-zinc-700 hover:text-zinc-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Daily MCQs ({currentList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('online-links')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'online-links'
                ? 'bg-[#1b5e20] text-white shadow-xs'
                : 'text-zinc-700 hover:text-zinc-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Online Quiz Links ({currentLinks.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: IN-APP DAILY MCQS */}
      {activeTab === 'mcqs' && (
        <>
          {!currentQ ? (
            <div className="p-8 text-center text-zinc-500 bg-white rounded-xl border border-zinc-200">
              No quiz questions available currently.
            </div>
          ) : !quizFinished ? (
            <div className="bg-white rounded-xl shadow-xs border border-zinc-200 border-t-4 border-t-[#4caf50] p-5 sm:p-6 space-y-5">
              {/* Top progress indicator */}
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 pb-3 border-b border-zinc-100">
                <span className="text-[#1b5e20]">
                  Agriculture Daily Practice Set
                </span>
                <span>
                  Question {safeIndex + 1} of {currentList.length}
                </span>
              </div>

              {/* Question Text */}
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Q{safeIndex + 1}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 mt-2">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOption === opt.key;
                  const isCorrect = currentQ.correctAnswer === opt.key;
                  let borderClass = 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50';
                  let bgClass = 'bg-white';
                  let textClass = 'text-zinc-800';

                  if (isCurrentSubmitted) {
                    if (isCorrect) {
                      borderClass = 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      borderClass = 'border-red-400 bg-red-50/70 text-red-900';
                    }
                  } else if (isSelected) {
                    borderClass = 'border-[#1b5e20] bg-emerald-50/40';
                    bgClass = 'bg-emerald-50/40';
                  }

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      disabled={isCurrentSubmitted}
                      className={`w-full text-left p-3.5 rounded-lg border-2 text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${borderClass} ${bgClass} ${textClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected ? 'bg-[#1b5e20] text-white' : 'bg-zinc-100 text-zinc-700'
                        }`}>
                          {opt.key}
                        </span>
                        <span>{opt.text}</span>
                      </div>

                      {isCurrentSubmitted && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isCurrentSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons & Explanation */}
              <div className="pt-3 border-t border-zinc-100">
                {!isCurrentSubmitted ? (
                  <div className="flex justify-end">
                    <button
                      id="btn-quiz-submit-answer"
                      onClick={handleSubmitCurrent}
                      disabled={!selectedOption}
                      className="bg-[#1b5e20] hover:bg-[#154a19] disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-md shadow-xs transition-colors cursor-pointer"
                    >
                      Submit Answer (उत्तर सबमिट करें)
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Feedback Box */}
                    <div className={`p-4 rounded-lg text-xs sm:text-sm flex items-start gap-2.5 ${
                      selectedOption === currentQ.correctAnswer
                        ? 'bg-emerald-50 text-[#1b5e20] border border-emerald-300'
                        : 'bg-amber-50 text-amber-900 border border-amber-300'
                    }`}>
                      {selectedOption === currentQ.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
                      )}
                      <div>
                        <p className="font-bold">
                          {selectedOption === currentQ.correctAnswer
                            ? 'Sahi Uttar! (Correct Answer)'
                            : `Galat Uttar. Sahi option hai: (${currentQ.correctAnswer})`}
                        </p>
                        <p className="text-xs mt-1 text-zinc-700 font-normal">
                          <strong>Vyakhya (Explanation):</strong> {currentQ.explanation}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        id="btn-quiz-next"
                        onClick={handleNext}
                        className="bg-[#1b5e20] hover:bg-[#4caf50] text-white font-bold text-sm px-5 py-2.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <span>{currentIndex < currentList.length - 1 ? 'Agla Prashna (Next)' : 'Parinam Dekhein (View Results)'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Final Results Card */
            <div className="bg-white rounded-xl shadow-xs border border-zinc-200 p-6 sm:p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#1b5e20] mx-auto flex items-center justify-center">
                <Award className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-900">
                  Quiz Completed! (प्रश्नोत्तरी संपन्न)
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Agriculture Daily Practice Set mein aapka scorecard:
                </p>
              </div>

              <div className="inline-block bg-emerald-50 border border-emerald-200 px-6 py-4 rounded-xl">
                <div className="text-3xl font-black text-[#1b5e20]">
                  {score} / {currentList.length}
                </div>
                <p className="text-xs font-semibold text-emerald-800 mt-1">
                  {score >= currentList.length * 0.75 ? '🌟 Outstanding Performance!' : score >= currentList.length * 0.5 ? '👍 Good Effort! Revise once.' : 'Keep practicing daily!'}
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="bg-[#1b5e20] hover:bg-[#4caf50] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz (दोबारा टेस्ट दें)</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 2: ONLINE QUIZ LINKS */}
      {activeTab === 'online-links' && (
        <QuizLinksView 
          quizLinks={currentLinks} 
          isAdmin={isAdmin}
          onEditQuizLink={onEditQuizLink}
          onDeleteQuizLink={onDeleteQuizLink}
          onOpenUploadQuiz={onOpenUploadQuiz}
        />
      )}
    </div>
  );
};

interface QuizLinksViewProps {
  quizLinks: QuizLink[];
  isAdmin?: boolean;
  onEditQuizLink?: (link: QuizLink) => void;
  onDeleteQuizLink?: (id: string) => void;
  onOpenUploadQuiz?: () => void;
}

const QuizLinksView: React.FC<QuizLinksViewProps> = ({ 
  quizLinks,
  isAdmin = false,
  onEditQuizLink,
  onDeleteQuizLink,
  onOpenUploadQuiz
}) => {
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all');

  const freeCount = quizLinks.filter(l => !l.isPaid && l.targetBatch !== 'paid').length;
  const paidCount = quizLinks.filter(l => l.isPaid || l.targetBatch === 'paid').length;

  const filteredLinks = quizLinks.filter(link => {
    if (filter === 'free') return !link.isPaid && link.targetBatch !== 'paid';
    if (filter === 'paid') return link.isPaid || link.targetBatch === 'paid';
    return true;
  });

  return (
    <div className="space-y-4">
      {isAdmin && onOpenUploadQuiz && (
        <div className="flex justify-end">
          <button
            onClick={onOpenUploadQuiz}
            className="bg-[#1b5e20] hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>नया ऑनलाइन टेस्ट जोड़ें (Add Quiz Link)</span>
          </button>
        </div>
      )}

      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start justify-between gap-3 flex-col sm:flex-row">

        <div className="flex items-start gap-2.5">
          <LinkIcon className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Online Quiz & Mock Test Links:</strong> Yeh test links Prashant sir aur expert faculty dwara taiyar kiye gaye hain. Kisi bhi test par click karke aap naye tab mein live exam attempt kar sakte hain.
          </p>
        </div>

        {/* Filter subtabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-amber-200 shrink-0">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#1b5e20] text-white shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            All ({quizLinks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('free')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              filter === 'free'
                ? 'bg-[#1b5e20] text-white shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Free ({freeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('paid')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              filter === 'paid'
                ? 'bg-[#f57c00] text-white shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            AGTA Batch ({paidCount})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLinks.map((link) => {
          const isPaid = link.isPaid || link.targetBatch === 'paid';
          return (
            <div 
              key={link.id}
              className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-emerald-500 transition-all group ${
                isPaid ? 'border-amber-300 border-l-4 border-l-[#f57c00]' : 'border-zinc-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    {isPaid ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        ⭐ AGTA Paid Batch
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        🎁 Free Quiz
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-100 text-[#1b5e20]">
                      {link.subject}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {link.addedDate || 'Live Mock'}
                    </span>
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        {onEditQuizLink && (
                          <button
                            type="button"
                            onClick={() => onEditQuizLink(link)}
                            className="p-1 text-zinc-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                            title="एडिट करें"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteQuizLink && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`क्या आप "${link.title}" टेस्ट हटाना चाहते हैं?`)) {
                                onDeleteQuizLink(link.id);
                              }
                            }}
                            className="p-1 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded"
                            title="हटाएं"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-zinc-900 group-hover:text-[#1b5e20] transition-colors leading-snug">
                  {link.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-zinc-600 my-2.5 font-medium">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                    {link.totalQuestions}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    {link.duration}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                  {link.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-mono truncate max-w-[140px]">
                  {link.quizUrl.replace(/^https?:\/\//, '')}
                </span>

                <a
                  href={link.quizUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs ${
                    isPaid ? 'bg-[#f57c00] hover:bg-[#e65100]' : 'bg-[#1b5e20] hover:bg-[#154a19]'
                  }`}
                >
                  <span>Start Test (टेस्ट शुरू करें)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
