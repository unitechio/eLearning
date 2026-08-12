import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { useDocuments } from '../hooks/useDocuments';
import { getFileIcon, getFileColorVariant, formatFileSize } from '../utils/file-utils';
import { Document } from '../types';
import { Search, File, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface DocumentPickerProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onSelect: (docs: Document[]) => void;
  readonly multiple?: boolean;
}

export function DocumentPicker({
  open,
  onClose,
  onSelect,
  multiple = false,
}: DocumentPickerProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Document[]>([]);
  const { data: { items: documents = [] } = { items: [], total: 0 } } = useDocuments({ search });

  const toggleSelect = (doc: Document) => {
    if (multiple) {
      const exists = selected.some((d) => d.id === doc.id);
      if (exists) {
        setSelected((prev) => prev.filter((d) => d.id !== doc.id));
      } else {
        setSelected((prev) => [...prev, doc]);
      }
    } else {
      setSelected([doc]);
    }
  };

  const handleConfirm = () => {
    onSelect(selected);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl p-6 rounded-[24px] bg-white dark:bg-slate-900 border dark:border-slate-800 font-sans">
        <DialogHeader className="border-b pb-3 dark:border-slate-800">
          <DialogTitle className="text-lg font-black text-slate-800 dark:text-white">
            Choose from Document Library
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative mt-4">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-850 dark:text-white"
          />
        </div>

        {/* Documents List */}
        <ul className="mt-4 max-h-[300px] overflow-y-auto space-y-2 pr-1" role="list">
          {documents.map((doc) => {
            const Icon = getFileIcon(doc.title);
            const { bg, iconColor } = getFileColorVariant(doc.title);
            const isSel = selected.some((d) => d.id === doc.id);

            return (
              <li
                key={doc.id}
                onClick={() => toggleSelect(doc)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                  isSel
                    ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/10'
                    : 'border-slate-100 hover:border-slate-200 dark:border-slate-800 dark:hover:border-slate-750'
                }`}
              >
                <div className="flex items-center gap-3">
                  <figure className={`h-10 w-10 rounded-lg flex items-center justify-center ${bg}`} aria-hidden="true">
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </figure>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{doc.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {formatFileSize(doc.current_version?.file_asset?.size || 0)} • {doc.current_version?.file_asset?.extension?.replace('.', '') || 'unknown'}
                    </p>
                  </div>
                </div>
                <div>
                  {isSel ? (
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-slate-300" />
                  )}
                </div>
              </li>
            );
          })}
          {documents.length === 0 && (
            <li className="text-center text-xs text-slate-400 py-12">No files found matching search.</li>
          )}
        </ul>

        {/* Action Buttons */}
        <footer className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={selected.length === 0}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6"
          >
            Select ({selected.length})
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
