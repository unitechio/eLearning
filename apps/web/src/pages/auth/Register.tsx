import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister, useAuthStore } from '@/features/auth';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const registerMutation = useRegister();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = await registerMutation.mutateAsync(form);
      setAuth(payload);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Register failed');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">Use your real academy account to access courses, progress, and admin tools.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="First name" value={form.first_name} onChange={(e) => setForm((s) => ({ ...s, first_name: e.target.value }))} required />
            <Input placeholder="Last name" value={form.last_name} onChange={(e) => setForm((s) => ({ ...s, last_name: e.target.value }))} required />
          </div>
          <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} required />
          <Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} required />

          {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div> : null}

          <Button className="w-full py-6" disabled={registerMutation.isPending} type="submit">
            {registerMutation.isPending ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?
          <Link className="ml-1 font-bold text-primary" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
