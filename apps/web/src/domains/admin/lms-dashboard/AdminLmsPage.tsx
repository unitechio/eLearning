import React from 'react';
import { useAdminLmsEditor } from './hooks/useAdminLmsEditor';
import { UserPicker } from './components/UserPicker';
import { DashboardConfigForm } from './components/DashboardConfigForm';
import { EnrollmentList } from './components/EnrollmentList';

export function AdminLmsPage() {
  const editor = useAdminLmsEditor();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Admin LMS</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Learner tracking dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Quản trị block LMS cho từng học viên: hero, streak, progress, toolkit, mock test, 4 kỹ năng và các course cards hiển thị ở learner view.
        </p>
        {editor.message && (
          <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {editor.message}
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        {/* Left Panel: User Picker */}
        <UserPicker
          query={editor.query}
          onQueryChange={editor.setQuery}
          users={editor.usersQuery.data?.items ?? []}
          selectedUserId={editor.selectedUserId}
          onSelect={editor.setSelectedUserId}
        />

        {/* Right Panel: Editors */}
        <div className="space-y-6">
          <DashboardConfigForm
            form={editor.form}
            onTextChange={editor.setText}
            onNumberChange={editor.setNumber}
            onSave={editor.saveDashboard}
            isSaving={editor.isSavingDashboard}
          />

          <EnrollmentList
            enrollments={editor.enrollments}
            onEnrollmentChange={(idx, patch) => editor.setEnrollments((c) => c.map((e, i) => (i === idx ? { ...e, ...patch } : e)))}
            onAdd={editor.addEnrollment}
            onSave={editor.saveEnrollment}
            onRemove={editor.deleteEnrollment}
          />
        </div>
      </div>
    </div>
  );
}
