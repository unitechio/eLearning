import React from 'react';
import { Grip, X } from 'lucide-react';
import { cn } from '@/shared/lib';

export type QuestionPalettePassage = {
  id: number;
  label: string;
  start: number;
  end: number;
  answered: number;
};

export function QuestionPalette({
  passages,
  activeQuestion,
  onQuestionSelect,
  onClose,
}: {
  passages: QuestionPalettePassage[];
  activeQuestion: number;
  onQuestionSelect: (question: number) => void;
  onClose?: () => void;
}) {
  return (
    <aside className="w-[340px] rounded-[8px] border border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <Grip className="h-4 w-4 text-slate-500" />
          <p className="text-sm font-black text-slate-900">Bảng câu hỏi</p>
        </div>
        {onClose ? (
          <button className="text-slate-400 hover:text-slate-700" onClick={onClose} type="button">
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <div className="space-y-5 p-4">
        {passages.map((passage) => (
          <section key={passage.id}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">{passage.label}</p>
              <p className="text-xs text-slate-500">{passage.answered}/{passage.end - passage.start + 1}</p>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: passage.end - passage.start + 1 }, (_, index) => passage.start + index).map((question) => (
                <button
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-black transition',
                    activeQuestion === question ? 'border-slate-500 bg-slate-100 text-slate-950' : 'border-slate-300 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-700',
                  )}
                  key={question}
                  onClick={() => onQuestionSelect(question)}
                  type="button"
                >
                  {question}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
