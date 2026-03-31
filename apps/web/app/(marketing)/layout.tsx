import { TopNav } from "@/components/shared/top-nav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      {/* Root Nav for Marketing (Can use the same TopNav or a simplified one) */}
      <header className="fixed top-0 w-full z-50 bg-white/8 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900">eEnglish</span>
           </div>
           
           <div className="flex items-center gap-6">
              <a href="/login" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">SignIn</a>
              <a href="/login" className="px-5 py-2 bg-primary text-white text-sm font-black rounded-full shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">Get Started</a>
           </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Aesthetic Backdrop Elements */}
      <div className="fixed -bottom-48 -left-48 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      <div className="fixed -top-48 -right-48 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10"></div>
    </div>
  );
}
