import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#c2c6d3] animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00346f]">help</span>
            <h3 className="text-lg font-bold text-[#111c2d]">How QRAttend Works</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-[#424751]">
          <div className="p-3 bg-[#f0f3ff] rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00346f] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">sync</span>
            </div>
            <div>
              <h4 className="font-bold text-[#111c2d] text-xs">1. Dynamic Rotating QR Codes</h4>
              <p className="text-[11px] mt-0.5 leading-relaxed">
                The smartboard display updates its cryptographic QR token every 5-10 seconds. Even if a student takes a photo and sends it to a peer at home, the token will expire before it can be scanned.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#f0f3ff] rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#004a99] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">radar</span>
            </div>
            <div>
              <h4 className="font-bold text-[#111c2d] text-xs">2. Geofence Distance Validation</h4>
              <p className="text-[11px] mt-0.5 leading-relaxed">
                The student mobile scanner calculates real-time proximity to the professor's podium. If the student is beyond the 100m threshold, the scan is rejected and logged as a proxy attempt.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#f0f3ff] rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">fingerprint</span>
            </div>
            <div>
              <h4 className="font-bold text-[#111c2d] text-xs">3. Device Fingerprinting</h4>
              <p className="text-[11px] mt-0.5 leading-relaxed">
                Each student account is bound to a single verified device hardware fingerprint to prevent one student from logging in for multiple peers on a single smartphone.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end pt-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#00346f] text-white text-xs font-bold rounded-xl hover:bg-[#004a99]"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
