import { Link2, ScanSearch, GitPullRequest } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: <Link2 size={20} />,
    title: 'Paste Repo Link',
    desc: 'Drop any public GitHub URL into RepoLens. No login, no setup. Just the repo URL.',
    iconBg: 'bg-cyan-500/15 text-cyan-400',
  },
  {
    num: '02',
    icon: <ScanSearch size={20} />,
    title: 'Instant Scan',
    desc: 'Our engine analyzes architecture files, tests, workflows and PR guidelines in under 6 seconds.',
    iconBg: 'bg-violet-500/15 text-violet-400',
  },
  {
    num: '03',
    icon: <GitPullRequest size={20} />,
    title: 'Ready to PR',
    desc: 'Follow tailored action items and ensure your changes match in contributor conventions in minutes.',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
  },
];

export default function WorkflowSection() {
  return (
    <section className="py-24 border-t border-white/[0.06] relative" id="how-it-works">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <p className="section-badge mb-4 mx-auto w-fit">SIMPLE WORKFLOW</p>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          From URL to First Contribution in
          <br />3 Steps
        </h2>
        <p className="text-slate-500 text-sm mb-12 max-w-sm mx-auto">
          No configuration required. No onboarding calls.
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {steps.map((step) => (
            <div key={step.num} className="glass-card rounded-2xl p-6 relative">
              {/* Step number */}
              <div className="mono-label text-slate-700 mb-5 text-right">{step.num}</div>

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${step.iconBg}`}>
                {step.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
