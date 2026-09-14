import React from 'react';
import { 
  GraduationCap, 
  Folder, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  Edit3,
  Trash2,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Send,
  Video,
  FileText,
  CheckSquare,
  Users,
  Settings,
  Flame,
  Award
} from 'lucide-react';
import { User, ActiveSection, VideoLesson, StudyPdf, QuizLink, StudyFolder, StudyBatch, AppSettings } from '../types';

export interface HomeSectionProps {
  currentUser: User | null;
  hasPurchasedBatch: boolean;
  onNavigate: (section: ActiveSection) => void;
  onOpenStore: () => void;
  batches: StudyBatch[];
  folders?: StudyFolder[];
  videos?: VideoLesson[];
  pdfs?: StudyPdf[];
  quizLinks?: QuizLink[];
  settings?: AppSettings;
  onOpenNewBatch?: () => void;
  onEditBatch?: (batch: StudyBatch) => void;
  onDeleteBatch?: (id: string) => void;
  onQuickAdjustPrice?: (batchId: string, delta: number) => void;
  onSelectFolderFilter?: (folderId: string) => void;
  onOpenBatchPayment?: (batch: StudyBatch) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  currentUser,
  hasPurchasedBatch,
  onNavigate,
  onOpenStore,
  batches = [],
  folders = [],
  videos = [],
  pdfs = [],
  quizLinks = [],
  settings,
  onOpenNewBatch,
  onEditBatch,
  onDeleteBatch,
  onQuickAdjustPrice,
  onSelectFolderFilter,
  onOpenBatchPayment
}) => {
  const isAdmin = Boolean(
    currentUser &&
    currentUser.email.toLowerCase().trim() === 'ahlawatprashantchaudhary@gmail.com'
  );

  const handleOpenBatchFolder = (batch: StudyBatch) => {
    if (batch.folderId) {
      if (onSelectFolderFilter) {
        onSelectFolderFilter(batch.folderId);
      }
      const linkedFolder = folders.find(f => f.id === batch.folderId);
      if (linkedFolder) {
        if (linkedFolder.category === 'video') {
          onNavigate('sec-video');
          return;
        } else if (linkedFolder.category === 'quiz') {
          onNavigate('sec-quiz');
          return;
        }
      }
      onNavigate('sec-pdf');
    } else {
      onNavigate('sec-mycourse');
    }
  };

  const handleEnrollClick = (batch: StudyBatch) => {
    if (onOpenBatchPayment) {
      onOpenBatchPayment(batch);
    } else {
      onOpenStore();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* 1. Live Running Notice Ticker (बैचेस की डिटेल चलती रहनी चाहिए) */}
      {settings?.marqueeNotice && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-zinc-950 font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-3 overflow-hidden border border-amber-400">
          <div className="flex items-center gap-1.5 shrink-0 bg-zinc-950 text-amber-300 text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-lg">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>लाइव सूचना (Notice)</span>
          </div>
          <div className="overflow-hidden relative w-full flex-1">
            <div className="whitespace-nowrap inline-block animate-marquee text-xs sm:text-sm font-bold text-zinc-950">
              {settings.marqueeNotice}
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => onNavigate('sec-admin')}
              className="shrink-0 bg-white/90 hover:bg-white text-zinc-900 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
              title="एडमिन पैनल से नोटिस एडिट करें"
            >
              <Edit3 className="w-3 h-3" />
              <span className="hidden sm:inline">एडिट</span>
            </button>
          )}
        </div>
      )}

      {/* 2. Top Header with App Name & Admin Controls */}
      <div className="border-b-2 border-zinc-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1b5e20] tracking-tight">
              {settings?.appName || 'Target State Exam'}
            </h2>
            <span className="bg-emerald-100 text-[#1b5e20] text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
              लाइव बैचेस
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 font-medium">
            {settings?.bannerDescription || 'UPSSSC AGTA एवं राज्य कृषि भर्ती स्पेशल बैचेस — लाइव व रिकॉर्डेड क्लासेस, हस्तलिखित नोट्स व टेस्ट सीरीज।'}
          </p>
        </div>

        {/* Admin Quick Action Buttons */}
        {isAdmin && (
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {onOpenNewBatch && (
              <button
                type="button"
                onClick={onOpenNewBatch}
                className="bg-[#1b5e20] hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>➕ नया बैच लगाएं (Add Batch)</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate('sec-admin')}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="एडमिन सेटिंग्स"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">एडमिन सेटिंग्स</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Dynamic Batches Showcase (बैचेस की पूरी जानकारी व एडिट) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#1b5e20]" />
            <span>उपलब्ध अध्ययन बैचेस (Available Courses & Batches)</span>
            <span className="text-xs bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded-full font-bold">
              {batches.length} बैचेस
            </span>
          </h3>

          <span className="text-xs text-zinc-500 font-medium hidden sm:inline">
            100% सिलेबस ओरिएंटेड डिजिटल क्लासेस व नोट्स
          </span>
        </div>

        {batches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center space-y-3">
            <GraduationCap className="w-12 h-12 text-zinc-400 mx-auto" />
            <h4 className="text-base font-bold text-zinc-800">अभी कोई बैच उपलब्ध नहीं है</h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              एडमिन पैनल से नया बैच जोड़ें या सेटिंग्स चेक करें।
            </p>
            {isAdmin && onOpenNewBatch && (
              <button
                onClick={onOpenNewBatch}
                className="bg-[#1b5e20] text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                ➕ नया बैच जोड़ें
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {batches.map((batch) => {
              const matchedFolder = folders.find(f => f.id === batch.folderId);
              const folderPdfs = matchedFolder 
                ? pdfs.filter(p => p.folderId === matchedFolder.id || p.subject === matchedFolder.name)
                : [];
              const folderVideos = matchedFolder 
                ? videos.filter(v => v.folderId === matchedFolder.id || v.subject === matchedFolder.name)
                : [];
              const folderQuizzes = matchedFolder 
                ? quizLinks.filter(q => q.folderId === matchedFolder.id || q.subject === matchedFolder.name)
                : [];
              const totalItemsInFolder = folderPdfs.length + folderVideos.length + folderQuizzes.length;
              const isUserEnrolled = hasPurchasedBatch || isAdmin || (currentUser && batch.enrolledStudents.includes(currentUser.email));

              return (
                <div
                  key={batch.id}
                  className="bg-white rounded-2xl shadow-xs border border-zinc-200 border-t-4 border-t-[#1b5e20] p-5 sm:p-7 space-y-5 transition-all hover:shadow-md relative"
                >
                  {/* Top Bar: Badge, Enrolled Count & Admin Action Icons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>{batch.badge || '⭐ Bestseller'}</span>
                      </span>

                      <span className="text-xs text-zinc-600 bg-zinc-100 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{batch.enrolledStudents.length + 120} छात्र एनरोल्ड हैं</span>
                      </span>

                      {batch.discountPercentage > 0 && (
                        <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-full">
                          {batch.discountPercentage}% भारी छूट (Save ₹{batch.originalPrice - batch.price})
                        </span>
                      )}
                    </div>

                    {/* Admin Action Bar directly on batch card */}
                    {isAdmin && (
                      <div className="flex items-center gap-2 bg-zinc-50 p-1.5 rounded-xl border border-zinc-200 shrink-0">
                        {onEditBatch && (
                          <button
                            type="button"
                            onClick={() => onEditBatch(batch)}
                            className="text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="बैच का नाम, फीस व लिंक बदलें"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                            <span>बैच एडिट करें</span>
                          </button>
                        )}
                        {onDeleteBatch && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`क्या आप वाकई "${batch.name}" बैच को डिलीट करना चाहते हैं?`)) {
                                onDeleteBatch(batch.id);
                              }
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                            title="बैच हटाएं"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Batch Title, Tagline & Description */}
                  <div className="space-y-2">
                    <h4 className="text-xl sm:text-2xl font-black text-[#1b5e20]">
                      {batch.name}
                    </h4>
                    {batch.tagline && (
                      <p className="text-sm font-semibold text-zinc-800">
                        {batch.tagline}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-3xl">
                      {batch.description}
                    </p>
                  </div>

                  {/* LINKED FOLDER INFO BOX (पेड बैच के अंदर सेहरा एक फोल्डर होना चाहिए) */}
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-[#1b5e20]" />
                        <span className="text-xs font-bold text-emerald-950">
                          इस बैच से जुड़ा स्टडी फ़ोल्डर (Linked Study Folder):
                        </span>
                        <span className="text-xs font-black text-[#1b5e20] bg-white px-2 py-0.5 rounded border border-emerald-300">
                          {matchedFolder?.name || batch.folderName || 'समस्त कृषि विषय व परीक्षा नोट्स'}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-600">
                        इस बैच में एडमिशन लेने वाले छात्रों को इस फ़ोल्डर की सभी अध्ययन सामग्रियां प्राप्त होती हैं।
                      </p>
                    </div>

                    {matchedFolder && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 shrink-0">
                        <span className="bg-white px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 text-[11px]">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          {folderPdfs.length} PDFs
                        </span>
                        <span className="bg-white px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 text-[11px]">
                          <Video className="w-3.5 h-3.5 text-red-600" />
                          {folderVideos.length} Videos
                        </span>
                        <span className="bg-white px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 text-[11px]">
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                          {folderQuizzes.length} Tests
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Features Checklist */}
                  {batch.features && batch.features.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                        बैच की मुख्य विशेषताएं (What You Get):
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {batch.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-zinc-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="font-medium">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pricing Row & Quick Adjuster & CTA Button */}
                  <div className="pt-4 border-t border-zinc-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Price and Live Adjuster */}
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black text-[#1b5e20]">
                          ₹{batch.price}
                        </span>
                        {batch.originalPrice > batch.price && (
                          <span className="text-base text-zinc-400 line-through font-semibold">
                            ₹{batch.originalPrice}
                          </span>
                        )}
                        <span className="text-xs text-zinc-500 font-semibold">
                          (एकमुश्त फीस, पूर्ण वैधता परीक्षा तक)
                        </span>
                      </div>

                      {/* Admin Quick Price Steppers (कितने प्राइस घटा सकते हैं, बढ़ा सकते हैं) */}
                      {isAdmin && onQuickAdjustPrice && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-bold text-zinc-600 flex items-center gap-1 mr-1">
                            <TrendingUp className="w-3 h-3 text-emerald-700" />
                            <span>प्राइस बदलें:</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => onQuickAdjustPrice(batch.id, -50)}
                            className="text-[10px] font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                            title="₹50 घटाएं"
                          >
                            - ₹50
                          </button>
                          <button
                            type="button"
                            onClick={() => onQuickAdjustPrice(batch.id, -10)}
                            className="text-[10px] font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                            title="₹10 घटाएं"
                          >
                            - ₹10
                          </button>
                          <button
                            type="button"
                            onClick={() => onQuickAdjustPrice(batch.id, 10)}
                            className="text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                            title="₹10 बढ़ाएं"
                          >
                            + ₹10
                          </button>
                          <button
                            type="button"
                            onClick={() => onQuickAdjustPrice(batch.id, 50)}
                            className="text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                            title="₹50 बढ़ाएं"
                          >
                            + ₹50
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Action CTA Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {matchedFolder && (
                        <button
                          type="button"
                          onClick={() => handleOpenBatchFolder(batch)}
                          className="text-xs font-bold text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Folder className="w-4 h-4 text-zinc-600" />
                          <span>स्टडी सामग्री देखें</span>
                        </button>
                      )}

                      {isUserEnrolled ? (
                        <button
                          type="button"
                          onClick={() => onNavigate('sec-mycourse')}
                          className="bg-[#1b5e20] hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>माई कोर्सेज में जाएं (Enrolled)</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleEnrollClick(batch)}
                          className="bg-[#f57c00] hover:bg-[#e65100] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>अभी एडमिशन लें @ ₹{batch.price} Only</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Support & Direct Admission Helpline */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>एडमिशन सहायता व आधिकारिक सहायता केंद्र</span>
          </h4>
          <p className="text-xs text-zinc-600">
            किसी भी तकनीकी समस्या या पेमेंट वेरिफिकेशन हेतु सहायता टीम से तुरंत संपर्क करें:
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-700 pt-1">
            <span>📧 {settings?.helplineEmail || 'ahlawatprashantchaudhary@gmail.com'}</span>
            <span>📱 {settings?.supportPhone || '+91 9876543210'}</span>
            <span>💳 UPI: <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono">{settings?.upiId || 'ahlawatprashantchaudhary@okaxis'}</code></span>
          </div>
        </div>

        {settings?.telegramChannel && (
          <a
            href={settings.telegramChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shrink-0 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span>टेलीग्राम चैनल से जुड़ें</span>
          </a>
        )}
      </div>
    </div>
  );
};
