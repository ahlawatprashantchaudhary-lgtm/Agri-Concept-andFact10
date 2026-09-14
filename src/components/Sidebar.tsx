import React from 'react';
import { 
  Home, 
  Video, 
  FileText, 
  CheckSquare, 
  Sparkles, 
  Briefcase, 
  Lock, 
  Unlock, 
  Sprout,
  X,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { User, ActiveSection, AppSettings } from '../types';

interface SidebarProps {
  activeSection: ActiveSection;
  onSelectSection: (section: ActiveSection) => void;
  currentUser: User | null;
  hasPurchasedBatch: boolean;
  onOpenLoginModal: () => void;
  onOpenSignupModal: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  settings?: AppSettings;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  currentUser,
  hasPurchasedBatch,
  onOpenLoginModal,
  onOpenSignupModal,
  isOpenMobile,
  onCloseMobile,
  settings
}) => {
  const isAdmin = Boolean(
    currentUser &&
    currentUser.email.toLowerCase().trim() === 'ahlawatprashantchaudhary@gmail.com'
  );

  const avatarLetter = currentUser ? currentUser.name.charAt(0).toUpperCase() : 'G';
  const studentName = currentUser ? currentUser.name : 'Guest Student';

  const handleMyCoursesClick = () => {
    if (!currentUser) {
      alert('Please Login or Sign Up first to view your enrolled courses.');
      onOpenLoginModal();
      return;
    }
    if (!hasPurchasedBatch) {
      alert('You have not enrolled in any paid batch yet. Opening the batch details for you!');
      onSelectSection('sec-store');
      return;
    }
    onSelectSection('sec-mycourse');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#113615] text-[#f5f5f5] flex flex-col transition-transform duration-300 ease-in-out shrink-0 border-r border-emerald-950/50 select-none ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Banner */}
        <div className="p-4 bg-[#0c260f] border-b border-emerald-900/40 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-700/80 flex items-center justify-center text-emerald-200 shadow-inner">
                <Sprout className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h2 className="text-base font-bold text-emerald-200 leading-tight">
                  Agri Concept & Fact
                </h2>
                <p className="text-[11px] font-medium text-emerald-400/90 tracking-wide">
                  {settings?.subTitle || "Target State Exam & Agriculture Exam"}
                </p>
              </div>
            </div>
            <button
              onClick={onCloseMobile}
              className="md:hidden text-zinc-400 hover:text-white p-1 rounded-md"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="p-4 border-b border-emerald-900/40 flex items-center gap-3 bg-[#133d17]/40">
          <div className="w-10 h-10 rounded-full bg-[#4caf50] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0 ring-2 ring-emerald-400/30">
            {avatarLetter}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-white truncate leading-tight">
              {studentName}
            </h4>
            {currentUser ? (
              <p className="text-xs text-amber-300 flex items-center gap-1 mt-0.5 font-medium">
                {isAdmin ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span className="font-bold text-amber-300">Portal Administrator</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span>{hasPurchasedBatch ? 'Premium AGTA Batch' : 'Registered Student'}</span>
                  </>
                )}
              </p>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <button
                  id="btn-sidebar-signup"
                  onClick={() => {
                    onOpenSignupModal();
                    onCloseMobile();
                  }}
                  className="text-[11px] bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100 px-2 py-0.5 rounded font-medium transition-colors cursor-pointer"
                >
                  Sign Up
                </button>
                <button
                  id="btn-sidebar-login-prompt"
                  onClick={() => {
                    onOpenLoginModal();
                    onCloseMobile();
                  }}
                  className="text-[11px] text-emerald-300 hover:text-white underline font-medium cursor-pointer"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-4 px-2">
          {/* Main Dashboard */}
          <div>
            <p className="px-3 text-[11px] font-semibold text-emerald-400/70 uppercase tracking-wider mb-1">
              Main Dashboard
            </p>
            <button
              id="nav-btn-home"
              onClick={() => {
                onSelectSection('sec-home');
                onCloseMobile();
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${
                activeSection === 'sec-home'
                  ? 'bg-[#4caf50] text-white shadow-sm border-l-4 border-[#f57c00]'
                  : 'text-zinc-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Home Overview</span>
            </button>
          </div>

          {/* Free Resources */}
          <div>
            <p className="px-3 text-[11px] font-semibold text-emerald-400/70 uppercase tracking-wider mb-1">
              Free Resources
            </p>
            <div className="space-y-1">
              <button
                id="nav-btn-video"
                onClick={() => {
                  onSelectSection('sec-video');
                  onCloseMobile();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${
                  activeSection === 'sec-video'
                    ? 'bg-[#4caf50] text-white shadow-sm border-l-4 border-[#f57c00]'
                    : 'text-zinc-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4 shrink-0" />
                <span>Video Classes</span>
              </button>

              <button
                id="nav-btn-pdf"
                onClick={() => {
                  onSelectSection('sec-pdf');
                  onCloseMobile();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${
                  activeSection === 'sec-pdf'
                    ? 'bg-[#4caf50] text-white shadow-sm border-l-4 border-[#f57c00]'
                    : 'text-zinc-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>PDF Notes</span>
              </button>

              <button
                id="nav-btn-quiz"
                onClick={() => {
                  onSelectSection('sec-quiz');
                  onCloseMobile();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${
                  activeSection === 'sec-quiz'
                    ? 'bg-[#4caf50] text-white shadow-sm border-l-4 border-[#f57c00]'
                    : 'text-zinc-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <CheckSquare className="w-4 h-4 shrink-0" />
                <span>Daily Quiz</span>
              </button>
            </div>
          </div>

          {/* Premium Area */}
          <div>
            <p className="px-3 text-[11px] font-semibold text-amber-400/80 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Premium Area</span>
            </p>
            <div className="space-y-1">
              <button
                id="nav-btn-store"
                onClick={() => {
                  onSelectSection('sec-store');
                  onCloseMobile();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                  activeSection === 'sec-store'
                    ? 'bg-[#4caf50] text-white shadow-sm border-l-4 border-[#f57c00]'
                    : 'text-amber-300 hover:bg-white/5 hover:text-amber-200'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Paid Batches</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded font-semibold border border-amber-500/30">
                  ₹99 Offer
                </span>
              </button>

              <button
                id="nav-btn-mycourses"
                onClick={() => {
                  handleMyCoursesClick();
                  onCloseMobile();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                  activeSection === 'sec-mycourse'
                    ? 'bg-[#4caf50] text-white shadow-sm border-l-4 border-[#f57c00]'
                    : 'text-zinc-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>My Courses</span>
                </span>
                {hasPurchasedBatch ? (
                  <Unlock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                )}
              </button>
            </div>
          </div>

          {/* Admin Exclusive Area (Only visible when logged in as Admin) */}
          {isAdmin && (
            <div className="pt-2 border-t border-emerald-900/60">
              <p className="px-3 text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Controls</span>
              </p>
              <button
                id="nav-btn-admin"
                onClick={() => {
                  onSelectSection('sec-admin');
                  onCloseMobile();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between transition-colors ${
                  activeSection === 'sec-admin'
                    ? 'bg-amber-500 text-zinc-950 shadow-sm border-l-4 border-amber-700 font-bold'
                    : 'text-amber-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Sliders className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Upload Study Material</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-400/20 text-amber-300 rounded font-mono font-bold">
                  ADMIN
                </span>
              </button>
            </div>
          )}
        </nav>

        {/* Footer Support Tag */}
        <div className="p-3 bg-[#0a1e0d] border-t border-emerald-950 text-center">
          <p className="text-[11px] text-emerald-400/90 font-medium">
            Helpline: {settings?.helplineEmail || "ahlawatprashantchaudhary@gmail.com"}
          </p>
          <p className="text-[10px] text-emerald-500/80 mt-0.5 font-semibold">
            {settings?.appName || "Target State Exam"}
          </p>
        </div>
      </aside>
    </>
  );
};
