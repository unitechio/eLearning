import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  BookOpen,
  CreditCard,
  Database,
  FileText,
  Flag,
  GraduationCap,
  Image,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  LineChart,
  Mail,
  Megaphone,
  MessageSquare,
  Receipt,
  ScrollText,
  Settings,
  Shield,
  Tag,
  TrendingUp,
  Users,
  Wifi,
  Zap,
} from 'lucide-react';

export interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

export interface NavGroup {
  group: string;
  items: readonly NavItem[];
}

export const adminNavItems: readonly NavGroup[] = [
  {
    group: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    ],
  },
  {
    group: 'Analytics',
    items: [
      { icon: TrendingUp, label: 'Traffic Analytics',  path: '/admin/analytics/traffic' },
      { icon: LineChart,  label: 'Revenue Report',     path: '/admin/analytics/revenue' },
      { icon: BarChart3,  label: 'User Behaviour',     path: '/admin/analytics/behaviour' },
    ],
  },
  {
    group: 'User Management',
    items: [
      { icon: Users,    label: 'Users',              path: '/admin/users' },
      { icon: Shield,   label: 'Access Control',     path: '/admin/access' },
      { icon: KeyRound, label: 'User Access',        path: '/admin/user-access' },
      { icon: Bell,     label: 'Notifications Mgmt', path: '/admin/notifications' },
    ],
  },
  {
    group: 'Content',
    items: [
      { icon: BookOpen,      label: 'IELTS Content', path: '/admin/ielts' },
      { icon: GraduationCap, label: 'Courses',       path: '/admin/courses' },
      { icon: FileText,      label: 'Exam Banks',    path: '/admin/exam-banks' },
      { icon: Image,         label: 'Media Library', path: '/admin/media' },
      { icon: Megaphone,     label: 'Announcements', path: '/admin/announcements' },
      { icon: LineChart,     label: 'LMS',           path: '/admin/lms' },
      { icon: FileText,      label: 'Documents',     path: '/admin/documents' },
      { icon: MessageSquare, label: 'Writing Review', path: '/admin/writing-review' },
      { icon: BookOpen,      label: 'Content Manager', path: '/admin/content' },
      { icon: ScrollText,    label: 'Mock Tests Sessions', path: '/admin/mock-tests' },
    ],
  },
  {
    group: 'Finance',
    items: [
      { icon: CreditCard, label: 'Billing',       path: '/admin/billing' },
      { icon: Zap,        label: 'Subscriptions', path: '/admin/subscriptions' },
      { icon: Receipt,    label: 'Transactions',  path: '/admin/transactions' },
      { icon: Tag,        label: 'Coupons',       path: '/admin/coupons' },
      { icon: Receipt,    label: 'Invoices',      path: '/admin/invoices' },
      { icon: Tag,        label: 'Vouchers',      path: '/admin/vouchers' },
    ],
  },
  {
    group: 'Platform',
    items: [
      { icon: Settings,   label: 'Platform Settings', path: '/admin/platform-settings' },
      { icon: Flag,       label: 'Feature Flags',     path: '/admin/feature-flags' },
      { icon: Activity,   label: 'System Health',     path: '/admin/system-health' },
      { icon: Database,   label: 'Cache Manager',     path: '/admin/cache' },
      { icon: Wifi,       label: 'API Rate Limits',   path: '/admin/rate-limits' },
      { icon: ScrollText, label: 'Audit Logs',        path: '/admin/audit-logs' },
      { icon: Mail,       label: 'Email Logs',        path: '/admin/email-logs' },
    ],
  },
  {
    group: 'Support',
    items: [
      { icon: LifeBuoy,      label: 'Support Tickets',   path: '/admin/support' },
      { icon: MessageSquare, label: 'Feedback & Reviews', path: '/admin/feedback' },
      { icon: AlertCircle,   label: 'Error Reports',     path: '/admin/errors' },
    ],
  },
];
