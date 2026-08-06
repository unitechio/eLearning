import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  KeyRound,
  Menu as MenuIcon,
  FileText,
  BookOpen,
  GraduationCap,
  Layers,
  PenLine,
  ScrollText,
  School,
  CreditCard,
  Receipt,
  Tag,
  Ticket,
  LifeBuoy,
  Mail,
  History,
  Terminal as TerminalIcon,
  Plug,
  Settings,
  ToggleLeft,
  Truck,
  FileCheck,
  Globe,
  PhoneCall,
  QrCode,
  Calendar,
  Heart,
  Download,
  Radio,
  Shield,
  Monitor,
  FileSearch,
  Database,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  soon?: boolean;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const adminNavGroups: readonly NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { title: "Calendar", path: "/admin/calendar", icon: Calendar },
      { title: "Referrals", path: "/admin/referrals", icon: Heart },
      { title: "Downloads", path: "/admin/downloads", icon: Download },
    ],
  },
  {
    label: "User Management",
    items: [
      { title: "Users", path: "/admin/users", icon: Users },
    ],
  },
  {
    label: "Identity & Access",
    items: [
      { title: "Roles & Permissions", path: "/admin/access", icon: ShieldCheck },
      { title: "Auth Clients", path: "/admin/ams/auth-clients", icon: KeyRound },
      { title: "SSO Providers", path: "/admin/ams/sso-providers", icon: Globe },
      { title: "Login Channels", path: "/admin/ams/login-channels", icon: Radio },
      { title: "Security Policies", path: "/admin/ams/security-policies", icon: Shield },
    ],
  },
  {
    label: "Security",
    items: [
      { title: "Auth History", path: "/admin/ams/auth-history", icon: History },
      { title: "Trusted Devices", path: "/admin/ams/devices", icon: Monitor },
      { title: "Audit Logs", path: "/admin/audit-logs", icon: FileSearch },
      { title: "Reference Data", path: "/admin/ams/reference-options", icon: Database },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Content", path: "/admin/content", icon: FileText },
      { title: "Mock Tests", path: "/admin/mock-tests", icon: ScrollText },
      { title: "IELTS", path: "/admin/ielts", icon: BookOpen },
      { title: "Documents", path: "/admin/documents", icon: FileText },
      { title: "Writing Review", path: "/admin/writing-review", icon: PenLine },
      { title: "Blueprints", path: "/admin/blueprints", icon: Layers },
    ],
  },
  {
    label: "Learning",
    items: [
      { title: "LMS", path: "/admin/lms", icon: School },
    ],
  },
  {
    label: "Billing",
    items: [
      { title: "Billing", path: "/admin/billing", icon: CreditCard },
      { title: "Invoices", path: "/admin/invoices", icon: Receipt },
      { title: "Invoice Categories", path: "/admin/invoice-categories", icon: Tag },
      { title: "Vouchers", path: "/admin/vouchers", icon: Ticket },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Support", path: "/admin/support", icon: LifeBuoy },
      { title: "Email Logs", path: "/admin/email-logs", icon: Mail },
      { title: "Agent Console", path: "/admin/agent-console", icon: TerminalIcon, badge: "AI" },
      { title: "Integrations", path: "/admin/integrations", icon: Plug },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Platform Settings", path: "/admin/platform-settings", icon: Settings },
      { title: "Feature Flags", path: "/admin/feature-flags", icon: ToggleLeft },
    ],
  },
  {
    label: "Planned",
    items: [
      { title: "Delivery Tracker", path: "/admin/delivery-tracker", icon: Truck, soon: true },
      { title: "Signer Flow", path: "/admin/signer-flow", icon: FileCheck, soon: true },
      { title: "Bio Pages", path: "/admin/bio-pages", icon: Globe, soon: true },
      { title: "QR Generator", path: "/admin/qr-generator", icon: QrCode, soon: true },
      { title: "Call History", path: "/admin/call-history", icon: PhoneCall, soon: true },
    ],
  },
];

export const allAdminNavItems: readonly NavItem[] = adminNavGroups.flatMap((g) => g.items);

