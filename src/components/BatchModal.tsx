import React, { useState, useEffect } from 'react';
import { GraduationCap, X, Save, Trash2, AlertCircle, Plus, Check, Folder, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { StudyBatch, StudyFolder } from '../types';

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchToEdit: StudyBatch | null;
  onSaveBatch: (batch: StudyBatch) => void;
  onDeleteBatch?: (id: string) => void;
  folders?: StudyFolder[];
}

export const BatchModal: React.FC<BatchModalProps> = ({
  isOpen,
  onClose,
  batchToEdit,
  onSaveBatch,
  onDeleteBatch,
  folders = []
}) => {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('99');
  const [originalPrice, setOriginalPrice] = useState('499');
  const [paymentLink, setPaymentLink] = useState('upi://pay?pa=ahlawatprashantchaudhary@gmail.com&pn=AgriCoaching&am=99&cu=INR');
  const [telegramLink, setTelegramLink] = useState('https://t.me/AgriTargetStateExam');
  const [badge, setBadge] = useState('⭐ Most Popular');
  const [folderId, setFolderId] = useState<string>('');
  const [featureInputs, setFeatureInputs] = useState<string[]>([
    '120+ High-Definition Recorded Video Lectures (All 6 modules)',
    'Complete Chapter-wise PDF Notes & Fact-Sheets (English + Hindi)',
    '15 Full Length Mock Tests based on latest exam pattern',
    'Special focus on Uttar Pradesh Agriculture, Schemes & Statistics',
    'Telegram Secret Doubt Discussion Group with Agriculture Specialists',
    'Previous Year Solved Papers with detailed video explanations'
  ]);
  const [newFeature, setNewFeature] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (batchToEdit) {
      setName(batchToEdit.name);
      setTagline(batchToEdit.tagline || '');
      setDescription(batchToEdit.description || '');
      setPrice(String(batchToEdit.price || 99));
      setOriginalPrice(String(batchToEdit.originalPrice || 499));
      setPaymentLink(batchToEdit.paymentLink || 'upi://pay?pa=ahlawatprashantchaudhary@gmail.com&pn=AgriCoaching&am=99&cu=INR');
      setTelegramLink(batchToEdit.telegramLink || 'https://t.me/AgriTargetStateExam');
      setBadge(batchToEdit.badge || '⭐ Most Popular');
      setFolderId(batchToEdit.folderId || (folders.length > 0 ? folders[0].id : ''));
      if (batchToEdit.features && batchToEdit.features.length > 0) {
        setFeatureInputs(batchToEdit.features);
      }
    } else {
      setName('');
      setTagline('Complete Selection Guaranteed Preparation Batch');
      setDescription('Comprehensive preparation course covering all agriculture subjects, video classes, notes and mock tests.');
      setPrice('99');
      setOriginalPrice('499');
      setPaymentLink('upi://pay?pa=ahlawatprashantchaudhary@gmail.com&pn=AgriCoaching&am=99&cu=INR');
      setTelegramLink('https://t.me/AgriTargetStateExam');
      setBadge('⭐ Most Popular');
      setFolderId(folders.length > 0 ? folders[0].id : '');
    }
    setError(null);
  }, [batchToEdit, isOpen, folders]);

  if (!isOpen) return null;

  const handleAdjustPrice = (delta: number) => {
    const current = parseFloat(price) || 0;
    const nextVal = Math.max(0, current + delta);
    setPrice(String(nextVal));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatureInputs([...featureInputs, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatureInputs(featureInputs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('बैच का नाम दर्ज करना अनिवार्य है (Batch name is required).');
      return;
    }

    const numPrice = parseFloat(price) || 0;
    const numOrig = parseFloat(originalPrice) || numPrice;
    const discount = numOrig > numPrice ? Math.round(((numOrig - numPrice) / numOrig) * 100) : 0;
    const matchedFolder = folders.find(f => f.id === folderId);

    const batchData: StudyBatch = {
      id: batchToEdit ? batchToEdit.id : `batch-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      price: numPrice,
      originalPrice: numOrig,
      discountPercentage: discount,
      paymentLink: paymentLink.trim(),
      telegramLink: telegramLink.trim(),
      badge: badge.trim(),
      folderId: folderId || undefined,
      folderName: matchedFolder ? matchedFolder.name : undefined,
      features: featureInputs.filter(f => f.trim().length > 0),
      syllabus: batchToEdit?.syllabus || [
        'General Agriculture, Agronomy & Weather Forecasting',
        'Soil Science, Fertility, Saline-Alkali Soil Reclamation',
        'Horticulture, Olericulture, Pomology & Post Harvest Technology',
        'Plant Pathology, Entomology & Integrated Pest Management (IPM)',
        'Animal Husbandry, Dairying & Livestock Management',
        'Uttar Pradesh Agriculture, Agro-Ecological Zones & State Schemes'
      ],
      enrolledStudents: batchToEdit?.enrolledStudents || [],
      isActive: true,
      createdAt: batchToEdit?.createdAt || new Date().toISOString()
    };

    onSaveBatch(batchData);
    onClose();
  };

  const handleDelete = () => {
    if (!batchToEdit || !onDeleteBatch) return;
    if (window.confirm(`क्या आप वाकई बैच "${batchToEdit.name}" को हटाना चाहते हैं?`)) {
      onDeleteBatch(batchToEdit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-zinc-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 to-[#1b5e20] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {batchToEdit ? '🎓 बैच संपादित करें (Edit Batch)' : '➕ नया बैच जोड़ें (Create New Batch)'}
              </h3>
              <p className="text-xs text-emerald-200">
                बैच का नाम, फीस, पेमेंट लिंक और टेलीग्राम ग्रुप लिंक सेट करें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                बैच का नाम (Batch / Course Name) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा. टारगेट स्टेट एग्जाम एंड एग्रीकल्चर एग्जाम (Special Batch)"
                className="w-full text-sm px-3.5 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e20] font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                बैज / टैग (Badge)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="उदा. ⭐ Bestseller, Live + Recorded"
                className="w-full text-xs px-3.5 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              सबटाइटल / टैगलाइन (Subtitle / Tagline)
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Complete Selection Guaranteed Preparation Batch"
              className="w-full text-xs px-3.5 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              बैच विवरण (Description)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="इस बैच में छात्रों को क्या मिलेगा (वीडियो क्लासेस, पीडीएफ नोट्स, टेस्ट सीरीज आदि)..."
              className="w-full text-xs px-3.5 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
            />
          </div>

          {/* Linked Study Folder for Paid Batch */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
            <label className="block text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-blue-700" />
              <span>📁 इस पेड बैच का स्टडी फ़ोल्डर (Linked Study Folder for this Batch)</span>
            </label>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              छात्र जब इस बैच में एनरोल करेंगे, तो वे सीधे इस फ़ोल्डर के सभी नोट्स, क्लासेज व टेस्ट एक्सेस कर पाएंगे।
            </p>
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-zinc-800"
            >
              <option value="">-- कोई विशिष्ट फ़ोल्डर चुनें (Select Folder) --</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  📁 {f.name} ({f.category.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Pricing and Links with Quick Price Adjuster */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>💳 फीस व पेमेंट लिंक सेटिंग्स (Pricing & Payment Link)</span>
              </h4>
              {parseFloat(originalPrice) > parseFloat(price) && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                  {Math.round(((parseFloat(originalPrice) - parseFloat(price)) / parseFloat(originalPrice)) * 100)}% छूट (Save ₹{parseFloat(originalPrice) - parseFloat(price)})
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  ऑफर फीस (Selling Price ₹) *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="99"
                  className="w-full text-sm font-bold text-emerald-800 px-3 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-2 focus:ring-[#1b5e20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  मूल फीस (Original Price ₹)
                </label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="499"
                  className="w-full text-sm px-3 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-2 focus:ring-[#1b5e20] text-zinc-600"
                />
              </div>
            </div>

            {/* Quick Price Adjuster (बढ़ाएं / घटाएं) */}
            <div className="pt-2 border-t border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span>प्राइस घटाएं या बढ़ाएं (Quick Price Adjuster):</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-zinc-600">
                  वर्तमान: ₹{price || 0}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAdjustPrice(-50)}
                  className="px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-800 text-[11px] font-bold cursor-pointer transition-colors"
                >
                  - ₹50
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustPrice(-10)}
                  className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold cursor-pointer transition-colors"
                >
                  - ₹10
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustPrice(10)}
                  className="px-2 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold cursor-pointer transition-colors"
                >
                  + ₹10
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustPrice(50)}
                  className="px-2 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold cursor-pointer transition-colors"
                >
                  + ₹50
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustPrice(100)}
                  className="px-2 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold cursor-pointer transition-colors"
                >
                  + ₹100
                </button>

                <div className="h-4 w-px bg-emerald-300 mx-1 hidden sm:block" />

                {/* Direct Presets */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-zinc-500 font-semibold mr-0.5">Presets:</span>
                  {[49, 99, 149, 199, 299, 499].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPrice(String(preset))}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                        Number(price) === preset
                          ? 'bg-[#1b5e20] text-white'
                          : 'bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                      }`}
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                पेमेंट लिंक / UPI QR URL (Payment URL or UPI Deep-Link) *
              </label>
              <input
                type="text"
                required
                value={paymentLink}
                onChange={(e) => setPaymentLink(e.target.value)}
                placeholder="upi://pay?pa=ahlawatprashantchaudhary@gmail.com&pn=AgriCoaching&am=99&cu=INR"
                className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-2 focus:ring-[#1b5e20]"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                छात्र इस लिंक या UPI आईडी पर भुगतान करके स्क्रीनशॉट या ट्रांजैक्शन आईडी अपलोड करेंगे
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                🚀 बैच टेलीग्राम लिंक (Batch Secret Telegram Link) *
              </label>
              <input
                type="url"
                required
                value={telegramLink}
                onChange={(e) => setTelegramLink(e.target.value)}
                placeholder="https://t.me/AgriTargetStateExam"
                className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-2 focus:ring-[#1b5e20]"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                पेमेंट कन्फर्म होने के बाद छात्र सीधे इस टेलीग्राम ग्रुप/चैनल में जुड़ेंगे
              </p>
            </div>
          </div>

          {/* Key Features list */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              बैच की मुख्य विशेषताएं (Batch Highlights / Key Features)
            </label>
            <div className="space-y-1.5 mb-2">
              {featureInputs.map((f, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                  <div className="flex items-center gap-1.5 text-zinc-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-red-500 hover:text-red-700 text-xs px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    हटाएं
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="उदा. Daily Doubt Sessions on Google Meet"
                className="flex-1 text-xs px-3 py-1.5 border border-zinc-300 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-1.5 bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-zinc-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>जोड़ें</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-zinc-200 flex items-center justify-between gap-3">
            {batchToEdit && onDeleteBatch ? (
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>बैच हटाएं (Delete Batch)</span>
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
                <span>{batchToEdit ? 'अपडेट करें (Save Changes)' : 'बैच बनाएं (Create Batch)'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
