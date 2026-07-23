import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus, 
  Share2, 
  Download, 
  Columns,
  List,
  FileDown
} from 'lucide-react';
import { cn } from '@/shared/lib';

interface PDFPreviewProps {
  title: string;
  fileSize: string;
  onClose?: () => void;
  onShare?: () => void;
}

const TOC_ITEMS = [
  { title: "Executive Summary", page: 1 },
  { title: "Q2 Performance Highlights", page: 3 },
  { title: "Company Objectives & Q2 Goals", page: 7 },
  { title: "Revenue Performance Analysis", page: 12 },
  { title: "Order Volume Analysis", page: 18 },
  { title: "AOV Analysis", page: 23 },
  { title: "GMV Analysis", page: 24 },
  { title: "Customer Acquisition Performance", page: 27 },
  { title: "Customer Retention & Loyalty", page: 30 },
  { title: "Customer Segmentation Insights", page: 32 }
];

export function PDFPreview({ title, fileSize, onClose, onShare }: PDFPreviewProps) {
  const [activeTab, setActiveTab] = useState<'pages' | 'toc'>('toc');
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const totalPages = 60;

  const handleZoomIn = () => setZoom(prev => Math.min(200, prev + 10));
  const handleZoomOut = () => setZoom(prev => Math.max(50, prev - 10));

  return (
    <article className="flex flex-col h-[80vh] w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition duration-300">
      {/* Top Header */}
      <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 flex items-center justify-between">
        <section className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400"
            aria-label="Toggle sidebar"
          >
            <Columns className="h-4.5 w-4.5" />
          </button>
          <figure className="h-9 w-9 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center shrink-0" aria-hidden="true">
            <FileText className="h-5 w-5" />
          </figure>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white truncate leading-none">{title}</h2>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1 block">PDF • {fileSize}</span>
          </div>
        </section>

        <nav className="flex items-center gap-1.5" aria-label="Preview tools">
          <button type="button" aria-label="Search" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </button>
          <button type="button" aria-label="Fullscreen" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400">
            <Maximize2 className="h-4.5 w-4.5" />
          </button>
          {onClose && (
            <button 
              type="button" 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400"
              aria-label="Close preview"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          )}
        </nav>
      </header>

      {/* Main body: sidebar + content */}
      <section className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside 
          className={cn(
            "w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 overflow-hidden shrink-0",
            sidebarOpen ? "w-72 opacity-100" : "w-0 opacity-0 border-r-0"
          )}
          aria-label="Table of Contents"
        >
          {/* Sidebar Tab buttons */}
          <nav className="p-3 border-b border-slate-100 dark:border-slate-850 flex gap-2" aria-label="Sidebar navigation">
            <button 
              type="button"
              onClick={() => setActiveTab('pages')}
              className={cn(
                "flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-center transition",
                activeTab === 'pages' 
                  ? "bg-slate-100 dark:bg-slate-850 text-slate-900 dark:text-white" 
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
              )}
            >
              Pages
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('toc')}
              className={cn(
                "flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-center transition",
                activeTab === 'toc' 
                  ? "bg-slate-100 dark:bg-slate-850 text-slate-900 dark:text-white" 
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
              )}
            >
              TOC
            </button>
          </nav>

          {/* List items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {activeTab === 'toc' ? (
              TOC_ITEMS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentPage(item.page)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-xl transition text-xs flex flex-col gap-1",
                    currentPage === item.page 
                      ? "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                  )}
                >
                  <span className="truncate">{item.title}</span>
                  <span className="text-[9px] text-slate-400">Page {item.page}</span>
                </button>
              ))
            ) : (
              Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl transition text-xs flex items-center justify-between",
                      currentPage === pageNum
                        ? "bg-slate-100 dark:bg-slate-850 text-slate-900 dark:text-white font-bold"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                    )}
                  >
                    <span>Page {pageNum}</span>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* PDF Document Renderer Viewport */}
        <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-900/60 p-8 flex justify-center">
          <div 
            className="bg-white dark:bg-slate-950 shadow-xl border border-slate-200 dark:border-slate-850 rounded-2xl p-12 w-[600px] h-[800px] max-w-full origin-top transition-transform duration-200 text-slate-800 dark:text-slate-200 leading-relaxed font-sans"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {/* Simulation of a styled premium report */}
            <article className="space-y-6">
              <header className="border-b border-slate-100 dark:border-slate-850 pb-4">
                <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Executive Summary</h1>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">Page {currentPage} of {totalPages}</p>
              </header>

              <section className="space-y-4 text-sm font-semibold">
                <p>
                  In Q2 2026, our illustrative e-commerce platform (a mid-sized global fashion retailer) delivered <strong className="text-slate-950 dark:text-white">$52.3M</strong> in revenue, up <strong className="text-emerald-500">8% QoQ</strong> and <strong className="text-emerald-500">15% YoY</strong>. Gross margin improved modestly to <strong className="text-slate-950 dark:text-white">46%</strong> (versus industry ~40-50% [91L33-L40] [44L41-L47]). We acquired new customers at a blended CAC of <strong className="text-slate-950 dark:text-white">$75</strong> (illustrative; industry range ~$68-84 [14L52-L57]) and maintained an LTV:CAC ratio above 3:1 (the sustainable benchmark [14L62-L65]). Key user metrics were encouraging: Monthly Active Users (MAU) reached <strong className="text-slate-950 dark:text-white">1.2M</strong> (with a DAU/MAU "stickiness" of ~15%), monthly active buyers were <strong className="text-slate-950 dark:text-white">180K</strong>, repeat purchase rate ~18% (in line with the ~19% DTC average [39L24-L32]), and AOV was <strong className="text-slate-950 dark:text-white">$120</strong> (versus a global average ~$189 [48L22-L30]). Conversion remained ~2.5% of sessions (above the 1.9-2.0% global benchmark [36L174-L182]), while cart abandonment hovered near <strong className="text-slate-950 dark:text-white">70%</strong> (typical range [37L150-L159]).
                </p>
                <p>
                  On marketing, we invested <strong className="text-slate-950 dark:text-white">~$4.1M</strong> across channels (mostly Google and Meta ads, influencer, affiliate, and email), yielding a blended ROAS of <strong className="text-slate-950 dark:text-white">~3.0x</strong> (industry average ~2.9x [19L7-L14]). Channel breakdown: Google Shopping had ~4.5x ROAS [20L136-L143], Facebook prospecting ~2.2x [3.6x on retargeting] [20L153-L160], TikTok ~1.5x [20L172-L180], and email marketing the lowest CAC (~$8-15 [14L61-L64]) and highest ROI (45:1 [14L61-L64]).
                </p>
                <p>
                  Product-wise, the top 5 SKUs (all private-label dresses and jeans) accounted for 12% of sales, and top category (women's apparel) drove 60% of GMV. Inventory turnover was <strong className="text-slate-950 dark:text-white">6x/yr</strong> (healthy; 4-6x is ideal [22L120-L129]), with stockouts % of SKU &lt; 5% (&lt; 1% for high-demand SKUs). Operationally, average fulfillment time was <strong className="text-slate-950 dark:text-white">3 days</strong> (2d processing + 1d transit; industry [30L49-L56]), shipping cost per order ~$8.0 [28L146-L154], returns ~20% of orders (in line with ~20.8% average [26L49-L52]), and our live chat support resolves 80% of inquiries within 30 minutes (compared to industry ~82% [34L394-L402]). Site performance: pages load &lt; 2s on desktop (mobile slightly slower), with 65% of traffic via mobile (which typically has higher abandonment [37L156-L160]).
                </p>
              </section>
            </article>
          </div>
        </div>
      </section>

      {/* Bottom Control Bar */}
      <footer className="h-14 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 flex items-center justify-between shrink-0">
        <section className="flex items-center gap-2">
          <button 
            type="button" 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-350">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            type="button" 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400"
            aria-label="Next page"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </section>

        {/* Zoom controls */}
        <section className="flex items-center gap-2 border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 rounded-xl px-2 py-1">
          <button 
            type="button" 
            onClick={handleZoomOut}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-650 dark:text-slate-350"
            aria-label="Zoom out"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="text-[10px] font-black text-slate-700 dark:text-slate-350 min-w-10 text-center">
            {zoom}%
          </span>
          <button 
            type="button" 
            onClick={handleZoomIn}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-650 dark:text-slate-350"
            aria-label="Zoom in"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </section>

        {/* Action controls */}
        <section className="flex gap-2">
          {onShare && (
            <button 
              type="button" 
              onClick={onShare}
              className="flex items-center gap-1.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          )}
          <a 
            href="#"
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold transition hover:bg-slate-850 dark:hover:bg-slate-100"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </a>
        </section>
      </footer>
    </article>
  );
}
