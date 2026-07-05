import React from "react";
import { UserRound, Headphones, MapPin } from "lucide-react";
import { cn } from "@/shared/lib";
import { OptimizedImage } from "@/shared/components/media";

const IMAGES = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop",
];

// Duplicate items to ensure seamless infinite scroll
const MARQUEE_ITEMS = [...IMAGES, ...IMAGES];

export function ConsultationSection() {
  return (
    <section className="mt-24 bg-slate-50 py-16 overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="self-center z-10">
          <h2 className="text-3xl font-black leading-tight text-slate-900">
            Đăng ký test đầu vào IELTS <span className="text-red-600">miễn phí</span> và nhận tư vấn
          </h2>
          <div className="mt-8 space-y-5">
            {[
              ["Để lại thông tin liên hệ", "Chúng tôi sẽ liên hệ với bạn ngay."],
              ["Gọi điện liên hệ", "Liên hệ eEnglish qua hotline miễn phí: 1900 98 98 19"],
              ["eEnglish có 15+ cơ sở tại TP.HCM, Hà Nội và Đà Nẵng", "Click để xem địa chỉ chi tiết"],
            ].map(([title, description], index) => (
              <div className="flex gap-3" key={title}>
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white",
                    index === 0
                      ? "bg-red-500"
                      : index === 1
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                  )}
                >
                  {index === 0 ? (
                    <UserRound className="h-4 w-4" />
                  ) : index === 1 ? (
                    <Headphones className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{title}</p>
                  <p className="mt-1 text-xs text-slate-500">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Gallery */}
        <div
          className="relative h-[450px] w-full"
          style={{
            // Fade out the top and bottom edges
            maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          }}
        >
          <div className="grid grid-cols-3 gap-3 opacity-80 absolute inset-0">
            {/* Column 1 (Scroll Up) */}
            <div className="flex flex-col gap-3 h-max w-full animate-[marquee-vertical_20s_linear_infinite] group-hover:[animation-play-state:paused]">
              {MARQUEE_ITEMS.map((src, i) => (
                <OptimizedImage
                  alt=""
                  aspectClassName="aspect-square"
                  className="rounded-[6px] object-cover w-full shadow-sm"
                  key={`col1-${i}`}
                  src={src}
                  widthHint={240}
                />
              ))}
            </div>

            {/* Column 2 (Scroll Up Faster/Offset) */}
            <div className="flex flex-col gap-3 h-max w-full animate-[marquee-vertical_25s_linear_infinite_reverse] group-hover:[animation-play-state:paused]">
              {MARQUEE_ITEMS.map((src, i) => (
                <OptimizedImage
                  alt=""
                  aspectClassName="aspect-square"
                  className="rounded-[6px] object-cover w-full shadow-sm"
                  key={`col2-${i}`}
                  src={src}
                  widthHint={240}
                />
              ))}
            </div>

            {/* Column 3 (Scroll Up) */}
            <div className="flex flex-col gap-3 h-max w-full animate-[marquee-vertical_22s_linear_infinite] group-hover:[animation-play-state:paused]">
              {MARQUEE_ITEMS.map((src, i) => (
                <OptimizedImage
                  alt=""
                  aspectClassName="aspect-square"
                  className="rounded-[6px] object-cover w-full shadow-sm"
                  key={`col3-${i}`}
                  src={src}
                  widthHint={240}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
