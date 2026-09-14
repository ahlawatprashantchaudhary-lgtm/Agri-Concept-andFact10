import React, { useState } from 'react';
import { 
  PlayCircle, 
  Download, 
  FileText, 
  CheckCircle2, 
  Lock, 
  BookOpen, 
  Award, 
  Clock, 
  Sparkles,
  Check,
  Eye,
  ExternalLink,
  Link as LinkIcon,
  Layers,
  ShieldCheck,
  Unlock
} from 'lucide-react';
import { PREMIUM_LECTURES, MOCK_TEST_PAPERS } from '../data/portalData';
import { User, VideoLesson, StudyPdf, QuizLink } from '../types';

interface MyCoursesSectionProps {
  currentUser: User | null;
  hasPurchasedBatch: boolean;
  videos?: VideoLesson[];
  pdfs?: StudyPdf[];
  quizLinks?: QuizLink[];
  onOpenPdfReader: (pdf: StudyPdf) => void;
  onOpenStore: () => void;
  onOpenLoginModal: () => void;
}

export const MyCoursesSection: React.FC<MyCoursesSectionProps> = ({
  currentUser,
  hasPurchasedBatch,
  videos = [],
  pdfs = [],
  quizLinks = [],
  onOpenPdfReader,
  onOpenStore,
  onOpenLoginModal
}) => {
  const isAdmin = Boolean(
    currentUser &&
    currentUser.email.toLowerCase().trim() === 'ahlawatprashantchaudhary@gmail.com'
  );

  const isUnlocked = isAdmin || hasPurchasedBatch;

  // Combine default PREMIUM_LECTURES with any videos added by admin
  const dynamicPaidVideos = videos.filter((v) => v.isPaid || v.targetBatch === 'paid');
  const allPaidVideos = dynamicPaidVideos.length > 0 
    ? [...dynamicPaidVideos, ...PREMIUM_LECTURES.filter(pl => !dynamicPaidVideos.some(dv => dv.id === pl.id))]
    : PREMIUM_LECTURES;

  const paidPdfs = pdfs.filter((p) => p.isPaid || p.targetBatch === 'paid');
  const paidQuizLinks = quizLinks.filter((q) => q.isPaid || q.targetBatch === 'paid');

  const [selectedLecture, setSelectedLecture] = useState<VideoLesson>(allPaidVideos[0] || PREMIUM_LECTURES[0]);
  const [courseTab, setCourseTab] = useState<'all' | 'videos' | 'notes' | 'tests'>('all');

  const handleDownloadMockTest = (mock: (typeof MOCK_TEST_PAPERS)[0]) => {
    const blob = new Blob([mock.downloadContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mock.id}_UPSSSC_AGTA.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = (pdf: StudyPdf) => {
    if (pdf.fileContent.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = pdf.fileContent;
      link.download = pdf.fileName.endsWith('.pdf') ? pdf.fileName : `${pdf.fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    const blob = new Blob([pdf.fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = pdf.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Banner if not unlocked */}
      {!isUnlocked && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-zinc-900 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                UPSSSC AGTA 2026 Target Batch - Preview Mode
              </h3>
              <p className="text-xs text-zinc-900/80">
                Aap batch ka study material yahan dekh sakte hain. Sabhi exclusive mock papers aur classes unlock karne ke liye join karein.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenStore}
            className="bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-bold px-4 py-2 rounded-lg shrink-0 transition-colors shadow-xs cursor-pointer"
          >
            Unlock Full Batch @ ₹99
          </button>
        </div>
      )}

      {/* Section Header */}
      <div className="border-b-2 border-zinc-200 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[#1b5e20] flex items-center gap-2">
              <span>💼 My Courses: UPSSSC AGTA Batch</span>
            </h2>
            <p className="text-sm font-semibold text-emerald-700 mt-1">
              {isAdmin ? 'Admin View: All Batch Content & Materials' : 'Dedicated AGTA Target Batch Dashboard'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-[#1b5e20] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs">
            {isAdmin ? <ShieldCheck className="w-4 h-4 text-amber-600" /> : <Award className="w-4 h-4 text-emerald-600" />}
            <span>{isAdmin ? 'Admin Full Access' : (isUnlocked ? 'Active AGTA Batch Member' : 'Batch Preview')}</span>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-zinc-100">
          <button
            type="button"
            onClick={() => setCourseTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              courseTab === 'all'
                ? 'bg-[#1b5e20] text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Content Overview</span>
          </button>
          <button
            type="button"
            onClick={() => setCourseTab('videos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              courseTab === 'videos'
                ? 'bg-[#1b5e20] text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Video Lectures ({allPaidVideos.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setCourseTab('notes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              courseTab === 'notes'
                ? 'bg-[#1b5e20] text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Batch Notes & PDFs ({paidPdfs.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setCourseTab('tests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              courseTab === 'tests'
                ? 'bg-[#1b5e20] text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Mock Papers ({MOCK_TEST_PAPERS.length + paidQuizLinks.length})</span>
          </button>
        </div>
      </div>

      {/* Video Lectures Section */}
      {(courseTab === 'all' || courseTab === 'videos') && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-[#1b5e20]" />
            <span>Target AGTA Video Classes ({allPaidVideos.length} Classes)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {allPaidVideos.map((lec) => {
              const isSelected = selectedLecture?.id === lec.id;
              return (
                <button
                  key={lec.id}
                  onClick={() => setSelectedLecture(lec)}
                  className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50/80 border-[#1b5e20] shadow-xs ring-1 ring-[#1b5e20]'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {lec.subject}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-medium">
                        {lec.duration}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900 line-clamp-2">
                      {lec.title}
                    </h4>
                  </div>
                  <div className="mt-2 pt-2 border-t border-zinc-100 flex items-center text-[11px] font-semibold text-[#1b5e20]">
                    <PlayCircle className="w-3.5 h-3.5 mr-1" />
                    <span>{isSelected ? 'Currently Selected' : 'Click to Watch'}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedLecture && (
            <div className="bg-white rounded-xl shadow-xs border border-zinc-200 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-bold text-base text-zinc-900">
                  {selectedLecture.title}
                </h4>
                <span className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Duration: {selectedLecture.duration}
                </span>
              </div>

              <div className="relative rounded-lg overflow-hidden bg-black aspect-video max-h-[420px] w-full shadow-inner flex items-center justify-center">
                <video
                  key={selectedLecture.id}
                  controls
                  controlsList="nodownload"
                  className="w-full h-full object-contain"
                >
                  <source src={selectedLecture.videoUrl} type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
              </div>

              <p className="text-xs sm:text-sm text-zinc-700 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                {selectedLecture.description}
              </p>
            </div>
          )}
        </div>
      )}

      {/* PDF Notes Section */}
      {(courseTab === 'all' || courseTab === 'notes') && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1b5e20]" />
            <span>Exclusive AGTA Batch Handwritten & Formula Notes</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paidPdfs.map((pdf) => (
              <div
                key={pdf.id}
                className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      ⭐ AGTA Paid Batch
                    </span>
                    <span className="text-[11px] font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded">
                      {pdf.subject}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#1b5e20] mb-1">
                    {pdf.title}
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium mb-2">
                    {pdf.fileSize || pdf.pages} • {pdf.language || 'Hindi/English'}
                  </p>
                  <p className="text-xs text-zinc-600 line-clamp-3 bg-zinc-50 p-2 rounded border border-zinc-100">
                    {pdf.summary}
                  </p>
                </div>

                <div className="space-y-2 mt-4 pt-3 border-t border-zinc-100">
                  <button
                    onClick={() => onOpenPdfReader(pdf)}
                    className="w-full bg-emerald-50 hover:bg-emerald-100 text-[#1b5e20] border border-emerald-300 text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>पोर्टल में पढ़ें (Read in Portal)</span>
                  </button>
                  <button
                    onClick={() => handleDownloadPdf(pdf)}
                    className="w-full bg-[#1b5e20] hover:bg-emerald-800 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>डाउनलोड PDF (Download)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mock Test Papers */}
      {(courseTab === 'all' || courseTab === 'tests') && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#1b5e20]" />
            <span>AGTA Full Length Mock Test Papers</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_TEST_PAPERS.map((mock) => (
              <div
                key={mock.id}
                className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      ⭐ 100 Questions Mock
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">
                      Duration: {mock.duration}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 mb-1">
                    {mock.title}
                  </h4>
                  <p className="text-xs text-zinc-600 line-clamp-2">
                    {mock.difficulty || 'Full Syllabus Mock Test Paper with Detailed Solutions'}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-end">
                  <button
                    onClick={() => handleDownloadMockTest(mock)}
                    className="bg-[#1b5e20] hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Question Paper</span>
                  </button>
                </div>
              </div>
            ))}

            {paidQuizLinks.map((link) => (
              <div
                key={link.id}
                className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Live Online Test
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">
                      {link.duration || '45 Mins'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 mb-1">
                    {link.title}
                  </h4>
                  <p className="text-xs text-zinc-600 line-clamp-2">
                    {link.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-end">
                  <a
                    href={link.quizUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#f57c00] hover:bg-[#e65100] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Start Test</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
