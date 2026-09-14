import React, { useState, useRef, useEffect } from 'react';
import { 
  FileUp, 
  Video, 
  FileText, 
  HelpCircle, 
  PlusCircle, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Sparkles,
  RotateCcw,
  Eye,
  Link as LinkIcon,
  UploadCloud,
  Laptop,
  ExternalLink,
  FileCheck,
  X,
  Lock,
  Gift,
  Check,
  Award,
  Folder,
  FolderPlus,
  Edit3,
  Settings,
  Users,
  Layers,
  GraduationCap,
  DollarSign,
  Send,
  Phone,
  Mail as MailIcon,
  Database,
  RefreshCw
} from 'lucide-react';
import { 
  VideoLesson, 
  StudyPdf, 
  QuizQuestion, 
  QuizLink, 
  User, 
  StudyFolder, 
  StudyBatch, 
  RegisteredAccount, 
  PaymentRequest, 
  AppSettings 
} from '../types';
import { StudentManager } from './StudentManager';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

export interface AdminUploadSectionProps {
  currentUser: User | null;
  videos: VideoLesson[];
  pdfs: StudyPdf[];
  quizQuestions: QuizQuestion[];
  quizLinks: QuizLink[];
  folders?: StudyFolder[];
  batches?: StudyBatch[];
  onOpenNewBatch?: () => void;
  onEditBatch?: (batch: StudyBatch) => void;
  onDeleteBatch?: (id: string) => void;
  onQuickAdjustPrice?: (batchId: string, delta: number) => void;
  students?: RegisteredAccount[];
  paymentRequests?: PaymentRequest[];
  onToggleBatchAccess?: (email: string, batchId: string, status: boolean) => void;
  onApprovePayment?: (paymentId: string) => void;
  onRejectPayment?: (paymentId: string) => void;
  onAddStudent?: (newStudent: RegisteredAccount) => void;
  onDeleteStudent?: (email: string) => void;
  settings?: AppSettings;
  onUpdateSettings?: (settings: Partial<AppSettings>) => void;
  onAddPdf: (pdf: StudyPdf) => void;
  onDeletePdf: (id: string) => void;
  onEditPdf?: (pdf: StudyPdf) => void;
  onAddVideo: (video: VideoLesson) => void;
  onDeleteVideo: (id: string) => void;
  onEditVideo?: (video: VideoLesson) => void;
  onAddQuizQuestion: (question: QuizQuestion) => void;
  onDeleteQuizQuestion: (id: number) => void;
  onAddQuizLink: (link: QuizLink) => void;
  onDeleteQuizLink: (id: string) => void;
  onEditQuizLink?: (link: QuizLink) => void;
  onResetToDefaults: () => void;
  onPreviewPdf: (pdf: StudyPdf) => void;
  onOpenNewFolder?: () => void;
  onEditFolder?: (folder: StudyFolder) => void;
  onDeleteFolder?: (id: string) => void;
}

type AdminTab = 'folders' | 'batches' | 'students' | 'settings' | 'pdfs' | 'quiz-links' | 'videos' | 'quizzes';

