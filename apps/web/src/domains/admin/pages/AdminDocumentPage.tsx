import React, { useRef, useState } from 'react';
import {
  Upload,
  FileText,
  Music,
  Image,
  Film,
  Trash2,
  Eye,
  Copy,
  CheckCheck,
  FolderOpen,
  CloudUpload,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';

interface UploadedFile {
  id: string;
  url: string;
  key: string;
  file_name: string;
  size_bytes: number;
  uploaded_at: string;
  content_type?: string;
}

interface UploadResponse {
  url: string;
  key: string;
  file_name: string;
  size_bytes: number;
  uploaded_at: string;
  thumbnail_url?: string;
}

const FOLDER_OPTIONS = [
  { value: 'ielts', label: 'IELTS Content' },
  { value: 'ielts/reading', label: 'IELTS Reading' },
  { value: 'ielts/listening', label: 'IELTS Listening' },
  { value: 'ielts/writing', label: 'IELTS Writing' },
  { value: 'ielts/speaking', label: 'IELTS Speaking' },
  { value: 'thumbnails', label: 'Thumbnails' },
  { value: 'audio', label: 'Audio Files' },
  { value: 'documents', label: 'General Documents' },
  { value: 'assignments', label: 'Assignments' },
  { value: 'public/assets', label: 'Public Assets' },
];

function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) return Music;
  if (['mp4', 'webm', 'mov'].includes(ext)) return Film;
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) return Image;
  return FileText;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AdminDocumentPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [folder, setFolder] = useState('documents');
  const [isPublic, setIsPublic] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const endpoint = isPublic
        ? '/admin/documents/upload-public'
        : '/admin/documents/upload';

      const response = await apiClient.post<{ data: UploadResponse }>(
        endpoint,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return response.data.data;
    },
    onSuccess: (data, file) => {
      setUploadedFiles((prev) => [
        {
          id: crypto.randomUUID(),
          url: data.url,
          key: data.key,
          file_name: data.file_name || file.name,
          size_bytes: data.size_bytes || file.size,
          uploaded_at: data.uploaded_at,
          content_type: file.type,
        },
        ...prev,
      ]);
    },
  });

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      void uploadMutation.mutateAsync(file);
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  async function copyToClipboard(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-6 lg:p-8">
      {/* Header */}
      <header className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white shadow-xl">
        <section className="flex items-center gap-4">
          <figure className="rounded-2xl bg-white/20 p-3" aria-hidden="true">
            <FolderOpen className="h-8 w-8" />
          </figure>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Document & Media Manager</h1>
            <p className="mt-1 text-emerald-100">
              Upload và quản lý tài liệu PDF, audio, hình ảnh dùng trong các bài học
            </p>
          </div>
        </section>
      </header>

      <div className="grid gap-8 xl:grid-cols-3">
        {/* Upload Panel */}
        <section className="xl:col-span-1 space-y-6" aria-label="Upload settings">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              Cấu hình upload
            </h2>

            <div className="space-y-4">
              <label htmlFor="folder-select" className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Thư mục lưu trữ
                </span>
                <select
                  id="folder-select"
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                >
                  {FOLDER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="public-toggle" className="flex cursor-pointer items-center gap-3">
                <input
                  id="public-toggle"
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Public (ai cũng có thể truy cập)
                </span>
              </label>
            </div>
          </article>

          {/* Upload stats */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Thống kê</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Files đã upload</dt>
                <dd className="text-sm font-bold text-slate-900 dark:text-white">{uploadedFiles.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Tổng dung lượng</dt>
                <dd className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatBytes(uploadedFiles.reduce((acc, f) => acc + f.size_bytes, 0))}
                </dd>
              </div>
            </dl>
          </article>
        </section>

        {/* Main Upload + Files area */}
        <section className="xl:col-span-2 space-y-6" aria-label="Upload area and files">
          {/* Drop zone */}
          <article
            className={`relative rounded-3xl border-2 border-dashed p-12 text-center transition-colors ${
              dragOver
                ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/20'
                : 'border-slate-200 bg-white hover:border-emerald-300 dark:border-slate-600 dark:bg-slate-900'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.mp3,.wav,.ogg,.m4a,.mp4,.webm,.png,.jpg,.jpeg,.webp,.gif,.svg"
              onChange={(e) => handleFiles(e.target.files)}
              aria-label="Upload file"
            />

            {uploadMutation.isPending ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Đang upload...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <figure className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/30" aria-hidden="true">
                  <CloudUpload className="h-10 w-10 text-emerald-500" />
                </figure>
                <div>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">
                    Kéo thả file vào đây
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    PDF, Audio, Image, Video — tối đa 100MB mỗi file
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  Chọn file từ máy tính
                </button>
              </div>
            )}

            {uploadMutation.isError && (
              <aside className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                Upload thất bại: {uploadMutation.error instanceof Error ? uploadMutation.error.message : 'Lỗi không xác định'}
              </aside>
            )}
          </article>

          {/* Uploaded files list */}
          {uploadedFiles.length > 0 && (
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <header className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Files đã upload trong phiên này
                </h2>
                <button
                  type="button"
                  onClick={() => setUploadedFiles([])}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Xóa tất cả
                </button>
              </header>

              <ul className="space-y-3" role="list">
                {uploadedFiles.map((file) => {
                  const FileIcon = getFileIcon(file.file_name);
                  return (
                    <li
                      key={file.id}
                      className="group rounded-2xl border border-slate-100 p-4 transition hover:border-emerald-200 hover:shadow-sm dark:border-slate-700"
                    >
                      <article className="flex items-start gap-3">
                        <figure className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800" aria-hidden="true">
                          <FileIcon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                        </figure>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                            {file.file_name}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {formatBytes(file.size_bytes)} · {new Date(file.uploaded_at).toLocaleTimeString()}
                          </p>
                          <p className="mt-1 truncate text-xs font-mono text-emerald-700 dark:text-emerald-400">
                            {file.url}
                          </p>
                        </div>
                        <nav className="flex gap-2" aria-label="File actions">
                          <button
                            type="button"
                            aria-label="Copy URL"
                            onClick={() => void copyToClipboard(file.url, file.id)}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                          >
                            {copiedKey === file.id ? (
                              <CheckCheck className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            aria-label="Preview file"
                            onClick={() => setPreviewFile(file)}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label="Remove from list"
                            onClick={() => setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id))}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </nav>
                      </article>
                    </li>
                  );
                })}
              </ul>
            </article>
          )}

          {/* Help section */}
          <article className="rounded-3xl border border-amber-100 bg-amber-50 p-6 dark:border-amber-900/30 dark:bg-amber-950/20">
            <header className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-amber-600" aria-hidden="true" />
              <h2 className="text-sm font-bold text-amber-800 dark:text-amber-400">
                Hướng dẫn sử dụng URL
              </h2>
            </header>
            <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
              <li>• Copy URL sau khi upload và dán vào field <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">thumbnail_url</code>, <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">audio_url</code>, hoặc <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">pdf_url</code> của IELTS content</li>
              <li>• Thumbnail: nên upload ảnh JPG/PNG, hệ thống tự optimize thành WebP</li>
              <li>• Audio: định dạng MP3 được khuyến nghị</li>
              <li>• PDF: tối đa 50MB</li>
            </ul>
          </article>
        </section>
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="File preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewFile(null)}
        >
          <article
            className="max-h-[80vh] w-full max-w-3xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{previewFile.file_name}</h2>
              <button
                type="button"
                aria-label="Close preview"
                onClick={() => setPreviewFile(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </header>
            <dl className="space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="font-medium text-slate-500 w-24">URL:</dt>
                <dd className="font-mono text-emerald-700 dark:text-emerald-400 break-all">{previewFile.url}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-slate-500 w-24">Key:</dt>
                <dd className="font-mono text-xs text-slate-700 dark:text-slate-300">{previewFile.key}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-slate-500 w-24">Size:</dt>
                <dd>{formatBytes(previewFile.size_bytes)}</dd>
              </div>
            </dl>
            <footer className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => void copyToClipboard(previewFile.url, 'preview')}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
              >
                {copiedKey === 'preview' ? '✓ Đã copy' : 'Copy URL'}
              </button>
              <a
                href={previewFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
              >
                Mở trong tab mới
              </a>
            </footer>
          </article>
        </div>
      )}
    </main>
  );
}
