import React, { useState } from 'react';
import { X, ShieldAlert, PhoneCall, MessageSquare, HeartHandshake, ExternalLink } from 'lucide-react';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose }) => {
  const [trustedName, setTrustedName] = useState(() => localStorage.getItem('mindcare_trusted_name') || 'Dr. Sarah / Family');
  const [trustedPhone, setTrustedPhone] = useState(() => localStorage.getItem('mindcare_trusted_phone') || '+1-555-0199');
  const [isEditingTrusted, setIsEditingTrusted] = useState(false);

  if (!isOpen) return null;

  const handleSaveTrusted = () => {
    localStorage.setItem('mindcare_trusted_name', trustedName);
    localStorage.setItem('mindcare_trusted_phone', trustedPhone);
    setIsEditingTrusted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rose-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        id="sos-support-dialog"
        className="relative w-full max-w-lg rounded-3xl bg-white p-6 md:p-8 shadow-2xl border-2 border-rose-200"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Emergency Alert Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Immediate Safety Support
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">Need Immediate Help?</h3>
          </div>
        </div>

        {/* Essential Statement */}
        <div className="rounded-2xl bg-rose-50 p-4 border border-rose-100 text-xs text-rose-950 leading-relaxed font-medium mb-5">
          "If you are in immediate danger or feel you may hurt yourself, please contact your local emergency service, reach out to someone you trust, or connect with a qualified mental-health professional immediately."
        </div>

        {/* Direct Emergency Hotlines */}
        <div className="space-y-3 mb-6">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">988 Suicide & Crisis Lifeline</div>
              <div className="text-[11px] text-slate-500">Free, confidential 24/7 support (US & Canada)</div>
            </div>
            <a
              href="tel:988"
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition"
            >
              <PhoneCall className="h-3.5 w-3.5" /> Call 988
            </a>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">Crisis Text Line</div>
              <div className="text-[11px] text-slate-500">Text HOME to 741741 to connect with a crisis counselor</div>
            </div>
            <a
              href="sms:741741?body=HOME"
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-900 transition"
            >
              <MessageSquare className="h-3.5 w-3.5" /> Text HOME
            </a>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">International Emergency Services</div>
              <div className="text-[11px] text-slate-500">Call 112 (EU), 999 (UK), 102/112 (India), 000 (Aus)</div>
            </div>
            <a
              href="tel:112"
              className="flex items-center gap-1.5 rounded-xl bg-slate-200 px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-300 transition"
            >
              <PhoneCall className="h-3.5 w-3.5" /> Call 112
            </a>
          </div>
        </div>

        {/* Trusted Contact Section */}
        <div className="rounded-2xl bg-teal-50/60 p-4 border border-teal-100 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
              <HeartHandshake className="h-4 w-4 text-teal-600" />
              Your Designated Trusted Contact
            </span>
            <button
              onClick={() => setIsEditingTrusted(!isEditingTrusted)}
              className="text-[11px] text-teal-700 font-semibold underline hover:text-teal-900"
            >
              {isEditingTrusted ? 'Done' : 'Edit'}
            </button>
          </div>

          {isEditingTrusted ? (
            <div className="space-y-2 mt-2">
              <input
                type="text"
                value={trustedName}
                onChange={(e) => setTrustedName(e.target.value)}
                placeholder="Trusted person's name or title"
                className="w-full rounded-lg border border-teal-200 bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-teal-500"
              />
              <input
                type="text"
                value={trustedPhone}
                onChange={(e) => setTrustedPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full rounded-lg border border-teal-200 bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-teal-500"
              />
              <button
                onClick={handleSaveTrusted}
                className="rounded-lg bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-700"
              >
                Save Contact
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between mt-1">
              <div>
                <div className="text-xs font-bold text-slate-800">{trustedName}</div>
                <div className="text-[11px] text-slate-600">{trustedPhone}</div>
              </div>
              <a
                href={`tel:${trustedPhone}`}
                className="rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition"
              >
                Call Contact
              </a>
            </div>
          )}
        </div>

        {/* Crucial Hospital / Prototype Disclaimer */}
        <div className="text-center">
          <p className="text-[11px] text-slate-400 leading-normal">
            MindCare AI provides educational wellness and screening support. It does not provide emergency medical care, crisis intervention, or replacement for emergency services.
          </p>
          <button
            onClick={onClose}
            className="mt-3 text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
          >
            I am safe, return to app
          </button>
        </div>
      </div>
    </div>
  );
};
