import React, { useState } from 'react';
import {
  Bot,
  ChevronDown,
  Download,
  Eye,
  HelpCircle,
  QrCode,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeModal({ isOpen, onClose }: QRCodeModalProps) {
  const [qrName, setQrName] = useState('Sheikh');
  const [qrType, setQrType] = useState('Whatsapp');
  const [alias, setAlias] = useState('e.g. mybio');
  const [domain, setDomain] = useState('https://onlylinks.cc');
  const [textPrompt, setTextPrompt] = useState('Your AI assistant is ready to help!');
  const [selectedTemplate, setSelectedTemplate] = useState('tech');
  const [qrSize, setQrSize] = useState('1.5 px');
  const [qrFormat, setQrFormat] = useState('PNG');
  const [matrixStyle, setMatrixStyle] = useState('Pattern');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans antialiased">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog (Matching Image 5 input_file_4.png) */}
      <div
        role="dialog"
        aria-labelledby="qr-modal-title"
        className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-[#181C24] max-h-[90vh] flex flex-col"
      >
        {/* Modal Top Header */}
        <header className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-orange-500" />
            <h2 id="qr-modal-title" className="text-base font-bold text-gray-900 dark:text-white">
              Create QR Code
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Sub Banner */}
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-gradient-to-r from-orange-50/80 via-rose-50/50 to-indigo-50/50 px-4 py-2.5 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 border border-orange-100/60 dark:border-gray-800">
          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
            What Type QR Code do you want to create?
          </span>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1 text-xs font-bold text-gray-800 shadow-2xs dark:bg-gray-800 dark:text-white"
          >
            <Bot className="h-3.5 w-3.5 text-indigo-500" />
            <span>Help AI</span>
          </button>
        </div>

        {/* Main Grid Content */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto pr-1 flex-1">
          {/* Left Configuration Form (7 Columns) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Form Section: QR Code Informations */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                QR Code Informations
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="qr-name" className="mb-1 block text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                    QR Code Name
                  </label>
                  <input
                    id="qr-name"
                    type="text"
                    value={qrName}
                    onChange={(e) => setQrName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="qr-type" className="mb-1 block text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                    Dynamic QR
                  </label>
                  <select
                    id="qr-type"
                    value={qrType}
                    onChange={(e) => setQrType(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="Whatsapp">Whatsapp</option>
                    <option value="Website">Website URL</option>
                    <option value="WiFi">WiFi Network</option>
                    <option value="vCard">vCard Contact</option>
                    <option value="Email">Email Message</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="qr-alias" className="mb-1 block text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                    Custom Alias
                  </label>
                  <input
                    id="qr-alias"
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="qr-domain" className="mb-1 block text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                    Domain
                  </label>
                  <select
                    id="qr-domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="https://onlylinks.cc">https://onlylinks.cc</option>
                    <option value="https://eenglish.io">https://eenglish.io</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Form Section: Text / Prompt Area */}
            <section className="space-y-1.5">
              <label htmlFor="qr-text" className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                Text / Action Message
              </label>
              <div className="relative">
                <textarea
                  id="qr-text"
                  rows={3}
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
                <span className="absolute right-3 top-3 flex items-center gap-1 text-[10px] font-bold text-amber-600">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                </span>
              </div>
            </section>

            {/* Form Section: Templates Carousel */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Templates
                </h3>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>

              <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none">
                {[
                  { id: 'your_design', name: 'Your Design', color: 'border-orange-500' },
                  { id: 'tech', name: 'Tech Purple', color: 'text-purple-600' },
                  { id: 'sunset', name: 'Sunset Cafe', color: 'text-rose-600' },
                  { id: 'tech_red', name: 'Tech Red', color: 'text-red-600' },
                  { id: 'classic', name: 'Classic Dark', color: 'text-gray-900' },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-3 w-24 shrink-0 transition-all ${
                      selectedTemplate === tpl.id
                        ? 'border-orange-500 bg-orange-50/30 dark:bg-orange-950/20 shadow-xs'
                        : 'border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900'
                    }`}
                  >
                    <QrCode className={`h-10 w-10 ${tpl.color}`} />
                    <span className="mt-2 truncate text-[10px] font-bold text-gray-700 dark:text-gray-300">
                      {tpl.name}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Accordion Settings */}
            <div className="space-y-2 border-t border-gray-100 pt-3 dark:border-gray-800">
              {['Colors', 'Design', 'Matrix style'].map((settingName) => (
                <button
                  key={settingName}
                  type="button"
                  className="flex w-full items-center justify-between py-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  <span>{settingName}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Preview Section (5 Columns - Image 5 input_file_4.png) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-gray-200 bg-gray-50/60 p-5 dark:border-gray-800 dark:bg-gray-900/50">
            <div>
              <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-4">
                QR Code Preview
              </h3>

              {/* Dynamic QR Code Canvas Box */}
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#181C24]">
                <svg
                  className="h-56 w-56 text-gray-900 dark:text-white"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  {/* Outer Position Detection Patterns */}
                  <rect x="5" y="5" width="25" height="25" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="11" y="11" width="13" height="13" rx="2" />
                  
                  <rect x="70" y="5" width="25" height="25" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="76" y="11" width="13" height="13" rx="2" />

                  <rect x="5" y="70" width="25" height="25" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="11" y="76" width="13" height="13" rx="2" />

                  {/* Matrix Dots */}
                  <rect x="36" y="10" width="6" height="6" rx="1" />
                  <rect x="48" y="10" width="6" height="6" rx="1" />
                  <rect x="58" y="18" width="6" height="6" rx="1" />
                  <rect x="36" y="24" width="6" height="6" rx="1" />

                  <rect x="10" y="36" width="6" height="6" rx="1" />
                  <rect x="22" y="44" width="6" height="6" rx="1" />
                  <rect x="36" y="44" width="6" height="6" rx="1" />
                  <rect x="48" y="36" width="6" height="6" rx="1" />
                  <rect x="60" y="44" width="6" height="6" rx="1" />
                  <rect x="74" y="36" width="6" height="6" rx="1" />
                  <rect x="84" y="44" width="6" height="6" rx="1" />

                  <rect x="36" y="60" width="6" height="6" rx="1" />
                  <rect x="48" y="52" width="6" height="6" rx="1" />
                  <rect x="60" y="60" width="6" height="6" rx="1" />
                  <rect x="74" y="60" width="6" height="6" rx="1" />
                  <rect x="84" y="52" width="6" height="6" rx="1" />

                  <rect x="36" y="76" width="6" height="6" rx="1" />
                  <rect x="48" y="84" width="6" height="6" rx="1" />
                  <rect x="60" y="76" width="6" height="6" rx="1" />
                  <rect x="74" y="84" width="6" height="6" rx="1" />
                  <rect x="84" y="76" width="6" height="6" rx="1" />
                </svg>
              </div>

              {/* Size, Format & Pattern Controls Bar */}
              <div className="mt-4 flex items-center justify-between gap-2 text-xs text-gray-500">
                <select
                  value={qrSize}
                  onChange={(e) => setQrSize(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  <option value="1.5 px">1.5 px</option>
                  <option value="2.0 px">2.0 px</option>
                  <option value="3.0 px">3.0 px</option>
                </select>

                <select
                  value={qrFormat}
                  onChange={(e) => setQrFormat(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  <option value="PNG">PNG</option>
                  <option value="SVG">SVG</option>
                  <option value="JPEG">JPEG</option>
                </select>

                <select
                  value={matrixStyle}
                  onChange={(e) => setMatrixStyle(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  <option value="Pattern">Pattern</option>
                  <option value="Dots">Dots</option>
                  <option value="Rounded">Rounded</option>
                </select>
              </div>
            </div>

            {/* Bottom Action Buttons (Image 5 input_file_4.png) */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                className="flex-1 rounded-xl bg-orange-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-orange-700"
              >
                Preview
              </button>

              <button
                type="button"
                className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-800 shadow-2xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                Generate QR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
