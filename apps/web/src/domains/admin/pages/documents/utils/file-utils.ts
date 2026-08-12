import {
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Table,
  FileCode,
  Sliders,
  File,
  LucideIcon
} from 'lucide-react';

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() ?? '';
}

export function getFileCategory(file: string | { mime_type?: string; extension?: string }): string {
  const ext = typeof file === 'string' ? getFileExtension(file) : (file.extension?.toLowerCase() || '');
  const mime = typeof file === 'string' ? '' : (file.mime_type || '').toLowerCase();

  if (['pdf'].includes(ext) || mime.includes('pdf')) return 'pdf';
  if (['doc', 'docx', 'txt', 'rtf'].includes(ext) || mime.includes('word') || mime.includes('text')) return 'document';
  if (['xls', 'xlsx', 'csv'].includes(ext) || mime.includes('excel') || mime.includes('spreadsheet')) return 'spreadsheet';
  if (['ppt', 'pptx'].includes(ext) || mime.includes('presentation') || mime.includes('powerpoint')) return 'presentation';
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext) || mime.startsWith('image/')) return 'image';
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext) || mime.startsWith('audio/')) return 'audio';
  if (['mp4', 'webm', 'mov', 'avi'].includes(ext) || mime.startsWith('video/')) return 'video';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || mime.includes('zip') || mime.includes('compressed')) return 'archive';
  return 'other';
}

export function getFileIcon(file: string | { mime_type?: string; extension?: string }): LucideIcon {
  const category = getFileCategory(file);
  switch (category) {
    case 'pdf':
    case 'document':
      return FileText;
    case 'spreadsheet':
      return Table;
    case 'presentation':
      return Sliders;
    case 'image':
      return Image;
    case 'audio':
      return Music;
    case 'video':
      return Video;
    case 'archive':
      return Archive;
    default:
      return File;
  }
}

export function getFileColorVariant(file: string | { mime_type?: string; extension?: string }): {
  bg: string;
  text: string;
  border: string;
  iconColor: string;
} {
  const category = getFileCategory(file);
  switch (category) {
    case 'pdf':
      return {
        bg: 'bg-red-50 dark:bg-red-950/20',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800/30',
        iconColor: 'text-red-500'
      };
    case 'document':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800/30',
        iconColor: 'text-blue-500'
      };
    case 'spreadsheet':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/20',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800/30',
        iconColor: 'text-emerald-500'
      };
    case 'presentation':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800/30',
        iconColor: 'text-amber-500'
      };
    case 'image':
      return {
        bg: 'bg-purple-50 dark:bg-purple-950/20',
        text: 'text-purple-700 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800/30',
        iconColor: 'text-purple-500'
      };
    case 'audio':
      return {
        bg: 'bg-pink-50 dark:bg-pink-950/20',
        text: 'text-pink-700 dark:text-pink-400',
        border: 'border-pink-200 dark:border-pink-800/30',
        iconColor: 'text-pink-500'
      };
    case 'video':
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-950/20',
        text: 'text-indigo-700 dark:text-indigo-400',
        border: 'border-indigo-200 dark:border-indigo-800/30',
        iconColor: 'text-indigo-500'
      };
    case 'archive':
      return {
        bg: 'bg-orange-50 dark:bg-orange-950/20',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800/30',
        iconColor: 'text-orange-500'
      };
    default:
      return {
        bg: 'bg-slate-50 dark:bg-slate-900',
        text: 'text-slate-700 dark:text-slate-400',
        border: 'border-slate-200 dark:border-slate-800',
        iconColor: 'text-slate-400'
      };
  }
}

export function canPreview(file: string | { mime_type?: string; extension?: string }): boolean {
  const category = getFileCategory(file);
  const ext = typeof file === 'string' ? getFileExtension(file) : (file.extension?.toLowerCase() || '');
  const isText = /^(txt|md|json|js|ts|html|css|yaml|yml|xml|csv)$/i.test(ext);
  return ['pdf', 'image', 'audio', 'video'].includes(category) || isText;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
