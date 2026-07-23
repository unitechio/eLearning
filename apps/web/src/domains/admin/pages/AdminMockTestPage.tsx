import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Award, 
  BookOpen, 
  Headphones, 
  PenSquare, 
  Mic,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { cn } from '@/shared/lib';

interface IELTSMockTestSession {
  id: number;
  user_id: string;
  user_email?: string;
  status: 'started' | 'submitted';
  started_at: string;
  submitted_at?: string;
  overall_band: number;
  component_scores?: string; // JSON string mapping skill -> band
}

export function AdminMockTestPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Query mock test sessions
  const { data: mockSessionsData, isLoading } = useQuery({
    queryKey: ['admin-mock-sessions'],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ data: IELTSMockTestSession[] }>('/admin/ielts/mock-tests?page=1&page_size=100');
        return res.data.data;
      } catch {
        // Fallback Mock Data if API fails
        return [
          {
            id: 1,
            user_id: "u_1",
            user_email: "nguyenvana@gmail.com",
            status: "submitted",
            started_at: "2026-07-22T08:00:00Z",
            submitted_at: "2026-07-22T10:40:00Z",
            overall_band: 7.0,
            component_scores: JSON.stringify({ reading: 7.5, listening: 7.0, writing: 6.5, speaking: 7.0 })
          },
          {
            id: 2,
            user_id: "u_2",
            user_email: "lethib@gmail.com",
            status: "started",
            started_at: "2026-07-23T05:30:00Z",
            overall_band: 0,
            component_scores: "{}"
          }
        ] as IELTSMockTestSession[];
      }
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-2.5 py-0.5 rounded-full text-xs font-black">
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full text-xs font-black">
            In Progress
          </span>
        );
    }
  };

  const parseScores = (scoresJSON?: string) => {
    if (!scoresJSON) return {};
    try {
      return JSON.parse(scoresJSON);
    } catch {
      return {};
    }
  };

  const filteredSessions = (mockSessionsData ?? []).filter(session => {
    const email = session.user_email || session.user_id;
    const matchesSearch = email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-6 lg:p-8 text-slate-800 dark:text-slate-100 font-sans">
      {/* Header banner */}
      <header className="rounded-3xl bg-gradient-to-r from-teal-600 to-cyan-600 p-8 text-white shadow-xl">
        <section className="flex items-center gap-4">
          <figure className="rounded-2xl bg-white/20 p-3" aria-hidden="true">
            <ClipboardList className="h-8 w-8" />
          </figure>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Mock Test Sessions</h1>
            <p className="mt-1 text-teal-105">
              Theo dõi và quản lý các lượt thi thử IELTS trực tuyến của học viên
            </p>
          </div>
        </section>
      </header>

      {/* Filter and search row */}
      <section className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl" aria-label="Filters">
        <label className="relative flex items-center w-full sm:max-w-md">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo email hoặc ID học viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
          />
        </label>

        <label htmlFor="status-select" className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            id="status-select"
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold focus:outline-none"
          >
            <option value="all">Tất cả lượt thi</option>
            <option value="submitted">Đã hoàn thành</option>
            <option value="started">Đang thi</option>
          </select>
        </label>
      </section>

      {/* Main card list list */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm overflow-hidden" aria-label="Mock sessions list">
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">Danh sách phiên thi thử</h2>

        {isLoading ? (
          <div className="py-20 text-center text-slate-400 font-bold">Đang tải danh sách phiên thi...</div>
        ) : filteredSessions.length === 0 ? (
          <div className="py-20 text-center text-slate-450 font-bold">Không tìm thấy phiên thi nào</div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map(session => {
              const scores = parseScores(session.component_scores);
              return (
                <article 
                  key={session.id}
                  className="p-5 border border-slate-100 dark:border-slate-850 rounded-3xl hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        {session.user_email || `ID: ${session.user_id}`}
                      </h3>
                      {getStatusBadge(session.status)}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Started: {new Date(session.started_at).toLocaleString()}
                      </span>
                      {session.submitted_at && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          Submitted: {new Date(session.submitted_at).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Component skill bands display */}
                  <div className="flex items-center gap-4">
                    {session.status === 'submitted' && (
                      <div className="flex items-center gap-2 border-r border-slate-100 dark:border-slate-850 pr-4">
                        <span className="flex items-center gap-1 text-[10px] bg-red-50 dark:bg-red-950/20 text-red-650 px-2 py-0.5 rounded-lg font-black">
                          <BookOpen className="h-3 w-3" />
                          <span>R: {scores.reading || 'N/A'}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[10px] bg-blue-50 dark:bg-blue-950/20 text-blue-650 px-2 py-0.5 rounded-lg font-black">
                          <Headphones className="h-3 w-3" />
                          <span>L: {scores.listening || 'N/A'}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[10px] bg-purple-50 dark:bg-purple-950/20 text-purple-650 px-2 py-0.5 rounded-lg font-black">
                          <PenSquare className="h-3 w-3" />
                          <span>W: {scores.writing || 'N/A'}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 px-2 py-0.5 rounded-lg font-black">
                          <Mic className="h-3 w-3" />
                          <span>S: {scores.speaking || 'N/A'}</span>
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <figure className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-2xl flex items-center justify-center shrink-0" aria-hidden="true">
                        <Award className="h-5 w-5" />
                      </figure>
                      <div>
                        <h4 className="text-xs font-black text-slate-400 leading-none">Overall Band</h4>
                        <p className="text-base font-black text-slate-900 dark:text-white mt-1">
                          {session.status === 'submitted' ? `Band ${session.overall_band}` : 'Pending'}
                        </p>
                      </div>
                    </div>
                  </div>

                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
