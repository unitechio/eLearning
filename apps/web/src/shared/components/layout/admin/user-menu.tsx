import {
  LogOut,
  Settings,
  User as UserIcon,
  SunMoon,
  Bell,
  ExternalLink,
  Smile,
  Star,
  ArrowLeftRight,
  Heart,
  Download,
  HelpCircle,
  Sparkles,
  Layers,
  Check,
  Copy,
  Laptop,
  Monitor,
  Smartphone,
  Shield,
  Trash2,
  Lock,
  Plus,
  Send,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMe, useLogout } from "@/domains/auth/api/hooks";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { useTheme } from "@/shared/hooks/useTheme";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

function initials(first?: string, last?: string, email?: string) {
  const f = first?.[0];
  const l = last?.[0];
  if (f && l) return `${f}${l}`.toUpperCase();
  if (email) return email.slice(0, 2).toUpperCase();
  return "U";
}

interface UserStatus {
  emoji: string;
  text: string;
  expiry: string;
}

export function UserMenu() {
  const { data: user } = useMe();
  const logout = useLogout();
  const navigate = useNavigate();
  const { theme, setLight, setDark } = useTheme();

  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.email || "Manager";

  // Active user status from localstorage
  const [userStatus, setUserStatus] = useState<UserStatus | null>(() => {
    const stored = localStorage.getItem("user-status");
    return stored ? JSON.parse(stored) : null;
  });

  // Modal open states
  const [activeModal, setActiveModal] = useState<
    "status" | "profile" | "appearance" | "notifications" | "upgrade" | "referrals" | "download" | "account" | "space" | "help" | null
  >(null);

  // Status Modal states
  const [statusEmoji, setStatusEmoji] = useState(userStatus?.emoji || "💻");
  const [statusText, setStatusText] = useState(userStatus?.text || "");
  const [statusExpiry, setStatusExpiry] = useState(userStatus?.expiry || "Today");

  // Profile Modal states
  const [firstName, setFirstName] = useState(user?.first_name || "Admin");
  const [lastName, setLastName] = useState(user?.last_name || "Manager");
  const [profileEmail, setProfileEmail] = useState(user?.email || "admin@eenglish.org");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Upgrade Modal states
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("annually");
  const [upgradeState, setUpgradeState] = useState<"idle" | "connecting" | "processing" | "success">("idle");

  // Referrals Modal states
  const [referralEmail, setReferralEmail] = useState("");
  const [isSendingReferral, setIsSendingReferral] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Notifications Modal states
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifySound, setNotifySound] = useState(false);
  const [isSavingNotify, setIsSavingNotify] = useState(false);

  // Switch Account state
  const [switchingAccountIdx, setSwitchingAccountIdx] = useState<number | null>(null);

  // Switch Space state
  const [activeSpaceIdx, setActiveSpaceIdx] = useState(0);

  // Help Modal state
  const [helpMessage, setHelpMessage] = useState("");
  const [isSubmittingHelp, setIsSubmittingHelp] = useState(false);

  // Preset status options
  const statusPresets = [
    { emoji: "💻", text: "Focusing" },
    { emoji: "🤒", text: "Out sick" },
    { emoji: "🌴", text: "On vacation" },
    { emoji: "🏠", text: "Remote working" },
    { emoji: "📅", text: "In a meeting" },
  ];

  const handleSaveStatus = () => {
    if (!statusText.trim()) {
      setUserStatus(null);
      localStorage.removeItem("user-status");
      toast.success("Status cleared");
    } else {
      const newStatus = { emoji: statusEmoji, text: statusText, expiry: statusExpiry };
      setUserStatus(newStatus);
      localStorage.setItem("user-status", JSON.stringify(newStatus));
      toast.success("Status updated successfully");
    }
    setActiveModal(null);
  };

  const handleClearStatus = () => {
    setStatusText("");
    setUserStatus(null);
    localStorage.removeItem("user-status");
    toast.success("Status cleared");
    setActiveModal(null);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      toast.success("Profile saved successfully");
      setActiveModal(null);
    }, 800);
  };

  const handleUpgrade = () => {
    setUpgradeState("connecting");
    setTimeout(() => {
      setUpgradeState("processing");
      setTimeout(() => {
        setUpgradeState("success");
        toast.success("Successfully upgraded to eEnglish Pro!");
      }, 1500);
    }, 1000);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText("https://eenglish.org/join?ref=admin_38a2");
    setCopiedLink(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralEmail) return;
    setIsSendingReferral(true);
    setTimeout(() => {
      setIsSendingReferral(false);
      setReferralEmail("");
      toast.success(`Invitation sent to ${referralEmail}`);
    }, 800);
  };

  const handleSaveNotifications = () => {
    setIsSavingNotify(true);
    setTimeout(() => {
      setIsSavingNotify(false);
      toast.success("Preferences updated");
      setActiveModal(null);
    }, 500);
  };

  const handleSwitchAccount = (idx: number, email: string) => {
    setSwitchingAccountIdx(idx);
    setTimeout(() => {
      setSwitchingAccountIdx(null);
      toast.success(`Switched account to ${email}`);
      setActiveModal(null);
    }, 1200);
  };

  const handleSwitchSpace = (idx: number, spaceName: string) => {
    setActiveSpaceIdx(idx);
    toast.success(`Switched workspace to ${spaceName}`);
    setActiveModal(null);
  };

  const handleSubmitHelp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpMessage.trim()) return;
    setIsSubmittingHelp(true);
    setTimeout(() => {
      setIsSubmittingHelp(false);
      setHelpMessage("");
      toast.success("Support request sent. We will review it shortly.");
      setActiveModal(null);
    }, 1000);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 gap-2 px-2.5 rounded-lg border border-border/60 hover:bg-muted/60 transition-colors"
            aria-expanded="false"
            aria-haspopup="menu"
            aria-label="User menu dropdown"
          >
            <Avatar className="h-6 w-6 border border-border/80">
              <AvatarFallback className="text-[10px] bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold">
                {initials(user?.first_name, user?.last_name, user?.email)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-xs font-semibold text-foreground/90 md:inline-block">
              {displayName}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-60 rounded-xl p-1.5 shadow-md border border-border bg-popover text-popover-foreground animate-in fade-in zoom-in-95 duration-100"
          role="menu"
        >
          {/* User Profile Header */}
          <DropdownMenuLabel className="px-2.5 py-2 font-normal">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8 border border-border/80">
                <AvatarFallback className="text-[10px] bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold">
                  {initials(user?.first_name, user?.last_name, user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 justify-between">
                  <span className="text-[12px] font-bold text-foreground truncate">{displayName}</span>
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Online" />
                </div>
                <span className="text-[10px] text-muted-foreground truncate block mt-0.5 font-medium">Administrator</span>
              </div>
            </div>
            {userStatus && (
              <div className="mt-2 flex items-center gap-1.5 rounded-md bg-muted/40 border border-border/40 px-2 py-1 text-[10px] text-foreground/80">
                <span>{userStatus.emoji}</span>
                <span className="truncate">{userStatus.text}</span>
              </div>
            )}
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-1 border-border/60" />

          {/* Update Status */}
          <DropdownMenuItem
            onClick={() => setActiveModal("status")}
            className="rounded-lg py-1.5 px-2 text-xs font-medium cursor-pointer"
            role="menuitem"
          >
            <Smile className="mr-2 h-4 w-4 text-muted-foreground/75" />
            <span>Update status</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 border-border/60" />

          {/* Your Profile */}
          <DropdownMenuItem
            onClick={() => setActiveModal("profile")}
            className="rounded-lg py-1.5 px-2 text-xs font-medium cursor-pointer flex justify-between items-center"
            role="menuitem"
          >
            <div className="flex items-center">
              <UserIcon className="mr-2 h-4 w-4 text-muted-foreground/75" />
              <span>Your profile</span>
            </div>
            <kbd className="rounded border border-border/60 bg-muted/50 px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground/80">1</kbd>
          </DropdownMenuItem>

          {/* Appearance */}
          <DropdownMenuItem
            onClick={() => setActiveModal("appearance")}
            className="rounded-lg py-1.5 px-2 text-xs font-medium cursor-pointer flex justify-between items-center"
            role="menuitem"
          >
            <div className="flex items-center">
              <SunMoon className="mr-2 h-4 w-4 text-muted-foreground/75" />
              <span>Appearance</span>
            </div>
            <kbd className="rounded border border-border/60 bg-muted/50 px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground/80">2</kbd>
          </DropdownMenuItem>

          {/* Settings - route link */}
          <DropdownMenuItem
            onClick={() => navigate("/admin/platform-settings")}
            className="rounded-lg py-1.5 px-2 text-xs font-medium cursor-pointer flex justify-between items-center"
            role="menuitem"
          >
            <div className="flex items-center">
              <Settings className="mr-2 h-4 w-4 text-muted-foreground/75" />
              <span>Settings</span>
            </div>
            <kbd className="rounded border border-border/60 bg-muted/50 px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground/80">3</kbd>
          </DropdownMenuItem>

          {/* Notifications config */}
          <DropdownMenuItem
            onClick={() => setActiveModal("notifications")}
            className="rounded-lg py-1.5 px-2 text-xs font-medium cursor-pointer flex justify-between items-center"
            role="menuitem"
          >
            <div className="flex items-center">
              <Bell className="mr-2 h-4 w-4 text-muted-foreground/75" />
              <span>Notifications</span>
            </div>
            <kbd className="rounded border border-border/60 bg-muted/50 px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground/80">4</kbd>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 border-border/60" />

          {/* Upgrade promo */}
          <DropdownMenuItem
            onClick={() => navigate("/admin/billing")}
            className="rounded-lg py-1.5 px-2 text-xs font-semibold cursor-pointer text-amber-600 dark:text-amber-400 hover:text-amber-700 flex justify-between items-center bg-amber-500/5 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/10"
            role="menuitem"
          >
            <div className="flex items-center">
              <Sparkles className="mr-2 h-4 w-4 text-amber-500 fill-amber-500/10" />
              <span>Upgrade to Pro</span>
            </div>
            <span className="rounded-md bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider scale-90">20% OFF</span>
          </DropdownMenuItem>

          {/* Referrals */}
          <DropdownMenuItem
            onClick={() => navigate("/admin/referrals")}
            className="rounded-lg py-1.5 px-2 text-xs font-medium cursor-pointer"
            role="menuitem"
          >
            <Heart className="mr-2 h-4 w-4 text-muted-foreground/75" />
            <span>Referrals</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 border-border/60" />

          {/* Download App */}
          <DropdownMenuItem
            onClick={() => navigate("/admin/downloads")}
            className="rounded-lg py-1.5 px-2 text-xs font-medium cursor-pointer flex justify-between items-center"
            role="menuitem"
          >
            <div className="flex items-center">
              <Download className="mr-2 h-4 w-4 text-muted-foreground/75" />
              <span>Download app</span>
            </div>
          </DropdownMenuItem>

          {/* What's new */}
          <DropdownMenuItem
            onClick={() => {
              window.open("https://eenglish.org/changelog", "_blank");
            }}
            className="rounded-lg py-1.5 px-2 text-xs font-medium cursor-pointer flex justify-between items-center"
            role="menuitem"
          >
            <div className="flex items-center">
              <Star className="mr-2 h-4 w-4 text-muted-foreground/75" />
              <span>What's new?</span>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground/50" />
          </DropdownMenuItem>

          {/* Get Help */}
          <DropdownMenuItem
            onClick={() => setActiveModal("help")}
            className="rounded-lg py-1.5 px-2 text-xs font-medium cursor-pointer flex justify-between items-center"
            role="menuitem"
          >
            <div className="flex items-center">
              <HelpCircle className="mr-2 h-4 w-4 text-muted-foreground/75" />
              <span>Get help</span>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground/50" />
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 border-border/60" />

          {/* Switch Account */}
          <DropdownMenuItem
            onClick={() => setActiveModal("account")}
            className="rounded-lg py-1.5 px-2 text-xs font-medium cursor-pointer flex justify-between items-center"
            role="menuitem"
          >
            <div className="flex items-center">
              <ArrowLeftRight className="mr-2 h-4 w-4 text-muted-foreground/75" />
              <span>Switch account</span>
            </div>
            <kbd className="rounded border border-border/60 bg-muted/50 px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground/80">S</kbd>
          </DropdownMenuItem>

          {/* Switch space */}
          <DropdownMenuItem
            onClick={() => setActiveModal("space")}
            className="rounded-lg py-1.5 px-2 text-xs font-medium cursor-pointer flex justify-between items-center"
            role="menuitem"
          >
            <div className="flex items-center">
              <Layers className="mr-2 h-4 w-4 text-muted-foreground/75" />
              <span>Switch space</span>
            </div>
            <span className="h-3.5 w-3.5 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-500 shrink-0 scale-90" />
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 border-border/60" />

          {/* Log out */}
          <DropdownMenuItem
            onClick={() => logout.mutate()}
            className="rounded-lg py-1.5 px-2 text-xs font-medium cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5 hover:bg-destructive/5 transition-colors"
            role="menuitem"
          >
            <LogOut className="mr-2 h-4 w-4 text-destructive/80" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ── 1. CUSTOM STATUS MODAL (16px / rounded-2xl) ────────────────────── */}
      <Dialog open={activeModal === "status"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[400px] rounded-2xl p-5 border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">Set status</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Let your team know what you're up to.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Input with Emoji selection */}
            <div className="flex gap-2">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg border border-border/60 bg-muted/30 text-sm">
                {statusEmoji}
              </div>
              <div className="flex-1">
                <Input
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                  placeholder="What's your status?"
                  className="h-9 border-border/60 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Presets Row */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Presets</Label>
              <div className="flex flex-wrap gap-1.5">
                {statusPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setStatusEmoji(preset.emoji);
                      setStatusText(preset.text);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/80 text-[11px] font-medium transition-all"
                  >
                    <span>{preset.emoji}</span>
                    <span>{preset.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Expiry Selector */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Clear status after</Label>
              <select
                value={statusExpiry}
                onChange={(e) => setStatusExpiry(e.target.value)}
                className="w-full h-9 rounded-lg border border-border/60 bg-card px-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Don't clear">Don't clear</option>
                <option value="30 minutes">30 minutes</option>
                <option value="1 hour">1 hour</option>
                <option value="4 hours">4 hours</option>
                <option value="Today">Today</option>
                <option value="This week">This week</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearStatus}
              className="h-8 text-xs font-semibold text-destructive hover:bg-destructive/5 hover:text-destructive rounded-lg"
            >
              Clear status
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveModal(null)}
                className="h-8 text-xs font-semibold rounded-lg border-border/60"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSaveStatus}
                className="h-8 text-xs font-semibold rounded-lg px-4"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 2. EDIT PROFILE MODAL ─────────────────────────────────────────── */}
      <Dialog open={activeModal === "profile"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[420px] rounded-2xl p-5 border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">Account profile</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Update your account details and login settings.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4 py-2 text-xs">
            {/* Avatar Upload Preview */}
            <div className="flex items-center gap-4 border border-border/40 rounded-xl p-3 bg-muted/10">
              <Avatar className="h-12 w-12 border-2 border-border/80">
                <AvatarFallback className="text-sm bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold">
                  {initials(firstName, lastName, profileEmail)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <p className="font-bold text-foreground">Profile photo</p>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" className="h-6 text-[10px] font-bold rounded">
                    Upload
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px] font-bold text-destructive hover:bg-destructive/5 rounded">
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="prof-fn" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">First name</Label>
                <Input
                  id="prof-fn"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-9 border-border/60 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="prof-ln" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Last name</Label>
                <Input
                  id="prof-ln"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-9 border-border/60 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="prof-email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Email address</Label>
              <Input
                id="prof-email"
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="h-9 border-border/60 rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-6">
              <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> Checked secure
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveModal(null)}
                  className="h-8 text-xs font-semibold rounded-lg border-border/60"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSavingProfile}
                  className="h-8 text-xs font-semibold rounded-lg px-4"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── 3. THEME APPEARANCE MODAL ─────────────────────────────────────── */}
      <Dialog open={activeModal === "appearance"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[420px] rounded-2xl p-5 border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">Theme settings</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Select how eEnglish Admin is rendered on your browser.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 py-3 text-xs">
            {/* Light Mode Selector Card */}
            <button
              type="button"
              onClick={() => {
                setLight();
                toast.success("Applied light mode");
              }}
              className={cn(
                "group text-left p-4 rounded-xl border border-border/70 hover:border-border transition-all flex flex-col gap-3",
                theme === "light"
                  ? "border-primary bg-primary/[0.02] ring-1 ring-primary"
                  : "bg-muted/10"
              )}
            >
              {/* Header preview */}
              <div className="w-full bg-slate-50 border border-slate-200/80 rounded-lg p-2 flex flex-col gap-1.5 shadow-sm group-hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <div className="h-1 w-6 rounded bg-slate-300" />
                </div>
                <div className="h-2 w-full rounded bg-slate-200" />
                <div className="h-1.5 w-3/4 rounded bg-slate-200" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <SunMoon className="h-4 w-4 text-amber-500" /> Light mode
                </span>
                {theme === "light" && <Check className="h-4 w-4 text-primary" />}
              </div>
            </button>

            {/* Dark Mode Selector Card */}
            <button
              type="button"
              onClick={() => {
                setDark();
                toast.success("Applied dark mode");
              }}
              className={cn(
                "group text-left p-4 rounded-xl border border-border/70 hover:border-border transition-all flex flex-col gap-3",
                theme === "dark"
                  ? "border-primary bg-primary/[0.02] ring-1 ring-primary"
                  : "bg-muted/10"
              )}
            >
              {/* Header preview */}
              <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 flex flex-col gap-1.5 shadow-sm group-hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  <div className="h-1 w-6 rounded bg-slate-700" />
                </div>
                <div className="h-2 w-full rounded bg-slate-800" />
                <div className="h-1.5 w-3/4 rounded bg-slate-800" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <SunMoon className="h-4 w-4 text-indigo-400" /> Dark mode
                </span>
                {theme === "dark" && <Check className="h-4 w-4 text-primary" />}
              </div>
            </button>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button
              type="button"
              onClick={() => setActiveModal(null)}
              className="h-8 text-xs font-semibold rounded-lg px-4"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 4. NOTIFICATIONS PREFERENCES MODAL ────────────────────────────── */}
      <Dialog open={activeModal === "notifications"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[400px] rounded-2xl p-5 border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">Notification setup</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Choose what notifications you want to receive.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Email notification switch */}
            <div className="flex items-center justify-between p-3 border border-border/40 rounded-xl bg-muted/10">
              <div className="space-y-0.5 pr-2">
                <p className="font-bold text-foreground">Email updates</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">Weekly digest reports, invoice receipts, and system reports.</p>
              </div>
              <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
            </div>

            {/* Push notification switch */}
            <div className="flex items-center justify-between p-3 border border-border/40 rounded-xl bg-muted/10">
              <div className="space-y-0.5 pr-2">
                <p className="font-bold text-foreground">Browser push alerts</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">Instant alerts for new support tickets and critical audits.</p>
              </div>
              <Switch checked={notifyPush} onCheckedChange={setNotifyPush} />
            </div>

            {/* Sound notification switch */}
            <div className="flex items-center justify-between p-3 border border-border/40 rounded-xl bg-muted/10">
              <div className="space-y-0.5 pr-2">
                <p className="font-bold text-foreground">Sound notifications</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">Play notification sound alerts for instant messages.</p>
              </div>
              <Switch checked={notifySound} onCheckedChange={setNotifySound} />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveModal(null)}
              className="h-8 text-xs font-semibold rounded-lg border-border/60"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveNotifications}
              disabled={isSavingNotify}
              className="h-8 text-xs font-semibold rounded-lg px-4"
            >
              {isSavingNotify ? "Saving..." : "Save preferences"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 5. UPGRADE TO PRO MODAL (confetti upgrade) ────────────────────── */}
      <Dialog open={activeModal === "upgrade"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[440px] rounded-2xl p-5 border border-border bg-card">
          {upgradeState !== "success" ? (
            <>
              <DialogHeader>
                <div className="inline-flex self-start rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                  Upgrade Workspace
                </div>
                <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500/10" /> Upgrade eEnglish Console
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Power up your organization with AI grades, transcripts, multi-tenancy, and advanced white-label settings.
                </DialogDescription>
              </DialogHeader>

              {/* Monthly vs Annual Toggle */}
              <div className="flex bg-muted/60 p-1 rounded-xl items-center border border-border/40 mt-3">
                <button
                  type="button"
                  onClick={() => setBillingPeriod("monthly")}
                  className={cn(
                    "flex-1 text-center py-1.5 rounded-lg text-xs font-semibold transition-all",
                    billingPeriod === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  Monthly billing
                </button>
                <button
                  type="button"
                  onClick={() => setBillingPeriod("annually")}
                  className={cn(
                    "flex-1 text-center py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1",
                    billingPeriod === "annually" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  Annual billing
                  <span className="scale-90 bg-emerald-500 text-white rounded px-1 text-[8px] font-bold">SAVE 20%</span>
                </button>
              </div>

              {/* Pricing Cards */}
              <div className="py-4 flex justify-between items-baseline">
                <div>
                  <span className="text-3xl font-extrabold text-foreground">
                    {billingPeriod === "annually" ? "$39" : "$49"}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium"> / workspace / month</span>
                </div>
                <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider bg-muted px-2 py-0.5 rounded">
                  {billingPeriod === "annually" ? "Billed annually ($468)" : "Billed monthly"}
                </span>
              </div>

              {/* Pro Features checklist */}
              <div className="space-y-2 text-xs border-t border-border/40 pt-4">
                <p className="font-bold text-foreground">Included in Pro plan:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-foreground/80 font-medium">
                    <span className="h-4 w-4 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    <span>Unlimited AI evaluation of IELTS Speaking Practice</span>
                  </li>
                  <li className="flex items-center gap-2 text-foreground/80 font-medium">
                    <span className="h-4 w-4 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    <span>White-label brand branding &amp; Custom Domains</span>
                  </li>
                  <li className="flex items-center gap-2 text-foreground/80 font-medium">
                    <span className="h-4 w-4 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    <span>Advanced student CRM, groups &amp; cohorts tools</span>
                  </li>
                  <li className="flex items-center gap-2 text-foreground/80 font-medium">
                    <span className="h-4 w-4 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    <span>Priority WhatsApp and dedicated Slack channels</span>
                  </li>
                </ul>
              </div>

              {/* Upgrade Trigger Actions */}
              <div className="flex gap-2 mt-5 border-t border-border/40 pt-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveModal(null)}
                  disabled={upgradeState !== "idle"}
                  className="h-8 text-xs font-semibold rounded-lg border-border/60"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleUpgrade}
                  disabled={upgradeState !== "idle"}
                  className="h-8 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4"
                >
                  {upgradeState === "connecting" && (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                      Connecting Stripe...
                    </>
                  )}
                  {upgradeState === "processing" && (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                      Processing payment...
                    </>
                  )}
                  {upgradeState === "idle" && "Upgrade workspace"}
                </Button>
              </div>
            </>
          ) : (
            // Success State UI
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                <CheckCircle className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Welcome to eEnglish Pro!</h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  Your organization billing tier has been successfully upgraded. Pro features are now unlocked.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => {
                  setUpgradeState("idle");
                  setActiveModal(null);
                }}
                className="h-9 w-full rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Go to Workspace
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── 6. REFERRALS MODAL ───────────────────────────────────────────── */}
      <Dialog open={activeModal === "referrals"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[420px] rounded-2xl p-5 border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-rose-500 fill-rose-500/10" /> Refer &amp; Earn
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Share the love. Invite other school operators to eEnglish. You'll both receive 20% discount coupon tags upon setup completion.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Invitation link copy zone */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Your referral link</Label>
              <div className="flex gap-1.5">
                <Input
                  readOnly
                  value="https://eenglish.org/join?ref=admin_38a2"
                  className="h-9 border-border/60 bg-muted/20 rounded-lg text-xs text-muted-foreground/80 font-mono"
                />
                <Button
                  type="button"
                  onClick={handleCopyReferral}
                  className="h-9 px-3 shrink-0 rounded-lg text-xs font-bold gap-1"
                >
                  {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedLink ? "Copied" : "Copy"}</span>
                </Button>
              </div>
            </div>

            {/* Email invite form */}
            <form onSubmit={handleSendReferral} className="space-y-1.5 border-t border-border/40 pt-4 mt-2">
              <Label htmlFor="ref-email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Invite directly via email</Label>
              <div className="flex gap-1.5">
                <Input
                  id="ref-email"
                  type="email"
                  placeholder="name@school.com"
                  value={referralEmail}
                  onChange={(e) => setReferralEmail(e.target.value)}
                  className="h-9 border-border/60 rounded-lg text-xs"
                />
                <Button
                  type="submit"
                  disabled={isSendingReferral || !referralEmail}
                  className="h-9 px-3 shrink-0 rounded-lg text-xs font-bold gap-1 bg-primary hover:bg-primary/95 text-primary-foreground"
                >
                  {isSendingReferral ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  <span>Send</span>
                </Button>
              </div>
            </form>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveModal(null)}
              className="h-8 text-xs font-semibold rounded-lg border-border/60 px-4"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 7. DOWNLOAD APP MODAL ────────────────────────────────────────── */}
      <Dialog open={activeModal === "download"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[440px] rounded-2xl p-5 border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">Download eEnglish Console</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Accelerate your school control workflows. Install the dedicated application with custom hotkeys and system docks.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-3 text-xs">
            {/* Desktop Zone */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-1.5">
                <Monitor className="h-3.5 w-3.5" /> Desktop Client
              </h4>
              <div className="space-y-1.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toast.info("Downloading installer for macOS (dmg)...")}
                  className="h-9 w-full rounded-lg justify-start text-[11px] font-semibold border-border/60 hover:bg-muted/40 gap-2"
                >
                  <span className="text-xs">🍏</span>
                  <span>macOS (Apple Silicon)</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toast.info("Downloading installer for Windows (exe)...")}
                  className="h-9 w-full rounded-lg justify-start text-[11px] font-semibold border-border/60 hover:bg-muted/40 gap-2"
                >
                  <span className="text-xs">🪟</span>
                  <span>Windows Installer (x64)</span>
                </Button>
              </div>
            </div>

            {/* Mobile zone with mocked QR code */}
            <div className="space-y-2.5 border-l border-border/50 pl-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-1.5">
                <Smartphone className="h-3.5 w-3.5" /> Mobile Companion
              </h4>
              <div className="flex items-center gap-3">
                {/* Simulated QR Code */}
                <div className="h-20 w-20 bg-white border-2 border-slate-200 rounded-lg p-1.5 flex flex-wrap gap-0.5 items-center justify-center shadow-sm shrink-0">
                  <div className="h-2.5 w-2.5 bg-slate-900" />
                  <div className="h-2.5 w-2.5 bg-slate-900" />
                  <div className="h-2.5 w-2.5 bg-transparent" />
                  <div className="h-2.5 w-2.5 bg-slate-900" />
                  <div className="h-2.5 w-2.5 bg-transparent" />
                  <div className="h-2.5 w-2.5 bg-slate-900" />
                  <div className="h-2.5 w-2.5 bg-slate-900" />
                  <div className="h-2.5 w-2.5 bg-transparent" />
                  <div className="h-2.5 w-2.5 bg-slate-900" />
                  <div className="h-2.5 w-2.5 bg-slate-900" />
                  <div className="h-2.5 w-2.5 bg-slate-900" />
                  <div className="h-2.5 w-2.5 bg-slate-900" />
                  <div className="h-2.5 w-2.5 bg-transparent" />
                  <div className="h-2.5 w-2.5 bg-slate-900" />
                  <div className="h-2.5 w-2.5 bg-slate-900" />
                  <div className="h-2.5 w-2.5 bg-slate-900" />
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-[10px] leading-snug font-bold text-foreground">Scan to download mobile apps</p>
                  <p className="text-[9px] text-muted-foreground">Available on both Apple App Store and Google Play.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-border/50">
            <Button
              type="button"
              onClick={() => setActiveModal(null)}
              className="h-8 text-xs font-semibold rounded-lg px-4"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 8. SWITCH ACCOUNT MODAL ──────────────────────────────────────── */}
      <Dialog open={activeModal === "account"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[400px] rounded-2xl p-5 border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" /> Switch login user
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Select or add a secure credentials profile key to reload workspace content.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5 py-3 text-xs">
            {/* Account Option 1 */}
            <button
              type="button"
              onClick={() => handleSwitchAccount(0, "admin@eenglish.org")}
              className="w-full text-left p-2.5 rounded-xl border border-border/70 bg-primary/[0.02] hover:bg-primary/[0.04] border-primary/50 transition-all flex items-center gap-3 relative"
            >
              <Avatar className="h-7 w-7 border border-border">
                <AvatarFallback className="text-[9px] bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold">AM</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-foreground leading-tight">Admin Manager (Active)</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">admin@eenglish.org</p>
              </div>
              {switchingAccountIdx === 0 ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>

            {/* Account Option 2 */}
            <button
              type="button"
              onClick={() => handleSwitchAccount(1, "teacher.aiden@eenglish.org")}
              className="w-full text-left p-2.5 rounded-xl border border-border/70 bg-muted/10 hover:bg-muted/30 transition-all flex items-center gap-3"
            >
              <Avatar className="h-7 w-7 border border-border">
                <AvatarFallback className="text-[9px] bg-slate-200 dark:bg-slate-800 text-foreground font-bold">AT</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground leading-tight">Aiden Teacher</p>
                <p className="text-[10px] text-muted-foreground/60 font-medium mt-0.5">teacher.aiden@eenglish.org</p>
              </div>
              {switchingAccountIdx === 1 && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
            </button>

            {/* Account Option 3 */}
            <button
              type="button"
              onClick={() => handleSwitchAccount(2, "student.test@eenglish.org")}
              className="w-full text-left p-2.5 rounded-xl border border-border/70 bg-muted/10 hover:bg-muted/30 transition-all flex items-center gap-3"
            >
              <Avatar className="h-7 w-7 border border-border">
                <AvatarFallback className="text-[9px] bg-slate-200 dark:bg-slate-800 text-foreground font-bold">ST</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground leading-tight">Student Testing Account</p>
                <p className="text-[10px] text-muted-foreground/60 font-medium mt-0.5">student.test@eenglish.org</p>
              </div>
              {switchingAccountIdx === 2 && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setActiveModal(null);
                toast.info("Add account workflow triggered");
              }}
              className="h-8 text-xs font-semibold rounded-lg gap-1 border-border/60"
            >
              <Plus className="h-3.5 w-3.5" /> Add account
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveModal(null)}
              className="h-8 text-xs font-semibold rounded-lg"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 9. SWITCH SPACE WORKSPACE MODAL ──────────────────────────────── */}
      <Dialog open={activeModal === "space"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[400px] rounded-2xl p-5 border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-muted-foreground" /> Switch workspace organization
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Switch database context regions to reload target cohort profiles.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5 py-3 text-xs">
            {/* Space 1 */}
            <button
              type="button"
              onClick={() => handleSwitchSpace(0, "eEnglish Main Office")}
              className={cn(
                "w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 relative",
                activeSpaceIdx === 0
                  ? "border-primary/50 bg-primary/[0.02] hover:bg-primary/[0.04]"
                  : "border-border/70 bg-muted/10 hover:bg-muted/30"
              )}
            >
              <figure className="h-7 w-7 rounded bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                M
              </figure>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-foreground leading-tight">eEnglish Main Office</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">1,200 students · HQ Hub</p>
              </div>
              {activeSpaceIdx === 0 && <Check className="h-4 w-4 text-primary shrink-0" />}
            </button>

            {/* Space 2 */}
            <button
              type="button"
              onClick={() => handleSwitchSpace(1, "eEnglish Saigon Region")}
              className={cn(
                "w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 relative",
                activeSpaceIdx === 1
                  ? "border-primary/50 bg-primary/[0.02] hover:bg-primary/[0.04]"
                  : "border-border/70 bg-muted/10 hover:bg-muted/30"
              )}
            >
              <figure className="h-7 w-7 rounded bg-gradient-to-br from-rose-500 to-orange-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                S
              </figure>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground leading-tight">eEnglish Saigon Region</p>
                <p className="text-[10px] text-muted-foreground/60 font-medium mt-0.5">2,400 students · Branch Office</p>
              </div>
              {activeSpaceIdx === 1 && <Check className="h-4 w-4 text-primary shrink-0" />}
            </button>

            {/* Space 3 */}
            <button
              type="button"
              onClick={() => handleSwitchSpace(2, "Speaking Simulation Hub")}
              className={cn(
                "w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 relative",
                activeSpaceIdx === 2
                  ? "border-primary/50 bg-primary/[0.02] hover:bg-primary/[0.04]"
                  : "border-border/70 bg-muted/10 hover:bg-muted/30"
              )}
            >
              <figure className="h-7 w-7 rounded bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                T
              </figure>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground leading-tight">Speaking Simulation Hub</p>
                <p className="text-[10px] text-muted-foreground/60 font-medium mt-0.5">Sandbox staging environment</p>
              </div>
              {activeSpaceIdx === 2 && <Check className="h-4 w-4 text-primary shrink-0" />}
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setActiveModal(null);
                toast.info("Workspace creation workflow triggered");
              }}
              className="h-8 text-xs font-semibold rounded-lg gap-1 border-border/60"
            >
              <Plus className="h-3.5 w-3.5" /> Create space
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveModal(null)}
              className="h-8 text-xs font-semibold rounded-lg"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 10. HELP / CUSTOMER SUPPORT MODAL ────────────────────────────── */}
      <Dialog open={activeModal === "help"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[400px] rounded-2xl p-5 border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-muted-foreground" /> Contact technical support
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Describe your issue or feature request. Our support engineering desk will get back to you.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitHelp} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="help-msg" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">How can we help you?</Label>
              <textarea
                id="help-msg"
                required
                rows={4}
                value={helpMessage}
                onChange={(e) => setHelpMessage(e.target.value)}
                placeholder="Briefly explain the issue or bug you encountered..."
                className="w-full rounded-lg border border-border/60 bg-card p-3 text-xs font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
              />
            </div>

            <div className="flex gap-2 justify-end border-t border-border/50 pt-4 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveModal(null)}
                className="h-8 text-xs font-semibold rounded-lg border-border/60"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmittingHelp || !helpMessage.trim()}
                className="h-8 text-xs font-semibold rounded-lg px-4"
              >
                {isSubmittingHelp ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                    Submitting...
                  </>
                ) : (
                  "Submit request"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
