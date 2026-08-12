import type { LucideIcon } from 'lucide-react';

import {
  Columns3,
  ExternalLink,
  FolderIcon,
  Heart,
  Trash2,
  Grid,
  List
} from 'lucide-react';
import type { DocumentTab,DocumentViewMode} from '@/shared/types/document.types';

export const DOCUMENT_TABS = [
  { id: 'all', label: 'All docs', icon: Columns3 },
  { id: 'folders', label: 'Folders', icon: FolderIcon },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'shared', label: 'Sharing', icon: ExternalLink },
  { id: 'trash', label: 'Deleted', icon: Trash2 },
] satisfies Array<{
  id: DocumentTab;
  label: string;
  icon: LucideIcon;
}>;

export const DOCUMENT_VIEW_MODES = [
  { mode: 'grid', icon: Grid, label: 'Grid view' },
  { mode: 'list', icon: List, label: 'List view' },
] satisfies Array<{
  mode: DocumentViewMode;
  icon: LucideIcon;
  label: string;
}>;
