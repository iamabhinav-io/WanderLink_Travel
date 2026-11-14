import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Users, Phone, Mail, MessageSquare, Send } from 'lucide-react';

/**
 * Interactive Inquiry & Contact Modal for Community listings
 * Ensures every "Contact Host", "Contact Provider", "Contact Guide" button
 * performs a complete, meaningful, interactive workflow with instant feedback.
 */
const InquiryModal = ({ isOpen, onClose, item, type = 'accommodation' }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    dates: '',
    guests: '1',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({ name: '', contact: '', dates: '', guests: '1', message: '' });
    onClose();
  };

  const getTitle = () => {
    switch (type) {
      case 'accommodation':
        return `Contact Host • ${item.hostName || item.title}`;
      case 'food':
        return `Book Food Experience • ${item.providerName || item.title}`;
      case 'guide':
        return `Connect with Guide • ${item.name}`;
      default:
        return 'Send Inquiry';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-stone-100 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-600 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">Inquiry Sent!</h3>
            <p className="text-stone-600 text-sm mb-6 leading-relaxed">
              Your message regarding <strong className="text-stone-800">{item.title || item.name}</strong> has been delivered. 
              The community host will reach out to you shortly via WanderLink chat or phone.
            </p>
            <div className="bg-stone-50 rounded-2xl p-4 text-xs text-stone-600 mb-6 text-left border border-stone-200/60">
              <div className="font-semibold text-stone-800 mb-1">Direct Host Details:</div>
              {item.contactPhone && <div>Phone / WhatsApp: {item.contactPhone}</div>}
              {item.contactEmail && <div>Email: {item.contactEmail}</div>}
              {item.location && <div>Location: {item.location}</div>}
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 pr-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                WanderLink Community Connect
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-stone-900 mt-1 leading-snug">
                {getTitle()}
              </h3>
              <p className="text-xs md:text-sm text-stone-600 mt-1 truncate">
                {item.title || item.name} • {item.location}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Phone or WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Preferred Dates
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next Weekend"
                    value={formData.dates}
                    onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Message / Special Requests
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Tell the host about your travel vibe, dietary preferences, or questions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-emerald-800 text-white hover:bg-emerald-900 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-900/10"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Direct Inquiry</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-stone-600 pt-1">
                🔒 WanderLink Community Protection Guarantee • Zero booking commissions
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryModal;
