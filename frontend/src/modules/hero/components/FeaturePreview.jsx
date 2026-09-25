import { BookOpen, Compass, ClipboardCheck, GitMerge } from 'lucide-react';

const features = [
  {
    id: 'architecture',
    icon: <BookOpen size={18} />,
    iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    label: 'INTELLIGENCE',
    badge: 'Live',
    badgeColor: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
    title: 'Architecture Decoder',
    desc: "Instant breakdown of any repository's structure, dependencies, and file architecture so you know exactly where your changes belong.",
  },
  {
    id: 'guide',
    icon: <Compass size={18} />,
    iconBg: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
    label: 'AI GUIDE',
    badge: 'Beta',
    badgeColor: 'text-violet-400 border-violet-400/30 bg-violet-400/10',
    title: 'AI Onboarding Guide',
    desc: 'Get tailored onboarding instructions for installation, tooling, and contributing rules so you contribute the right way from minute one.',
  },
  {
    id: 'readiness',
    icon: <ClipboardCheck size={18} />,
    iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    label: 'PR READINESS',
    badge: 'Fullscore',
    badgeColor: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
    title: 'PR Readiness Audit',
    desc: "Automatically check for formatting, commit conventions, and test coverage before submitting so your changes match what maintainers review.",
  },
  {
    id: 'merge-risk',
    icon: <GitMerge size={18} />,
    iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    label: 'MERGE RISK',
    badge: 'Preview',
    badgeColor: 'text-rose-400 border-rose-400/30 bg-rose-400/10',
    title: 'Semantic Merge Risk',
    desc: "Predict merge conflicts and spot logic collisions across open PRs before they happen—so you merge cleanly without breaking the codebase.",
  },
];

export default function FeaturePreview() {
  return (
    <section className="py-24 relative" id="features">
      {/* Section header */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="section-badge mb-3 w-fit">FEATURES</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Built to eliminate
              <br />
              developer friction
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
            Every feature gives you the concrete assistance instead of shallow online overviews.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.id} className="glass-card-hover rounded-2xl p-6">
              <div className="flex items-start justify-between mb-5">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${f.iconBg}`}>
                  {f.icon}
                </div>
                <div className="flex items-center gap-2">
                  <span className="mono-label text-slate-600">{f.label}</span>
                  <span className={`mono-label px-2 py-0.5 rounded-full border text-[10px] ${f.badgeColor}`}>
                    {f.badge}
                  </span>
                </div>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
