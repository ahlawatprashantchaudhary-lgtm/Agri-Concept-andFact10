import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { HomeSection } from './components/HomeSection';
import { VideoSection } from './components/VideoSection';
import { PdfSection } from './components/PdfSection';
import { QuizSection } from './components/QuizSection';
import { StoreSection } from './components/StoreSection';
import { MyCoursesSection } from './components/MyCoursesSection';
import { AdminUploadSection } from './components/AdminUploadSection';
import { Modals } from './components/Modals';
import { User, ActiveSection, StudyPdf, VideoLesson, QuizQuestion, QuizLink, RegisteredAccount, StudyFolder, StudyBatch, PaymentRequest, AppSettings } from './types';
import { FREE_VIDEOS, FREE_PDFS, QUIZ_QUESTIONS, DEFAULT_QUIZ_LINKS, DEFAULT_FOLDERS, DEFAULT_BATCHES, DEFAULT_SETTINGS } from './data/portalData';
import { FolderModal } from './components/FolderModal';
import { EditMaterialModal } from './components/EditMaterialModal';
import { BatchModal } from './components/BatchModal';
// Firebase Firestore Database Connection
import { db } from './firebase';

// ONLY ahlawatprashantchaudhary@gmail.com is authorized as Admin
const INITIAL_DEMO_ACCOUNTS: RegisteredAccount[] = [
  {
    name: 'Prashant Chaudhary (Admin)',
    email: 'ahlawatprashantchaudhary@gmail.com',
    password: 'admin',
    role: 'admin',
    hasPurchasedBatch: true
  },
  {
    name: 'Student User',
    email: 'student@agriconcept.in',
    password: 'password123',
    role: 'student',
    hasPurchasedBatch: false
  },
  {
    name: 'Ramesh Sharma',
    email: 'ramesh@example.com',
    password: 'password123',
    role: 'student',
    hasPurchasedBatch: true
  },
  {
    name: 'Amit Patel',
    email: 'amit@example.com',
    password: 'password123',
    role: 'student',
    hasPurchasedBatch: false
  }
];

