import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Sparkles, 
  Gift, 
  Edit3, 
  Trash2, 
  Plus, 
  ExternalLink,
  Folder
} from 'lucide-react';
import { FREE_VIDEOS } from '../data/portalData';
import { VideoLesson, StudyFolder } from '../types';

interface VideoSectionProps {
  videos?: VideoLesson[];
  folders?: StudyFolder[];
  isAdmin?: boolean;
  onOpenStore?: () => void;
  hasPurchasedBatch?: boolean;
  onNavigateMyCourses?: () => void;
  onEditVideo?: (video: VideoLesson) => void;
  onDeleteVideo?: (id: string) => void;
  onOpenUploadVideo?: () => void;
  onOpenNewFolder?: () => void;
  onEditFolder?: (folder: StudyFolder) => void;
}

// Helper to extract YouTube embed URL
function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  return null;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  videos = FREE_VIDEOS,
  folders = [],
  isAdmin = false,
  onOpenStore,
  hasPurchasedBatch = false,
  onNavigateMyCourses,
  onEditVideo,
  onDeleteVideo,
  onOpenUploadVideo,
  onOpenNewFolder,
  onEditFolder
}) => {
  const currentList = videos && videos.length > 0 ? videos : FREE_VIDEOS;
  const [filterType, setFilterType] = useState<'all' | 'free' | 'paid'>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');

  const freeCount = currentList.filter(v => !v.isPaid && v.targetBatch !== 'paid').length;
  const paidCount = currentList.filter(v => v.isPaid || v.targetBatch === 'paid').length;

  const filteredList = currentList.filter(vid => {
    // Filter by type
    if (filterType === 'free' && (vid.isPaid || vid.targetBatch === 'paid')) return false;
    if (filterType === 'paid' && (!vid.isPaid && vid.targetBatch !== 'paid')) return false;

    // Filter by folder
    if (selectedFolderId !== 'all') {
      const targetFolder = folders.find(f => f.id === selectedFolderId);
      if (targetFolder) {
        if (vid.folderId && vid.folderId === selectedFolderId) return true;
        if (vid.subject && (vid.subject === targetFolder.name || targetFolder.name.includes(vid.subject) || vid.subject.includes(targetFolder.name))) return true;
        return false;
      }
    }

    return true;
  });

  const [selectedVideo, setSelectedVideo] = useState<VideoLesson>(filteredList[0] || currentList[0]);

  // Keep selectedVideo in sync if filter or list updates
  useEffect(() => {
    if (!filteredList.some(v => v.id === selectedVideo?.id)) {
      if (filteredList.length > 0) {
        setSelectedVideo(filteredList[0]);
      }
    }
  }, [filterType, selectedFolderId, filteredList, selectedVideo?.id]);

  const isCurrentPaid = selectedVideo?.isPaid || selectedVideo?.targetBatch === 'paid';
  const embedUrl = selectedVideo ? getEmbedUrl(selectedVideo.videoUrl) : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="border-b-2 border-zinc-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#1b5e20] flex items-center gap-2">
            <span>🎥 Agriculture Video Classes</span>
          </h2>
          <p className="text-sm text-zinc-600 mt-1">
            Watch concept lectures and marathon revision classes prepared for UPSSSC AGTA aspirants.
          </p>
        </div>

        {/* Filter and Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && onOpenUploadVideo && (
            <button
              onClick={onOpenUploadVideo}
              className="bg-[#1b5e20] hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>नया वीडियो जोड़ें</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-zinc-200/80 p-1 rounded-xl self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'text-zinc-700 hover:text-zinc-900'
              }`}
            >
              All Videos ({currentList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('free')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterType === 'free'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'text-zinc-700 hover:text-zinc-900'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Free ({freeCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType('paid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterType === 'paid'
                  ? 'bg-[#f57c00] text-white shadow-xs'
                  : 'text-zinc-700 hover:text-zinc-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AGTA Paid ({paidCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Folders filter with Admin folder controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2.5 rounded-xl border border-zinc-200">
        <span className="text-xs font-bold text-zinc-600 shrink-0 flex items-center gap-1">
          <Folder className="w-3.5 h-3.5 text-[#1b5e20]" />
          <span>विषय फ़ोल्डर:</span>
        </span>
        <button
          onClick={() => setSelectedFolderId('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
            selectedFolderId === 'all'
              ? 'bg-[#1b5e20] text-white'
              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
          }`}
        >
          सभी (All)
        </button>
        {folders.map(f => (
          <button
            key={f.id}
            onClick={() => setSelectedFolderId(f.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              selectedFolderId === f.id
                ? 'bg-[#1b5e20] text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            {f.name}
          </button>
        ))}

        {isAdmin && (
          <div className="flex items-center gap-1 ml-auto shrink-0 pl-2 border-l border-zinc-200">
            {onOpenNewFolder && (
              <button
                onClick={onOpenNewFolder}
                className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer whitespace-nowrap"
                title="नया फ़ोल्डर जोड़ें"
              >
                <Plus className="w-3 h-3" />
                <span>नया फ़ोल्डर</span>
              </button>
            )}
            {onEditFolder && selectedFolderId !== 'all' && (
              <button
                onClick={() => {
                  const targetFolder = folders.find(f => f.id === selectedFolderId);
                  if (targetFolder) onEditFolder(targetFolder);
                }}
                className="bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer whitespace-nowrap"
                title="वर्तमान फ़ोल्डर का नाम बदलें"
              >
                <Edit3 className="w-3 h-3" />
                <span>फ़ोल्डर एडिट</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Playlist Selector Buttons */}
      <div className="flex flex-wrap gap-2">
        {filteredList.map((vid) => {
          const isSelected = selectedVideo && vid.id === selectedVideo.id;
          const isPaid = vid.isPaid || vid.targetBatch === 'paid';
          return (
            <button
              key={vid.id}
              onClick={() => setSelectedVideo(vid)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#1b5e20] text-white shadow-xs ring-2 ring-[#1b5e20]/30'
                  : 'bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-[200px]">{vid.title}</span>
              {isPaid ? (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  isSelected ? 'bg-amber-400 text-black' : 'bg-amber-100 text-amber-900'
                }`}>
                  ⭐ Paid
                </span>
              ) : (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  🎁 Free
                </span>
              )}
              <span className="text-[10px] opacity-80 bg-black/10 px-1.5 py-0.2 rounded">
                {vid.duration}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Video Player Card */}
      {selectedVideo ? (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 border-t-4 border-t-[#4caf50] p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                {isCurrentPaid ? (
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>⭐ UPSSSC AGTA Paid Batch Lecture</span>
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-emerald-600" />
                    <span>🎁 Free Video Class</span>
                  </span>
                )}
                <span className="text-xs font-bold text-[#1b5e20] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  {selectedVideo.subject}
                </span>
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {selectedVideo.duration}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-zinc-900">
                {selectedVideo.title}
              </h3>
            </div>

            {/* Admin Controls for this Video */}
            {isAdmin && (
              <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
                {onEditVideo && (
                  <button
                    onClick={() => onEditVideo(selectedVideo)}
                    className="px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded flex items-center gap-1 cursor-pointer"
                    title="एडिट करें"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>एडिट वीडियो</span>
                  </button>
                )}
                {onDeleteVideo && (
                  <button
                    onClick={() => {
                      if (confirm(`क्या आप "${selectedVideo.title}" वीडियो हटाना चाहते हैं?`)) {
                        onDeleteVideo(selectedVideo.id);
                      }
                    }}
                    className="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 rounded flex items-center gap-1 cursor-pointer"
                    title="हटाएं"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>हटाएं</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Video Player: Supports YouTube Embed, HTML5 MP4, or Fallback */}
          <div className="relative rounded-lg overflow-hidden bg-black aspect-video max-h-[480px] w-full shadow-inner flex items-center justify-center">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                key={selectedVideo.id}
                controls
                controlsList="nodownload"
                poster=""
                className="w-full h-full object-contain"
              >
                <source src={selectedVideo.videoUrl} type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            )}
          </div>

          {/* External video link fallback */}
          {selectedVideo.videoUrl && (
            <div className="flex items-center justify-end">
              <a
                href={selectedVideo.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#1b5e20] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>वीडियो को सीधे नए टैब में खोलें (Direct Video Link)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Video Details and Takeaways */}
          <div className="pt-2 space-y-3">
            <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 p-3 rounded-lg border border-zinc-100">
              {selectedVideo.description}
            </p>

            {selectedVideo.topics && selectedVideo.topics.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#1b5e20]" />
                  <span>मुख्य अध्ययन बिंदु (Key Exam Takeaways):</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700">
                  {selectedVideo.topics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-2 bg-emerald-50/50 p-2 rounded-md border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-[#1b5e20] shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-zinc-200 p-6 space-y-3">
          <PlayCircle className="w-12 h-12 text-zinc-300 mx-auto" />
          <h3 className="text-base font-bold text-zinc-700">
            इस श्रेणी में कोई वीडियो उपलब्ध नहीं है।
          </h3>
          {isAdmin && onOpenUploadVideo && (
            <button
              onClick={onOpenUploadVideo}
              className="bg-[#1b5e20] text-white text-xs font-bold px-4 py-2 rounded-lg"
            >
              + नया वीडियो जोड़ें
            </button>
          )}
        </div>
      )}
    </div>
  );
};
