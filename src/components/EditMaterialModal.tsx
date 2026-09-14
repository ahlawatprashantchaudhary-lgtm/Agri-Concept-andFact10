import React, { useState, useEffect } from 'react';
import { Edit3, X, Save, Trash2, AlertCircle, FileText, Video, Link as LinkIcon, Check } from 'lucide-react';
import { StudyPdf, VideoLesson, QuizLink, StudyFolder } from '../types';

type MaterialType = 'pdf' | 'video' | 'quiz-link';

interface EditMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: MaterialType;
  folders: StudyFolder[];
  material: StudyPdf | VideoLesson | QuizLink | null;
  onSavePdf?: (id: string, updates: Partial<StudyPdf>) => void;
  onSaveVideo?: (id: string, updates: Partial<VideoLesson>) => void;
  onSaveQuizLink?: (id: string, updates: Partial<QuizLink>) => void;
  onDelete?: (type: MaterialType, id: string) => void;
}

export const EditMaterialModal: React.FC<EditMaterialModalProps> = ({
  isOpen,
  onClose,
  type,
  folders,
  material,
  onSavePdf,
  onSaveVideo,
  onSaveQuizLink,
  onDelete
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [targetBatch, setTargetBatch] = useState<'free' | 'paid'>('free');
  
  // PDF specific
  const [pages, setPages] = useState('');
  const [summary, setSummary] = useState('');
  const [fileContent, setFileContent] = useState('');
  
  // Video specific
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [topicsStr, setTopicsStr] = useState('');

  // Quiz specific
  const [quizUrl, setQuizUrl] = useState('');
  const [totalQuestions, setTotalQuestions] = useState('');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (material) {
      setTitle(material.title || '');
      setSubject(material.subject || (folders[0]?.name || 'General Agriculture'));
      setTargetBatch(material.targetBatch || (material.isPaid ? 'paid' : 'free'));

      if (type === 'pdf') {
        const p = material as StudyPdf;
        setPages(p.pages || '');
        setSummary(p.summary || '');
        setFileContent(p.fileContent || '');
      } else if (type === 'video') {
        const v = material as VideoLesson;
        setVideoUrl(v.videoUrl || '');
        setDuration(v.duration || '');
        setDescription(v.description || '');
        setTopicsStr(Array.isArray(v.topics) ? v.topics.join(', ') : '');
      } else if (type === 'quiz-link') {
        const q = material as QuizLink;
        setQuizUrl(q.quizUrl || '');
        setDuration(q.duration || '');
        setTotalQuestions(q.totalQuestions || '');
        setDescription(q.description || '');
      }
    }
    setError(null);
  }, [material, type, isOpen, folders]);

  if (!isOpen || !material) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    const isPaid = targetBatch === 'paid';

    if (type === 'pdf' && onSavePdf) {
      onSavePdf(material.id, {
        title: title.trim(),
        subject: subject.trim(),
        targetBatch,
        isPaid,
        pages: pages.trim() || 'Document',
        summary: summary.trim(),
        fileContent: fileContent.trim()
      });
    } else if (type === 'video' && onSaveVideo) {
      const parsedTopics = topicsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      onSaveVideo(material.id, {
        title: title.trim(),
        subject: subject.trim(),
        targetBatch,
        isPaid,
        videoUrl: videoUrl.trim(),
        duration: duration.trim() || '15:00',
        description: description.trim(),
        topics: parsedTopics.length > 0 ? parsedTopics : ['Key Topic Overview']
      });
    } else if (type === 'quiz-link' && onSaveQuizLink) {
      onSaveQuizLink(material.id, {
        title: title.trim(),
        subject: subject.trim(),
        targetBatch,
        isPaid,
        quizUrl: quizUrl.trim(),
        totalQuestions: totalQuestions.trim() || '50 Questions',
        duration: duration.trim() || '45 Minutes',
        description: description.trim()
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (!onDelete) return;
    if (window.confirm(`क्या आप वाकई इस सामग्री (${material.title}) को हटाना चाहते हैं?`)) {
      onDelete(type, material.id);
      onClose();
    }
  };

  const getTypeName = () => {
    if (type === 'pdf') return 'PDF Notes';
    if (type === 'video') return 'Video Class';
    return 'Online Quiz Link';
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col border border-zinc-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#1b5e20] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                सामग्री संपादित करें (Edit {getTypeName()})
              </h3>
              <p className="text-xs text-emerald-200">
                शीर्षक, फोल्डर, लिंक या बैच विवरण बदलें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              शीर्षक (Title) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e20] font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                फ़ोल्डर / विषय (Select Folder)
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
              >
                {folders.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name}
                  </option>
                ))}
                {!folders.some(f => f.name === subject) && (
                  <option value={subject}>{subject}</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                बैच प्रकार (Batch Access)
              </label>
              <select
                value={targetBatch}
                onChange={(e) => setTargetBatch(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e20] font-semibold"
              >
                <option value="free">🎁 Free (सभी छात्रों के लिए खुला)</option>
                <option value="paid">⭐ AGTA Paid Batch (पेड छात्रों के लिए)</option>
              </select>
            </div>
          </div>

          {/* Type Specific Fields */}
          {type === 'pdf' && (
            <>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  पेज / साइज (Pages / Size)
                </label>
                <input
                  type="text"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  placeholder="उदा. 15 Pages • 2.4 MB"
                  className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  संक्षिप्त विवरण (Summary)
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  नोट्स कंटेंट (Text Notes Content)
                </label>
                <textarea
                  rows={4}
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  placeholder="नोट्स का टेक्स्ट यहाँ लिखें..."
                  className="w-full text-xs font-mono px-3 py-2 border border-zinc-300 rounded-lg"
                />
              </div>
            </>
          )}

          {type === 'video' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    वीडियो लिंक (YouTube / MP4 URL) *
                  </label>
                  <input
                    type="url"
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    समय अवधि (Duration)
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="उदा. 24:30"
                    className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  क्लास विवरण (Class Description)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  कवर किए गए मुख्य बिंदु (Topics - comma separated)
                </label>
                <input
                  type="text"
                  value={topicsStr}
                  onChange={(e) => setTopicsStr(e.target.value)}
                  placeholder="उदा. मृदा पीएच, चूना उपचार, जिप्सम अनुपात"
                  className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg"
                />
              </div>
            </>
          )}

          {type === 'quiz-link' && (
            <>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  ऑनलाइन टेस्ट लिंक (Google Forms / Test URL) *
                </label>
                <input
                  type="url"
                  required
                  value={quizUrl}
                  onChange={(e) => setQuizUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    कुल प्रश्न (Total Questions)
                  </label>
                  <input
                    type="text"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(e.target.value)}
                    placeholder="उदा. 50 Questions"
                    className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    समय सीमा (Time Duration)
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="उदा. 45 Minutes"
                    className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  टेस्ट निर्देश (Instructions / Description)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg"
                />
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="pt-3 border-t border-zinc-200 flex items-center justify-between gap-3 shrink-0">
            {onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>हटाएं (Delete)</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs px-4 py-2 border border-zinc-300 hover:bg-zinc-100 rounded-lg font-medium text-zinc-700 transition-colors cursor-pointer"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="submit"
                className="text-xs bg-[#1b5e20] hover:bg-[#2e7d32] text-white px-5 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>सेव करें (Save Changes)</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
