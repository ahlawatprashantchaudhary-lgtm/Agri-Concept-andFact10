import React, { useState, useEffect } from 'react';
import { Folder, FolderPlus, X, Save, Trash2, Check, AlertCircle } from 'lucide-react';
import { StudyFolder } from '../types';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderToEdit: StudyFolder | null;
  onSaveFolder: (folder: StudyFolder) => void;
  onDeleteFolder?: (id: string) => void;
}

export const FolderModal: React.FC<FolderModalProps> = ({
  isOpen,
  onClose,
  folderToEdit,
  onSaveFolder,
  onDeleteFolder
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'pdf' | 'video' | 'quiz' | 'all'>('all');
  const [targetBatch, setTargetBatch] = useState<string>('both');
  const [color, setColor] = useState('#1b5e20');
  const [isCourse, setIsCourse] = useState(false);
  const [price, setPrice] = useState('99');
  const [originalPrice, setOriginalPrice] = useState('499');
  const [paymentLink, setPaymentLink] = useState('upi://pay?pa=ahlawatprashantchaudhary@gmail.com&pn=AgriCoaching&am=99&cu=INR');
  const [telegramLink, setTelegramLink] = useState('https://t.me/AgriTargetStateExam');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (folderToEdit) {
      setName(folderToEdit.name);
      setDescription(folderToEdit.description || '');
      setCategory(folderToEdit.category || 'all');
      setTargetBatch(folderToEdit.targetBatch || 'both');
      setColor(folderToEdit.color || '#1b5e20');
      setIsCourse(Boolean(folderToEdit.isCourse || folderToEdit.price));
      setPrice(folderToEdit.price ? String(folderToEdit.price) : '99');
      setOriginalPrice(folderToEdit.originalPrice ? String(folderToEdit.originalPrice) : '499');
      setPaymentLink(folderToEdit.paymentLink || 'upi://pay?pa=ahlawatprashantchaudhary@gmail.com&pn=AgriCoaching&am=99&cu=INR');
      setTelegramLink(folderToEdit.telegramLink || 'https://t.me/AgriTargetStateExam');
    } else {
      setName('');
      setDescription('');
      setCategory('all');
      setTargetBatch('both');
      setColor('#1b5e20');
      setIsCourse(false);
      setPrice('99');
      setOriginalPrice('499');
      setPaymentLink('upi://pay?pa=ahlawatprashantchaudhary@gmail.com&pn=AgriCoaching&am=99&cu=INR');
      setTelegramLink('https://t.me/AgriTargetStateExam');
    }
    setError(null);
  }, [folderToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('कृपया फोल्डर / विषय का नाम दर्ज करें (Folder name is required).');
      return;
    }

    const folderData: StudyFolder = {
      id: folderToEdit ? folderToEdit.id : `folder-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      category,
      targetBatch,
      color,
      isCourse,
      price: isCourse ? (parseFloat(price) || 0) : undefined,
      originalPrice: isCourse ? (parseFloat(originalPrice) || 0) : undefined,
      paymentLink: isCourse ? paymentLink.trim() : undefined,
      telegramLink: telegramLink.trim() || undefined,
      createdAt: folderToEdit?.createdAt || new Date().toISOString()
    };

    onSaveFolder(folderData);
    onClose();
  };

  const handleDelete = () => {
    if (!folderToEdit || !onDeleteFolder) return;
    if (window.confirm(`क्या आप वाकई "${folderToEdit.name}" फोल्डर को हटाना चाहते हैं?`)) {
      onDeleteFolder(folderToEdit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-zinc-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 to-[#1b5e20] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-white">
              {folderToEdit ? <Folder className="w-5 h-5" /> : <FolderPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold">
                {folderToEdit ? '📁 फोल्डर / कोर्स संपादित करें (Edit Folder / Course)' : '➕ नया फोल्डर / कोर्स जोड़ें (Add Unlimited Folders)'}
              </h3>
              <p className="text-xs text-emerald-200">
                नया नाम दें, प्राइस जोड़ें, पेमेंट लिंक व टेलीग्राम लिंक सेट करें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              फ़ोल्डर / विषय का नाम (Folder / Subject Name) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="उदा. Agronomy (सस्य विज्ञान), UP Special GK, Animal Husbandry..."
              className="w-full text-sm px-3.5 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e20] focus:border-transparent font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              विवरण (Description / Topics inside)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="उदा. फसल चक्र, बुवाई, बीज दर और खरपतवार प्रबंधन के सभी नोट्स और वीडियो"
              className="w-full text-xs px-3.5 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e20] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                सामग्री का प्रकार (Folder Type)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
              >
                <option value="all">🌐 सभी (All - PDFs, Videos, Quizzes)</option>
                <option value="pdf">📄 केवल PDF नोट्स (PDF Notes Only)</option>
                <option value="video">🎥 केवल वीडियो क्लास (Videos Only)</option>
                <option value="quiz">📝 केवल ऑनलाइन टेस्ट (Quizzes Only)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                किसके लिए उपलब्ध (Audience)
              </label>
              <select
                value={targetBatch}
                onChange={(e) => setTargetBatch(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
              >
                <option value="both">🌟 सभी छात्र (Free + Paid Batch)</option>
                <option value="free">🎁 केवल फ्री छात्र (Free Only)</option>
                <option value="paid">⭐ केवल Paid Batch (पेड छात्र)</option>
              </select>
            </div>
          </div>

          {/* Course / Price & Payment Settings */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-950">
                  💰 क्या यह एक पेड कोर्स / फ़ोल्डर है? (Paid Course / Batch Folder)
                </span>
                <p className="text-[11px] text-amber-800">
                  यदि हां, तो इसमें प्राइस और पेमेंट लिंक जोड़ें ताकि छात्र पेमेंट के बाद अनलॉक कर सकें
                </p>
              </div>
              <input
                type="checkbox"
                checked={isCourse}
                onChange={(e) => setIsCourse(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-zinc-300 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {isCourse && (
              <div className="space-y-3 pt-2 border-t border-amber-200/60 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      ऑफर प्राइस (₹ Selling Price) *
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="99"
                      className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      एमआरपी (₹ Original Price)
                    </label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="499"
                      className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                    पेमेंट लिंक / UPI आईडी (Payment Gateway or UPI URL) *
                  </label>
                  <input
                    type="text"
                    value={paymentLink}
                    onChange={(e) => setPaymentLink(e.target.value)}
                    placeholder="upi://pay?pa=ahlawatprashantchaudhary@gmail.com&pn=AgriCoaching&am=99&cu=INR"
                    className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg bg-white"
                  />
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                     छात्र इस लिंक पर क्लिक करके पेमेंट कर सकेंगे (UPI, Google Pay, PhonePe, Paytm या Razorpay/QR URL)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Telegram Link Setting */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              🚀 टेलीग्राम ग्रुप / चैनल लिंक (Telegram Discussion Link)
            </label>
            <input
              type="url"
              value={telegramLink}
              onChange={(e) => setTelegramLink(e.target.value)}
              placeholder="https://t.me/AgriTargetStateExam"
              className="w-full text-xs px-3.5 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
            />
            <p className="text-[10px] text-zinc-500 mt-0.5">
              इस बैच/फ़ोल्डर में एनरोल होने वाले छात्र इस टेलीग्राम लिंक से ग्रुप में सीधे जुड़ सकेंगे
            </p>
          </div>

          <div className="pt-3 border-t border-zinc-200 flex items-center justify-between gap-3">
            {folderToEdit && onDeleteFolder ? (
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>फ़ोल्डर हटाएं (Delete)</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs px-4 py-2 border border-zinc-300 hover:bg-zinc-100 rounded-lg font-medium text-zinc-700 transition-colors cursor-pointer"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="submit"
                className="text-xs bg-[#1b5e20] hover:bg-[#2e7d32] text-white px-5 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{folderToEdit ? 'अपडेट करें (Save Changes)' : 'फ़ोल्डर जोड़ें (Create Folder)'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