export default function App() {
  // App state with local persistence
  const [activeSection, setActiveSection] = useState<ActiveSection>('sec-home');

  // Registered accounts persistence
  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>(() => {
    try {
      const saved = localStorage.getItem('agri_registered_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize accounts: ONLY ahlawatprashantchaudhary@gmail.com is admin
          const sanitized = parsed.map((acc: RegisteredAccount) => {
            const isAuthorizedAdmin = acc.email.toLowerCase().trim() === 'ahlawatprashantchaudhary@gmail.com';
            return {
              ...acc,
              role: isAuthorizedAdmin ? ('admin' as const) : ('student' as const)
            };
          });

          // Ensure the authorized admin exists
          const hasAdmin = sanitized.some(
            (u: RegisteredAccount) => u.email.toLowerCase().trim() === 'ahlawatprashantchaudhary@gmail.com'
          );
          if (!hasAdmin) {
            return [...INITIAL_DEMO_ACCOUNTS, ...sanitized.filter(s => s.email.toLowerCase() !== 'student@agriconcept.in')];
          }
          return sanitized;
        }
      }
      return INITIAL_DEMO_ACCOUNTS;
    } catch {
      return INITIAL_DEMO_ACCOUNTS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('agri_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          const isAuthorizedAdmin = parsed.email?.toLowerCase().trim() === 'ahlawatprashantchaudhary@gmail.com';
          return {
            ...parsed,
            role: isAuthorizedAdmin ? 'admin' : 'student'
          };
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [hasPurchasedBatch, setHasPurchasedBatch] = useState<boolean>(() => {
    try {
      return localStorage.getItem('agri_purchased_batch') === 'true';
    } catch {
      return false;
    }
  });

  // Dynamic study materials (synchronized with localStorage)
  const [videos, setVideos] = useState<VideoLesson[]>(() => {
    try {
      const saved = localStorage.getItem('agri_custom_videos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return FREE_VIDEOS;
    } catch {
      return FREE_VIDEOS;
    }
  });

  const [pdfs, setPdfs] = useState<StudyPdf[]>(() => {
    try {
      const saved = localStorage.getItem('agri_custom_pdfs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return FREE_PDFS;
    } catch {
      return FREE_PDFS;
    }
  });

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('agri_custom_quiz');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return QUIZ_QUESTIONS;
    } catch {
      return QUIZ_QUESTIONS;
    }
  });

  // Online Quiz Links
  const [quizLinks, setQuizLinks] = useState<QuizLink[]>(() => {
    try {
      const saved = localStorage.getItem('agri_custom_quiz_links');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_QUIZ_LINKS;
    } catch {
      return DEFAULT_QUIZ_LINKS;
    }
  });

  // Dynamic Folders state with local persistence
  const [folders, setFolders] = useState<StudyFolder[]>(() => {
    try {
      const saved = localStorage.getItem('agri_custom_folders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_FOLDERS;
    } catch {
      return DEFAULT_FOLDERS;
    }
  });

  // Dynamic Batches state with local persistence
  const [batches, setBatches] = useState<StudyBatch[]>(() => {
    try {
      const saved = localStorage.getItem('agri_custom_batches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_BATCHES;
    } catch {
      return DEFAULT_BATCHES;
    }
  });

  // Dynamic App Settings state
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('agri_app_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.appName) return parsed;
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Payment requests
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);

  // Modal dialog states
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [prefillSignupEmail, setPrefillSignupEmail] = useState<string>('');
  const [activePdfReader, setActivePdfReader] = useState<StudyPdf | null>(null);

  // Folder modal state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<StudyFolder | null>(null);

  // Batch modal state
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchToEdit, setBatchToEdit] = useState<StudyBatch | null>(null);

  // Edit Material modal state
  const [editModalConfig, setEditModalConfig] = useState<{
    isOpen: boolean;
    type: 'pdf' | 'video' | 'quiz-link';
    material: StudyPdf | VideoLesson | QuizLink | null;
  }>({
    isOpen: false,
    type: 'pdf',
    material: null
  });

  // Mobile menu drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch persistent materials & folders from server API (sync across all students & devices)
  const fetchMaterials = () => {
    fetch('/api/materials')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          if (Array.isArray(data.folders) && data.folders.length > 0) {
            setFolders(data.folders);
          }
          if (Array.isArray(data.videos) && data.videos.length > 0) {
            setVideos(data.videos);
          }
          if (Array.isArray(data.pdfs) && data.pdfs.length > 0) {
            setPdfs(data.pdfs);
          }
          if (Array.isArray(data.quizQuestions)) {
            setQuizQuestions(data.quizQuestions);
          }
          if (Array.isArray(data.quizLinks) && data.quizLinks.length > 0) {
            setQuizLinks(data.quizLinks);
          }
          if (Array.isArray(data.batches) && data.batches.length > 0) {
            setBatches(data.batches);
          }
          if (data.settings && data.settings.appName) {
            setSettings(data.settings);
          }
          if (Array.isArray(data.students) && data.students.length > 0) {
            setRegisteredAccounts((prev) => {
              const serverStudents = data.students as RegisteredAccount[];
              const merged = [...serverStudents];
              // Keep any local student that is not yet on server
              prev.forEach((localAcc) => {
                if (!merged.some(s => s.email.toLowerCase().trim() === localAcc.email.toLowerCase().trim())) {
                  merged.push(localAcc);
                }
              });
              // Ensure admin is always present with admin role
              const hasAdmin = merged.some(s => s.email.toLowerCase().trim() === 'ahlawatprashantchaudhary@gmail.com');
              if (!hasAdmin) {
                merged.push({
                  name: 'Prashant Chaudhary (Admin)',
                  email: 'ahlawatprashantchaudhary@gmail.com',
                  password: 'admin',
                  role: 'admin',
                  hasPurchasedBatch: true
                });
              }
              return merged;
            });
          }
          if (Array.isArray(data.paymentRequests)) {
            setPaymentRequests(data.paymentRequests);
          }
        }
      })
      .catch((err) => console.log('Materials API fetch offline fallback:', err));
  };

  useEffect(() => {
    fetchMaterials();
    // Poll every 8 seconds so student section automatically updates if admin adds anything
    const interval = setInterval(fetchMaterials, 8000);
    const handleFocus = () => fetchMaterials();
    window.addEventListener('focus', handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Save batches to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agri_custom_batches', JSON.stringify(batches));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, [batches]);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agri_app_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, [settings]);

  // Save registered accounts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agri_registered_accounts', JSON.stringify(registeredAccounts));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, [registeredAccounts]);

  // Save dynamic study materials to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agri_custom_videos', JSON.stringify(videos));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, [videos]);

  useEffect(() => {
    try {
      localStorage.setItem('agri_custom_pdfs', JSON.stringify(pdfs));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, [pdfs]);

  useEffect(() => {
    try {
      localStorage.setItem('agri_custom_quiz', JSON.stringify(quizQuestions));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, [quizQuestions]);

  useEffect(() => {
    try {
      localStorage.setItem('agri_custom_quiz_links', JSON.stringify(quizLinks));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, [quizLinks]);

  useEffect(() => {
    try {
      localStorage.setItem('agri_custom_folders', JSON.stringify(folders));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, [folders]);

  // Save to localStorage when current user changes
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('agri_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('agri_current_user');
      }
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('agri_purchased_batch', hasPurchasedBatch ? 'true' : 'false');
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, [hasPurchasedBatch]);

  // Handlers
  const handleLoginSuccess = (account: RegisteredAccount) => {
    const isPremium = Boolean(account.hasPurchasedBatch);
    setHasPurchasedBatch(isPremium);

    // Strictly authorize admin only for ahlawatprashantchaudhary@gmail.com
    const isAdmin = account.email.toLowerCase().trim() === 'ahlawatprashantchaudhary@gmail.com';

    const studentUser: User = {
      name: account.name,
      email: account.email,
      isPremium: isPremium,
      role: isAdmin ? 'admin' : 'student'
    };
    setCurrentUser(studentUser);

    // If Admin logs in, open the Admin Study Material section directly
    if (isAdmin) {
      setActiveSection('sec-admin');
    }
  };

  const handleSignupSuccess = (account: RegisteredAccount) => {
    const isAdmin = account.email.toLowerCase().trim() === 'ahlawatprashantchaudhary@gmail.com';

    const newAccount: RegisteredAccount = {
      ...account,
      role: isAdmin ? 'admin' : 'student'
    };

    // Add to registered accounts
    setRegisteredAccounts((prev) => {
      const exists = prev.some((u) => u.email.toLowerCase().trim() === newAccount.email.toLowerCase().trim());
      if (exists) {
        return prev.map((u) => u.email.toLowerCase().trim() === newAccount.email.toLowerCase().trim() ? newAccount : u);
      }
      return [...prev, newAccount];
    });

    // CRITICAL: Persist to backend database!
    fetch('/api/students/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAccount)
    }).catch(err => console.log('Student register error:', err));

    setHasPurchasedBatch(false);
    const studentUser: User = {
      name: newAccount.name,
      email: newAccount.email,
      isPremium: false,
      role: isAdmin ? 'admin' : 'student'
    };
    setCurrentUser(studentUser);

    if (isAdmin) {
      setActiveSection('sec-admin');
    }
  };

  const handleUpdatePassword = (email: string, newPass: string): boolean => {
    const normalizedEmail = email.toLowerCase().trim();
    const cleanPass = newPass.trim();
    const isAdminEmail = normalizedEmail === 'ahlawatprashantchaudhary@gmail.com';

    setRegisteredAccounts((prev) => {
      const accountIndex = prev.findIndex(
        (acc) => acc.email.toLowerCase().trim() === normalizedEmail
      );
      if (accountIndex === -1) {
        if (isAdminEmail) {
          return [
            ...prev,
            {
              name: 'Prashant Chaudhary (Admin)',
              email: normalizedEmail,
              password: cleanPass,
              role: 'admin',
              hasPurchasedBatch: true
            }
          ];
        }
        return prev;
      }
      const updated = [...prev];
      updated[accountIndex] = {
        ...updated[accountIndex],
        password: cleanPass
      };
      return updated;
    });

    // CRITICAL: Persist updated password to backend database!
    fetch('/api/students/update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, password: cleanPass })
    }).catch(err => console.log('Password update error:', err));

    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setHasPurchasedBatch(false);
    setActiveSection('sec-home');
  };

  const handleAttemptPurchase = () => {
    if (!currentUser) {
      alert('Kripya batch khareedne se pehle Login ya Sign Up karein.');
      setIsLoginOpen(true);
    } else {
      setIsPaymentOpen(true);
    }
  };

  const handleCompletePayment = () => {
    setHasPurchasedBatch(true);
    if (currentUser) {
      setCurrentUser((prev) => prev ? { ...prev, isPremium: true } : null);
      // Persist to registered account
      setRegisteredAccounts((prev) =>
        prev.map((acc) =>
          acc.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
            ? { ...acc, hasPurchasedBatch: true }
            : acc
        )
      );
    }
    setActiveSection('sec-mycourse');
  };

  const handleOpenSignupFromLogin = (email?: string) => {
    if (email) setPrefillSignupEmail(email);
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  // Folder CRUD Handlers for Admin
  const handleOpenNewFolder = () => {
    setFolderToEdit(null);
    setIsFolderModalOpen(true);
  };

  const handleOpenEditFolder = (folder: StudyFolder) => {
    setFolderToEdit(folder);
    setIsFolderModalOpen(true);
  };

  const handleSaveFolder = (folder: StudyFolder) => {
    const isExisting = folders.some((f) => f.id === folder.id);
    if (isExisting) {
      const oldFolder = folders.find((f) => f.id === folder.id);
      const oldName = oldFolder ? oldFolder.name : folder.name;

      setFolders((prev) => prev.map((f) => (f.id === folder.id ? folder : f)));

      // Cascade folder name updates to all associated materials
      if (oldName !== folder.name) {
        setPdfs((prev) =>
          prev.map((p) =>
            p.folderId === folder.id || p.subject === oldName
              ? { ...p, subject: folder.name, folderId: folder.id }
              : p
          )
        );
        setVideos((prev) =>
          prev.map((v) =>
            v.folderId === folder.id || v.subject === oldName
              ? { ...v, subject: folder.name, folderId: folder.id }
              : v
          )
        );
        setQuizLinks((prev) =>
          prev.map((q) =>
            q.folderId === folder.id || q.subject === oldName
              ? { ...q, subject: folder.name, folderId: folder.id }
              : q
          )
        );
      }

      fetch(`/api/materials/folder/${folder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(folder)
      }).catch((err) => console.log('Folder update error:', err));
    } else {
      setFolders((prev) => [...prev, folder]);
      fetch('/api/materials/folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(folder)
      }).catch((err) => console.log('Folder create error:', err));
    }
  };

  const handleDeleteFolder = (id: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== id));
    fetch(`/api/materials/folder/${id}`, { method: 'DELETE' }).catch((err) =>
      console.log('Folder delete error:', err)
    );
  };

  // Material Edit Handlers
  const handleOpenEditPdf = (pdf: StudyPdf) => {
    setEditModalConfig({ isOpen: true, type: 'pdf', material: pdf });
  };

  const handleSaveEditedPdf = (id: string, updates: Partial<StudyPdf>) => {
    setPdfs((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    fetch(`/api/materials/pdf/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch((err) => console.log('PDF update error:', err));
  };

  const handleOpenEditVideo = (video: VideoLesson) => {
    setEditModalConfig({ isOpen: true, type: 'video', material: video });
  };

  const handleSaveEditedVideo = (id: string, updates: Partial<VideoLesson>) => {
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
    fetch(`/api/materials/video/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch((err) => console.log('Video update error:', err));
  };

  const handleOpenEditQuizLink = (link: QuizLink) => {
    setEditModalConfig({ isOpen: true, type: 'quiz-link', material: link });
  };

  const handleSaveEditedQuizLink = (id: string, updates: Partial<QuizLink>) => {
    setQuizLinks((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
    fetch(`/api/materials/quiz-link/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch((err) => console.log('Quiz link update error:', err));
  };

  const handleDeleteMaterialFromModal = (type: 'pdf' | 'video' | 'quiz-link', id: string) => {
    if (type === 'pdf') handleDeletePdf(id);
    else if (type === 'video') handleDeleteVideo(id);
    else if (type === 'quiz-link') handleDeleteQuizLink(id);
  };

  // Study Material CRUD Handlers for Admin (updates local state + syncs to server API)
  const handleAddPdf = (newPdf: StudyPdf) => {
    setPdfs((prev) => [newPdf, ...prev]);
    fetch('/api/materials/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPdf)
    }).catch((err) => console.log('Sync error:', err));
  };

  const handleDeletePdf = (id: string) => {
    setPdfs((prev) => prev.filter((p) => p.id !== id));
    fetch(`/api/materials/pdf/${id}`, { method: 'DELETE' }).catch((err) => console.log('Delete error:', err));
  };

  const handleAddVideo = (newVideo: VideoLesson) => {
    setVideos((prev) => [...prev, newVideo]);
    fetch('/api/materials/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVideo)
    }).catch((err) => console.log('Sync error:', err));
  };

  const handleDeleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    fetch(`/api/materials/video/${id}`, { method: 'DELETE' }).catch((err) => console.log('Delete error:', err));
  };

  const handleAddQuizQuestion = (newQuestion: QuizQuestion) => {
    setQuizQuestions((prev) => [...prev, newQuestion]);
    fetch('/api/materials/quiz-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuestion)
    }).catch((err) => console.log('Sync error:', err));
  };

  const handleDeleteQuizQuestion = (id: number) => {
    setQuizQuestions((prev) => prev.filter((q) => q.id !== id));
    fetch(`/api/materials/quiz-question/${id}`, { method: 'DELETE' }).catch((err) => console.log('Delete error:', err));
  };

  const handleAddQuizLink = (newLink: QuizLink) => {
    setQuizLinks((prev) => [newLink, ...prev]);
    fetch('/api/materials/quiz-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLink)
    }).catch((err) => console.log('Sync error:', err));
  };

  const handleDeleteQuizLink = (id: string) => {
    setQuizLinks((prev) => prev.filter((q) => q.id !== id));
    fetch(`/api/materials/quiz-link/${id}`, { method: 'DELETE' }).catch((err) => console.log('Delete error:', err));
  };

  // Batch Management Handlers
  const handleOpenNewBatch = () => {
    setBatchToEdit(null);
    setIsBatchModalOpen(true);
  };

  const handleOpenEditBatch = (batch: StudyBatch) => {
    setBatchToEdit(batch);
    setIsBatchModalOpen(true);
  };

  const handleSaveBatch = (savedBatch: StudyBatch) => {
    setBatches((prev) => {
      const exists = prev.some((b) => b.id === savedBatch.id);
      if (exists) {
        return prev.map((b) => (b.id === savedBatch.id ? savedBatch : b));
      }
      return [savedBatch, ...prev];
    });
    fetch('/api/materials/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(savedBatch)
    }).catch((err) => console.log('Batch sync error:', err));
    setIsBatchModalOpen(false);
    setBatchToEdit(null);
  };

  const handleDeleteBatch = (id: string) => {
    setBatches((prev) => prev.filter((b) => b.id !== id));
    fetch(`/api/materials/batch/${id}`, { method: 'DELETE' }).catch((err) => console.log('Delete batch error:', err));
    setIsBatchModalOpen(false);
    setBatchToEdit(null);
  };

  const handleQuickAdjustPrice = (batchId: string, delta: number) => {
    setBatches((prev) => {
      const updated = prev.map((b) => {
        if (b.id === batchId) {
          const newPrice = Math.max(0, (b.price || 0) + delta);
          const origPrice = Math.max(newPrice, b.originalPrice || newPrice);
          const discount = origPrice > newPrice ? Math.round(((origPrice - newPrice) / origPrice) * 100) : 0;
          const adjusted: StudyBatch = {
            ...b,
            price: newPrice,
            originalPrice: origPrice,
            discountPercentage: discount
          };
          fetch('/api/materials/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adjusted)
          }).catch((err) => console.log('Batch sync error:', err));
          return adjusted;
        }
        return b;
      });
      return updated;
    });
  };

  // Settings Handler
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    }).catch((err) => console.log('Settings sync error:', err));
  };

  // Student Access & Payment Handlers
  const handleToggleBatchAccess = (email: string, batchId: string, status: boolean) => {
    fetch('/api/students/toggle-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, batchId, status })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          if (data.students) setRegisteredAccounts(data.students);
          if (data.batches) setBatches(data.batches);
        }
      })
      .catch((err) => console.log('Toggle access error:', err));

    setRegisteredAccounts((prev) =>
      prev.map((acc) => {
        if (acc.email.toLowerCase().trim() === email.toLowerCase().trim()) {
          const currentBatches = acc.enrolledBatches || [];
          const updatedBatches = status
            ? Array.from(new Set([...currentBatches, batchId]))
            : currentBatches.filter((b) => b !== batchId);
          return {
            ...acc,
            enrolledBatches: updatedBatches,
            hasPurchasedBatch: updatedBatches.length > 0
          };
        }
        return acc;
      })
    );
  };

  const handleAddStudent = (newStudent: RegisteredAccount) => {
    setRegisteredAccounts((prev) => [...prev, newStudent]);
    fetch('/api/students/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent)
    }).catch((err) => console.log('Student add error:', err));
  };

  const handleDeleteStudent = (email: string) => {
    setRegisteredAccounts((prev) => prev.filter((s) => s.email.toLowerCase().trim() !== email.toLowerCase().trim()));
    fetch(`/api/students/${encodeURIComponent(email)}`, { method: 'DELETE' }).catch((err) => console.log('Student delete error:', err));
  };

  const handleApprovePayment = (paymentId: string) => {
    fetch('/api/payments/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          if (data.paymentRequests) setPaymentRequests(data.paymentRequests);
          if (data.students) setRegisteredAccounts(data.students);
          if (data.batches) setBatches(data.batches);
        }
      })
      .catch((err) => console.log('Approve payment error:', err));
  };

  const handleRejectPayment = (paymentId: string) => {
    fetch('/api/payments/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          if (data.paymentRequests) setPaymentRequests(data.paymentRequests);
        }
      })
      .catch((err) => console.log('Reject payment error:', err));
  };

  const handleResetToDefaults = () => {
    setFolders(DEFAULT_FOLDERS);
    setVideos(FREE_VIDEOS);
    setPdfs(FREE_PDFS);
    setQuizQuestions(QUIZ_QUESTIONS);
    setQuizLinks(DEFAULT_QUIZ_LINKS);
    fetch('/api/materials/reset', { method: 'POST' }).catch((err) => console.log('Reset error:', err));
  };

  const isAdmin = Boolean(
    currentUser &&
    currentUser.email.toLowerCase().trim() === 'ahlawatprashantchaudhary@gmail.com'
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f0f2f5] text-[#333333] font-sans antialiased">
      {/* 1. Left Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={(sec) => setActiveSection(sec)}
        currentUser={currentUser}
        hasPurchasedBatch={hasPurchasedBatch}
        onOpenLoginModal={() => setIsLoginOpen(true)}
        onOpenSignupModal={() => setIsSignupOpen(true)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        settings={settings}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Topbar
          activeSection={activeSection}
          currentUser={currentUser}
          hasPurchasedBatch={hasPurchasedBatch}
          onOpenLoginModal={() => setIsLoginOpen(true)}
          onOpenSignupModal={() => setIsSignupOpen(true)}
          onLogout={handleLogout}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
          settings={settings}
        />

        {/* Dynamic Section View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeSection === 'sec-home' && (
            <HomeSection
              currentUser={currentUser}
              hasPurchasedBatch={hasPurchasedBatch}
              onNavigate={(sec) => setActiveSection(sec)}
              onOpenStore={() => setActiveSection('sec-store')}
              batches={batches}
              folders={folders}
              videos={videos}
              pdfs={pdfs}
              quizLinks={quizLinks}
              settings={settings}
              onOpenNewBatch={handleOpenNewBatch}
              onEditBatch={handleOpenEditBatch}
              onDeleteBatch={handleDeleteBatch}
              onQuickAdjustPrice={handleQuickAdjustPrice}
              onOpenBatchPayment={() => setIsPaymentOpen(true)}
            />
          )}

          {activeSection === 'sec-video' && (
            <VideoSection
              videos={videos}
              folders={folders}
              isAdmin={isAdmin}
              onOpenStore={() => setActiveSection('sec-store')}
              hasPurchasedBatch={hasPurchasedBatch}
              onNavigateMyCourses={() => setActiveSection('sec-mycourse')}
              onEditVideo={handleOpenEditVideo}
              onDeleteVideo={handleDeleteVideo}
              onOpenUploadVideo={() => setActiveSection('sec-admin')}
              onOpenNewFolder={handleOpenNewFolder}
              onEditFolder={handleOpenEditFolder}
            />
          )}

          {activeSection === 'sec-pdf' && (
            <PdfSection
              pdfs={pdfs}
              folders={folders}
              isAdmin={isAdmin}
              onOpenPdfReader={(pdf) => setActivePdfReader(pdf)}
              hasPurchasedBatch={hasPurchasedBatch}
              onOpenStore={() => setActiveSection('sec-store')}
              onNavigateMyCourses={() => setActiveSection('sec-mycourse')}
              onEditPdf={handleOpenEditPdf}
              onDeletePdf={handleDeletePdf}
              onOpenUploadPdf={() => setActiveSection('sec-admin')}
              onOpenNewFolder={handleOpenNewFolder}
              onEditFolder={handleOpenEditFolder}
            />
          )}

          {activeSection === 'sec-quiz' && (
            <QuizSection 
              questions={quizQuestions} 
              quizLinks={quizLinks}
              isAdmin={isAdmin}
              onEditQuizLink={handleOpenEditQuizLink}
              onDeleteQuizLink={handleDeleteQuizLink}
              onOpenUploadQuiz={() => setActiveSection('sec-admin')}
            />
          )}

          {activeSection === 'sec-store' && (
            <StoreSection
              hasPurchasedBatch={hasPurchasedBatch}
              onAttemptPurchase={handleAttemptPurchase}
              onNavigateMyCourses={() => setActiveSection('sec-mycourse')}
              batches={batches}
              folders={folders}
              currentUser={currentUser}
              isAdmin={isAdmin}
              onOpenNewBatch={handleOpenNewBatch}
              onEditBatch={handleOpenEditBatch}
              onDeleteBatch={handleDeleteBatch}
              onQuickAdjustPrice={handleQuickAdjustPrice}
            />
          )}

          {activeSection === 'sec-mycourse' && (
            <MyCoursesSection
              currentUser={currentUser}
              hasPurchasedBatch={hasPurchasedBatch}
              videos={videos}
              pdfs={pdfs}
              quizLinks={quizLinks}
              onOpenPdfReader={(pdf) => setActivePdfReader(pdf)}
              onOpenStore={() => setActiveSection('sec-store')}
              onOpenLoginModal={() => setIsLoginOpen(true)}
            />
          )}

          {activeSection === 'sec-admin' && (
            <AdminUploadSection
              currentUser={currentUser}
              folders={folders}
              videos={videos}
              pdfs={pdfs}
              quizQuestions={quizQuestions}
              quizLinks={quizLinks}
              batches={batches}
              onOpenNewBatch={handleOpenNewBatch}
              onEditBatch={handleOpenEditBatch}
              onDeleteBatch={handleDeleteBatch}
              onQuickAdjustPrice={handleQuickAdjustPrice}
              students={registeredAccounts}
              paymentRequests={paymentRequests}
              onToggleBatchAccess={handleToggleBatchAccess}
              onApprovePayment={handleApprovePayment}
              onRejectPayment={handleRejectPayment}
              onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onAddPdf={handleAddPdf}
              onEditPdf={handleOpenEditPdf}
              onDeletePdf={handleDeletePdf}
              onAddVideo={handleAddVideo}
              onEditVideo={handleOpenEditVideo}
              onDeleteVideo={handleDeleteVideo}
              onAddQuizQuestion={handleAddQuizQuestion}
              onDeleteQuizQuestion={handleDeleteQuizQuestion}
              onAddQuizLink={handleAddQuizLink}
              onEditQuizLink={handleOpenEditQuizLink}
              onDeleteQuizLink={handleDeleteQuizLink}
              onOpenNewFolder={handleOpenNewFolder}
              onEditFolder={handleOpenEditFolder}
              onDeleteFolder={handleDeleteFolder}
              onResetToDefaults={handleResetToDefaults}
              onPreviewPdf={(pdf) => setActivePdfReader(pdf)}
            />
          )}
        </main>
      </div>

      {/* 3. Popups & Modals */}
      <Modals
        isLoginOpen={isLoginOpen}
        onCloseLogin={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenSignup={handleOpenSignupFromLogin}
        isSignupOpen={isSignupOpen}
        onCloseSignup={() => setIsSignupOpen(false)}
        onSignupSuccess={handleSignupSuccess}
        onOpenLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
        prefillSignupEmail={prefillSignupEmail}
        registeredAccounts={registeredAccounts}
        onUpdatePassword={handleUpdatePassword}
        isPaymentOpen={isPaymentOpen}
        onClosePayment={() => setIsPaymentOpen(false)}
        onCompletePayment={handleCompletePayment}
        activePdf={activePdfReader}
        onClosePdfReader={() => setActivePdfReader(null)}
      />

      {/* 4. Folder Create / Edit Modal */}
      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => {
          setIsFolderModalOpen(false);
          setFolderToEdit(null);
        }}
        folderToEdit={folderToEdit}
        onSaveFolder={handleSaveFolder}
        onDeleteFolder={handleDeleteFolder}
      />

      {/* 5. Material Edit Modal (PDF, Video, Quiz Link) */}
      <EditMaterialModal
        isOpen={editModalConfig.isOpen}
        onClose={() => setEditModalConfig((prev) => ({ ...prev, isOpen: false, material: null }))}
        type={editModalConfig.type}
        folders={folders}
        material={editModalConfig.material}
        onSavePdf={handleSaveEditedPdf}
        onSaveVideo={handleSaveEditedVideo}
        onSaveQuizLink={handleSaveEditedQuizLink}
        onDelete={handleDeleteMaterialFromModal}
      />

      {/* 6. Batch Create / Edit Modal */}
      <BatchModal
        isOpen={isBatchModalOpen}
        onClose={() => {
          setIsBatchModalOpen(false);
          setBatchToEdit(null);
        }}
        batchToEdit={batchToEdit}
        onSaveBatch={handleSaveBatch}
        onDeleteBatch={handleDeleteBatch}
        folders={folders}
      />
    </div>
  );
}
