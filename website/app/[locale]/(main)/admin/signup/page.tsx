'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle, Lock, Mail, User } from 'lucide-react';
import type { Locale } from '@/i18n';
import { getReadableSignupError } from '@/lib/auth-errors';

export default function AdminSignupPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as Locale) || 'en';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully. Redirecting to login...');
        setTimeout(() => {
          router.push(`/${locale}/admin/login`);
        }, 2000);
      } else {
        setError(getReadableSignupError(data.error));
      }
    } catch {
      setError('Unable to create the account right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,102,204,0.16),_transparent_32%),linear-gradient(180deg,#f6f9fc_0%,#eef4fb_100%)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur lg:order-2 lg:p-10">
          <div className="mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#004B87] text-2xl font-bold text-white shadow-[0_16px_35px_rgba(0,75,135,0.22)]">
              D
            </div>
            <h1 className="mt-6 text-3xl font-bold text-[#12314f]">Create admin</h1>
            <p className="mt-2 text-sm leading-6 text-[#6a7b91]">Register the first or next admin account for the project workspace.</p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#f7c6c1] bg-[#fff3f1] p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#b42318]" />
              <p className="text-sm text-[#912018]">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#b7e4c7] bg-[#eefaf1] p-4">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#107948]" />
              <p className="text-sm text-[#107948]">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#12314f]">Full name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6a7b91]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-[#d8e2ee] bg-white px-12 py-3.5 outline-none transition-all focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#12314f]">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6a7b91]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-[#d8e2ee] bg-white px-12 py-3.5 outline-none transition-all focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10"
                  placeholder="admin@designconcept.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#12314f]">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6a7b91]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-[#d8e2ee] bg-white px-12 py-3.5 outline-none transition-all focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10"
                  placeholder="Choose a strong password"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-[#6a7b91]">Minimum 6 characters</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#12314f]">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6a7b91]" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-[#d8e2ee] bg-white px-12 py-3.5 outline-none transition-all focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10"
                  placeholder="Repeat the password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF6600] px-6 py-3.5 font-semibold text-white shadow-[0_18px_35px_rgba(255,102,0,0.22)] transition-all hover:bg-[#E55C00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create admin'}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#e7edf4] pt-6 text-sm text-[#6a7b91]">
            <p>Already have an account?</p>
            <Link href={`/${locale}/admin/login`} className="font-semibold text-[#004B87] no-underline hover:text-[#0066CC]">
              Sign in
            </Link>
          </div>
        </section>

        <section className="rounded-[32px] bg-[#12314f] p-8 text-white shadow-[0_24px_70px_rgba(18,49,79,0.24)] lg:order-1 lg:p-12">
          <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
            Workspace Access
          </div>
          <h2 className="mt-6 text-4xl font-bold leading-tight">Set up the control room before content work starts.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/75">
            Admin accounts can manage services, portfolio publishing, enquiry status, and site operations. Keep this route limited to trusted users.
          </p>
          <div className="mt-10 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
              <p className="font-semibold">Use role-based access sparingly</p>
              <p className="mt-2 text-sm text-white/72">Only create accounts for people who need to edit inventory or respond to leads.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
              <p className="font-semibold">Rotate credentials after handoffs</p>
              <p className="mt-2 text-sm text-white/72">Change passwords when ownership changes or temporary access expires.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
