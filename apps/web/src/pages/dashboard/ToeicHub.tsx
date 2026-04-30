import React from 'react';
import { Headphones, BookText, Mic2, PenSquare } from 'lucide-react';
import { useCourses } from '@/features/course/api/hooks';

const practiceModes = [
  { icon: Headphones, title: 'TOEIC Listening', description: 'Luyện Part 1-4 với đề theo bộ.' },
  { icon: BookText, title: 'TOEIC Reading', description: 'Luyện Part 5-7 với bài đọc và câu hỏi.' },
  { icon: Mic2, title: 'TOEIC Speaking', description: 'Luyện nói và chấm phát âm theo tiêu chí.' },
  { icon: PenSquare, title: 'TOEIC Writing', description: 'Luyện viết câu, email, opinion response.' },
];

export function ToeicHubPage() {
  const coursesQuery = useCourses({ domain: 'toeic', page: 1, page_size: 12 });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">TOEIC Practice Hub</h1>
        <p className="mt-2 text-sm text-slate-500">Điểm vào cho các màn TOEIC dùng course data thật từ backend.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {practiceModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <div key={mode.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{mode.title}</h2>
              <p className="mt-2 text-sm text-slate-500">{mode.description}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">TOEIC Courses</h2>
          <p className="mt-1 text-sm text-slate-500">Danh sách course TOEIC hiện có trên hệ thống.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(coursesQuery.data ?? []).map((course) => (
            <div key={course.id} className="rounded-2xl border border-slate-100 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-primary">{course.level || 'general'}</p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">{course.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{course.description || 'No description yet.'}</p>
              <div className="mt-4 flex gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{course.status}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{course.visibility}</span>
              </div>
            </div>
          ))}
          {!coursesQuery.isLoading && (coursesQuery.data ?? []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
              Chưa có course TOEIC public hoặc thuộc tenant hiện tại.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
