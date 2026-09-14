'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Menu, X } from 'lucide-react';
import Button from '../common/Button';

const navLinks = [
  { label: 'Overview', href: '#overview' },
  { label: 'Intelligence', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'PR Readiness', href: '#pr-readiness' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
      style={{ background: 'rgba(5,5,8,0.85)', backdropFilter: 'blur(20px)' }}>
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

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
              Sign in
            </Link>
            <Button variant="cyan" size="sm">
              Start Free →
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
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
            <div className="pt-3 flex gap-3 px-3">
              <Link href="/login" className="text-sm text-slate-400">Sign in</Link>
              <Button variant="cyan" size="sm">Start Free →</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
