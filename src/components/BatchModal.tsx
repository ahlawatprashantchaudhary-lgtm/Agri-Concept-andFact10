import React, { useState, useEffect } from 'react';
import { 
  X, Key, MessageSquare, ChevronLeft, ShieldCheck, 
  User, Lock, Unlock, LogOut, Settings, GraduationCap, 
  BookOpen, Users, LayoutDashboard, Plus, Edit, Trash2,
  CheckCircle, PlayCircle, FileText
} from 'lucide-react';

const SECRET_ADMIN_ID = "7055975531";

const initialCourses = [
  { id: 1, title: 'UPPSC Agriculture Services', price: '₹999', students: 1240 },
  { id: 2, title: 'Agronomy Masterclass', price: '₹499', students: 850 },
  { id: 3, title: 'Agriculture Facts & MCQ', price: '₹299', students: 2100 },
];

const ChangePasswordModal = ({ isOpen, onClose, onChangePassword, userId }) => {
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const res = onChangePassword(userId, oldPwd, newPwd);
      if (res.success) {
        setMsg({ type: 'success', text: 'Password changed successfully! (पासवर्ड सफलतापूर्वक बदल दिया गया!)' });
        setTimeout(() => {
          setOldPwd(''); setNewPwd(''); setMsg({ type: '', text: '' });
          setIsSubmitting(false);
          onClose();
        }, 1500);
      } else {
        setMsg({ type: 'error', text: res.error });
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative overflow-hidden flex flex-col p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer" disabled={isSubmitting}>
          <X className="w-5 h-5" />
        </button>
        <div className="flex justify-center mb-2">
           <div className="p-3 bg-green-100 text-green-700 rounded-full"><Key className="w-6 h-6" /></div>
        </div>
        <h2 className="text-xl font-bold text-center text-zinc-900 mb-6">Change Password</h2>

        {msg.text && (
          <div className={`mb-4 p-3 text-sm font-medium rounded-xl border ${msg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Current Password (वर्तमान पासवर्ड)</label>
            <input type="password" required value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} className="w-full text-sm px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600" disabled={isSubmitting} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">New Password (नया पासवर्ड)</label>
            <input type="password" required value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="w-full text-sm px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600" disabled={isSubmitting} />
          </div>
          <button type="submit" disabled={isSubmitting || !oldPwd || !newPwd} className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3.5 rounded-xl transition-colors cursor-pointer flex justify-center items-center shadow-lg mt-2">
            {isSubmitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

const AuthModal = ({ isOpen, onClose, mode, users, onRegister, onUserLogin, onAdminLogin, onResetPassword }) => {
  // steps: 'ENTER_ID', 'ENTER_PWD', 'SIGNUP', 'ADMIN_FIRST_PWD', 'FORGOT_ID', 'FORGOT_OTP', 'RESET_PWD'
  const [step, setStep] = useState(mode === 'login' ? 'ENTER_ID' : 'SIGNUP');
  const [contactId, setContactId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(mode === 'login' ? 'ENTER_ID' : 'SIGNUP');
      setContactId(''); setPassword(''); setName(''); setOtp(''); setError(''); setSuccessMsg('');
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleNextFromId = (e) => {
    e.preventDefault();
    setError('');
    const user = users.find(u => u.id === contactId);

    if (contactId === SECRET_ADMIN_ID) {
      if (user) setStep('ENTER_PWD'); // Admin returning
      else setStep('ADMIN_FIRST_PWD'); // Admin first time
    } else {
      if (user) setStep('ENTER_PWD'); // User returning
      else setError('Account not found. Please Sign Up first. (खाता नहीं मिला, कृपया पहले साइन अप करें)');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    setTimeout(() => {
      const user = users.find(u => u.id === contactId);
      if (user && user.password === password) {
        setIsSubmitting(false);
        if (user.role === 'admin') onAdminLogin(user);
        else onUserLogin(user);
      } else {
        setIsSubmitting(false);
        setError('Incorrect password. (गलत पासवर्ड)');
      }
    }, 800);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      if (users.find(u => u.id === contactId)) {
        setIsSubmitting(false);
        setError('Mobile number/Email already registered! (यह नंबर पहले से पंजीकृत है)');
        return;
      }

      const role = contactId === SECRET_ADMIN_ID ? 'admin' : 'student';
      const newUser = { id: contactId, name: name || 'Admin', password, role };
      onRegister(newUser);
      setIsSubmitting(false);
      
      if (role === 'admin') onAdminLogin(newUser);
      else onUserLogin(newUser);
    }, 800);
  };

  const handleForgotIdSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!users.find(u => u.id === contactId)) {
       setError('No account found with this ID. (इस आईडी से कोई खाता नहीं मिला)');
       return;
    }
    setStep('FORGOT_OTP');
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (otp === '123456') { // Mock OTP verification
      setStep('RESET_PWD');
    } else {
      setError('Invalid OTP. Please enter 123456 (गलत OTP)');
    }
  };

  const handleResetPwdSubmit = (e) => {
    e.preventDefault();
    setError('');
    onResetPassword(contactId, password);
    setSuccessMsg('Password Reset Successfully! You can now login.');
    setTimeout(() => {
      setStep('ENTER_ID');
      setPassword('');
      setSuccessMsg('');
    }, 2000);
  };

  const renderContent = () => {
    if (step === 'ENTER_ID') {
      return (
        <form onSubmit={handleNextFromId} className="animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold text-center text-zinc-900 mb-2">Sign In</h2>
          <p className="text-sm text-center text-zinc-500 mb-6">Agri Concept and Fact</p>
          {error && <p className="text-red-500 text-xs text-center mb-4 bg-red-50 p-2 rounded-lg">{error}</p>}
          {successMsg && <p className="text-green-600 text-xs text-center mb-4 bg-green-50 p-2 rounded-lg">{successMsg}</p>}
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Mobile Number / Email</label>
            <input type="text" required value={contactId} onChange={(e) => setContactId(e.target.value)} placeholder="Enter your registered ID" className="w-full text-sm px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none" />
          </div>
          
          <div className="text-right mb-6">
            <button type="button" onClick={() => { setStep('FORGOT_ID'); setContactId(''); setError(''); }} className="text-sm font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer flex items-center justify-end gap-1 w-full">
              <Unlock className="w-4 h-4" /> Forgot Password?
            </button>
          </div>

          <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer shadow-lg">Next</button>
          <div className="mt-6 text-center text-sm text-zinc-600">
            Don't have an account? <span onClick={() => {setStep('SIGNUP'); setContactId('');}} className="text-green-700 font-bold hover:underline cursor-pointer">Sign Up</span>
          </div>
        </form>
      );
    }

    if (step === 'ENTER_PWD') {
      return (
        <form onSubmit={handleLoginSubmit} className="animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold text-center text-zinc-900 mb-2">Enter Password</h2>
          <p className="text-sm text-center text-zinc-500 mb-6">Logging in as <span className="font-bold text-zinc-800">{contactId}</span></p>
          {error && <p className="text-red-500 text-xs text-center mb-4 bg-red-50 p-2 rounded-lg">{error}</p>}
          
          <div className="mb-6">
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your Password" className="w-full text-sm px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none" disabled={isSubmitting} />
          </div>
          
          <button type="submit" disabled={isSubmitting} className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer shadow-lg flex justify-center items-center">
            {isSubmitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Login'}
          </button>
        </form>
      );
    }

    if (step === 'SIGNUP' || step === 'ADMIN_FIRST_PWD') {
      return (
        <form onSubmit={handleSignupSubmit} className="animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold text-center text-zinc-900 mb-2">
            {step === 'ADMIN_FIRST_PWD' ? 'Admin Setup' : 'Create Account'}
          </h2>
          <p className="text-sm text-center text-zinc-500 mb-6">Agri Concept and Fact</p>
          {error && <p className="text-red-500 text-xs text-center mb-4 bg-red-50 p-2 rounded-lg">{error}</p>}
          
          {step === 'SIGNUP' && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-zinc-700 mb-1">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Student Name" className="w-full text-sm px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none" disabled={isSubmitting}/>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Mobile Number</label>
            <input type="text" required value={contactId} readOnly={step === 'ADMIN_FIRST_PWD'} onChange={(e) => setContactId(e.target.value)} placeholder="Enter Mobile Number" className={`w-full text-sm px-4 py-3 border border-zinc-300 rounded-xl outline-none ${step === 'ADMIN_FIRST_PWD' ? 'bg-zinc-100 text-zinc-500' : 'focus:ring-2 focus:ring-green-600'}`} disabled={isSubmitting} />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Create Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Secure Password" className="w-full text-sm px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none" disabled={isSubmitting} />
          </div>
          
          <button type="submit" disabled={isSubmitting} className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer shadow-lg flex justify-center items-center">
             {isSubmitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : (step === 'ADMIN_FIRST_PWD' ? 'Set Admin Password' : 'Sign Up')}
          </button>
          
          {step === 'SIGNUP' && (
            <div className="mt-6 text-center text-sm text-zinc-600">
              Already registered? <span onClick={() => {setStep('ENTER_ID'); setContactId('');}} className="text-green-700 font-bold hover:underline cursor-pointer">Sign In</span>
            </div>
          )}
        </form>
      );
    }

    if (step === 'FORGOT_ID') {
       return (
         <form onSubmit={handleForgotIdSubmit} className="animate-in fade-in slide-in-from-right-4 duration-300">
           <h2 className="text-2xl font-bold text-center text-zinc-900 mb-2">Forgot Password</h2>
           <p className="text-sm text-center text-zinc-500 mb-6">Enter your registered ID to receive OTP.</p>
           {error && <p className="text-red-500 text-xs text-center mb-4 bg-red-50 p-2 rounded-lg">{error}</p>}
           
           <div className="mb-6">
             <input type="text" required value={contactId} onChange={(e) => setContactId(e.target.value)} placeholder="Registered Mobile/Email" className="w-full text-sm px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none" />
           </div>
           
           <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer shadow-lg">Send OTP</button>
         </form>
       );
    }

    if (step === 'FORGOT_OTP') {
       return (
         <form onSubmit={handleOtpSubmit} className="animate-in fade-in slide-in-from-right-4 duration-300">
           <h2 className="text-2xl font-bold text-center text-zinc-900 mb-2">Verify OTP</h2>
           <p className="text-sm text-center text-zinc-500 mb-6">Enter the OTP sent to {contactId}</p>
           {error && <p className="text-red-500 text-xs text-center mb-4 bg-red-50 p-2 rounded-lg">{error}</p>}
           
           <div className="mb-6">
             <input type="text" required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="123456 (Mock OTP)" className="w-full text-center tracking-widest text-xl font-bold px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none" />
           </div>
           
           <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer shadow-lg">Verify OTP</button>
         </form>
       );
    }

    if (step === 'RESET_PWD') {
       return (
         <form onSubmit={handleResetPwdSubmit} className="animate-in fade-in slide-in-from-right-4 duration-300">
           <h2 className="text-2xl font-bold text-center text-zinc-900 mb-2">Create New Password</h2>
           <p className="text-sm text-center text-zinc-500 mb-6">Set a strong password for your account.</p>
           
           <div className="mb-6">
             <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" className="w-full text-sm px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none" />
           </div>
           
           <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer shadow-lg">Reset Password</button>
         </form>
       );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden flex flex-col p-6 sm:p-8">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer" disabled={isSubmitting}>
          <X className="w-5 h-5" />
        </button>

        {step !== 'ENTER_ID' && step !== 'SIGNUP' && (
          <button onClick={() => setStep(mode === 'login' ? 'ENTER_ID' : 'SIGNUP')} className="absolute top-4 left-4 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer" disabled={isSubmitting}>
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div className="flex justify-center mb-6 mt-4">
          <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-8 h-8 text-green-700" />
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

const AdminPortal = ({ onLogout, courses, setCourses, adminId, onChangePassword }) => {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-green-500 p-2 rounded-lg"><GraduationCap className="w-6 h-6 text-white"/></div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Agri Concept<br/><span className="text-green-400">Admin</span></h2>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-green-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><LayoutDashboard className="w-5 h-5" /> Dashboard</button>
          <button onClick={() => setActiveTab('courses')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'courses' ? 'bg-green-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><BookOpen className="w-5 h-5" /> Manage Courses</button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-green-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Users className="w-5 h-5" /> Users</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-green-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Settings className="w-5 h-5" /> Settings</button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-red-500 hover:text-white text-slate-300 rounded-xl text-sm font-medium transition-all cursor-pointer"><LogOut className="w-4 h-4" /> Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && <div className="flex flex-col items-center justify-center h-64 text-slate-400"><LayoutDashboard className="w-16 h-16 mb-4 opacity-20" /><p>Dashboard Overview coming soon.</p></div>}
          
          {activeTab === 'courses' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800">Course Management</h3>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md"><Plus className="w-4 h-4" /> Add New Course</button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                      <th className="p-4 font-semibold">Course Title</th>
                      <th className="p-4 font-semibold">Price</th>
                      <th className="p-4 font-semibold">Students</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(course => (
                      <tr key={course.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium text-slate-800">{course.title}</td>
                        <td className="p-4 text-green-600 font-bold">{course.price}</td>
                        <td className="p-4 text-slate-600">{course.students}</td>
                        <td className="p-4 flex justify-end gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"><Edit className="w-4 h-4" /></button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && <div className="flex flex-col items-center justify-center h-64 text-slate-400"><Users className="w-16 h-16 mb-4 opacity-20" /><p>User management module coming soon.</p></div>}
          
          {activeTab === 'settings' && (
            <div className="max-w-xl animate-in fade-in duration-300">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Account Settings</h3>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                 <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Key className="w-5 h-5 text-green-600"/> Change Admin Password</h4>
                 <form onSubmit={(e) => {
                    e.preventDefault();
                    const res = onChangePassword(adminId, e.target.oldPwd.value, e.target.newPwd.value);
                    if(res.success) { alert('Password updated successfully!'); e.target.reset(); }
                    else { alert(res.error); }
                 }} className="space-y-4">
                    <input name="oldPwd" type="password" required placeholder="Current Password" className="w-full text-sm px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                    <input name="newPwd" type="password" required placeholder="New Password" className="w-full text-sm px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                    <button type="submit" className="bg-green-700 text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-green-800 transition-colors cursor-pointer shadow-md">Update Password</button>
                 </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserPortal = ({ user, onLogout, courses, onChangePassword }) => {
  const [isChangePwdOpen, setIsChangePwdOpen] = useState(false);

  return (
    <div className="min-h-screen bg-green-50/30 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-green-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-1.5 rounded-lg"><GraduationCap className="w-6 h-6 text-white" /></div>
            <span className="font-extrabold text-xl text-green-900 tracking-tight">Agri Concept</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-zinc-800 leading-tight">Welcome, {user?.name}</p>
              <p className="text-xs text-zinc-500">{user?.id}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shadow-md">
              {(user?.name || 'S')[0].toUpperCase()}
            </div>
            <button onClick={() => setIsChangePwdOpen(true)} className="p-2 text-zinc-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors cursor-pointer" title="Settings">
              <Settings className="w-5 h-5" />
            </button>
            <button onClick={onLogout} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">My Courses</h1>
        <p className="text-zinc-500 mb-8">Continue your agriculture preparation journey.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-3xl p-1 shadow-sm border border-green-100 hover:shadow-xl transition-all duration-300 group">
              <div className="bg-green-50 rounded-2xl p-6 aspect-video flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start">
                  <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm border border-green-100">
                    Active
                  </div>
                  <PlayCircle className="w-8 h-8 text-green-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-zinc-900 leading-tight mb-1">{course.title}</h3>
                  <p className="text-xs text-zinc-500 flex items-center gap-1"><FileText className="w-3 h-3"/> View Study Material</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-500">Progress</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-24 h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[15%] rounded-full"></div>
                    </div>
                    <span className="text-xs font-bold text-green-600">15%</span>
                  </div>
                </div>
                <button className="bg-zinc-900 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-md">
                  Resume
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <ChangePasswordModal 
        isOpen={isChangePwdOpen} 
        onClose={() => setIsChangePwdOpen(false)} 
        onChangePassword={onChangePassword} 
        userId={user?.id} 
      />
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [authModalConfig, setAuthModalConfig] = useState({ isOpen: false, mode: 'login' });
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [courses, setCourses] = useState(initialCourses);

  const handleAdminLogin = (user) => {
    setCurrentUser(user);
    setCurrentView('admin_portal');
    setAuthModalConfig({ isOpen: false, mode: 'login' });
  };

  const handleUserLogin = (user) => {
    setCurrentUser(user);
    setCurrentView('user_portal');
    setAuthModalConfig({ isOpen: false, mode: 'login' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const openAuth = (mode) => {
    setAuthModalConfig({ isOpen: true, mode });
  };

  const handleRegister = (newUser) => {
    setRegisteredUsers([...registeredUsers, newUser]);
  };

  const handleResetPassword = (id, newPassword) => {
    setRegisteredUsers(registeredUsers.map(u => u.id === id ? { ...u, password: newPassword } : u));
  };

  const handleChangePassword = (userId, oldPassword, newPassword) => {
    const user = registeredUsers.find(u => u.id === userId);
    if (user && user.password === oldPassword) {
      setRegisteredUsers(registeredUsers.map(u => u.id === userId ? { ...u, password: newPassword } : u));
      return { success: true };
    }
    return { success: false, error: 'Incorrect current password (वर्तमान पासवर्ड गलत है).' };
  };

  if (currentView === 'admin_portal') return <AdminPortal onLogout={handleLogout} courses={courses} setCourses={setCourses} adminId={currentUser?.id} onChangePassword={handleChangePassword} />;
  if (currentView === 'user_portal') return <UserPortal user={currentUser} onLogout={handleLogout} courses={courses} onChangePassword={handleChangePassword} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-green-200">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md border-b border-zinc-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-700 p-2 rounded-xl shadow-sm"><GraduationCap className="w-6 h-6 text-white" /></div>
            <span className="font-extrabold text-xl tracking-tight text-zinc-900">Agri Concept <span className="text-green-700 font-black">and Fact</span></span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => openAuth('login')} className="px-5 py-2.5 text-sm font-bold text-zinc-700 hover:text-green-700 transition-colors cursor-pointer hidden sm:block">Sign In</button>
            <button onClick={() => openAuth('signup')} className="bg-zinc-900 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg cursor-pointer">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-bold mb-8 border border-green-200">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span></span>
          Top Agriculture Coaching Platform
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tight leading-[1.1] mb-6">
          Master Agriculture <br/><span className="text-green-700">Concepts & Facts</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mb-10 font-medium">
          Comprehensive preparation courses covering all agriculture subjects, video classes, notes, and mock tests for State Exams.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button onClick={() => openAuth('signup')} className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-green-900/20 cursor-pointer flex items-center justify-center gap-2">
            Start Learning Now <ChevronLeft className="w-5 h-5 rotate-180" />
          </button>
          <button onClick={() => openAuth('login')} className="bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 px-8 py-4 rounded-2xl text-lg font-bold transition-all shadow-sm cursor-pointer sm:hidden">
            Sign In
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-4xl text-left">
           <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex flex-col gap-4">
             <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600"><BookOpen className="w-6 h-6"/></div>
             <h3 className="font-bold text-zinc-900 text-lg">Expert Material</h3>
             <p className="text-zinc-500 text-sm">Detailed PDF notes and fact-sheets (English + Hindi) designed by agriculture specialists.</p>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex flex-col gap-4">
             <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600"><CheckCircle className="w-6 h-6"/></div>
             <h3 className="font-bold text-zinc-900 text-lg">Mock Tests</h3>
             <p className="text-zinc-500 text-sm">Full length mock tests based on latest exam patterns to boost your preparation.</p>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex flex-col gap-4">
             <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600"><Users className="w-6 h-6"/></div>
             <h3 className="font-bold text-zinc-900 text-lg">Doubt Support</h3>
             <p className="text-zinc-500 text-sm">Secret Telegram doubt discussion groups directly with subject experts.</p>
           </div>
        </div>
      </main>

      {/* Dynamic Authentication Modal */}
      <AuthModal 
        isOpen={authModalConfig.isOpen} 
        onClose={() => setAuthModalConfig({ ...authModalConfig, isOpen: false })} 
        mode={authModalConfig.mode}
        users={registeredUsers}
        onRegister={handleRegister}
        onUserLogin={handleUserLogin}
        onAdminLogin={handleAdminLogin}
        onResetPassword={handleResetPassword}
      />
    </div>
  );
}
