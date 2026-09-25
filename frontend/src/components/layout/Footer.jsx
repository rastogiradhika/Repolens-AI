import { Zap, Github, Twitter } from 'lucide-react';
import Link from 'next/link';

const footerLinks = {
  Product: ['Overview', 'Intelligence', 'PR Readiness', 'Merge Risk'],
  Developers: ['Documentation', 'API Reference', 'Changelog'],
  Company: ['About', 'Privacy', 'Terms'],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-dark-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Zap size={10} className="text-cyan-400" />
              </div>
              <span className="text-sm font-semibold text-white">RepoLens AI</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[180px]">
              Open source intelligence platform for developers.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://github.com" className="text-slate-500 hover:text-white transition-colors">
                <Github size={16} />
              </a>
              <a href="https://twitter.com" className="text-slate-500 hover:text-white transition-colors">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className="mono-label text-slate-500 mb-3">{section}</p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-slate-500 hover:text-white transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-600">
            © 2026 RepoLens AI. Open source intelligence platform.
          </p>
          <p className="mono-label text-slate-600 text-[10px]">v0.1.0</p>
        </div>
      </div>
    </footer>
  );
}
