import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Trash2, 
  Plus, 
  CreditCard, 
  ExternalLink,
  Download,
  Filter,
  GraduationCap,
  Sparkles,
  Send,
  Smartphone,
  Calendar
} from 'lucide-react';
import { RegisteredAccount, StudyBatch, PaymentRequest } from '../types';

interface StudentManagerProps {
  students: RegisteredAccount[];
  batches: StudyBatch[];
  paymentRequests: PaymentRequest[];
  onToggleBatchAccess: (email: string, batchId: string, status: boolean) => void;
  onApprovePayment: (paymentId: string) => void;
  onRejectPayment: (paymentId: string) => void;
  onAddStudent: (newStudent: RegisteredAccount) => void;
  onDeleteStudent: (email: string) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  batches,
  paymentRequests,
  onToggleBatchAccess,
  onApprovePayment,
  onRejectPayment,
  onAddStudent,
  onDeleteStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'enrolled'>('all');
  const [activeTab, setActiveTab] = useState<'students' | 'payments'>('students');

  // Add Student modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newPassword, setNewPassword] = useState('pass1234');
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || 'batch-agta-2026');
  const [grantImmediateAccess, setGrantImmediateAccess] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Filter students
  const filteredStudents = students.filter(student => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      student.name.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term) ||
      (student.mobile && student.mobile.includes(term));

    if (!matchesSearch) return false;

    if (statusFilter === 'online') return student.isLoggedIn;
    if (statusFilter === 'offline') return !student.isLoggedIn;
    if (statusFilter === 'enrolled') return student.hasPurchasedBatch || (student.enrolledBatches && student.enrolledBatches.length > 0);
    return true;
  });

  const pendingPayments = paymentRequests.filter(p => p.status === 'pending');
  const onlineCount = students.filter(s => s.isLoggedIn).length;
  const enrolledCount = students.filter(s => s.hasPurchasedBatch || (s.enrolledBatches && s.enrolledBatches.length > 0)).length;

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      setFormError('Name and Email are required.');
      return;
    }

    if (students.some(s => s.email.toLowerCase().trim() === newEmail.toLowerCase().trim())) {
      setFormError('An account with this email already exists.');
      return;
    }

    const student: RegisteredAccount = {
      name: newName.trim(),
      email: newEmail.toLowerCase().trim(),
      mobile: newMobile.trim(),
      password: newPassword.trim(),
      role: 'student',
      isLoggedIn: false,
      createdAt: new Date().toISOString(),
      hasPurchasedBatch: grantImmediateAccess,
      enrolledBatches: grantImmediateAccess ? [selectedBatchId] : []
    };

    onAddStudent(student);
    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewMobile('');
    setFormError(null);
  };

  const exportStudentsToCSV = () => {
    const headers = ['Name', 'Email', 'Mobile', 'Login Status', 'Last Login', 'Enrolled Batches', 'Registration Date'];
    const rows = students.map(s => [
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.mobile || 'N/A'}"`,
      `"${s.isLoggedIn ? 'Online' : 'Offline'}"`,
      `"${s.lastLoginAt ? new Date(s.lastLoginAt).toLocaleString('en-IN') : 'N/A'}"`,
      `"${(s.enrolledBatches || []).join(', ') || (s.hasPurchasedBatch ? 'Paid Batch' : 'Free')}"`,
      `"${s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN') : 'N/A'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Target_State_Exam_Students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-semibold">कुल छात्र (Total Students)</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-zinc-900">{students.length}</div>
          <p className="text-[10px] text-zinc-500 mt-0.5">रजिस्टर्ड यूजर अकाउंट</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-xs font-semibold">लॉगिन छात्र (Online Now)</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-900">{onlineCount}</div>
          <p className="text-[10px] text-emerald-700 mt-0.5">सक्रिय (Active Login Status)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-xs font-semibold">बैच छात्र (Paid Enrolled)</span>
            <GraduationCap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900">{enrolledCount}</div>
          <p className="text-[10px] text-amber-700 mt-0.5">कोर्स एक्सेस प्राप्त</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/40 shadow-2xs">
          <div className="flex items-center justify-between text-blue-700 mb-1">
            <span className="text-xs font-semibold">पेमेंट सत्यापन (Pending)</span>
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-900">{pendingPayments.length}</div>
          <p className="text-[10px] text-blue-700 mt-0.5">मंजूरी का इंतजार</p>
        </div>
      </div>

      {/* Action Bar & Sub-Tabs */}
      <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'students'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>छात्र सूची व लॉगिन रिकॉर्ड ({students.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
                activeTab === 'payments'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>पेमेंट पुष्टि व अनुरोध</span>
              {pendingPayments.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ml-1">
                  {pendingPayments.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportStudentsToCSV}
              className="px-3 py-1.5 rounded-lg border border-zinc-300 text-zinc-700 text-xs font-semibold hover:bg-zinc-50 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="छात्रों का डेटा एक्सेल / CSV में डाउनलोड करें"
            >
              <Download className="w-3.5 h-3.5 text-zinc-600" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#1b5e20] hover:bg-[#2e7d32] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ नया छात्र जोड़ें</span>
            </button>
          </div>
        </div>

        {/* Tab 1: STUDENTS LIST & LOGIN TRACKING */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="छात्र का नाम, ईमेल या मोबाइल नंबर से खोजें..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-zinc-800 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  सभी ({students.length})
                </button>
                <button
                  onClick={() => setStatusFilter('online')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                    statusFilter === 'online'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  🟢 ऑनलाइन ({onlineCount})
                </button>
                <button
                  onClick={() => setStatusFilter('offline')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap cursor-pointer ${
                    statusFilter === 'offline'
                      ? 'bg-zinc-600 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  ⚪ ऑफलाइन ({students.length - onlineCount})
                </button>
                <button
                  onClick={() => setStatusFilter('enrolled')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap cursor-pointer ${
                    statusFilter === 'enrolled'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  ⭐ बैच एनरोल्ड ({enrolledCount})
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto border border-zinc-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider">
                    <th className="p-3">छात्र का नाम (Student)</th>
                    <th className="p-3">ईमेल आईडी (Email)</th>
                    <th className="p-3">मोबाइल नंबर (Mobile)</th>
                    <th className="p-3 text-center">लॉगिन स्थिति (Login Status)</th>
                    <th className="p-3">एनरोल्ड बैच (Batch Access)</th>
                    <th className="p-3 text-right">कार्रवाई (Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 font-medium">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-zinc-500">
                        कोई छात्र नहीं मिला (No students match search filter).
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => {
                      const isMainAdmin = student.email.toLowerCase().trim() === 'ahlawatprashantchaudhary@gmail.com';
                      const isEnrolled = student.hasPurchasedBatch || (student.enrolledBatches && student.enrolledBatches.length > 0);

                      return (
                        <tr key={student.email} className="hover:bg-zinc-50/60 transition-colors">
                          {/* Student Name */}
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
                                isMainAdmin ? 'bg-amber-600' : 'bg-emerald-700'
                              }`}>
                                {student.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                                  <span>{student.name}</span>
                                  {isMainAdmin && (
                                    <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded border border-amber-300">
                                      CHIEF ADMIN
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-zinc-400">
                                  {student.createdAt ? new Date(student.createdAt).toLocaleDateString('en-IN') : 'Registered'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="p-3 text-zinc-700">
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              <span className="font-mono">{student.email}</span>
                            </div>
                          </td>

                          {/* Mobile */}
                          <td className="p-3">
                            {student.mobile ? (
                              <div className="flex items-center gap-1.5 text-zinc-800">
                                <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="font-bold font-mono">{student.mobile}</span>
                                <a
                                  href={`https://wa.me/91${student.mobile.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200"
                                  title="WhatsApp पर मैसेज भेजें"
                                >
                                  WhatsApp
                                </a>
                              </div>
                            ) : (
                              <span className="text-zinc-400 italic">उपलब्ध नहीं (Not set)</span>
                            )}
                          </td>

                          {/* Login Status */}
                          <td className="p-3 text-center">
                            {student.isLoggedIn ? (
                              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>ऑनलाइन (Logged In)</span>
                              </div>
                            ) : (
                              <div className="inline-flex flex-col items-center">
                                <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-600 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                                  <span>ऑफलाइन (Offline)</span>
                                </span>
                                {student.lastLoginAt && (
                                  <span className="text-[9px] text-zinc-400 mt-0.5">
                                    Last: {new Date(student.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Enrolled Batches */}
                          <td className="p-3">
                            <div className="flex flex-wrap items-center gap-1">
                              {batches.map((batch) => {
                                const hasBatch = student.enrolledBatches?.includes(batch.id) || (student.hasPurchasedBatch && batch.id.includes('agta'));
                                return (
                                  <button
                                    key={batch.id}
                                    onClick={() => onToggleBatchAccess(student.email, batch.id, !hasBatch)}
                                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                      hasBatch
                                        ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                                        : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200'
                                    }`}
                                    title={hasBatch ? `एक्सेस हटाएं (${batch.name})` : `एक्सेस दें (${batch.name})`}
                                  >
                                    {hasBatch ? <CheckCircle2 className="w-3 h-3 text-emerald-700" /> : <XCircle className="w-3 h-3 text-zinc-400" />}
                                    <span>{batch.name.slice(0, 18)}...</span>
                                  </button>
                                );
                              })}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-3 text-right">
                            {!isMainAdmin ? (
                              <button
                                onClick={() => {
                                  if (window.confirm(`क्या आप वाकई छात्र ${student.name} (${student.email}) को पोर्टल से हटाना चाहते हैं?`)) {
                                    onDeleteStudent(student.email);
                                  }
                                }}
                                className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="छात्र को हटाएं"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-zinc-400 font-semibold">Admin Protected</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: PAYMENT VERIFICATION & APPROVAL */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
              <div>
                <strong>पेमेंट पुष्टि प्रणाली:</strong> छात्र जब UPI या पेमेंट लिंक से भुगतान करते हैं तो उनका अनुरोध यहां दिखता है। &apos;Approve&apos; बटन दबाते ही छात्र का कोर्स तुरंत अनलॉक हो जाएगा।
              </div>
            </div>

            {paymentRequests.length === 0 ? (
              <div className="text-center py-10 bg-zinc-50 rounded-xl border border-zinc-200">
                <CreditCard className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-zinc-600">कोई लंबित पेमेंट अनुरोध नहीं है</p>
                <p className="text-xs text-zinc-400 mt-1">जब भी कोई छात्र पेमेंट करेगा, उसका विवरण यहां दिखाई देगा</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-zinc-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase">
                      <th className="p-3">छात्र (Student Details)</th>
                      <th className="p-3">कोर्स / बैच (Target Batch)</th>
                      <th className="p-3">फीस (Amount)</th>
                      <th className="p-3">ट्रांजैक्शन Ref / UTR</th>
                      <th className="p-3 text-center">स्थिति (Status)</th>
                      <th className="p-3 text-right">अनुमोदन (Approval)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 font-medium">
                    {paymentRequests.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-50/60">
                        <td className="p-3">
                          <div className="font-bold text-zinc-900">{p.studentName}</div>
                          <div className="text-[11px] text-zinc-500 font-mono">{p.studentEmail}</div>
                          {p.studentMobile && (
                            <div className="text-[11px] text-emerald-700 font-bold">📱 {p.studentMobile}</div>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-zinc-800">{p.batchName}</span>
                          <div className="text-[10px] text-zinc-400">
                            {new Date(p.createdAt).toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-sm font-black text-emerald-700">₹{p.amount}</span>
                        </td>
                        <td className="p-3 font-mono text-zinc-600">
                          {p.transactionRef || 'UPI Verification Request'}
                        </td>
                        <td className="p-3 text-center">
                          {p.status === 'approved' ? (
                            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                              ✅ स्वीकृत (Approved)
                            </span>
                          ) : p.status === 'rejected' ? (
                            <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                              ❌ अस्वीकृत (Rejected)
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-extrabold animate-pulse">
                              ⏳ लंबित (Pending)
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {p.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => onApprovePayment(p.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer shadow-2xs"
                              >
                                ✓ बैच अनलॉक करें
                              </button>
                              <button
                                onClick={() => onRejectPayment(p.id)}
                                className="bg-zinc-200 hover:bg-red-100 text-zinc-700 hover:text-red-700 font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-zinc-400">कार्रवाई पूर्ण</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-zinc-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>नया छात्र जोड़ें (Add Student Manually)</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-2.5 bg-red-50 text-red-700 rounded-lg text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  छात्र का पूरा नाम (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="उदा. अमित कुमार"
                  className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  ईमेल आईडी (Email ID) *
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  मोबाइल नंबर (Mobile Number) *
                </label>
                <input
                  type="tel"
                  required
                  value={newMobile}
                  onChange={(e) => setNewMobile(e.target.value)}
                  placeholder="9876543210"
                  className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  पासवर्ड (Default Password)
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg font-mono"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950">बैच एक्सेस प्रदान करें?</span>
                  <input
                    type="checkbox"
                    checked={grantImmediateAccess}
                    onChange={(e) => setGrantImmediateAccess(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                </div>

                {grantImmediateAccess && (
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      कौन सा बैच अनलॉक करें?
                    </label>
                    <select
                      value={selectedBatchId}
                      onChange={(e) => setSelectedBatchId(e.target.value)}
                      className="w-full text-xs p-2 border border-zinc-300 rounded-lg bg-white"
                    >
                      {batches.map(b => (
                        <option key={b.id} value={b.id}>{b.name} (₹{b.price})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs px-3 py-2 border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="text-xs bg-[#1b5e20] hover:bg-[#2e7d32] text-white font-bold px-4 py-2 rounded-lg cursor-pointer shadow-xs"
                >
                  छात्र सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
