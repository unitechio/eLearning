import React from 'react';
import { Activity, BookOpen, Bot, CalendarClock, CheckCircle2, Flame, GraduationCap, Headphones, Mic2, PenSquare, Trophy } from 'lucide-react';
import { useMyLmsDashboard } from '../api/hooks';

function ProgressRing({ value, label, subtitle }: { value: number; label: string; subtitle?: string }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[conic-gradient(#2563eb_var(--progress),#e2e8f0_0)]" style={{ ['--progress' as string]: `${safe * 3.6}deg` }}>
        <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-white">
          <span className="text-2xl font-black text-slate-900">{safe}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">%</span>
        </div>
      </div>
      <p className="mt-4 text-center text-lg font-bold text-slate-900">{label}</p>
      {subtitle ? <p className="mt-1 text-center text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  );
}

function SectionBlock({ icon: Icon, title, description, children }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-8 overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[1.05fr_1.15fr]">
      <div className="space-y-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-red-50 text-red-500">
          <Icon className="h-9 w-9" />
        </div>
        <div className="max-w-xl space-y-4">
          <h2 className="text-4xl font-black leading-tight tracking-tight text-slate-900">{title}</h2>
          <p className="text-lg leading-8 text-slate-600">{description}</p>
        </div>
      </div>
      <div className="rounded-[28px] bg-slate-50 p-6">{children}</div>
    </section>
  );
}

export function LmsDashboardPage() {
  const dashboardQuery = useMyLmsDashboard();
  const data = dashboardQuery.data;
  const dashboard = data?.dashboard;
  const enrollments = data?.enrollments ?? [];
  const inProgress = enrollments.filter((item) => item.status === 'in_progress');
  const upcoming = enrollments.filter((item) => item.status === 'upcoming');
  const completed = enrollments.filter((item) => item.status === 'completed');

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 p-8">
      <section className="overflow-hidden rounded-[36px] border border-red-200 bg-[linear-gradient(135deg,#ef4444_0%,#f87171_55%,#fb7185_100%)] p-8 text-white shadow-2xl shadow-red-200/50">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
              <Flame className="h-4 w-4 fill-current" />
              Chuỗi học tập {dashboard?.current_streak ?? 0} ngày
            </div>
            <div>
              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight">{dashboard?.hero_title || 'LMS theo dõi quá trình học IELTS'}</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/90">{dashboard?.hero_description || 'Theo dõi tiến độ học, luyện tập, assignment và các khóa học đang diễn ra của bạn.'}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-white/95 p-5 text-slate-900 shadow-sm">
                <p className="text-sm font-bold text-slate-500">Bạn đang theo học {dashboard?.active_courses ?? 0} khóa học</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm font-bold">Điểm danh {dashboard?.attendance_rate ?? 0}%</div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm font-bold">Luyện tập {dashboard?.practice_rate ?? 0}%</div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm font-bold">Assignment {dashboard?.assignment_rate ?? 0}%</div>
                </div>
              </div>
              <div className="rounded-3xl bg-white/95 p-5 text-slate-900 shadow-sm">
                <p className="text-sm font-bold text-slate-500">Trọng tâm hiện tại</p>
                <p className="mt-3 text-xl font-black">{dashboard?.current_focus || 'Lộ trình 4 kỹ năng IELTS'}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{dashboard?.current_focus_note || 'Giữ đều điểm danh, làm online tests và tăng tần suất luyện Writing/Speaking.'}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ProgressRing label="Course progress" subtitle="Các buổi đã học" value={dashboard?.overall_progress ?? 0} />
            <ProgressRing label="Attendance" subtitle="Mức độ chăm chỉ" value={dashboard?.attendance_rate ?? 0} />
            <ProgressRing label="Practice" subtitle="Luyện tập thêm" value={dashboard?.practice_rate ?? 0} />
            <ProgressRing label="Assignment" subtitle="Bài tập quan trọng" value={dashboard?.assignment_rate ?? 0} />
          </div>
        </div>
      </section>

      <SectionBlock icon={Activity} title="Thống kê điểm danh và luyện tập trong khóa học" description="Giúp học viên theo dõi tiến độ đi học và tiến độ luyện tập trong toàn quá trình học.">
        <div className="space-y-5 rounded-[24px] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between rounded-3xl bg-orange-50 px-5 py-4">
            <div>
              <p className="text-3xl font-black text-orange-500">🔥 {dashboard?.current_streak ?? 0}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">Bạn đang có chuỗi {dashboard?.current_streak ?? 0} ngày streak</p>
              <p className="mt-1 text-sm text-orange-600">Hãy tiếp tục luyện tập để giữ vững phong độ.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <ProgressRing label="Course progress" value={dashboard?.overall_progress ?? 0} />
            <ProgressRing label="Attendance" value={dashboard?.attendance_rate ?? 0} />
            <ProgressRing label="Practice" value={dashboard?.practice_rate ?? 0} />
            <ProgressRing label="Assignment" value={dashboard?.assignment_rate ?? 0} />
          </div>
        </div>
      </SectionBlock>

      <SectionBlock icon={PenSquare} title="Kho bài tập được soạn riêng cho từng khóa học" description="Giúp cho việc học đạt hiệu quả tối đa bằng các bài bổ trợ về nhà để ôn lại tư duy được học trên lớp, và nhuần nhuyễn chúng.">
        <div className="grid gap-4 md:grid-cols-2">
          {(dashboard?.skill_plan ?? []).length > 0 ? (
            dashboard?.skill_plan.map((item, index) => (
              <div key={`${item.label}-${index}`} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <p className="text-xl font-black text-slate-900">{item.label}</p>
                <p className="mt-3 text-sm text-slate-500">{item.subtitle || 'Bộ bài tập được mở theo tuần học và kỹ năng.'}</p>
                {typeof item.value !== 'undefined' ? <p className="mt-4 text-sm font-bold text-blue-600">{String(item.value)}</p> : null}
              </div>
            ))
          ) : (
            ['Tuần 1 - Speaking', 'Tuần 1 - Writing', 'Tuần 1 - Reading', 'Tuần 1 - Listening'].map((item) => (
              <div key={item} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <p className="text-xl font-black text-slate-900">{item}</p>
                <p className="mt-3 text-sm text-slate-500">Exercise, online tests, sample W/S và bài hỗ trợ đi kèm.</p>
              </div>
            ))
          )}
        </div>
      </SectionBlock>

      <SectionBlock icon={Mic2} title="Bài chấm Writing/Speaking kèm giọng nói" description="Giúp học viên làm bài tập W/S dễ hơn, biết lúc nào hết hạn, và được chấm sửa chi tiết hơn, nhanh hơn với giọng nói thu sẵn từ giáo viên.">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            {(dashboard?.score_breakdown ?? []).map((item, index) => (
              <div key={`${item.label}-${index}`} className="rounded-3xl border border-slate-100 p-5">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                <p className="mt-3 text-4xl font-black text-red-500">{String(item.value ?? '-')}</p>
                <p className="mt-2 text-sm text-slate-500">{item.subtitle}</p>
              </div>
            ))}
            {(!dashboard?.score_breakdown || dashboard.score_breakdown.length === 0) ? (
              <div className="rounded-3xl border border-slate-100 p-5 md:col-span-2">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Mock writing / speaking</p>
                <p className="mt-3 text-4xl font-black text-red-500">{(dashboard?.estimated_band ?? 0).toFixed(1)}</p>
                <p className="mt-2 text-sm text-slate-500">Thiết kế để hiển thị rubric hoặc radar band cho các bài W/S.</p>
              </div>
            ) : null}
          </div>
        </div>
      </SectionBlock>

      <SectionBlock icon={BookOpen} title="Đa dạng công cụ luyện tập, tạo trải nghiệm all-in-one" description="Từ online tests, dictation, vocabulary, exercises, sample W/S, AI mock test tới roadmap và assignments.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {(dashboard?.toolkit ?? []).length > 0 ? (
            dashboard?.toolkit.map((item, index) => (
              <div key={`${item.label}-${index}`} className="rounded-2xl bg-white px-5 py-4 text-base font-bold text-slate-800 shadow-sm ring-1 ring-slate-100">
                {item.label}
              </div>
            ))
          ) : (
            ['Online tests', 'Dictation', 'Vocabulary', 'Exercises', 'Sample W/S', 'Blogs', 'AI mock test', 'Roadmap', 'Assignments'].map((item) => (
              <div key={item} className="rounded-2xl bg-white px-5 py-4 text-base font-bold text-slate-800 shadow-sm ring-1 ring-slate-100">
                {item}
              </div>
            ))
          )}
        </div>
      </SectionBlock>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-black text-slate-900">Khóa học của bạn</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {inProgress.concat(upcoming).concat(completed).map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">{item.track || item.status}</p>
                    <h3 className="mt-2 text-2xl font-black text-slate-900">{item.title}</h3>
                  </div>
                  <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">{item.progress_percent}%</div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-500">
                  <p>{item.schedule_label} {item.time_range ? `• ${item.time_range}` : ''}</p>
                  <p>{item.center_name} {item.room_name ? `• ${item.room_name}` : ''}</p>
                  <p>{item.current_lesson || item.next_lesson}</p>
                  <p>{item.instructor_name}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.metrics?.map((metric, index) => (
                    <span key={`${metric.label}-${index}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                      {metric.label} {metric.value ? String(metric.value) : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {enrollments.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">Chưa có dữ liệu khóa học LMS cho tài khoản này.</div> : null}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-amber-500" />
              <h2 className="text-xl font-black text-slate-900">Chứng chỉ</h2>
            </div>
            {completed.find((item) => item.certificate_name || item.certificate_url) ? (
              <div className="mt-5 space-y-3">
                <p className="text-lg font-bold text-slate-900">{completed.find((item) => item.certificate_name || item.certificate_url)?.certificate_name || 'Certificate ready'}</p>
                <a className="text-sm font-bold text-blue-600" href={completed.find((item) => item.certificate_url)?.certificate_url || '#'} target="_blank" rel="noreferrer">Mở chứng chỉ</a>
              </div>
            ) : <p className="mt-5 text-sm text-slate-500">Chưa có chứng chỉ nào được gắn cho học viên.</p>}
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-black text-slate-900">AI Features</h2>
            </div>
            <div className="mt-5 space-y-3">
              {(dashboard?.ai_features ?? []).length > 0 ? dashboard?.ai_features.map((item, index) => (
                <div key={`${item.label}-${index}`} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="font-bold text-slate-900">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
                </div>
              )) : <p className="text-sm text-slate-500">Bật các block AI mock test, chấm Writing/Speaking, pronunciation và feedback tại admin LMS.</p>}
            </div>
          </div>
        </div>
      </section>

      <SectionBlock icon={Headphones} title="Giao diện thi thật 4 kỹ năng" description="Cung cấp giao diện thi thật cho cả 4 kỹ năng, cùng các block luyện tập từ dashboard LMS.">
        <div className="grid gap-4 md:grid-cols-2">
          {(dashboard?.four_skills ?? []).length > 0 ? dashboard?.four_skills.map((item, index) => (
            <div key={`${item.label}-${index}`} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <p className="text-xl font-black text-slate-900">{item.label}</p>
              <p className="mt-2 text-sm text-slate-500">{item.subtitle}</p>
              {typeof item.value !== 'undefined' ? <p className="mt-4 text-sm font-bold text-slate-700">{String(item.value)}</p> : null}
            </div>
          )) : (
            <>
              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100"><div className="flex items-center gap-3"><Headphones className="h-5 w-5 text-red-500" /><p className="text-xl font-black">1. Kỹ năng Nghe</p></div></div>
              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100"><div className="flex items-center gap-3"><BookOpen className="h-5 w-5 text-red-500" /><p className="text-xl font-black">2. Kỹ năng Đọc</p></div></div>
              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100"><div className="flex items-center gap-3"><PenSquare className="h-5 w-5 text-red-500" /><p className="text-xl font-black">3. Kỹ năng Viết</p></div></div>
              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100"><div className="flex items-center gap-3"><Mic2 className="h-5 w-5 text-red-500" /><p className="text-xl font-black">4. Kỹ năng Nói</p></div></div>
            </>
          )}
        </div>
      </SectionBlock>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        {dashboardQuery.isLoading ? 'Đang tải LMS dashboard...' : 'Module LMS đã lấy dữ liệu thật từ backend `GET /lms/dashboard`. Các block và course cards có thể chỉnh từ admin LMS.'}
      </div>
    </div>
  );
}
