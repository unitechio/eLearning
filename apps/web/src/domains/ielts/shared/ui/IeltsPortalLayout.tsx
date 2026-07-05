import React, { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IeltsBrand } from './IeltsBrand';

interface IeltsPortalLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function IeltsPortalLayout({
  eyebrow,
  title,
  description,
  actions,
  children,
}: IeltsPortalLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fffdf8]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-red-200 hover:text-red-500"
              onClick={() => navigate('/dashboard')}
              type="button"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <IeltsBrand />
          </div>
          {actions}
        </div>
      </header>

      <section className="border-b border-red-100 bg-gradient-to-br from-[#fff5ef] via-[#fffaf6] to-[#fff] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-600">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight text-slate-900">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{description}</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
