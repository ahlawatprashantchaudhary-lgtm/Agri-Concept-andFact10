import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen, 
  ArrowRight,
  Star,
  Plus,
  Edit3,
  Trash2,
  TrendingUp,
  TrendingDown,
  Folder,
  Send
} from 'lucide-react';
import { DEFAULT_BATCHES } from '../data/portalData';
import { StudyBatch, StudyFolder, User } from '../types';

interface StoreSectionProps {
  hasPurchasedBatch: boolean;
  onAttemptPurchase: () => void;
  onNavigateMyCourses: () => void;
  batches?: StudyBatch[];
  folders?: StudyFolder[];
  currentUser?: User | null;
  isAdmin?: boolean;
  onOpenNewBatch?: () => void;
  onEditBatch?: (batch: StudyBatch) => void;
  onDeleteBatch?: (id: string) => void;
  onQuickAdjustPrice?: (batchId: string, delta: number) => void;
}

export const StoreSection: React.FC<StoreSectionProps> = ({
  hasPurchasedBatch,
  onAttemptPurchase,
  onNavigateMyCourses,
  batches = DEFAULT_BATCHES,
  folders = [],
  currentUser,
  isAdmin = false,
  onOpenNewBatch,
  onEditBatch,
  onDeleteBatch,
  onQuickAdjustPrice
}) => {
  const activeBatches = batches && batches.length > 0 ? batches : DEFAULT_BATCHES;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Section Header with Admin Quick Actions */}
      <div className="border-b-2 border-zinc-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#f57c00] flex items-center gap-2">
            <span>⭐ All Batches & Courses (सभी बैचेस)</span>
          </h2>
          <p className="text-sm text-zinc-600 mt-1">
            UPSSSC AGTA aur State Exam ke sabhi premium batches yahan uplabdh hain. Admin ID se sabhi batch details aur price edit karein.
          </p>
        </div>

        {isAdmin && onOpenNewBatch && (
          <button
            onClick={onOpenNewBatch}
            className="bg-[#1b5e20] hover:bg-[#154a19] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>➕ नया बैच लगाएं</span>
          </button>
        )}
      </div>

      {/* Admin Notice Bar */}
      {isAdmin && (
        <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>
              <strong>एडमिन कंट्रोल:</strong> आप किसी भी बैच की फीस (Price), नाम, फोल्डर, फीचर्स, डिस्काउंट आदि सीधे <strong>"✏️ एडिट"</strong> बटन या <strong>+ / -</strong> बटन से तुरंत बदल सकते हैं।
            </span>
          </div>
          {onOpenNewBatch && (
            <button
              onClick={onOpenNewBatch}
              className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-md font-bold text-[11px] cursor-pointer"
            >
              + नया बैच
            </button>
          )}
        </div>
      )}

      {/* Batches Grid / List */}
      <div className="space-y-6">
        {activeBatches.map((batch) => {
          const linkedFolder = folders.find(f => f.id === batch.folderId);
          const discountPercent = batch.originalPrice && batch.originalPrice > batch.price 
            ? Math.round(((batch.originalPrice - batch.price) / batch.originalPrice) * 100)
            : 0;

          return (
            <div 
              key={batch.id}
              className="bg-white rounded-xl shadow-xs border border-zinc-200 border-t-4 border-t-[#f57c00] p-6 sm:p-7 space-y-6 relative hover:shadow-sm transition-all"
            >
              {/* Top Banner Row */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-zinc-200">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {batch.badge && (
                      <span className="bg-amber-100 text-[#f57c00] text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                        {batch.badge}
                      </span>
                    )}
                    <span className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      4.9/5 Rating (1,200+ Aspirants)
                    </span>
                    {linkedFolder && (
                      <span className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <Folder className="w-3 h-3 text-emerald-600" />
                        <span>स्टडी फोल्डर: {linkedFolder.name}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-[#1b5e20]">
                    {batch.name || batch.title}
                  </h3>
                  <p className="text-sm text-zinc-600">
                    {batch.tagline || batch.description}
                  </p>

                  <div className="flex items-baseline gap-3 pt-1">
                    <span className="text-3xl font-extrabold text-[#d32f2f]">
                      ₹{batch.price}
                    </span>
                    {batch.originalPrice && (
                      <span className="text-base text-zinc-400 line-through">
                        ₹{batch.originalPrice}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        SAVE {discountPercent}% TODAY
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Side: Buy / Enrolled / Admin controls */}
                <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3">
                  {!hasPurchasedBatch ? (
                    <div className="w-full sm:w-auto">
                      <button
                        onClick={onAttemptPurchase}
                        className="w-full sm:w-auto bg-[#f57c00] hover:bg-[#e65100] text-white font-bold text-base px-8 py-3 rounded-lg shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>Buy Now @ ₹{batch.price}</span>
                      </button>
                      <p className="text-[11px] text-zinc-500 text-center lg:text-right mt-1.5">
                        Instant Access • 100% Secure Checkout
                      </p>
                    </div>
                  ) : (
                    <div className="w-full sm:w-auto bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center sm:text-left">
                      <p className="text-sm text-emerald-800 font-bold flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Batch Already Unlocked & Active</span>
                      </p>
                      <button
                        onClick={onNavigateMyCourses}
                        className="w-full bg-[#1b5e20] hover:bg-[#4caf50] text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Go to My Courses</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* ADMIN CONTROLS FOR THIS BATCH */}
                  {isAdmin && (
                    <div className="w-full bg-amber-50/80 border border-amber-300 p-2.5 rounded-lg space-y-2 mt-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-amber-900">
                          ⚙️ Admin Batch Actions:
                        </span>
                        <div className="flex items-center gap-1.5">
                          {onEditBatch && (
                            <button
                              type="button"
                              onClick={() => onEditBatch(batch)}
                              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors"
                              title="बैच का नाम, फीस और डिटेल एडिट करें"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>एडिट करें</span>
                            </button>
                          )}
                          {onDeleteBatch && activeBatches.length > 1 && (
                            <button
                              type="button"
                              onClick={() => onDeleteBatch(batch.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold p-1 rounded cursor-pointer transition-colors"
                              title="बैच हटाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Quick Price Adjuster */}
                      {onQuickAdjustPrice && (
                        <div className="pt-1 border-t border-amber-200/80 flex items-center justify-between gap-1 flex-wrap">
                          <span className="text-[10px] font-bold text-zinc-600">
                            फीस बदलें (Quick Price):
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onQuickAdjustPrice(batch.id, -50)}
                              className="bg-white hover:bg-zinc-100 text-red-700 font-extrabold text-[11px] px-1.5 py-0.5 rounded border border-zinc-300 cursor-pointer"
                              title="घटाएं ₹50"
                            >
                              -50
                            </button>
                            <button
                              type="button"
                              onClick={() => onQuickAdjustPrice(batch.id, -10)}
                              className="bg-white hover:bg-zinc-100 text-red-700 font-extrabold text-[11px] px-1.5 py-0.5 rounded border border-zinc-300 cursor-pointer"
                              title="घटाएं ₹10"
                            >
                              -10
                            </button>
                            <span className="text-xs font-bold text-zinc-900 px-1">
                              ₹{batch.price}
                            </span>
                            <button
                              type="button"
                              onClick={() => onQuickAdjustPrice(batch.id, 10)}
                              className="bg-white hover:bg-zinc-100 text-emerald-700 font-extrabold text-[11px] px-1.5 py-0.5 rounded border border-zinc-300 cursor-pointer"
                              title="बढ़ाएं ₹10"
                            >
                              +10
                            </button>
                            <button
                              type="button"
                              onClick={() => onQuickAdjustPrice(batch.id, 50)}
                              className="bg-white hover:bg-zinc-100 text-emerald-700 font-extrabold text-[11px] px-1.5 py-0.5 rounded border border-zinc-300 cursor-pointer"
                              title="बढ़ाएं ₹50"
                            >
                              +50
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* What You Get in This Batch */}
              {batch.features && batch.features.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#1b5e20]" />
                    <span>Complete Batch Deliverables & Highlights</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {batch.features.map((feat, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-50 border border-zinc-100 text-xs sm:text-sm text-zinc-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Syllabus Coverage */}
              {batch.syllabusTopics && batch.syllabusTopics.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#1b5e20]" />
                    <span>Subjects & Modules Covered</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {batch.syllabusTopics.map((sub, index) => (
                      <div
                        key={index}
                        className="p-2.5 rounded-md border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 flex items-center gap-2"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] shrink-0">
                          {index + 1}
                        </span>
                        <span className="truncate">{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Telegram Community Link if available */}
              {batch.telegramLink && (
                <div className="pt-2">
                  <a
                    href={batch.telegramLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#0288d1] bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-lg hover:bg-sky-100 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Join Official Batch Telegram Group / Doubt Channel</span>
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
