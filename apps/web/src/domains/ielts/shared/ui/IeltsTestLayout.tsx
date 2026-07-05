import React, { ReactNode } from 'react';
import { Clock3, X } from 'lucide-react';
import { IeltsBrand } from './IeltsBrand';

interface IeltsTestLayoutProps {
  title: string;
  subtitle: string;
  timer?: string;
  onExit: () => void;
  headerRight?: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export function IeltsTestLayout({
  title,
  subtitle,
  timer,
  onExit,
  headerRight,
  toolbar,
  footer,
  children,
}: IeltsTestLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7fb]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-red-200 hover:text-red-500"
              onClick={onExit}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
            <IeltsBrand />
            <div className="border-l border-slate-200 pl-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Làm bài</p>
              <h1 className="text-xl font-black text-slate-900">{title}</h1>
              <p className="text-sm text-slate-500">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {headerRight}
            {timer ? (
              <div className="flex items-center gap-2 text-red-500">
                <Clock3 className="h-5 w-5" />
                <span className="text-3xl font-black tabular-nums">{timer}</span>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {toolbar ? <div className="border-b border-slate-200 bg-white px-5 py-4">{toolbar}</div> : null}

      <div className="min-h-0 flex-1">{children}</div>

      {footer ? <footer className="border-t border-slate-200 bg-white px-5 py-4">{footer}</footer> : null}
    </div>
  );
}
