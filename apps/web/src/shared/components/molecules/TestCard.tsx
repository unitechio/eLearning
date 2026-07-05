import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib";
import { OptimizedImage } from "@/shared/components/media";

export interface TestCardData {
  id?: string;
  slug: string;
  title: string;
  image: string;
  questions: number;
  attempts: string | number;
  status?: "not-started" | "in-progress" | "completed" | string;
  /** Link prefix, e.g. "/luyen-thi-ielts/ielts-reading-practice" */
  linkPrefix?: string;
}

interface TestCardProps {
  test: TestCardData;
  compact?: boolean;
}

export function TestCard({ test, compact = false }: TestCardProps) {
  const link = `${test.linkPrefix || "/luyen-thi-ielts/ielts-reading-practice"}/${test.slug}`;

  return (
    <article className="group">
      <Link to={link}>
        <div className="relative overflow-hidden rounded-[8px] bg-slate-100 aspect-[1.45]">
          <OptimizedImage
            alt={test.title}
            aspectClassName="h-full"
            className="h-full object-cover"
            imageClassName="transition duration-300 group-hover:scale-105"
            src={test.image}
            widthHint={560}
          />
          {/* Status Badge */}
          {test.status === "in-progress" ? (
            <span className="absolute left-2 top-2 rounded-[8px] bg-[#eef2ff] px-2 py-1 text-[10px] font-black text-blue-700 shadow-sm">
              Đang làm 0/{test.questions}
            </span>
          ) : (
            <span className="absolute left-2 top-2 rounded-[8px] bg-white/95 px-2 py-1 text-[10px] font-black text-slate-700 shadow-sm">
              {test.questions} câu
            </span>
          )}
        </div>
      </Link>
      
      <div className="mt-3 min-h-[4rem]">
        <Link
          className="line-clamp-2 text-base font-bold leading-snug text-slate-900 transition hover:text-red-600"
          to={link}
        >
          {test.title}
        </Link>
        <p className="mt-1 text-xs text-slate-500">{test.attempts}</p>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Link
          className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-red-200 hover:text-red-600 shadow-sm"
          to={link}
        >
          <div className="flex h-4 w-4 items-center justify-center rounded-full border border-red-500 text-red-500">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          Làm bài
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
        </Link>
      </div>
    </article>
  );
}
