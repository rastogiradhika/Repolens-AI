'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Menu, X, User, LogOut } from 'lucide-react';
import Button from '../common/Button';
import { isLoggedIn, getUser, logout } from '@/src/lib/auth';

const navLinks = [
  { label: 'Overview', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Intelligence', href: '/repository-intelligence' },
  { label: 'AI Guide', href: '/ai-guide' },
  { label: 'PR Readiness', href: '/pr-readiness' },
  { label: 'Merge Risk', href: '/merge-risk' },
];

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuth = () => {
    const logged = isLoggedIn();
    setAuthenticated(logged);
    setUser(logged ? getUser() : null);
  };

  useEffect(() => {
    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('repolens_auth_change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('repolens_auth_change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    checkAuth();
    router.push('/login');
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
      style={{ background: 'rgba(5,5,8,0.85)', backdropFilter: 'blur(20px)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center group-hover:border-cyan-400/60 transition-colors">
              <Zap size={12} className="text-cyan-400" />
            </div>
            <span className="text-sm font-semibold text-white">RepoLens</span>
            <span className="mono-label text-cyan-500/70 text-[10px]">AI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-sm text-slate-400 hover:text-white rounded-md hover:bg-white/5 transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA / Auth actions */}
          <div className="hidden md:flex items-center gap-3">
            {authenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-dark-800 border border-white/10 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate font-medium text-white">{user?.name || user?.email || 'User'}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors px-2 py-1 rounded hover:bg-rose-950/20"
                  title="Sign out of your account"
                >
                  <LogOut size={13} />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Sign in
                </Link>
                <Link href="/register" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                  Sign up
                </Link>
              </div>
            )}

            <Link href="/repository-intelligence">
              <Button variant="cyan" size="sm">
                Analyze Repo →
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-white/[0.06] space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-md"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2 px-3 border-t border-white/5">
              {authenticated ? (
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <User size={14} className="text-cyan-400" />
                    <span>{user?.name || user?.email || 'User'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <LogOut size={12} />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 py-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-slate-400 hover:text-white"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-cyan-400 hover:underline"
                  >
                    Sign up
                  </Link>
                </div>
              )}
              <Link href="/repository-intelligence" onClick={() => setMobileOpen(false)}>
                <Button variant="cyan" size="sm" className="w-full justify-center">
                  Analyze Repo →
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
