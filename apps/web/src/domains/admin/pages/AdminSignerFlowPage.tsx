import React, { useState } from 'react';
import {
  CheckCircle2,
  CheckSquare,
  ChevronLeft,
  Download,
  FileCheck,
  PenTool,
  ShieldCheck,
  Square,
  Triangle,
  X,
} from 'lucide-react';

export function AdminSignerFlowPage() {
  const [currentStep, setCurrentStep] = useState<'overview' | 'review' | 'signature'>('review');
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [signatureText, setSignatureText] = useState('Jordan Patel');
  const [signed, setSigned] = useState(false);

  const handleCompleteSign = () => {
    setSigned(true);
    setSignatureModalOpen(false);
    setCurrentStep('signature');
  };

  return (
    <main className="flex-1 min-h-screen bg-[#f5f5f3] font-sans antialiased text-gray-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header & Progress Stepper (Matching Image 4 input_file_3.png) */}
      <header className="mx-auto w-full max-w-4xl flex items-center justify-between border-b border-gray-200/80 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-white">
            <Triangle className="h-3.5 w-3.5 fill-current" />
          </div>
          <span className="font-bold text-sm text-gray-900">Counsel Doc</span>
        </div>

        {/* Stepper Steps */}
        <nav aria-label="Signature progress" className="flex items-center gap-6 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <CheckCircle2 className="h-4 w-4 fill-emerald-600/10" />
            <span>Overview</span>
          </div>

          <div
            className={`flex items-center gap-1.5 ${
              currentStep === 'review' ? 'text-gray-900 font-bold' : 'text-gray-400'
            }`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                currentStep === 'review'
                  ? 'border-gray-900 bg-gray-900 text-white text-[10px]'
                  : 'border-gray-300'
              }`}
            >
              2
            </span>
            <span>Review</span>
          </div>

          <div
            className={`flex items-center gap-1.5 ${
              signed || currentStep === 'signature' ? 'text-emerald-600 font-bold' : 'text-gray-400'
            }`}
          >
            {signed ? (
              <CheckCircle2 className="h-4 w-4 fill-emerald-600/10" />
            ) : (
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-[10px]">
                3
              </span>
            )}
            <span>Signature</span>
          </div>
        </nav>
      </header>

      {/* Main Document Review Box (Matching Image 4 input_file_3.png) */}
      <div className="mx-auto w-full max-w-3xl flex-1 flex flex-col justify-between">
        <section aria-label="Document viewer" className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <h1 className="text-base font-bold text-gray-900 mb-0.5">Review the document</h1>
              <p className="text-xs text-gray-500">
                Scroll through before signing. You can also download a copy.
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-100"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </button>
          </div>

          {/* Document Content Canvas */}
          <div className="p-8 text-xs text-gray-700 space-y-4 max-h-[420px] overflow-y-auto leading-relaxed border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Offer of Employment</h2>
            <p className="text-gray-400 font-mono">June 15, 2026</p>

            <p className="font-semibold text-gray-900">Dear Jordan Patel,</p>

            <p>
              On behalf of Agently Org (the "Company"), I am delighted to offer you the position of Senior Software Engineer. We were impressed throughout the process and believe you'll make a real difference here.
            </p>

            <h3 className="font-bold text-gray-900 pt-2">Position and Reporting</h3>
            <p>
              You will serve as Senior Software Engineer, reporting to Aqib Rahman. Your principal work location will be San Francisco, CA. The role is full-time and exempt; we expect a normal working week, but as with any early-stage company some flexibility on both sides will be required.
            </p>

            <h3 className="font-bold text-gray-900 pt-2">Start Date</h3>
            <p>
              Your anticipated start date is June 15, 2026. This offer is contingent on the satisfactory completion of standard reference checks and your execution of the Company's Confidential Information and Invention Assignment Agreement.
            </p>

            <h3 className="font-bold text-gray-900 pt-2">Base Salary</h3>
            <p>
              Your starting base salary will be $185,000 per year, payable in accordance with the Company's standard payroll practice.
            </p>
          </div>

          {/* Signed Status Badge if completed */}
          {signed && (
            <div className="bg-emerald-50 p-4 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="font-bold">Electronically signed by {signatureText}</span>
              </div>
              <span className="font-mono text-[11px]">Timestamp: 2026-06-15 14:32:01 UTC</span>
            </div>
          )}
        </section>

        {/* Consent Checkbox Box (Matching Image 4 input_file_3.png) */}
        {!signed && (
          <label htmlFor="consent-check" className="mt-4 flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-2xs cursor-pointer hover:border-gray-300">
            <input
              id="consent-check"
              type="checkbox"
              checked={consentAgreed}
              onChange={(e) => setConsentAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-0"
            />
            <span className="text-xs text-gray-600 leading-normal">
              I confirm I have read and understood this document, and I agree to sign it electronically. Electronic signatures are legally binding under applicable e-signature laws.
            </span>
          </label>
        )}
      </div>

      {/* Bottom Navigation Buttons (Matching Image 4 input_file_3.png) */}
      <footer className="mx-auto w-full max-w-3xl flex items-center justify-between pt-6 border-t border-gray-200/80 mt-6">
        <button
          type="button"
          onClick={() => setCurrentStep('overview')}
          className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>

        <button
          type="button"
          disabled={!consentAgreed || signed}
          onClick={() => setSignatureModalOpen(true)}
          className={`rounded-xl px-6 py-2.5 text-xs font-bold text-white shadow-sm transition ${
            consentAgreed && !signed
              ? 'bg-[#323639] hover:bg-black cursor-pointer'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {signed ? 'Signed Successfully' : 'Continue to sign'}
        </button>
      </footer>

      {/* E-Signature Drawing Modal */}
      {signatureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs" onClick={() => setSignatureModalOpen(false)} aria-hidden="true" />
          <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            <button type="button" onClick={() => setSignatureModalOpen(false)} className="absolute right-4 top-4 text-gray-400">
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-base font-bold text-gray-900 mb-1">Electronic Signature</h2>
            <p className="text-xs text-gray-500 mb-4">Type or draw your legal signature to authorize this document.</p>

            <div className="space-y-3">
              <label htmlFor="sig-text" className="block text-xs font-semibold text-gray-700">Full Legal Name</label>
              <input
                id="sig-text"
                type="text"
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 font-bold focus:border-gray-900 focus:outline-none"
              />

              {/* Signature Preview Canvas Box */}
              <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 font-serif text-2xl italic text-gray-800">
                {signatureText || 'Sign here'}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button type="button" onClick={() => setSignatureModalOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700">
                Cancel
              </button>
              <button type="button" onClick={handleCompleteSign} className="rounded-xl bg-[#323639] px-5 py-2 text-xs font-bold text-white hover:bg-black">
                Confirm & Sign Document
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
