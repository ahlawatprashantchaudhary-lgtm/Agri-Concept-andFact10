import React from 'react';
import { Menu, LogIn, LogOut, UserCheck, ShieldCheck, UserPlus, RefreshCw, FolderPlus } from 'lucide-react';
import { User, ActiveSection, AppSettings } from '../types';

interface TopbarProps {
  activeSection: ActiveSection;
  currentUser: User | null;
  hasPurchasedBatch: boolean;
  onOpenLoginModal: () => void;
  onOpenSignupModal: () => void;
  onLogout: () => void;
  onToggleMobileMenu: () => void;
  onRefreshMaterials?: () => void;
  isSyncing?: boolean;
  onOpenNewFolderModal?: () => void;
  settings?: AppSettings;
}

const SECTION_TITLES: Record<ActiveSection, string> = {
  'sec-home': 'Welcome to Learning Portal',
  'sec-video': 'Free Video Classes & Demos',
  'sec-pdf': 'Free PDF Revision Materials',
  'sec-quiz': 'HTML Digital Daily Quiz',
  'sec-store': 'Target State Exam & Agriculture Batch',
  'sec-mycourse': 'My Premium Courses & Mock Papers',
  'sec-admin': 'Portal Administrator - Management & Upload'
};

export const Topbar: React.FC<TopbarProps> = ({
  activeSection,
  currentUser,
  hasPurchasedBatch,
  onOpenLoginModal,
  onOpenSignupModal,
  onLogout,
  onToggleMobileMenu,
  onRefreshMaterials,
  isSyncing = false,
  onOpenNewFolderModal,
  settings
}) => {
  const isAdmin = Boolean(
    currentUser &&
    currentUser.email.toLowerCase().trim() === 'ahlawatprashantchaudhary@gmail.com'
  );

  return (
    <header className="bg-white border-b border-zinc-200 h-15 shrink-0 px-4 md:px-6 flex items-center justify-between shadow-xs z-20 sticky top-0">
      <div className="flex items-center gap-3">
        <button
          id="btn-mobile-hamburger"
          onClick={onToggleMobileMenu}
          className="md:hidden text-zinc-600 hover:text-zinc-900 p-1.5 -ml-1.5 rounded-md hover:bg-zinc-100"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 id="topbar-title" className="text-base md:text-lg font-bold text-[#1b5e20] leading-tight">
            {SECTION_TITLES[activeSection]}
          </h1>
          <p className="text-[11px] text-zinc-500 hidden sm:block">
            {settings?.subTitle || 'Target State Exam & Agriculture Exam'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sync / Refresh Button */}
        {onRefreshMaterials && (
          <button
            onClick={onRefreshMaterials}
            disabled={isSyncing}
            className="p-1.5 text-zinc-600 hover:text-[#1b5e20] hover:bg-zinc-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="रिफ्रेश करें (Sync latest data from server)"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#1b5e20]' : ''}`} />
            <span className="hidden lg:inline text-[11px]">Sync Data</span>
          </button>
        )}

        {/* Admin Quick Action: New Folder */}
        {isAdmin && onOpenNewFolderModal && (
          <button
            onClick={onOpenNewFolderModal}
            className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
            title="नया फोल्डर बनाएं"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">नया फोल्डर</span>
          </button>
        )}

        {isAdmin && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            Admin Mode
          </span>
        )}

        {hasPurchasedBatch && !isAdmin && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-[#1b5e20] border border-emerald-200 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Batch Unlocked
          </span>
        )}

        {currentUser ? (
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              {currentUser.name}
            </span>
            <button
              id="btn-top-logout"
              onClick={onLogout}
              className="bg-[#d32f2f] hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              id="btn-top-signup"
              onClick={onOpenSignupModal}
              className="bg-emerald-50 hover:bg-emerald-100 text-[#1b5e20] border border-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up (खाता बनाएं)</span>
            </button>
            <button
              id="btn-top-login"
              onClick={onOpenLoginModal}
              className="bg-[#1b5e20] hover:bg-emerald-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
