import React from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Package,
  Phone,
  Truck,
  X,
} from 'lucide-react';

interface DeliveryTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeliveryTrackerModal({ isOpen, onClose }: DeliveryTrackerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans antialiased">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Delivery Tracking Card Dialog (Matching Image 4 input_file_3.png) */}
      <div
        role="dialog"
        aria-labelledby="tracker-card-title"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-[#181C24] text-gray-900 dark:text-gray-100 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Header Row */}
        <header className="flex items-center justify-between pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Tracking Number
            </span>
            <h2 id="tracker-card-title" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white font-mono">
              PKG-482910
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Driver Info Box (Matching Image 4 input_file_3.png) */}
        <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-3.5 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black font-bold text-white text-xs dark:bg-gray-800">
              MR
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">Marcus Reyes</p>
              <p className="text-[11px] text-gray-400">Ford Transit • NY 4829-XT</p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            Contact driver
          </button>
        </div>

        {/* Delivery Route Stepper Box (Matching Image 4 input_file_3.png) */}
        <div className="my-5 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800/80 dark:bg-gray-900/40 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-900 dark:text-white">Delivery</span>
            <button type="button" className="text-gray-400 hover:underline">View on map</button>
          </div>

          {/* Stepper Route */}
          <div className="relative pl-6 space-y-5 text-xs">
            {/* Connecting Vertical Line */}
            <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-300 dark:bg-gray-700" />

            {/* Pickup Location */}
            <div className="relative">
              <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800" />
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Pickup</span>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 max-w-[220px] truncate">
                    Aria Textiles Warehouse • 228 Bowery St, Loading D...
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-gray-400">9:46 AM</span>
                  <p className="text-[10px] font-semibold text-gray-500 hover:underline">Track location</p>
                </div>
              </div>
            </div>

            {/* Middle Badge: 3 stops left */}
            <div className="flex items-center justify-center py-1">
              <span className="rounded-md bg-gray-200 px-2 py-0.5 text-[9px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                3 stops left
              </span>
            </div>

            {/* Delivery Location */}
            <div className="relative">
              <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-emerald-500 bg-emerald-500" />
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Delivery</span>
                  <p className="font-bold text-gray-900 dark:text-white max-w-[220px] truncate">
                    Priya Nair • 482 Greenwich St, Apt 5C, New York, NY
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-emerald-600">Est. 4:30 PM</span>
                  <p className="text-[10px] font-semibold text-gray-500 hover:underline">Track location</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Package Details Grid (Matching Image 4 input_file_3.png) */}
        <div className="space-y-2 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/40 text-xs">
          <div className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-800">
            <span className="text-gray-500 font-medium">Details</span>
            <button type="button" className="text-gray-400 hover:underline">Edit details</button>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-gray-400 font-medium">Weight & dimensions</span>
            <span className="font-semibold text-gray-900 dark:text-white font-mono">2.4 kg • 30×20×15 cm</span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-gray-400 font-medium">Contents</span>
            <span className="font-semibold text-gray-900 dark:text-white">Electronics accessories</span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-gray-400 font-medium">Signature</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Required
            </span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-gray-400 font-medium">Instructions</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">Leave at front desk if no answer.</span>
          </div>
        </div>

        {/* Bottom Action Buttons (Matching Image 4 input_file_3.png) */}
        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            className="flex-1 rounded-2xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-800 shadow-2xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            Contact driver
          </button>

          <button
            type="button"
            className="flex-1 rounded-2xl bg-black py-2.5 text-xs font-bold text-white shadow-md hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Track delivery
          </button>
        </div>
      </div>
    </div>
  );
}
