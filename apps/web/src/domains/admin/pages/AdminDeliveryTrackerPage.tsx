import React, { useState } from 'react';
import { Package, Sparkles, Truck } from 'lucide-react';
import { DeliveryTrackerModal } from '@/shared/components/common/DeliveryTrackerModal';

export function AdminDeliveryTrackerPage() {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <main className="flex-1 p-6 lg:p-12 font-sans antialiased bg-[#0d1017] min-h-screen text-white flex flex-col justify-between">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Delivery tracker
          </h1>
          <p className="text-sm text-gray-400">
            Real-time package logistics and driver route tracking system.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-gray-900 shadow-md hover:bg-gray-100"
        >
          <Truck className="h-4 w-4 text-gray-900" />
          <span>Open Tracker Card</span>
        </button>
      </header>

      <section className="mx-auto my-12 flex max-w-2xl flex-col items-center justify-center rounded-3xl border border-gray-800 bg-[#161b26] p-12 text-center shadow-2xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-700 bg-gray-800 text-white mb-4">
          <Package className="h-8 w-8 text-emerald-400" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Live Package Logistics Status</h2>
        <p className="text-xs text-gray-400 max-w-sm mb-6 leading-relaxed">
          Track driver Marcus Reyes (Ford Transit NY 4829-XT) on route to Greenwich St, New York.
        </p>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-xs font-bold text-gray-900 shadow-md hover:bg-gray-100"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Launch Tracker Card Modal</span>
        </button>
      </section>

      <DeliveryTrackerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
