export interface User {
  name: string;
  email: string;
  mobile?: string;
  isPremium?: boolean;
  role?: 'admin' | 'student';
  enrolledBatches?: string[];
}

export interface RegisteredAccount {
  name: string;
  email: string;
  mobile?: string;
  password?: string;
  hasPurchasedBatch?: boolean;
  role?: 'admin' | 'student';
  enrolledBatches?: string[];
  isLoggedIn?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface StudyFolder {
  id: string;
  name: string;
  category: 'pdf' | 'video' | 'quiz' | 'all';
  targetBatch: string; // 'free' | 'paid' | 'both' | batch id
  description?: string;
  icon?: string;
  color?: string;
  price?: number;
  originalPrice?: number;
  paymentLink?: string;
  telegramLink?: string;
  isCourse?: boolean;
  batchId?: string;
  enrolledStudents?: string[];
  createdAt?: string;
}

export interface StudyBatch {
  id: string;
  name: string;
  title?: string;
  tagline?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  paymentLink?: string;
  telegramLink?: string;
  badge?: string;
  isSpecialBatch?: boolean;
  color?: string;
  folderId?: string;
  folderName?: string;
  features?: string[];
  syllabus?: string[];
  syllabusTopics?: string[];
  enrolledStudents?: string[];
  isActive?: boolean;
  createdAt?: string;
}

export interface PaymentRequest {
  id: string;
  studentName: string;
  studentEmail: string;
  studentMobile: string;
  batchId: string;
  batchName: string;
  amount: number;
  paymentMethod: string;
  transactionRef?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
}

export interface AppSettings {
  appName: string;
  tagline?: string;
  subtitle?: string;
  subTitle?: string;
  helplineEmail: string;
  helplinePhone?: string;
  telegramChannel?: string;
  upiId?: string;
  supportPhone?: string;
  marqueeNotice?: string;
  bannerTitle?: string;
  bannerDescription?: string;
}

export interface VideoLesson {
  id: string;
  title: string;
  subject: string;
  duration: string;
  videoUrl: string;
  description: string;
  topics: string[];
  isPaid?: boolean;
  targetBatch?: string;
  batchId?: string;
  folderId?: string;
  createdAt?: string;
}

export interface StudyPdf {
  id: string;
  title: string;
  subject: string;
  pages: string;
  language: string;
  fileName: string;
  fileContent: string;
  summary: string;
  fileSize?: string;
  fileType?: 'pdf' | 'text';
  isPaid?: boolean;
  targetBatch?: string;
  batchId?: string;
  folderId?: string;
  createdAt?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  isPaid?: boolean;
  targetBatch?: string;
  batchId?: string;
  folderId?: string;
  externalLink?: string;
}

export interface QuizLink {
  id: string;
  title: string;
  subject: string;
  quizUrl: string;
  totalQuestions?: string;
  duration?: string;
  description?: string;
  dateAdded?: string;
  addedDate?: string;
  isPaid?: boolean;
  targetBatch?: string;
  batchId?: string;
  folderId?: string;
  createdAt?: string;
}

export type ActiveSection =
  | 'sec-home'
  | 'sec-video'
  | 'sec-pdf'
  | 'sec-quiz'
  | 'sec-store'
  | 'sec-mycourse'
  | 'sec-admin';

