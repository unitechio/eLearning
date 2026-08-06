import React from 'react';
import { Download, Monitor, Smartphone, CheckCircle, ShieldCheck, Cpu } from 'lucide-react';
import { AdminPageHeader, AdminCard, AdminCardHeader, AdminCardTitle, AdminCardDescription, AdminCardContent } from '@/shared/components/admin';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';

export function AdminDownloadsPage() {
  const handleDownload = (platform: string) => {
    toast.info(`Downloading native installer package for ${platform}...`);
  };

  const desktopFeatures = [
    "Native keyboard shortcuts (Global Search via ⌥Space)",
    "Hardware-accelerated performance & custom layouts",
    "Background data synchronization & offline cache modes",
    "Instant push alerts directly via OS system banners",
  ];

  const mobileFeatures = [
    "Secure evaluation queue & dashboard alerts",
    "Real-time chat with support agents and teachers",
    "Scan student test response forms via camera scanner",
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        title="Downloads"
        description="Access eEnglish console directly from your dock or taskbar with dedicated desktop clients and mobile companions."
        icon={Download}
        eyebrow="DESKTOP & MOBILE"
      />

      <div className="grid gap-6 lg:gap-8 md:grid-cols-2">
        {/* Desktop Client Card */}
        <AdminCard>
          <AdminCardHeader>
            <AdminCardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              <span>Desktop App</span>
            </AdminCardTitle>
            <AdminCardDescription>
              Dedicated installer client for macOS, Windows, and Linux.
            </AdminCardDescription>
          </AdminCardHeader>

          <AdminCardContent className="space-y-6">
            {/* Installer platforms row */}
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDownload("macOS Apple Silicon")}
                className="w-full h-10 rounded-xl justify-start text-xs font-semibold border-border/60 hover:bg-muted/40 gap-3"
              >
                <span className="text-sm">🍏</span>
                <span className="flex-1 text-left">macOS Desktop client (Apple Silicon M1/M2/M3)</span>
                <span className="text-[10px] text-muted-foreground/60 font-mono">.dmg</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleDownload("macOS Intel Core")}
                className="w-full h-10 rounded-xl justify-start text-xs font-semibold border-border/60 hover:bg-muted/40 gap-3"
              >
                <span className="text-sm">🍏</span>
                <span className="flex-1 text-left">macOS Desktop client (Intel Core chips)</span>
                <span className="text-[10px] text-muted-foreground/60 font-mono">.dmg</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleDownload("Windows x64")}
                className="w-full h-10 rounded-xl justify-start text-xs font-semibold border-border/60 hover:bg-muted/40 gap-3"
              >
                <span className="text-sm">🪟</span>
                <span className="flex-1 text-left">Windows Native client installer (x64)</span>
                <span className="text-[10px] text-muted-foreground/60 font-mono">.msi</span>
              </Button>
            </div>

            {/* Feature lists */}
            <div className="space-y-2.5 border-t border-border/50 pt-4 mt-2">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-muted-foreground" /> Key Capabilities
              </h4>
              <ul className="space-y-2 text-xs">
                {desktopFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-muted-foreground leading-relaxed">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Checksums security banner */}
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/10 p-3 text-[11px] text-emerald-800 dark:text-emerald-400">
              <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
              <span>Packages are digitally signed, clean, and checked safe. MD5 checksums verified.</span>
            </div>
          </AdminCardContent>
        </AdminCard>

        {/* Mobile App Card */}
        <AdminCard>
          <AdminCardHeader>
            <AdminCardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <span>Mobile Companion</span>
            </AdminCardTitle>
            <AdminCardDescription>
              Access critical alerts and scan tests from your phone.
            </AdminCardDescription>
          </AdminCardHeader>

          <AdminCardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/10 border border-border/40 p-4 rounded-xl">
              {/* Simulated QR Code */}
              <div className="h-28 w-28 bg-white border-2 border-slate-200 rounded-lg p-2.5 flex flex-wrap gap-0.5 items-center justify-center shadow-sm shrink-0">
                <div className="h-3.5 w-3.5 bg-slate-900" />
                <div className="h-3.5 w-3.5 bg-slate-900" />
                <div className="h-3.5 w-3.5 bg-transparent" />
                <div className="h-3.5 w-3.5 bg-slate-900" />
                <div className="h-3.5 w-3.5 bg-transparent" />
                <div className="h-3.5 w-3.5 bg-slate-900" />
                <div className="h-3.5 w-3.5 bg-slate-900" />
                <div className="h-3.5 w-3.5 bg-transparent" />
                <div className="h-3.5 w-3.5 bg-slate-900" />
                <div className="h-3.5 w-3.5 bg-slate-900" />
                <div className="h-3.5 w-3.5 bg-slate-900" />
                <div className="h-3.5 w-3.5 bg-slate-900" />
                <div className="h-3.5 w-3.5 bg-transparent" />
                <div className="h-3.5 w-3.5 bg-slate-900" />
                <div className="h-3.5 w-3.5 bg-slate-900" />
                <div className="h-3.5 w-3.5 bg-slate-900" />
              </div>
              <div className="min-w-0 space-y-1.5 text-center sm:text-left">
                <p className="text-xs font-bold text-foreground">Scan QR Code to Download</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Open your smartphone camera app, focus on this barcode image, and follow target link redirection to install companion.
                </p>
              </div>
            </div>

            {/* Badges mock */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload("iOS Client")}
                className="h-8 text-[11px] font-semibold border-border/60 gap-1.5"
              >
                <span>🍎</span> App Store
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload("Android Client")}
                className="h-8 text-[11px] font-semibold border-border/60 gap-1.5"
              >
                <span>🤖</span> Google Play
              </Button>
            </div>

            {/* Capabilities list */}
            <div className="space-y-2.5 border-t border-border/50 pt-4 mt-2">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-muted-foreground" /> Companion Features
              </h4>
              <ul className="space-y-2 text-xs">
                {mobileFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-muted-foreground leading-relaxed">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AdminCardContent>
        </AdminCard>
      </div>
    </div>
  );
}
