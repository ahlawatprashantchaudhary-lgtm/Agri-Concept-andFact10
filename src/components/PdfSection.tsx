import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  BookOpen, 
  Lock, 
  Sparkles, 
  Gift, 
  Edit3, 
  Trash2, 
  Folder, 
  FolderPlus, 
  Layers,
  Plus
} from 'lucide-react';
import { FREE_PDFS } from '../data/portalData';
import { StudyPdf, StudyFolder } from '../types';

interface PdfSectionProps {
  pdfs?: StudyPdf[];
  folders?: StudyFolder[];
  isAdmin?: boolean;
  onOpenPdfReader: (pdf: StudyPdf) => void;
  hasPurchasedBatch?: boolean;
  onOpenStore?: () => void;
  onNavigateMyCourses?: () => void;
  onEditPdf?: (pdf: StudyPdf) => void;
  onDeletePdf?: (id: string) => void;
  onOpenUploadPdf?: () => void;
  onOpenNewFolder?: () => void;
  onEditFolder?: (folder: StudyFolder) => void;
}

export const PdfSection: React.FC<PdfSectionProps> = ({ 
  pdfs = FREE_PDFS,
  folders = [],
  isAdmin = false,
  onOpenPdfReader,
  hasPurchasedBatch = false,
  onOpenStore,
  onNavigateMyCourses,
  onEditPdf,
  onDeletePdf,
  onOpenUploadPdf,
  onOpenNewFolder,
  onEditFolder
}) => {
  const currentList = pdfs && pdfs.length > 0 ? pdfs : FREE_PDFS;
  const [filterType, setFilterType] = useState<'all' | 'free' | 'paid'>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');

  const freeCount = currentList.filter(p => !p.isPaid && p.targetBatch !== 'paid').length;
  const paidCount = currentList.filter(p => p.isPaid || p.targetBatch === 'paid').length;

  const displayedList = currentList.filter(pdf => {
    // Audience filter
    if (filterType === 'free' && (pdf.isPaid || pdf.targetBatch === 'paid')) return false;
    if (filterType === 'paid' && (!pdf.isPaid && pdf.targetBatch !== 'paid')) return false;

    // Folder filter
    if (selectedFolderId !== 'all') {
      const targetFolder = folders.find(f => f.id === selectedFolderId);
      if (targetFolder) {
        if (pdf.folderId && pdf.folderId === selectedFolderId) return true;
        if (pdf.subject && (pdf.subject === targetFolder.name || targetFolder.name.includes(pdf.subject) || pdf.subject.includes(targetFolder.name))) return true;
        return false;
      }
    }
    return true;
  });

  const handleDownload = (pdf: StudyPdf) => {
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
      {/* Section Header */}
      <div className="border-b-2 border-zinc-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#1b5e20] flex items-center gap-2">
            <span>📚 Agriculture PDF Notes & Study Materials</span>
          </h2>
          <p className="text-sm text-zinc-600 mt-1">
            Download and read high-yield revision fact sheets prepared strictly according to UPSSSC AGTA syllabus.
          </p>
        </div>

        {/* Action / Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && (
            <div className="flex items-center gap-1.5">
              {onOpenUploadPdf && (
                <button
                  type="button"
                  onClick={onOpenUploadPdf}
                  className="bg-[#1b5e20] hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>नया PDF जोड़ें</span>
                </button>
              )}
              {onOpenNewFolder && (
                <button
                  type="button"
                  onClick={onOpenNewFolder}
                  className="bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>नया फोल्डर</span>
                </button>
              )}
            </div>
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
              All Notes ({currentList.length})
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
              <span>Free PDFs ({freeCount})</span>
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
              <span>AGTA Paid Batch ({paidCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subject / Folder Tabs Bar */}
      {folders.length > 0 && (
        <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-zinc-700 flex items-center gap-1.5 uppercase tracking-wide">
              <Folder className="w-4 h-4 text-[#1b5e20]" />
              <span>विषय / फ़ोल्डर अनुसार देखें (Folders):</span>
            </span>
            {isAdmin && onOpenNewFolder && (
              <button
                onClick={onOpenNewFolder}
                className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>+ फोल्डर जोड़ें</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedFolderId('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedFolderId === 'all'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              सभी विषय (All Folders)
            </button>

            {folders.map((folder) => {
              const isSelected = selectedFolderId === folder.id;
              const count = currentList.filter(
                p => p.folderId === folder.id || p.subject === folder.name || folder.name.includes(p.subject)
              ).length;

              return (
                <div key={folder.id} className="relative inline-flex items-center group shrink-0">
                  <button
                    onClick={() => setSelectedFolderId(folder.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#1b5e20] text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    <span>{folder.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-600'
                    }`}>
                      {count}
                    </span>
                  </button>

                  {/* Admin Edit Folder button on hover */}
                  {isAdmin && onEditFolder && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditFolder(folder);
                      }}
                      className="ml-1 p-1 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                      title="फ़ोल्डर एडिट / नाम चेंज करें"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PDF Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedList.map((pdf) => {
          const isPaid = pdf.isPaid || pdf.targetBatch === 'paid';

          return (
            <div
              key={pdf.id}
              className={`bg-white border rounded-xl p-5 text-center shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative ${
                isPaid ? 'border-amber-300 border-t-4 border-t-[#f57c00]' : 'border-zinc-200'
              }`}
            >
              {/* Admin direct card controls */}
              {isAdmin && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 p-1 rounded-lg border border-zinc-200 shadow-xs z-10">
                  {onEditPdf && (
                    <button
                      type="button"
                      onClick={() => onEditPdf(pdf)}
                      className="p-1 text-zinc-600 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                      title="एडिट करें (Edit Title/Folder/Content)"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onDeletePdf && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`क्या आप "${pdf.title}" PDF को हटाना चाहते हैं?`)) {
                          onDeletePdf(pdf.id);
                        }
                      }}
                      className="p-1 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="हटाएं (Delete)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              <div>
                <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3 ${
                  isPaid ? 'bg-amber-50 text-[#f57c00]' : 'bg-emerald-50 text-[#1b5e20]'
                }`}>
                  <FileText className="w-7 h-7" />
                </div>

                <div className="flex items-center justify-center gap-1.5 mb-1.5 flex-wrap">
                  {isPaid ? (
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>AGTA Paid Batch</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Gift className="w-3 h-3 text-emerald-600" />
                      <span>Free Notes</span>
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full">
                    {pdf.subject}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#1b5e20] mb-1">
                  {pdf.title}
                </h3>
                <p className="text-xs text-zinc-500 font-medium mb-2">
                  {pdf.fileSize || pdf.pages} • {pdf.language || 'Hindi/English'}
                </p>
                <p className="text-xs text-zinc-600 mb-4 line-clamp-3 leading-relaxed text-left bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                  {pdf.summary}
                </p>
              </div>

              {/* Student Action Buttons - Always accessible to student! */}
              <div className="space-y-2 pt-2 border-t border-zinc-100">
                <button
                  onClick={() => onOpenPdfReader(pdf)}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-[#1b5e20] border border-emerald-300 text-xs font-bold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Eye className="w-4 h-4 text-[#1b5e20]" />
                  <span>पोर्टल में पढ़ें (Read in Portal)</span>
                </button>

                <button
                  onClick={() => handleDownload(pdf)}
                  className="w-full bg-[#1b5e20] hover:bg-emerald-800 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>डाउनलोड PDF (Download)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {displayedList.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-zinc-200 p-6 space-y-3">
          <FileText className="w-12 h-12 text-zinc-300 mx-auto" />
          <h3 className="text-base font-bold text-zinc-700">
            इस फ़ोल्डर में अभी कोई PDF उपलब्ध नहीं है।
          </h3>
          <p className="text-xs text-zinc-500">
            {isAdmin ? 'आप ऊपर "नया PDF जोड़ें" बटन से इस फ़ोल्डर में तुरंत सामग्री अपलोड कर सकते हैं।' : 'फ़ैकल्टी द्वारा जल्द ही नए नोट्स अपलोड किए जाएंगे।'}
          </p>
          {isAdmin && onOpenUploadPdf && (
            <button
              onClick={onOpenUploadPdf}
              className="bg-[#1b5e20] text-white text-xs font-bold px-4 py-2 rounded-lg"
            >
              + अभी PDF अपलोड करें
            </button>
          )}
        </div>
      )}
    </div>
  );
};
