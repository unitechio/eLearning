import React, { useState } from 'react';
import { Download, Plus, QrCode, Sparkles } from 'lucide-react';
import { QRCodeModal } from '@/shared/components/common/QRCodeModal';

export function AdminQRCodePage() {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <main className="flex-1 p-6 lg:p-8 font-sans antialiased bg-gray-50/60 dark:bg-[#181C24]/60 min-h-screen text-gray-900 dark:text-gray-100">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            QR Code Generator
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Create custom AI-enhanced dynamic QR codes for WhatsApp, Links, WiFi, and Marketing Campaigns.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-orange-700"
        >
          <Plus className="h-4 w-4" />
          <span>Create New QR</span>
        </button>
      </header>

      {/* Main Container */}
      <section className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-800 dark:bg-[#181C24]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 mb-4">
          <QrCode className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Generate Customized Scannable QR Codes
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-6">
          Support custom aliases, branding templates, colors, vector SVG formats, and AI assistance.
        </p>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#181C24] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
        >
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>Launch QR Builder Modal</span>
        </button>
      </section>

      {/* Modal Dialog */}
      <QRCodeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
