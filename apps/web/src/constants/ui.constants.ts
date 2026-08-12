import { Grid,List } from 'lucide-react';

export const PAGE_SIZES = [10, 20, 50, 100];

export const DEFAULT_PAGE_SIZE = 20;

export const MAX_UPLOAD_SIZE = 50 * 1024 * 1024;

export const DEBOUNCE_MS = 300;

export const VIEW_MODES = [
  { mode: 'grid', icon: Grid, label: 'Grid view' },
  { mode: 'list', icon: List, label: 'List view' },
];
