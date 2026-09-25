'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser, saveToken, saveUser } from '@/src/lib/auth';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const passwordsMatch = confirm && confirm === password;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { user, token } = await registerUser({ name, email, password });
      saveToken(token);
      if (user) saveUser(user);
      setSuccess('Account created! Redirecting to dashboard...');
      setTimeout(() => router.push('/dashboard'), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white font-sans flex flex-col justify-between overflow-x-hidden relative">

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-gradient-to-b from-cyan-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/4 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed inset-0 grid-pattern pointer-events-none -z-10 opacity-40" />

      {/* Top Navigation */}
      <header className="w-full bg-dark-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/[0.06]">
        <div className="w-full px-6 lg:px-8 py-3.5 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-dark-700 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                  <path d="m4.93 4.93 2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">RepoLens</span>
              <span className="text-xs font-semibold font-mono px-1.5 py-0.5 rounded bg-dark-600 text-cyan-400 border border-white/10">AI</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="#" className="text-slate-400 hover:text-white transition-colors duration-150">Overview</Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors duration-150">Intelligence</Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors duration-150">PR Readiness</Link>
            </nav>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="hidden sm:inline">Already have an account?</span>
            <Link href="/login" className="text-cyan-400 font-medium hover:underline inline-flex items-center gap-1 group">
              Sign in
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-4 py-12 sm:px-6 lg:px-8 gap-12 relative z-10 max-w-7xl mx-auto w-full">

        {/* Left: Brand panel */}
        <div className="hidden lg:flex flex-col justify-center max-w-md w-full space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 section-badge mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>New account</span>
            </div>
            <h1 className="text-5xl font-bold text-white tracking-tight leading-tight mb-4">
              Start your<br/>
              <span className="text-gradient-cyan">intelligence</span><br/>
              journey
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Join thousands of developers using RepoLens AI to understand codebases faster, contribute smarter, and build better.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              { icon: '🔍', title: 'Deep Repository Analysis', desc: 'Instantly scan any GitHub repo' },
              { icon: '🤖', title: 'AI-Powered Guidance', desc: 'Gemini-backed onboarding assistant' },
              { icon: '🛡️', title: 'PR Readiness Check', desc: 'Catch issues before review' },
              { icon: '⚡', title: 'Redis-Cached Results', desc: 'Sub-100ms on repeat analysis' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-dark-600 border border-white/[0.06] flex items-center justify-center text-base flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{f.title}</div>
                  <div className="text-xs text-slate-500">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
            {[
              { val: '10K+', label: 'Repos Analyzed' },
              { val: '99.9%', label: 'Uptime' },
              { val: '<10s', label: 'Avg Scan Time' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-xl font-bold text-cyan-400">{s.val}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Registration card */}
        <div className="w-full max-w-[480px] rounded-xl overflow-hidden backdrop-blur-xl transition-all duration-300 flex-shrink-0"
          style={{
            background: 'linear-gradient(180deg, rgba(28,32,40,0.90) 0%, rgba(10,10,15,0.97) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderTop: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 0 35px -6px rgba(6, 182, 212, 0.28)',
          }}
        >
          {/* Terminal bar */}
          <div className="w-full px-5 py-3 border-b border-white/[0.06] flex items-center justify-between bg-dark-900/60">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-slate-500 tracking-tight">repolens-session // register</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>256-bit TLS</span>
            </div>
          </div>

          {/* Card header */}
          <div className="px-6 sm:px-8 pt-6 pb-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Create your account</h2>
            <p className="text-sm text-slate-400 mt-1">Free forever. No credit card required.</p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 pt-4 space-y-5">
            <form className="space-y-4" onSubmit={handleSubmit} id="registerForm">

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-white" htmlFor="fullName">Full Name</label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <input
                    id="fullName"
                    name="name"
                    type="text"
                    required
                    placeholder="[ Your full name ]"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-white/10 rounded-lg text-white placeholder:text-slate-600 text-sm font-mono focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-150"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-white" htmlFor="workEmail">Email</label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </div>
                  <input
                    id="workEmail"
                    name="email"
                    type="email"
                    required
                    placeholder="[ Your email address ]"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-white/10 rounded-lg text-white placeholder:text-slate-600 text-sm font-mono focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-150"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-white" htmlFor="password">Password</label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="[ Min. 8 characters ]"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-11 py-2.5 bg-dark-900 border border-white/10 rounded-lg text-white placeholder:text-slate-600 text-sm font-mono focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-150"
                  />
                  <button
                    type="button"
                    id="togglePassword1"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-white" htmlFor="confirmPassword">Confirm Password</label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="[ Re-enter your password ]"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className={`block w-full pl-10 pr-11 py-2.5 bg-dark-900 border rounded-lg text-white placeholder:text-slate-600 text-sm font-mono focus:outline-none transition-all duration-150 ${
                      confirm
                        ? passwordsMatch
                          ? 'border-emerald-500/50 focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/30'
                          : 'border-red-500/40 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20'
                        : 'border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30'
                    }`}
                  />
                  {/* Match indicator */}
                  <div id="matchIcon" className={`absolute inset-y-0 right-0 pr-3.5 flex items-center ${passwordsMatch ? '' : 'hidden'}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  id="submitBtn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: '#06b6d4',
                    color: '#001f26',
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.45)',
                  }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.background = '#22d3ee')}
                  onMouseLeave={e => !loading && (e.currentTarget.style.background = '#06b6d4')}
                >
                  <span id="submitText">{loading ? 'Creating account...' : 'Create RepoLens Account'}</span>
                  {!loading && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  )}
                  {loading && (
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Status messages */}
              {error && (
                <p className="text-center text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg py-2 px-3">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-center text-sm text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-lg py-2 px-3">
                  {success}
                </p>
              )}

              {/* Terms */}
              <p className="text-xs text-slate-600 text-center pt-1">
                By creating an account, you agree to our{' '}
                <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Terms of Service</Link>
                {' '}and{' '}
                <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Privacy Policy</Link>.
              </p>
            </form>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/[0.08]" />
              <span className="flex-shrink mx-4 font-mono text-xs text-slate-600 tracking-wider">OR</span>
              <div className="flex-grow border-t border-white/[0.08]" />
            </div>

            {/* GitHub button */}
            <div>
              <button
                type="button"
                onClick={() => setError('GitHub OAuth is coming soon. Please use email/password to create an account.')}
                className="w-full py-2.5 px-4 rounded-lg bg-dark-700/90 hover:bg-dark-600 border border-white/10 hover:border-cyan-500/30 text-white text-sm font-medium transition-all duration-150 flex items-center justify-center gap-3 active:scale-[0.99] group"
              >
                <svg aria-hidden="true" className="w-5 h-5 fill-current text-white group-hover:text-cyan-400 transition-colors" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </div>

            {/* Bottom link */}
            <div className="text-center pt-2 border-t border-white/[0.06]">
              <p className="text-sm text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="text-cyan-400 hover:underline font-medium ml-1">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-dark-900 border-t border-white/[0.06] py-8">
        <div className="w-full px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="text-lg font-bold text-white">RepoLens AI</span>
            <span className="hidden sm:inline text-slate-600">·</span>
            <span className="text-sm text-slate-500">© 2025 RepoLens AI Inc. Built for engineering teams.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            {['Documentation', 'CLI Reference', 'Security', 'Privacy Policy'].map(link => (
              <Link key={link} href="#" className="hover:text-cyan-400 transition-colors duration-150">{link}</Link>
            ))}
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Status</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