export const AdminUploadSection: React.FC<AdminUploadSectionProps> = ({
  currentUser,
  videos,
  pdfs,
  quizQuestions,
  quizLinks,
  folders = [],
  batches = [],
  onOpenNewBatch,
  onEditBatch,
  onDeleteBatch,
  onQuickAdjustPrice,
  students = [],
  paymentRequests = [],
  onToggleBatchAccess,
  onApprovePayment,
  onRejectPayment,
  onAddStudent,
  onDeleteStudent,
  settings,
  onUpdateSettings,
  onAddPdf,
  onDeletePdf,
  onEditPdf,
  onAddVideo,
  onDeleteVideo,
  onEditVideo,
  onAddQuizQuestion,
  onDeleteQuizQuestion,
  onAddQuizLink,
  onDeleteQuizLink,
  onEditQuizLink,
  onResetToDefaults,
  onPreviewPdf,
  onOpenNewFolder,
  onEditFolder,
  onDeleteFolder
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('batches');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Firestore Live Batches State
  const [firestoreBatches, setFirestoreBatches] = useState<{ id: string; name: string; price?: number; tagline?: string }[]>([]);
  const [firestoreBatchName, setFirestoreBatchName] = useState('');
  const [firestoreBatchPrice, setFirestoreBatchPrice] = useState('499');
  const [firestoreEditId, setFirestoreEditId] = useState<string | null>(null);
  const [isSyncingFirestore, setIsSyncingFirestore] = useState(false);

  // PDF Form State
  const [pdfUploadMode, setPdfUploadMode] = useState<'laptop' | 'manual'>('laptop');
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfSubject, setPdfSubject] = useState('General Agriculture');
  const [pdfPages, setPdfPages] = useState('PDF Document');
  const [pdfLanguage, setPdfLanguage] = useState('Hindi & English');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfSummary, setPdfSummary] = useState('');
  const [pdfContent, setPdfContent] = useState('');
  const [selectedLaptopFile, setSelectedLaptopFile] = useState<{
    name: string;
    sizeFormatted: string;
    dataUrl: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Quiz Link Form State
  const [quizLinkTitle, setQuizLinkTitle] = useState('');
  const [quizLinkSubject, setQuizLinkSubject] = useState('Full Syllabus');
  const [quizLinkUrl, setQuizLinkUrl] = useState('');
  const [quizLinkTotalQuestions, setQuizLinkTotalQuestions] = useState('50 Questions');
  const [quizLinkDuration, setQuizLinkDuration] = useState('45 Minutes');
  const [quizLinkDescription, setQuizLinkDescription] = useState('');

  // Video Form State
  const [vidTitle, setVidTitle] = useState('');
  const [vidSubject, setVidSubject] = useState('Agronomy');
  const [vidDuration, setVidDuration] = useState('20:00');
  const [vidUrl, setVidUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [vidDesc, setVidDesc] = useState('');
  const [vidTopics, setVidTopics] = useState('');

  // Quiz Form State
  const [quizText, setQuizText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctKey, setCorrectKey] = useState('A');
  const [explanation, setExplanation] = useState('');

  // Target Destination States
  const [pdfTargetBatch, setPdfTargetBatch] = useState<'paid' | 'free'>('paid');
  const [quizLinkTargetBatch, setQuizLinkTargetBatch] = useState<'paid' | 'free'>('paid');
  const [vidTargetBatch, setVidTargetBatch] = useState<'paid' | 'free'>('paid');

  // Filter States
  const [pdfFilter, setPdfFilter] = useState<'all' | 'paid' | 'free'>('all');
  const [quizLinkFilter, setQuizLinkFilter] = useState<'all' | 'paid' | 'free'>('all');
  const [videoFilter, setVideoFilter] = useState<'all' | 'paid' | 'free'>('all');

  // Custom Category States
  const [customCategoryMode, setCustomCategoryMode] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [vidCustomCategoryMode, setVidCustomCategoryMode] = useState(false);
  const [vidCustomCategoryInput, setVidCustomCategoryInput] = useState('');

  // App Settings States
  const [appNameInput, setAppNameInput] = useState(settings?.appName || 'Target State Exam');
  const [subTitleInput, setSubTitleInput] = useState(settings?.subTitle || 'Target State Exam & Agriculture Exam');
  const [helplineEmailInput, setHelplineEmailInput] = useState(settings?.helplineEmail || 'ahlawatprashantchaudhary@gmail.com');
  const [telegramChannelInput, setTelegramChannelInput] = useState(settings?.telegramChannel || 'https://t.me/AgriTargetStateExam');
  const [upiIdInput, setUpiIdInput] = useState(settings?.upiId || 'ahlawatprashantchaudhary@okaxis');
  const [supportPhoneInput, setSupportPhoneInput] = useState(settings?.supportPhone || '+91 9876543210');
  const [marqueeNoticeInput, setMarqueeNoticeInput] = useState(settings?.marqueeNotice || '🔥 UPSSSC AGTA 2026 एवं राज्य कृषि भर्ती स्पेशल बैचेस शुरू हो चुके हैं! अभी डिस्काउंट ऑफर के साथ एडमिशन लें।');
  const [bannerTitleInput, setBannerTitleInput] = useState(settings?.bannerTitle || 'Target State Exam & Agriculture Batch 2026');
  const [bannerDescriptionInput, setBannerDescriptionInput] = useState(settings?.bannerDescription || 'लाइव व रिकॉर्डेड क्लासेज, विशेष हस्तलिखित PDF नोट्स और 100% परीक्षा आधारित डिजिटल मॉक टेस्ट सीरीज।');

  useEffect(() => {
    if (settings) {
      if (settings.appName) setAppNameInput(settings.appName);
      if (settings.subTitle) setSubTitleInput(settings.subTitle);
      if (settings.helplineEmail) setHelplineEmailInput(settings.helplineEmail);
      if (settings.telegramChannel) setTelegramChannelInput(settings.telegramChannel);
      if (settings.upiId) setUpiIdInput(settings.upiId);
      if (settings.supportPhone) setSupportPhoneInput(settings.supportPhone);
      if (settings.marqueeNotice !== undefined) setMarqueeNoticeInput(settings.marqueeNotice);
      if (settings.bannerTitle !== undefined) setBannerTitleInput(settings.bannerTitle);
      if (settings.bannerDescription !== undefined) setBannerDescriptionInput(settings.bannerDescription);
    }
  }, [settings]);

  // Firestore Realtime Listener for 'batches' collection
  useEffect(() => {
    try {
      const batchesRef = collection(db, 'batches');
      const unsubscribe = onSnapshot(batchesRef, (snapshot) => {
        const fetched = snapshot.docs.map(d => ({
          id: d.id,
          name: d.data().name || '',
          price: d.data().price || 499,
          tagline: d.data().tagline || 'Selection Special Batch'
        }));
        setFirestoreBatches(fetched);
      }, (err) => {
        console.warn('Firestore real-time sync note:', err.message);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore init note:', e);
    }
  }, []);

  // Fetch from Firestore
  const fetchFirestoreBatches = async () => {
    setIsSyncingFirestore(true);
    try {
      const batchesRef = collection(db, 'batches');
      const data = await getDocs(batchesRef);
      const fetched = data.docs.map(d => ({
        id: d.id,
        name: d.data().name || '',
        price: d.data().price || 499,
        tagline: d.data().tagline || 'Selection Special Batch'
      }));
      setFirestoreBatches(fetched);
      setStatusMessage(`✅ Firestore: ${fetched.length} batches synced successfully!`);
    } catch (err: any) {
      console.error('Error fetching Firestore batches:', err);
      setStatusMessage(`Firestore sync: ${err.message || 'Connecting to cloud...'}`);
    } finally {
      setIsSyncingFirestore(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  // Create or Update in Firestore
  const handleFirestoreBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestoreBatchName.trim()) return;

    try {
      const parsedPrice = parseInt(firestoreBatchPrice, 10) || 499;
      if (firestoreEditId) {
        const itemDoc = doc(db, 'batches', firestoreEditId);
        await updateDoc(itemDoc, { 
          name: firestoreBatchName.trim(),
          price: parsedPrice,
          updatedAt: new Date().toISOString()
        });
        setStatusMessage(`✅ Batch "${firestoreBatchName}" updated in Firebase Firestore!`);
        setFirestoreEditId(null);
      } else {
        const batchesRef = collection(db, 'batches');
        await addDoc(batchesRef, { 
          name: firestoreBatchName.trim(),
          price: parsedPrice,
          createdAt: new Date().toISOString()
        });
        setStatusMessage(`✅ New Batch "${firestoreBatchName}" added to Firebase Firestore!`);
      }
      setFirestoreBatchName('');
      setFirestoreBatchPrice('499');
      fetchFirestoreBatches();
    } catch (err: any) {
      console.error('Error saving batch to Firestore:', err);
      setStatusMessage(`Error saving to Firestore: ${err.message}`);
    }
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Delete from Firestore
  const handleFirestoreBatchDelete = async (id: string) => {
    if (!confirm('Kya aap is batch ko Firebase Firestore se delete karna chahte hain?')) return;
    try {
      const itemDoc = doc(db, 'batches', id);
      await deleteDoc(itemDoc);
      setStatusMessage('✅ Batch removed from Firebase Firestore!');
      fetchFirestoreBatches();
    } catch (err: any) {
      console.error('Error deleting from Firestore:', err);
      setStatusMessage(`Error: ${err.message}`);
    }
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Strict Admin Rights: ahlawatprashantchaudhary@gmail.com
  const isAdmin = Boolean(
    currentUser &&
    currentUser.email.toLowerCase().trim() === 'ahlawatprashantchaudhary@gmail.com'
  );

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white border border-red-200 rounded-2xl shadow-xs text-center">
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2">
          Admin Access Restricted (केवल मुख्य एडमिन के लिए)
        </h2>
        <p className="text-sm text-zinc-600 max-w-md mx-auto">
          यह पैनल केवल मुख्य प्रशासक (ahlawatprashantchaudhary@gmail.com) के लिए आरक्षित है। कृपया सही एडमिन आईडी से लॉगिन करें।
        </p>
      </div>
    );
  }

  // Handle File Selection from Laptop
  const processUploadedFile = (file: File) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setStatusMessage('Error: कृपया केवल .pdf फॉर्मेट की फाइल चुनें (Only PDF files supported).');
      return;
    }

    const sizeInBytes = file.size;
    const formattedSize = sizeInBytes > 1024 * 1024 
      ? `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(sizeInBytes / 1024)} KB`;

    const cleanedTitle = file.name
      .replace(/\.pdf$/i, '')
      .replace(/[_-]+/g, ' ')
      .trim();

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSelectedLaptopFile({
        name: file.name,
        sizeFormatted: formattedSize,
        dataUrl: dataUrl
      });
      if (!pdfTitle.trim()) {
        setPdfTitle(cleanedTitle);
      }
      setPdfFileName(file.name);
      setPdfPages(formattedSize);
      if (!pdfSummary.trim()) {
        setPdfSummary(`Original PDF study material uploaded from laptop by Faculty Prashant Sir.`);
      }
      setStatusMessage(`✅ File selected: "${file.name}" (${formattedSize})`);
      setTimeout(() => setStatusMessage(null), 3000);
    };

    reader.onerror = () => {
      setStatusMessage('Error: File read karne mein dikkat aayi.');
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Handle PDF Submit
  const handlePdfSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (pdfUploadMode === 'laptop' && !selectedLaptopFile) {
      setStatusMessage('Error: कृपया लैपटॉप से PDF फ़ाइल सेलेक्ट करें।');
      return;
    }

    if (!pdfTitle.trim()) {
      setStatusMessage('Error: PDF Title दर्ज करना अनिवार्य है।');
      return;
    }

    if (pdfUploadMode === 'manual' && !pdfContent.trim()) {
      setStatusMessage('Error: Study Notes content दर्ज करना अनिवार्य है।');
      return;
    }

    const isPaid = pdfTargetBatch === 'paid';
    const finalSubject = customCategoryMode && customCategoryInput.trim()
      ? customCategoryInput.trim()
      : (pdfSubject.trim() || 'General Agriculture');

    const matchedFolder = folders.find(
      f => f.name.toLowerCase().trim() === finalSubject.toLowerCase().trim() ||
           f.name.toLowerCase().includes(finalSubject.toLowerCase()) ||
           finalSubject.toLowerCase().includes(f.name.toLowerCase())
    );
    const newPdf: StudyPdf = {
      id: 'pdf-custom-' + Date.now(),
      title: pdfTitle.trim(),
      subject: finalSubject,
      folderId: matchedFolder?.id || 'folder-agronomy',
      pages: selectedLaptopFile?.sizeFormatted || pdfPages.trim() || 'PDF Document',
      language: pdfLanguage.trim() || 'Hindi & English',
      fileName: selectedLaptopFile?.name || (pdfFileName.trim() || `${pdfTitle.trim().replace(/\s+/g, '_')}.pdf`),
      summary: pdfSummary.trim() || 'Essential revision fact sheet for UPSSSC AGTA candidates.',
      fileContent: selectedLaptopFile ? selectedLaptopFile.dataUrl : pdfContent.trim(),
      fileSize: selectedLaptopFile?.sizeFormatted,
      fileType: selectedLaptopFile ? 'pdf' : 'text',
      isPaid: isPaid,
      targetBatch: pdfTargetBatch
    };

    onAddPdf(newPdf);
    setStatusMessage(`✅ नया PDF Material "${newPdf.title}" (${isPaid ? 'AGTA Paid Batch (My Courses)' : 'Free PDF Section'}) में पब्लिश हो गया!`);
    setPdfTitle('');
    setPdfFileName('');
    setPdfSummary('');
    setPdfContent('');
    setSelectedLaptopFile(null);
    setCustomCategoryInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Handle Quiz Link Submit
  const handleQuizLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizLinkTitle.trim() || !quizLinkUrl.trim()) {
      setStatusMessage('Error: Quiz Title और Quiz Link URL अनिवार्य हैं।');
      return;
    }

    let cleanUrl = quizLinkUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const isPaid = quizLinkTargetBatch === 'paid';
    const matchedQuizFolder = folders.find(
      f => f.name.toLowerCase().trim() === quizLinkSubject.toLowerCase().trim() ||
           f.name.toLowerCase().includes(quizLinkSubject.toLowerCase()) ||
           quizLinkSubject.toLowerCase().includes(f.name.toLowerCase())
    );
    const newLink: QuizLink = {
      id: 'quiz-link-' + Date.now(),
      title: quizLinkTitle.trim(),
      subject: quizLinkSubject.trim() || 'General Agriculture',
      folderId: matchedQuizFolder?.id || 'folder-mock-tests',
      quizUrl: cleanUrl,
      totalQuestions: quizLinkTotalQuestions.trim() || '50 Questions',
      duration: quizLinkDuration.trim() || '45 Minutes',
      description: quizLinkDescription.trim() || 'Online test link for UPSSSC AGTA competitive exam.',
      addedDate: 'Live Now',
      isPaid: isPaid,
      targetBatch: quizLinkTargetBatch
    };

    onAddQuizLink(newLink);
    setStatusMessage(`✅ नया Quiz Link "${newLink.title}" (${isPaid ? 'AGTA Paid Batch Special' : 'Free Online Test'}) लाइव हो गया!`);
    setQuizLinkTitle('');
    setQuizLinkUrl('');
    setQuizLinkDescription('');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Handle Video Submit
  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitle.trim() || !vidUrl.trim()) {
      setStatusMessage('Error: Video Title और Video URL अनिवार्य हैं।');
      return;
    }

    const parsedTopics = vidTopics
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);

    const isPaid = vidTargetBatch === 'paid';
    const finalVidSubject = vidCustomCategoryMode && vidCustomCategoryInput.trim()
      ? vidCustomCategoryInput.trim()
      : (vidSubject.trim() || 'Agriculture');

    const matchedVidFolder = folders.find(
      f => f.name.toLowerCase().trim() === finalVidSubject.toLowerCase().trim() ||
           f.name.toLowerCase().includes(finalVidSubject.toLowerCase()) ||
           finalVidSubject.toLowerCase().includes(f.name.toLowerCase())
    );
    const newVideo: VideoLesson = {
      id: 'vid-custom-' + Date.now(),
      title: vidTitle.trim(),
      subject: finalVidSubject,
      folderId: matchedVidFolder?.id || 'folder-agronomy',
      duration: vidDuration.trim() || '20:00',
      videoUrl: vidUrl.trim(),
      description: vidDesc.trim() || 'Lecture session on essential concepts for UPSSSC AGTA competitive examination.',
      topics: parsedTopics.length > 0 ? parsedTopics : [
        'Key syllabus concepts analysis',
        'Previous year question breakdown',
        'Direct revision points'
      ],
      isPaid: isPaid,
      targetBatch: vidTargetBatch
    };

    onAddVideo(newVideo);
    setStatusMessage(`✅ नई Video Class "${newVideo.title}" (${isPaid ? 'AGTA Paid Batch (My Courses)' : 'Free Videos'}) लाइव पब्लिश हो गई!`);
    setVidTitle('');
    setVidDesc('');
    setVidTopics('');
    setVidCustomCategoryInput('');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Handle Quiz MCQ Submit
  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizText.trim() || !optA.trim() || !optB.trim()) {
      setStatusMessage('Error: Question text और options अनिवार्य हैं।');
      return;
    }

    const newQuestion: QuizQuestion = {
      id: Date.now(),
      question: quizText.trim(),
      options: [
        { key: 'A', text: optA.trim() },
        { key: 'B', text: optB.trim() },
        { key: 'C', text: optC.trim() || 'None of the above' },
        { key: 'D', text: optD.trim() || 'All of the above' }
      ],
      correctAnswer: correctKey,
      explanation: explanation.trim() || `Correct answer is Option (${correctKey}).`
    };

    onAddQuizQuestion(newQuestion);
    setStatusMessage(`✅ नया Quiz MCQ Daily Quiz Section में जोड़ दिया गया!`);
    setQuizText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setExplanation('');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              Portal Administrator Panel
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              Firebase Firestore Active
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              {currentUser?.email}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#1b5e20] mt-1 flex items-center gap-2">
            <span>🛠️ Manage Study Material & Batches</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            बैचेस (Firebase Firestore), लैपटॉप से डायरेक्ट PDF नोट्स, वीडियो क्लासेज, टेस्ट लिंक्स एवं सेटिंग्स एडिट करें।
          </p>
        </div>

        {/* Live Counters & Reset */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl text-xs flex-wrap">
            <span className="text-zinc-600">Total:</span>
            <span className="font-bold text-amber-800">{batches.length} Batches</span>
            <span className="text-zinc-300">|</span>
            <span className="font-bold text-emerald-800">{pdfs.length} PDFs</span>
            <span className="text-zinc-300">|</span>
            <span className="font-bold text-blue-800">{videos.length} Videos</span>
            <span className="text-zinc-300">|</span>
            <span className="font-bold text-purple-800">{quizLinks.length} Links</span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirm('क्या आप डिफ़ॉल्ट सैंपल स्टडी मटेरियल पर रीसेट करना चाहते हैं?')) {
                onResetToDefaults();
                setStatusMessage('Portal defaults पर वापस सेट कर दिया गया है।');
              }
            }}
            className="text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-300 px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            title="Reset to default initial content"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Alert Status Banner */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2.5 animate-in fade-in duration-200 ${
          statusMessage.startsWith('Error') 
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-emerald-50 text-[#1b5e20] border border-emerald-300'
        }`}>
          {statusMessage.startsWith('Error') ? (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          ) : (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('batches')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'batches'
              ? 'bg-[#1b5e20] text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>🎓 बैच प्रबंधन ({batches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('folders')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'folders'
              ? 'bg-[#1b5e20] text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          <Folder className="w-4 h-4" />
          <span>📁 फ़ोल्डर ({folders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'students'
              ? 'bg-[#1b5e20] text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>👥 छात्र व लॉगिन ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-[#1b5e20] text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>⚙️ ऐप सेटिंग्स</span>
        </button>

        <button
          onClick={() => setActiveTab('pdfs')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'pdfs'
              ? 'bg-[#1b5e20] text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Upload PDFs ({pdfs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'videos'
              ? 'bg-[#1b5e20] text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Upload Videos ({videos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz-links')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'quiz-links'
              ? 'bg-[#1b5e20] text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          <span>Quiz Links ({quizLinks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'quizzes'
              ? 'bg-[#1b5e20] text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Quiz MCQs ({quizQuestions.length})</span>
        </button>
      </div>

      {/* TAB: BATCHES MANAGEMENT (WITH FIRESTORE DIRECT INTEGRATION) */}
      {activeTab === 'batches' && (
        <div className="space-y-6">
          {/* Firestore Quick Unit Manager as requested */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 rounded-2xl border border-emerald-300 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                    <span>🔥 Firebase Firestore Batch Manager (लाइव क्लाउड सिंक)</span>
                  </h3>
                  <p className="text-xs text-emerald-800">
                    सीधे Firebase Firestore के <code>'batches'</code> कलेक्शन में नया बैच जोड़ें, एडिट करें व डिलीट करें।
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={fetchFirestoreBatches}
                disabled={isSyncingFirestore}
                className="bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingFirestore ? 'animate-spin' : ''}`} />
                <span>Sync with Firestore</span>
              </button>
            </div>

            {/* Form to Add / Edit Batch into Firestore */}
            <form onSubmit={handleFirestoreBatchSubmit} className="mt-4 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
              <input
                type="text"
                placeholder="बैच का नाम (उदा. Cane Supervisor Selection Batch)"
                value={firestoreBatchName}
                onChange={(e) => setFirestoreBatchName(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-white rounded-xl border border-emerald-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-xs"
              />
              <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-emerald-300">
                <span className="text-xs font-bold text-zinc-500">₹</span>
                <input
                  type="number"
                  placeholder="फीस"
                  value={firestoreBatchPrice}
                  onChange={(e) => setFirestoreBatchPrice(e.target.value)}
                  className="w-20 text-sm font-bold text-emerald-900 focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{firestoreEditId ? 'बैच अपडेट करें' : 'नया बैच जोड़ें'}</span>
                </button>
                {firestoreEditId && (
                  <button
                    type="button"
                    onClick={() => {
                      setFirestoreEditId(null);
                      setFirestoreBatchName('');
                      setFirestoreBatchPrice('499');
                    }}
                    className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    रद्द करें
                  </button>
                )}
              </div>
            </form>

            {/* Firestore Quick List */}
            {firestoreBatches.length > 0 && (
              <div className="mt-4 pt-3 border-t border-emerald-200/80">
                <p className="text-xs font-bold text-emerald-900 mb-2">
                  Cloud Firestore Batches ({firestoreBatches.length}):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {firestoreBatches.map((fb) => (
                    <div
                      key={fb.id}
                      className="bg-white/90 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-900 truncate">
                          {fb.name}
                        </p>
                        <span className="text-[11px] font-bold text-emerald-700">
                          ₹{fb.price || 499}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setFirestoreBatchName(fb.name);
                            setFirestoreBatchPrice(String(fb.price || 499));
                            setFirestoreEditId(fb.id);
                          }}
                          className="p-1 text-zinc-500 hover:text-amber-600 hover:bg-amber-50 rounded cursor-pointer"
                          title="एडिट करें"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFirestoreBatchDelete(fb.id)}
                          className="p-1 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Full Batches Grid with Modal Actions */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#1b5e20]" />
                <span>पोर्टल बैचेस एवं स्टोर कोर्सेज ({batches.length})</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                यहाँ से आप बैच का नाम, फीस, लिंक्ड फोल्डर, टेलीग्राम लिंक और फीचर्स लाइव एडिट कर सकते हैं।
              </p>
            </div>

            {onOpenNewBatch && (
              <button
                type="button"
                onClick={onOpenNewBatch}
                className="bg-[#1b5e20] hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>➕ फुल बैच मॉडल खोलें</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {batches.map((batch) => {
              const enrolledInBatch = students.filter(s => s.enrolledBatches?.includes(batch.id) || (s.hasPurchasedBatch && batch.id.includes('agta'))).length;

              return (
                <div
                  key={batch.id}
                  className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-500 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#f57c00] flex items-center justify-center font-bold shrink-0">
                          <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-zinc-900 group-hover:text-[#1b5e20] transition-colors leading-tight">
                            {batch.name}
                          </h4>
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {batch.tagline || 'Special Selection Batch'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-zinc-50 p-1 rounded-lg border border-zinc-200">
                        {onEditBatch && (
                          <button
                            type="button"
                            onClick={() => onEditBatch(batch)}
                            className="p-1.5 text-zinc-600 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                            title="बैच का नाम व विवरण एडिट करें"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {onDeleteBatch && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`क्या आप "${batch.name}" बैच को हटाना चाहते हैं?`)) {
                                onDeleteBatch(batch.id);
                              }
                            }}
                            className="p-1.5 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="बैच हटाएं"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-zinc-600 line-clamp-2">
                      {batch.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 text-xs">
                      <div className="bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                        <span className="text-[10px] text-zinc-500 font-semibold block">फीस / ऑफर प्राइस</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-black text-emerald-700">₹{batch.price}</span>
                          <span className="text-xs text-zinc-400 line-through">₹{batch.originalPrice}</span>
                        </div>
                      </div>

                      <div className="bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                        <span className="text-[10px] text-zinc-500 font-semibold block">एनरोल्ड छात्र</span>
                        <span className="text-base font-black text-zinc-800">{enrolledInBatch} छात्र</span>
                      </div>
                    </div>

                    {/* Linked Study Folder */}
                    <div className="bg-blue-50/70 p-2 rounded-lg border border-blue-200 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-blue-950 font-semibold">
                        <Folder className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>लिंक्ड फ़ोल्डर:</span>
                        <span className="font-bold text-blue-800">
                          {batch.folderName || 'समस्त कृषि फ़ोल्डर व नोट्स'}
                        </span>
                      </div>
                      {batch.folderId && (
                        <span className="text-[10px] text-blue-600 font-mono">ID: {batch.folderId}</span>
                      )}
                    </div>

                    {/* Quick Price Steppers */}
                    {onQuickAdjustPrice && (
                      <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-zinc-600 mr-1">प्राइस घटाएं / बढ़ाएं:</span>
                        <button
                          type="button"
                          onClick={() => onQuickAdjustPrice(batch.id, -50)}
                          className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 cursor-pointer"
                        >
                          - ₹50
                        </button>
                        <button
                          type="button"
                          onClick={() => onQuickAdjustPrice(batch.id, -10)}
                          className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 cursor-pointer"
                        >
                          - ₹10
                        </button>
                        <button
                          type="button"
                          onClick={() => onQuickAdjustPrice(batch.id, 10)}
                          className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-pointer"
                        >
                          + ₹10
                        </button>
                        <button
                          type="button"
                          onClick={() => onQuickAdjustPrice(batch.id, 50)}
                          className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-pointer"
                        >
                          + ₹50
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: FOLDERS MANAGEMENT */}
      {activeTab === 'folders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Folder className="w-5 h-5 text-[#1b5e20]" />
                <span>विषय एवं फ़ोल्डर प्रबंधन (Subject & Study Folders Control)</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                यहाँ से आप किसी भी विषय का फ़ोल्डर नाम बदल सकते हैं, विवरण बदल सकते हैं, नया फ़ोल्डर बना सकते हैं या पुराना फ़ोल्डर हटा सकते हैं।
              </p>
            </div>

            {onOpenNewFolder && (
              <button
                type="button"
                onClick={onOpenNewFolder}
                className="bg-[#1b5e20] hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
              >
                <FolderPlus className="w-4 h-4" />
                <span>➕ नया फ़ोल्डर बनाएं (New Folder)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => {
              const folderPdfs = pdfs.filter(p => p.folderId === folder.id || p.subject === folder.name || folder.name.includes(p.subject));
              const folderVideos = videos.filter(v => v.folderId === folder.id || v.subject === folder.name || folder.name.includes(v.subject));
              const folderQuizzes = quizLinks.filter(q => q.folderId === folder.id || q.subject === folder.name || folder.name.includes(q.subject));

              return (
                <div
                  key={folder.id}
                  className="bg-white rounded-xl border border-zinc-200 p-4 shadow-xs flex flex-col justify-between hover:border-emerald-500 transition-all group relative"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#1b5e20] flex items-center justify-center font-bold">
                          <Folder className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                          {folder.category.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 bg-zinc-50 p-1 rounded-lg border border-zinc-200">
                        {onEditFolder && (
                          <button
                            type="button"
                            onClick={() => onEditFolder(folder)}
                            className="p-1.5 text-zinc-600 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                            title="फ़ोल्डर एडिट या नाम चेंज करें"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {onDeleteFolder && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`क्या आप "${folder.name}" फ़ोल्डर को हटाना चाहते हैं?`)) {
                                onDeleteFolder(folder.id);
                              }
                            }}
                            className="p-1.5 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="फ़ोल्डर हटाएं"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-zinc-900 group-hover:text-[#1b5e20] transition-colors">
                      {folder.name}
                    </h4>
                    <p className="text-xs text-zinc-600 mt-1 line-clamp-2">
                      {folder.description || 'Syllabus oriented materials'}
                    </p>

                    <div className="flex items-center gap-2 mt-3 text-[11px] text-zinc-500 font-medium flex-wrap">
                      <span className="bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                        📄 {folderPdfs.length} PDFs
                      </span>
                      <span className="bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                        🎥 {folderVideos.length} Videos
                      </span>
                      <span className="bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                        📝 {folderQuizzes.length} Tests
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-500">
                      ID: <code className="text-[10px] bg-zinc-100 px-1 py-0.5 rounded">{folder.id}</code>
                    </span>
                    {onEditFolder && (
                      <button
                        type="button"
                        onClick={() => onEditFolder(folder)}
                        className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>नाम एडिट</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: STUDENTS MANAGEMENT */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <StudentManager
            students={students}
            batches={batches}
            paymentRequests={paymentRequests}
            onToggleBatchAccess={onToggleBatchAccess || (() => {})}
            onApprovePayment={onApprovePayment || (() => {})}
            onRejectPayment={onRejectPayment || (() => {})}
            onAddStudent={onAddStudent || (() => {})}
            onDeleteStudent={onDeleteStudent || (() => {})}
          />
        </div>
      )}

      {/* TAB: SETTINGS MANAGEMENT */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-zinc-200 pb-4">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#1b5e20]" />
              <span>पोर्टल व ऐप सेटिंग्स (Live App Settings)</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              यहाँ से ऐप का नाम, हेल्पलाइन नंबर, ईमेल, टेलीग्राम लिंक और UPI ID तुरंत बदलें।
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (onUpdateSettings) {
                onUpdateSettings({
                  appName: appNameInput,
                  subTitle: subTitleInput,
                  helplineEmail: helplineEmailInput,
                  telegramChannel: telegramChannelInput,
                  upiId: upiIdInput,
                  supportPhone: supportPhoneInput,
                  marqueeNotice: marqueeNoticeInput,
                  bannerTitle: bannerTitleInput,
                  bannerDescription: bannerDescriptionInput
                });
                setStatusMessage('✅ सेटिंग्स सफलतापूर्वक अपडेट हो गईं!');
                setTimeout(() => setStatusMessage(null), 3000);
              }
            }}
            className="space-y-4 max-w-3xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  ऐप/वेबसाइट का मुख्य नाम:
                </label>
                <input
                  type="text"
                  value={appNameInput}
                  onChange={(e) => setAppNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  सब-टाइटल / टैगलाइन:
                </label>
                <input
                  type="text"
                  value={subTitleInput}
                  onChange={(e) => setSubTitleInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  हेल्पलाइन ईमेल:
                </label>
                <input
                  type="email"
                  value={helplineEmailInput}
                  onChange={(e) => setHelplineEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  हेल्पलाइन फ़ोन / व्हाट्सएप:
                </label>
                <input
                  type="text"
                  value={supportPhoneInput}
                  onChange={(e) => setSupportPhoneInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  टेलीग्राम चैनल लिंक:
                </label>
                <input
                  type="url"
                  value={telegramChannelInput}
                  onChange={(e) => setTelegramChannelInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  UPI ID (फीस भुगतान के लिए):
                </label>
                <input
                  type="text"
                  value={upiIdInput}
                  onChange={(e) => setUpiIdInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                शीर्ष स्क्रॉलिंग नोटिस (Marquee Notice):
              </label>
              <input
                type="text"
                value={marqueeNoticeInput}
                onChange={(e) => setMarqueeNoticeInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#1b5e20] hover:bg-emerald-800 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>सेटिंग्स सेव करें</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB: UPLOAD PDFS */}
      {activeTab === 'pdfs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-4">
              <UploadCloud className="w-5 h-5 text-[#1b5e20]" />
              <span>Upload PDF Study Material (लैपटॉप से PDF अपलोड करें)</span>
            </h3>

            {/* Target Destination Toggle */}
            <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs font-bold text-zinc-700">अपलोड का गंतव्य (Target Destination):</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPdfTargetBatch('paid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    pdfTargetBatch === 'paid'
                      ? 'bg-amber-500 text-white'
                      : 'bg-white text-zinc-700 border border-zinc-300'
                  }`}
                >
                  🔒 AGTA Paid Batch (My Courses)
                </button>
                <button
                  type="button"
                  onClick={() => setPdfTargetBatch('free')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    pdfTargetBatch === 'free'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white text-zinc-700 border border-zinc-300'
                  }`}
                >
                  🎁 Free PDF Section
                </button>
              </div>
            </div>

            <form onSubmit={handlePdfSubmit} className="space-y-4">
              {/* Laptop File Drag-Drop Area */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-emerald-600 bg-emerald-50' 
                    : selectedLaptopFile 
                      ? 'border-emerald-500 bg-emerald-50/40' 
                      : 'border-zinc-300 hover:border-emerald-500 hover:bg-zinc-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                {selectedLaptopFile ? (
                  <div className="flex flex-col items-center gap-1.5">
                    <FileCheck className="w-10 h-10 text-emerald-600" />
                    <p className="text-sm font-bold text-emerald-950">
                      {selectedLaptopFile.name}
                    </p>
                    <span className="text-xs text-emerald-700 font-semibold">
                      {selectedLaptopFile.sizeFormatted} • क्लिक करके दूसरी फाइल चुनें
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <UploadCloud className="w-10 h-10 text-zinc-400" />
                    <p className="text-sm font-bold text-zinc-700">
                      लैपटॉप से PDF यहाँ ड्रैग करें या क्लिक करके चुनें
                    </p>
                    <span className="text-xs text-zinc-500">
                      (केवल .pdf फॉर्मेट समर्थित है)
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    PDF Title (शीर्षक):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. Agronomy Complete Revision Notes"
                    value={pdfTitle}
                    onChange={(e) => setPdfTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    विषय / Category:
                  </label>
                  <select
                    value={pdfSubject}
                    onChange={(e) => setPdfSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20] bg-white"
                  >
                    {folders.map((f) => (
                      <option key={f.id} value={f.name}>{f.name}</option>
                    ))}
                    <option value="General Agriculture">General Agriculture</option>
                    <option value="Agronomy">Agronomy</option>
                    <option value="Horticulture">Horticulture</option>
                    <option value="Soil Science">Soil Science</option>
                    <option value="Genetics & Breeding">Genetics & Breeding</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  संक्षिप्त विवरण (Summary):
                </label>
                <input
                  type="text"
                  placeholder="विद्यार्थियों के लिए परीक्षा-उपयोगी संक्षिप्त सारांश"
                  value={pdfSummary}
                  onChange={(e) => setPdfSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1b5e20] hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <FileUp className="w-5 h-5" />
                <span>PDF स्टडी मटेरियल पब्लिश करें</span>
              </button>
            </form>
          </div>

          {/* Manage Existing PDFs List */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
            <h4 className="text-base font-bold text-zinc-900 mb-3 flex items-center justify-between">
              <span>लाइव PDF स्टडी नोट्स ({pdfs.length})</span>
              <div className="flex gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setPdfFilter('all')}
                  className={`px-2 py-1 rounded ${pdfFilter === 'all' ? 'bg-[#1b5e20] text-white' : 'bg-zinc-100 text-zinc-700'}`}
                >
                  सभी
                </button>
                <button
                  type="button"
                  onClick={() => setPdfFilter('paid')}
                  className={`px-2 py-1 rounded ${pdfFilter === 'paid' ? 'bg-amber-600 text-white' : 'bg-zinc-100 text-zinc-700'}`}
                >
                  Paid
                </button>
                <button
                  type="button"
                  onClick={() => setPdfFilter('free')}
                  className={`px-2 py-1 rounded ${pdfFilter === 'free' ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-700'}`}
                >
                  Free
                </button>
              </div>
            </h4>

            <div className="space-y-2">
              {pdfs
                .filter(p => pdfFilter === 'all' || (pdfFilter === 'paid' ? p.isPaid : !p.isPaid))
                .map((pdf) => (
                  <div
                    key={pdf.id}
                    className="p-3 rounded-xl border border-zinc-200 flex items-center justify-between gap-3 hover:border-emerald-500"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${pdf.isPaid ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {pdf.isPaid ? 'PAID' : 'FREE'}
                        </span>
                        <p className="text-sm font-bold text-zinc-900 truncate">
                          {pdf.title}
                        </p>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {pdf.subject} • {pdf.pages}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onPreviewPdf(pdf)}
                        className="p-1.5 text-zinc-600 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                        title="प्रिव्यू देखें"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {onEditPdf && (
                        <button
                          type="button"
                          onClick={() => onEditPdf(pdf)}
                          className="p-1.5 text-zinc-600 hover:text-amber-700 hover:bg-amber-50 rounded"
                          title="एडिट करें"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`क्या आप "${pdf.title}" PDF को हटाना चाहते हैं?`)) {
                            onDeletePdf(pdf.id);
                          }
                        }}
                        className="p-1.5 text-zinc-600 hover:text-red-700 hover:bg-red-50 rounded"
                        title="हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: UPLOAD VIDEOS */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-4">
              <Video className="w-5 h-5 text-[#1b5e20]" />
              <span>Upload Video Lecture (यूट्यूब या डायरेक्ट वीडियो जोड़ें)</span>
            </h3>

            <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs font-bold text-zinc-700">अपलोड का गंतव्य (Target Destination):</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVidTargetBatch('paid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    vidTargetBatch === 'paid' ? 'bg-amber-500 text-white' : 'bg-white text-zinc-700 border border-zinc-300'
                  }`}
                >
                  🔒 AGTA Paid Batch (My Courses)
                </button>
                <button
                  type="button"
                  onClick={() => setVidTargetBatch('free')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    vidTargetBatch === 'free' ? 'bg-emerald-700 text-white' : 'bg-white text-zinc-700 border border-zinc-300'
                  }`}
                >
                  🎁 Free Videos
                </button>
              </div>
            </div>

            <form onSubmit={handleVideoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Video Title:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. UPSSSC AGTA Agronomy Special Class 01"
                    value={vidTitle}
                    onChange={(e) => setVidTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    YouTube URL या Video Link:
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={vidUrl}
                    onChange={(e) => setVidUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    अवधि (Duration):
                  </label>
                  <input
                    type="text"
                    placeholder="25:00"
                    value={vidDuration}
                    onChange={(e) => setVidDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    विषय / फ़ोल्डर:
                  </label>
                  <select
                    value={vidSubject}
                    onChange={(e) => setVidSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20] bg-white"
                  >
                    {folders.map((f) => (
                      <option key={f.id} value={f.name}>{f.name}</option>
                    ))}
                    <option value="Agronomy">Agronomy</option>
                    <option value="Horticulture">Horticulture</option>
                    <option value="Soil Science">Soil Science</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  विवरण (Description):
                </label>
                <input
                  type="text"
                  placeholder="लेक्चर का विवरण"
                  value={vidDesc}
                  onChange={(e) => setVidDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1b5e20] hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Video className="w-5 h-5" />
                <span>वीडियो क्लास पब्लिश करें</span>
              </button>
            </form>
          </div>

          {/* Manage Existing Videos */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
            <h4 className="text-base font-bold text-zinc-900 mb-3 flex items-center justify-between">
              <span>लाइव वीडियो लेक्चर्स ({videos.length})</span>
            </h4>
            <div className="space-y-2">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="p-3 rounded-xl border border-zinc-200 flex items-center justify-between gap-3 hover:border-emerald-500"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${vid.isPaid ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {vid.isPaid ? 'PAID' : 'FREE'}
                      </span>
                      <p className="text-sm font-bold text-zinc-900 truncate">
                        {vid.title}
                      </p>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {vid.subject} • {vid.duration}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {onEditVideo && (
                      <button
                        type="button"
                        onClick={() => onEditVideo(vid)}
                        className="p-1.5 text-zinc-600 hover:text-amber-700 hover:bg-amber-50 rounded"
                        title="एडिट करें"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`क्या आप "${vid.title}" वीडियो को हटाना चाहते हैं?`)) {
                          onDeleteVideo(vid.id);
                        }
                      }}
                      className="p-1.5 text-zinc-600 hover:text-red-700 hover:bg-red-50 rounded"
                      title="हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: QUIZ LINKS */}
      {activeTab === 'quiz-links' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-4">
              <LinkIcon className="w-5 h-5 text-[#1b5e20]" />
              <span>Add Online Quiz / Test Link (Google Form या टेस्ट लिंक जोड़ें)</span>
            </h3>

            <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs font-bold text-zinc-700">अपलोड का गंतव्य (Target Destination):</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setQuizLinkTargetBatch('paid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    quizLinkTargetBatch === 'paid' ? 'bg-amber-500 text-white' : 'bg-white text-zinc-700 border border-zinc-300'
                  }`}
                >
                  🔒 AGTA Paid Batch (My Courses)
                </button>
                <button
                  type="button"
                  onClick={() => setQuizLinkTargetBatch('free')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    quizLinkTargetBatch === 'free' ? 'bg-emerald-700 text-white' : 'bg-white text-zinc-700 border border-zinc-300'
                  }`}
                >
                  🎁 Free Tests
                </button>
              </div>
            </div>

            <form onSubmit={handleQuizLinkSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Quiz / Test Title:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. UPSSSC AGTA 2026 Full Mock Test 01"
                    value={quizLinkTitle}
                    onChange={(e) => setQuizLinkTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Quiz URL (Google Form / Online Portal Link):
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://docs.google.com/forms/..."
                    value={quizLinkUrl}
                    onChange={(e) => setQuizLinkUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    कुल प्रश्न (Total Questions):
                  </label>
                  <input
                    type="text"
                    placeholder="50 Questions"
                    value={quizLinkTotalQuestions}
                    onChange={(e) => setQuizLinkTotalQuestions(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    समय सीमा (Duration):
                  </label>
                  <input
                    type="text"
                    placeholder="45 Minutes"
                    value={quizLinkDuration}
                    onChange={(e) => setQuizLinkDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1b5e20] hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <LinkIcon className="w-5 h-5" />
                <span>ऑनलाइन टेस्ट लिंक लाइव करें</span>
              </button>
            </form>
          </div>

          {/* Manage Quiz Links */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
            <h4 className="text-base font-bold text-zinc-900 mb-3">
              लाइव क्विज़ लिंक्स ({quizLinks.length})
            </h4>
            <div className="space-y-2">
              {quizLinks.map((ql) => (
                <div
                  key={ql.id}
                  className="p-3 rounded-xl border border-zinc-200 flex items-center justify-between gap-3 hover:border-emerald-500"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ql.isPaid ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {ql.isPaid ? 'PAID' : 'FREE'}
                      </span>
                      <p className="text-sm font-bold text-zinc-900 truncate">
                        {ql.title}
                      </p>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {ql.totalQuestions} • {ql.duration}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {onEditQuizLink && (
                      <button
                        type="button"
                        onClick={() => onEditQuizLink(ql)}
                        className="p-1.5 text-zinc-600 hover:text-amber-700 hover:bg-amber-50 rounded"
                        title="एडिट करें"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`क्या आप "${ql.title}" टेस्ट लिंक को हटाना चाहते हैं?`)) {
                          onDeleteQuizLink(ql.id);
                        }
                      }}
                      className="p-1.5 text-zinc-600 hover:text-red-700 hover:bg-red-50 rounded"
                      title="हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: QUIZZES (MCQS) */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-[#1b5e20]" />
              <span>Add Daily Quiz Question (डेली क्विज़ MCQ जोड़ें)</span>
            </h3>

            <form onSubmit={handleQuizSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Question Text (प्रश्न):
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="उदा. उत्तर प्रदेश में कृषि जलवायु क्षेत्रों (Agro-Climatic Zones) की कुल संख्या कितनी है?"
                  value={quizText}
                  onChange={(e) => setQuizText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1">
                    Option A:
                  </label>
                  <input
                    type="text"
                    required
                    value={optA}
                    onChange={(e) => setOptA(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1">
                    Option B:
                  </label>
                  <input
                    type="text"
                    required
                    value={optB}
                    onChange={(e) => setOptB(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1">
                    Option C:
                  </label>
                  <input
                    type="text"
                    value={optC}
                    onChange={(e) => setOptC(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1">
                    Option D:
                  </label>
                  <input
                    type="text"
                    value={optD}
                    onChange={(e) => setOptD(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    सही उत्तर (Correct Option):
                  </label>
                  <select
                    value={correctKey}
                    onChange={(e) => setCorrectKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1b5e20] bg-white"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    व्याख्या (Explanation):
                  </label>
                  <input
                    type="text"
                    placeholder="उत्तर की व्याख्या"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1b5e20] hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>MCQ प्रश्न लाइव करें</span>
              </button>
            </form>
          </div>

          {/* Manage MCQs */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
            <h4 className="text-base font-bold text-zinc-900 mb-3">
              लाइव MCQ प्रश्न ({quizQuestions.length})
            </h4>
            <div className="space-y-3">
              {quizQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl border border-zinc-200 flex items-start justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-bold text-zinc-900">
                      {idx + 1}. {q.question}
                    </p>
                    <div className="mt-1 text-xs text-zinc-600 space-y-0.5">
                      <span className="font-bold text-emerald-700">
                        सही उत्तर: ({q.correctAnswer})
                      </span>
                      {q.explanation && (
                        <p className="text-zinc-500 italic">
                          व्याख्या: {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('क्या आप इस प्रश्न को हटाना चाहते हैं?')) {
                        onDeleteQuizQuestion(q.id);
                      }
                    }}
                    className="p-1.5 text-zinc-500 hover:text-red-700 hover:bg-red-50 rounded shrink-0 cursor-pointer"
                    title="हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUploadSection;
