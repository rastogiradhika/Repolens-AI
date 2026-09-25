import { BookOpen, Users, GitPullRequest, CheckCircle, AlertTriangle } from 'lucide-react';

// The three glassmorphic cards shown in the hero preview
const cards = [
  {
    id: 'architecture',
    label: 'Build System',
    badge: 'DETECTED',
    badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    title: 'Monorepo · Yarn',
    desc: 'Modular core with clean package separation.',
    meta: 'yarn/src',
    metaRight: 'Workspaces 3+',
    icon: <BookOpen size={11} />,
    iconBg: 'bg-cyan-500/15 text-cyan-400',
    dot: 'status-dot-cyan',
  },
  {
    id: 'onboarding',
    label: 'Onboarding Guide',
    badge: '3 Easy Steps',
    badgeColor: 'text-slate-400 bg-white/5 border-white/10',
    steps: [
      { label: 'fork & setup', done: true },
      { label: 'Run dev env', done: true },
      { label: 'Submit a fix', done: false },
    ],
    meta: 'Estimated time',
    metaRight: '~4 minutes',
    icon: <Users size={11} />,
    iconBg: 'bg-violet-500/15 text-violet-400',
    dot: 'status-dot-green',
  },
  {
    id: 'pr-risk',
    label: 'PR Merge Risk',
    badge: 'Safe',
    badgeSub: 'Score 94/100',
    badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    items: [
      'No high-risk factor active or open PR pipeline.',
      'Contribution Rules',
      'Low',
    ],
    icon: <GitPullRequest size={11} />,
    iconBg: 'bg-emerald-500/15 text-emerald-400',
    dot: 'status-dot-green',
  },
];

function ArchitectureCard({ card }) {
  return (
    <div className="glass-card rounded-xl p-3 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className={`w-5 h-5 rounded flex items-center justify-center ${card.iconBg}`}>
            {card.icon}
          </span>
          <span className="mono-label text-slate-500">{card.label}</span>
        </div>
        <span className={`mono-label px-1.5 py-0.5 rounded border text-[9px] ${card.badgeColor}`}>
          {card.badge}
        </span>
      </div>
      <p className="text-sm font-semibold text-white leading-tight">{card.title}</p>
      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{card.desc}</p>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06]">
        <span className="mono-label text-slate-600">{card.meta}</span>
        <span className="mono-label text-cyan-500">{card.metaRight}</span>
      </div>
    </div>
  );
}

function OnboardingCard({ card }) {
  return (
    <div className="glass-card rounded-xl p-3 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className={`w-5 h-5 rounded flex items-center justify-center ${card.iconBg}`}>
            {card.icon}
          </span>
          <span className="mono-label text-slate-500">{card.label}</span>
        </div>
        <span className="mono-label text-slate-500 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[9px]">
          {card.badge}
        </span>
      </div>
      <ul className="space-y-1.5">
        {card.steps.map((step) => (
          <li key={step.label} className="flex items-center gap-2">
            <CheckCircle
              size={11}
              className={step.done ? 'text-emerald-400' : 'text-slate-600'}
            />
            <span className={`text-xs ${step.done ? 'text-slate-300' : 'text-slate-600'}`}>
              {step.label}
            </span>
            {step.done && <span className="mono-label text-emerald-500 text-[9px] ml-auto">done</span>}
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06]">
        <span className="mono-label text-slate-600">{card.meta}</span>
        <span className="mono-label text-slate-400">{card.metaRight}</span>
      </div>
    </div>
  );
}

function PrRiskCard({ card }) {
  return (
    <div className="glass-card rounded-xl p-3 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className={`w-5 h-5 rounded flex items-center justify-center ${card.iconBg}`}>
            {card.icon}
          </span>
          <span className="mono-label text-slate-500">{card.label}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`mono-label px-1.5 py-0.5 rounded border text-[9px] ${card.badgeColor}`}>
            {card.badge}
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-1 leading-snug">{card.items[0]}</p>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06]">
        <span className="mono-label text-slate-600">{card.items[1]}</span>
        <span className="mono-label text-emerald-500">{card.items[2]}</span>
      </div>
    </div>
  );
}

export default function ProductPreview() {
  return (
    <div className="relative max-w-2xl mx-auto mt-12">
      {/* Outer chrome frame */}
      <div className="glass-card rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 0 80px rgba(6,182,212,0.06), 0 40px 80px rgba(0,0,0,0.5)' }}>

        {/* Window chrome */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]"
          style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/[0.08] rounded-md px-3 py-1">
            <span className="mono-label text-slate-500 text-[10px]">facebook/react</span>
            <span className="mono-label text-slate-600 text-[10px]">• main</span>
          </div>
          <span className="mono-label text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px]">
            Ready to Contribute
          </span>
        </div>

        {/* Cards body */}
        <div className="p-4 flex gap-3">
          <ArchitectureCard card={cards[0]} />
          <OnboardingCard card={cards[1]} />
          <PrRiskCard card={cards[2]} />
        </div>
      </div>

      {/* Bottom glow */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
    </div>
  );
}
